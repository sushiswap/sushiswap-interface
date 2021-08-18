import React, { createContext, useContext, useReducer, useMemo, useCallback } from 'react'
import reducer from './reducer'
import { ActionType, Context, HandleInputOptions, LiquidityMode, Reducer, State } from './types'
import { useRouter } from 'next/router'
import { useTridentPool } from '../../../../hooks/useTridentPools'
import { tryParseAmount } from '../../../../functions'
import { PoolType } from '../../types'
import { TridentRemoveClassicPoolContext, TridentRemoveClassicPoolContextProvider } from './ClassicPoolContext'
import {
  TridentRemoveConcentratedPoolContext,
  TridentRemoveConcentratedPoolContextProvider,
} from './ConcentratedPoolContext'
import { TridentRemoveHybridPoolContext, TridentRemoveHybridPoolContextProvider } from './HybridPoolContext'
import { TridentRemoveWeightedPoolContext, TridentRemoveWeightedPoolContextProvider } from './WeightedPoolContext'

// STATE SHOULD ONLY CONTAIN PRIMITIVE VALUES,
// ANY OTHER TYPE OF VARIABLE SHOULD BE DEFINED IN THE CONTEXT AND SEND AS DERIVED STATE
const initialState: State = {
  liquidityMode: LiquidityMode.ZAP,
  inputAmounts: {},
  showZapReview: false,
}

export const TridentRemoveLiquidityPageContext = createContext<Context>({
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

export const TridentRemoveLiquidityPageContextProvider = ({ children }) => {
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
    alert('Execute')

    // Close modal
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

  const ChildProvider = useMemo(
    () =>
      ({
        [PoolType.CLASSIC]: TridentRemoveClassicPoolContextProvider,
        [PoolType.CONCENTRATED]: TridentRemoveConcentratedPoolContextProvider,
        [PoolType.HYBRID]: TridentRemoveHybridPoolContextProvider,
        [PoolType.WEIGHTED]: TridentRemoveWeightedPoolContextProvider,
      }[pool.type]),
    [pool.type]
  )

  return (
    <TridentRemoveLiquidityPageContext.Provider
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
        }),
        [state, pool, tokens, handleInput, showReview, execute, parsedInputAmounts, parsedOutputAmounts]
      )}
    >
      <ChildProvider>{children}</ChildProvider>
    </TridentRemoveLiquidityPageContext.Provider>
  )
}

export const useTridentParentPageContext = () => useContext(TridentRemoveLiquidityPageContext)

export const useTridentRemoveLiquidityPageContext = () => {
  const parent = useContext(TridentRemoveLiquidityPageContext)
  const classic = useContext(TridentRemoveClassicPoolContext)
  const concentrated = useContext(TridentRemoveConcentratedPoolContext)
  const hybrid = useContext(TridentRemoveHybridPoolContext)
  const weighted = useContext(TridentRemoveWeightedPoolContext)

  return useMemo(
    () => ({
      ...parent,
      ...{
        [PoolType.CLASSIC]: classic,
        [PoolType.CONCENTRATED]: concentrated,
        [PoolType.HYBRID]: hybrid,
        [PoolType.WEIGHTED]: weighted,
      }[parent.pool.type],
    }),
    [classic, concentrated, hybrid, parent, weighted]
  )
}

export const useTridentRemoveLiquidityPageState = () => {
  const { state } = useTridentRemoveLiquidityPageContext()
  return state
}

export const useTridentRemoveLiquidityPageDispatch = () => {
  const { dispatch } = useTridentRemoveLiquidityPageContext()
  return dispatch
}
