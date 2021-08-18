import React, { createContext, useCallback, useContext, useMemo } from 'react'
import { useTridentParentPageContext } from '../index'
import { Context } from './types'
import { tryParseAmount } from '../../../../../functions'
import { Percent } from '@sushiswap/sdk'
import { LiquidityMode } from '../types'

export const TridentRemoveClassicPoolContext = createContext<Context>({
  execute: () => null,
})

export const TridentRemoveClassicPoolContextProvider = ({ children }) => {
  const { state, pool, tokens, ...parent } = useTridentParentPageContext()

  const parsedInputAmounts = useMemo(() => {
    return pool.tokens.reduce((acc, cur) => {
      // TODO change this 1 to balance in pool
      acc[cur.address] = tryParseAmount('1', cur).multiply(new Percent(state.percentageAmount, '100'))
      return acc
    }, {})
  }, [pool.tokens, state.percentageAmount])

  const parsedOutputAmounts = useMemo(() => {
    if (state.liquidityMode === LiquidityMode.STANDARD) {
      return parsedInputAmounts
    }

    // For ZAP mode, outputAmounts is the combined inputAmount
    // TODO uses balance from contract
    if (state.liquidityMode === LiquidityMode.ZAP) {
      return {
        [state.outputTokenAddress]: parsedInputAmounts[state.outputTokenAddress],
      }
    }
  }, [parsedInputAmounts, state.liquidityMode, state.outputTokenAddress])

  const execute = useCallback(async () => {
    // Do some custom execution
    alert('Executing ClassicPool execute function')

    // Call parent execute to do some default execution stuff
    parent.execute()
  }, [parent])

  return (
    <TridentRemoveClassicPoolContext.Provider
      value={useMemo(
        () => ({ parsedInputAmounts, parsedOutputAmounts, execute }),
        [execute, parsedInputAmounts, parsedOutputAmounts]
      )}
    >
      {children}
    </TridentRemoveClassicPoolContext.Provider>
  )
}

export const useTridentRemoveClassicPoolPageContext = () => useContext(TridentRemoveClassicPoolContext)
