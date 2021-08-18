import React, { createContext, useContext, useReducer, useMemo, useCallback } from 'react'
import reducer from './reducer'
import { ActionType, Context, LiquidityMode, Reducer, State } from './types'
import { useRouter } from 'next/router'
import { useTridentPool } from '../../../../hooks/useTridentPools'
import { HandleInputOptions } from '../../remove/context/types'
import useClassicPoolContext from './useClassicPoolContext'
import { tryParseAmount } from '../../../../functions'
import useConcentratedPoolContext from './useConcentratedPoolContext'
import useHybridPoolContext from './useHybridPoolContext'
import useWeightedPoolContext from './useWeightedPoolContext'
import { PoolType } from '../../types'

// STATE SHOULD ONLY CONTAIN PRIMITIVE VALUES,
// ANY OTHER TYPE OF VARIABLE SHOULD BE DEFINED IN THE CONTEXT AND SEND AS DERIVED STATE
const initialState: State = {
  liquidityMode: LiquidityMode.ZAP,
  inputAmounts: {},
  showZapReview: false,
  balancedMode: false,
  spendFromWallet: true,
}

export const TridentAddLiquidityPageContext = createContext<Context>({
  state: initialState,
  pool: null,
  parsedInputAmounts: {},
  parsedOutputAmounts: {},
  tokens: {},
  execute: () => null,
  handleInput: () => null,
  showReview: () => null,
  dispatch: () => null,
})

export const TridentAddLiquidityPageContextProvider = ({ children }) => {
  const { query } = useRouter()
  const [pool] = useTridentPool(query.tokens)
  const [state, dispatch] = useReducer<React.Reducer<State, Reducer>>(reducer, {
    ...initialState,
    inputAmounts: pool.tokens.reduce((acc, cur) => ((acc[cur.address] = ''), acc), {}),
  })

  // Convenience variable to allow for indexing by address
  const tokens = useMemo(() => pool.tokens.reduce((acc, cur) => ((acc[cur.address] = cur), acc), {}), [pool.tokens])

  // This function remains the same regarding poolType
  // so defined here once and pass on to child contexts
  const handleInput = useCallback(
    (amount: string, address: string, options: HandleInputOptions = {}) => {
      dispatch({
        type: options.clear ? ActionType.SET_INPUT_AMOUNT_WITH_CLEAR : ActionType.SET_INPUT_AMOUNT,
        payload: {
          amount,
          address,
        },
      })
    },
    [dispatch]
  )

  // Default showReview dispatch action
  const showReview = useCallback(
    (payload = true) => {
      dispatch({
        type: ActionType.SHOW_ZAP_REVIEW,
        payload,
      })
    },
    [dispatch]
  )

  // Parent execution function that hides modal after execute
  // Consider calling this function inside poolType context
  const execute = useCallback(async () => {
    alert('Execute function inside parent context')

    showReview(false)
  }, [showReview])

  // Default input parse
  // We don't want this in the state because the state should consist of primitive values only,
  // derived state should go here (in the context)
  const parsedInputAmounts = useMemo(() => {
    return Object.entries(state.inputAmounts).reduce((acc, [k, v]) => {
      acc[k] = tryParseAmount(v, tokens[k])
      return acc
    }, {})
  }, [state.inputAmounts, tokens])

  // Default output parse
  // For NORMAL mode, outputAmounts equals inputAmounts.
  // For ZAP mode, outputAmounts is the split inputAmount
  const parsedOutputAmounts = useMemo(() => {
    if (state.liquidityMode === LiquidityMode.STANDARD) {
      return Object.entries(state.inputAmounts).reduce((acc, [k, v]) => {
        acc[k] = tryParseAmount(v, tokens[k])
        return acc
      }, {})
    }

    if (state.liquidityMode === LiquidityMode.ZAP) {
      return Object.entries(state.inputAmounts).reduce((acc, [k, v]) => {
        acc[k] = tryParseAmount(v, tokens[k])
        return acc
      }, {})
    }
  }, [state.inputAmounts, state.liquidityMode, tokens])

  // Create memoized context object to send to child contexts
  const contextArgs = useMemo(
    () => ({
      state,
      pool,
      dispatch,
      execute,
      showReview,
      handleInput,
      tokens,
      parsedInputAmounts,
      parsedOutputAmounts,
    }),
    [execute, handleInput, parsedInputAmounts, parsedOutputAmounts, pool, showReview, state, tokens]
  )

  // Hooks for context overrides
  const classicPool = useClassicPoolContext(contextArgs)
  const concentratedPool = useConcentratedPoolContext(contextArgs)
  const hybridPool = useHybridPoolContext(contextArgs)
  const weightedPool = useWeightedPoolContext(contextArgs)

  // Get overrides for current pool type
  const overrides = useMemo(
    () =>
      ({
        [PoolType.CLASSIC]: classicPool,
        [PoolType.CONCENTRATED]: concentratedPool,
        [PoolType.HYBRID]: hybridPool,
        [PoolType.WEIGHTED]: weightedPool,
      }[pool.type]),
    [classicPool, concentratedPool, hybridPool, pool.type, weightedPool]
  )

  return (
    <TridentAddLiquidityPageContext.Provider
      value={useMemo(
        () => ({
          state,
          pool,
          tokens,
          handleInput,
          showReview,
          execute,
          dispatch,
          parsedInputAmounts,
          parsedOutputAmounts,
          ...overrides,
        }),
        [state, pool, tokens, handleInput, showReview, execute, parsedInputAmounts, parsedOutputAmounts, overrides]
      )}
    >
      {children}
    </TridentAddLiquidityPageContext.Provider>
  )
}

export const useTridentAddLiquidityPageContext = () => useContext(TridentAddLiquidityPageContext)
export const useTridentAddLiquidityPageState = () => useContext(TridentAddLiquidityPageContext).state
export const useTridentAddLiquidityPageDispatch = () => useContext(TridentAddLiquidityPageContext).dispatch
