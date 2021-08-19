import React, { createContext, useContext, useReducer, useMemo, useCallback, FC } from 'react'
import reducer from './reducer'
import { ActionType, Context, LiquidityMode, Reducer, State } from './types'
import { useRouter } from 'next/router'
import { useTridentPool } from '../../../../hooks/useTridentPools'
import { HandleInputOptions } from '../../remove/context/types'
import { tryParseAmount } from '../../../../functions'
import { PoolType } from '../../types'
import { TridentAddConcentratedPoolContext, TridentAddConcentratedPoolContextProvider } from './ConcentratedPoolContext'
import { TridentAddHybridPoolContext, TridentAddHybridPoolContextProvider } from './HybridPoolContext'
import { TridentAddWeightedPoolContext, TridentAddWeightedPoolContextProvider } from './WeightedPoolContext'
import { TridentAddClassicPoolContext, TridentAddClassicPoolContextProvider } from './ClassicPoolContext'

// STATE SHOULD ONLY CONTAIN PRIMITIVE VALUES,
// ANY OTHER TYPE OF VARIABLE SHOULD BE DEFINED IN THE CONTEXT AND SEND AS DERIVED STATE
const initialState: State = {
  inputTokenAddress: null,
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
  selectInputToken: () => null,
  showReview: () => null,
  dispatch: () => null,
})

const ParentProvider: FC<{ poolType: PoolType }> = ({ children, poolType }) => {
  const { query } = useRouter()
  const [pool] = useTridentPool(query.tokens, poolType)
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

  const selectInputToken = useCallback(
    (address: string) => {
      dispatch({
        type: ActionType.SET_INPUT_TOKEN,
        payload: address,
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

  const ChildProvider = useMemo(
    () =>
      ({
        [PoolType.CLASSIC]: TridentAddClassicPoolContextProvider,
        [PoolType.CONCENTRATED]: TridentAddConcentratedPoolContextProvider,
        [PoolType.HYBRID]: TridentAddHybridPoolContextProvider,
        [PoolType.WEIGHTED]: TridentAddWeightedPoolContextProvider,
      }[poolType]),
    [poolType]
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
          selectInputToken,
          parsedInputAmounts,
          parsedOutputAmounts,
        }),
        [
          state,
          pool,
          tokens,
          handleInput,
          showReview,
          execute,
          selectInputToken,
          parsedInputAmounts,
          parsedOutputAmounts,
        ]
      )}
    >
      <ChildProvider>{children}</ChildProvider>
    </TridentAddLiquidityPageContext.Provider>
  )
}

export const TridentAddLiquidityPageContextProvider = (poolType: PoolType) => {
  return ({ children }) => <ParentProvider poolType={poolType}>{children}</ParentProvider>
}

export const useTridentAddLiquidityPageContext = () => {
  const parent = useContext(TridentAddLiquidityPageContext)
  const classic = useContext(TridentAddClassicPoolContext)
  const concentrated = useContext(TridentAddConcentratedPoolContext)
  const hybrid = useContext(TridentAddHybridPoolContext)
  const weighted = useContext(TridentAddWeightedPoolContext)

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

export const useTridentAddLiquidityPageState = () => {
  const { state } = useTridentAddLiquidityPageContext()
  return state
}

export const useTridentAddLiquidityPageDispatch = () => {
  const { dispatch } = useTridentAddLiquidityPageContext()
  return dispatch
}

export const useTridentAddParentPageContext = () => useContext(TridentAddLiquidityPageContext)
