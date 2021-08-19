import React, { createContext, FC, useCallback, useContext, useMemo, useReducer } from 'react'
import { WeightedPoolContext, WeightedPoolState } from './types'
import { tryParseAmount } from '../../../../../functions'
import { WithTridentPool, withTridentPool } from '../../../../../hooks/useTridentPools'
import { LiquidityMode, PoolType, Reducer } from '../../../types'
import reducer from '../../../context/reducer'
import { handleInput, selectInputToken, showReview } from '../../../context/actions'

// STATE SHOULD ONLY CONTAIN PRIMITIVE VALUES,
// ANY OTHER TYPE OF VARIABLE SHOULD BE DEFINED IN THE CONTEXT AND SEND AS DERIVED STATE
const initialState: WeightedPoolState = {
  inputTokenAddress: null,
  liquidityMode: LiquidityMode.ZAP,
  inputAmounts: {},
  showZapReview: false,
  balancedMode: false,
  spendFromWallet: true,
  txHash: null,
}

export const TridentAddWeightedContext = createContext<WeightedPoolContext>({
  state: initialState,
  pool: null,
  tokens: {},
  parsedInputAmounts: {},
  parsedOutputAmounts: {},
  execute: () => null,
  handleInput: () => null,
  selectInputToken: () => null,
  showReview: () => null,
  dispatch: () => null,
})

const TridentAddWeightedContextProvider: FC<WithTridentPool> = ({ children, pool, tokens }) => {
  const [state, dispatch] = useReducer<React.Reducer<WeightedPoolState, Reducer>>(reducer, {
    ...initialState,
    inputAmounts: pool.tokens.reduce((acc, cur) => ((acc[cur.address] = ''), acc), {}),
  })

  // We don't want this in the state because the state should consist of primitive values only,
  // derived state should go here (in the context)
  const parsedInputAmounts = useMemo(() => {
    return Object.entries(state.inputAmounts).reduce((acc, [k, v]) => {
      acc[k] = tryParseAmount(v, tokens[k])
      return acc
    }, {})
  }, [state.inputAmounts, tokens])

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
    alert('Executing WeightedPool execute function')
  }, [])

  return (
    <TridentAddWeightedContext.Provider
      value={useMemo(
        () => ({
          state,
          pool,
          tokens,
          selectInputToken: selectInputToken(dispatch),
          parsedInputAmounts,
          parsedOutputAmounts,
          execute,
          handleInput: handleInput(dispatch),
          showReview: showReview(dispatch),
          dispatch,
        }),
        [state, pool, tokens, parsedInputAmounts, parsedOutputAmounts, execute]
      )}
    >
      {children}
    </TridentAddWeightedContext.Provider>
  )
}
export default withTridentPool(PoolType.WEIGHTED)(TridentAddWeightedContextProvider)
export const useTridentAddWeightedContext = () => useContext(TridentAddWeightedContext)
export const useTridentAddWeightedState = () => useContext(TridentAddWeightedContext).state
export const useTridentAddWeightedDispatch = () => useContext(TridentAddWeightedContext).dispatch
