import React, { createContext, FC, useCallback, useContext, useMemo, useReducer } from 'react'
import { WeightedPoolContext, WeightedPoolState } from './types'
import { tryParseAmount } from '../../../../../functions'
import { Percent } from '@sushiswap/sdk'
import { withTridentPool, WithTridentPool } from '../../../../../hooks/useTridentPools'
import { LiquidityMode, PoolType, Reducer } from '../../../types'
import reducer from '../../../context/reducer'
import { handleInput, handlePercentageAmount, selectOutputToken, showReview } from '../../../context/actions'

// STATE SHOULD ONLY CONTAIN PRIMITIVE VALUES,
// ANY OTHER TYPE OF VARIABLE SHOULD BE DEFINED IN THE CONTEXT AND SEND AS DERIVED STATE
const initialState: WeightedPoolState = {
  outputTokenAddress: null,
  percentageAmount: '',
  liquidityMode: LiquidityMode.ZAP,
  inputAmounts: {},
  showZapReview: false,
  txHash: null,
}

export const TridentRemoveWeightedContext = createContext<WeightedPoolContext>({
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
})

const TridentRemoveWeightedContextProvider: FC<WithTridentPool> = ({ children, pool, tokens }) => {
  const [state, dispatch] = useReducer<React.Reducer<WeightedPoolState, Reducer>>(reducer, {
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
    alert('Executing Weighted execute function')
  }, [])

  return (
    <TridentRemoveWeightedContext.Provider
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
          dispatch,
        }),
        [state, pool, tokens, parsedInputAmounts, parsedOutputAmounts, execute]
      )}
    >
      {children}
    </TridentRemoveWeightedContext.Provider>
  )
}

export default withTridentPool(PoolType.WEIGHTED)(TridentRemoveWeightedContextProvider)
export const useTridentRemoveWeightedContext = () => useContext(TridentRemoveWeightedContext)
export const useTridentRemoveWeightedState = () => useContext(TridentRemoveWeightedContext).state
export const useTridentRemoveWeightedDispatch = () => useContext(TridentRemoveWeightedContext).dispatch
