import React, { createContext, FC, useCallback, useContext, useMemo, useReducer } from 'react'
import { ConcentratedPoolContext, ConcentratedPoolState } from './types'
import { tryParseAmount } from '../../../../../functions'
import { Percent } from '@sushiswap/sdk'
import { withTridentPool, WithTridentPool } from '../../../../../hooks/useTridentPools'
import { LiquidityMode, PoolType, Reducer } from '../../../types'
import {
  handleInput,
  handlePercentageAmount,
  selectOutputToken,
  setLiquidityMode,
  showReview,
} from '../../../context/actions'
import reducer from '../../../context/reducer'
import TridentFacadeProvider from '../../../context'

// STATE SHOULD ONLY CONTAIN PRIMITIVE VALUES,
// ANY OTHER TYPE OF VARIABLE SHOULD BE DEFINED IN THE CONTEXT AND SEND AS DERIVED STATE
const initialState: ConcentratedPoolState = {
  outputTokenAddress: null,
  percentageAmount: '',
  liquidityMode: LiquidityMode.ZAP,
  inputAmounts: {},
  showZapReview: false,
  txHash: null,
}

export const TridentRemoveConcentratedContext = createContext<ConcentratedPoolContext>({
  state: initialState,
  pool: null,
  parsedInputAmounts: {},
  parsedOutputAmounts: {},
  tokens: {},
  execute: () => null,
  handlePercentageAmount: () => null,
  selectOutputToken: () => null,
  handleInput: () => null,
  showReview: () => null,
  dispatch: () => null,
  setLiquidityMode: () => null,
})

const TridentRemoveConcentratedContextProvider: FC<WithTridentPool> = ({ children, pool, tokens }) => {
  const [state, dispatch] = useReducer<React.Reducer<ConcentratedPoolState, Reducer>>(reducer, {
    ...initialState,
    inputAmounts: pool.tokens.reduce((acc, cur) => ((acc[cur.address] = ''), acc), {}),
  })

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
    alert('Executing Concentrated execute function')
  }, [])

  return (
    <TridentRemoveConcentratedContext.Provider
      value={useMemo(
        () => ({
          state,
          pool,
          tokens,
          selectOutputToken: selectOutputToken(dispatch),
          parsedInputAmounts,
          parsedOutputAmounts,
          execute,
          handleInput: handleInput(dispatch),
          handlePercentageAmount: handlePercentageAmount(dispatch),
          showReview: showReview(dispatch),
          setLiquidityMode: setLiquidityMode(dispatch),
          dispatch,
        }),
        [state, pool, tokens, parsedInputAmounts, parsedOutputAmounts, execute]
      )}
    >
      <TridentFacadeProvider pool={pool}>{children}</TridentFacadeProvider>
    </TridentRemoveConcentratedContext.Provider>
  )
}

export default withTridentPool(PoolType.CONCENTRATED)(TridentRemoveConcentratedContextProvider)
export const useTridentRemoveConcentratedContext = () => useContext(TridentRemoveConcentratedContext)
export const useTridentRemoveConcentratedState = () => useContext(TridentRemoveConcentratedContext).state
export const useTridentRemoveConcentratedDispatch = () => useContext(TridentRemoveConcentratedContext).dispatch
