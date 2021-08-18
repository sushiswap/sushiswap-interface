import React, { createContext, useCallback, useContext, useMemo } from 'react'
import { useTridentAddParentPageContext } from '../index'
import { Context } from './types'
import { LiquidityMode } from '../types'
import { tryParseAmount } from '../../../../../functions'

export const TridentAddHybridPoolContext = createContext<Context>({
  execute: () => null,
})

export const TridentAddHybridPoolContextProvider = ({ children }) => {
  const { state, pool, tokens, ...parent } = useTridentAddParentPageContext()

  const parsedOutputAmounts = useMemo(() => {
    // For NORMAL mode, outputAmounts equals inputAmounts.
    if (state.liquidityMode === LiquidityMode.STANDARD) {
      return Object.entries(state.inputAmounts).reduce((acc, [k, v]) => {
        acc[k] = tryParseAmount(v, tokens[k])
        return acc
      }, {})
    }

    // TODO this is not returning correct values for other tokens. Needs contract integration
    if (state.liquidityMode === LiquidityMode.ZAP) {
      return pool.tokens.reduce((acc, cur) => {
        acc[cur.address] = tryParseAmount(state.inputAmounts[state.inputTokenAddress], cur)?.divide(
          Object.keys(state.inputAmounts).length
        )
        return acc
      }, {})
    }
  }, [pool.tokens, state.inputAmounts, state.inputTokenAddress, state.liquidityMode, tokens])

  const execute = useCallback(async () => {
    // Do some custom execution
    alert('Executing HybridPool execute function')

    // Call parent execute to do some default execution stuff
    parent.execute()
  }, [parent])

  return (
    <TridentAddHybridPoolContext.Provider
      value={useMemo(() => ({ parsedOutputAmounts, execute }), [parsedOutputAmounts, execute])}
    >
      {children}
    </TridentAddHybridPoolContext.Provider>
  )
}

export const useTridentAddHybridPoolPageContext = () => useContext(TridentAddHybridPoolContext)
