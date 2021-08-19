import React, { createContext, useCallback, useContext, useMemo } from 'react'
import { useTridentAddParentPageContext } from '../index'
import { Context } from './types'
import { LiquidityMode } from '../types'
import { tryParseAmount } from '../../../../../functions'

export const TridentAddClassicPoolContext = createContext<Context>({
  execute: () => null,
})

export const TridentAddClassicPoolContextProvider = ({ children }) => {
  const { state, tokens, pool, parsedInputAmounts, ...parent } = useTridentAddParentPageContext()

  const parsedOutputAmounts = useMemo(() => {
    // For NORMAL mode, outputAmounts equals inputAmounts.
    if (state.liquidityMode === LiquidityMode.STANDARD) {
      return parsedInputAmounts
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
  }, [parsedInputAmounts, pool.tokens, state.inputAmounts, state.inputTokenAddress, state.liquidityMode])

  const execute = useCallback(async () => {
    // Do some custom execution
    alert('Executing ClassicPool execute function')

    // Call parent execute to do some default execution stuff
    parent.execute()
  }, [parent])

  return (
    <TridentAddClassicPoolContext.Provider
      value={useMemo(() => ({ parsedOutputAmounts, execute }), [execute, parsedOutputAmounts])}
    >
      {children}
    </TridentAddClassicPoolContext.Provider>
  )
}

export const useTridentAddClassicPoolPageContext = () => useContext(TridentAddClassicPoolContext)
