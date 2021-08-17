import React, { createContext, useContext, useReducer, Dispatch, useMemo, useCallback } from 'react'
import reducer from './reducer'
import { ActionType, LiquidityMode, Reducer, State } from './types'
import { useRouter } from 'next/router'
import { useTridentPool } from '../../../../hooks/useTridentPools'
import { Pool } from '../../types'
import { HandleInputOptions } from '../../remove/context/types'
import { CurrencyAmount, Token } from '@sushiswap/sdk'
import { tryParseAmount } from '../../../../functions'

// STATE SHOULD ONLY CONTAIN PRIMITIVE VALUES,
// ANY OTHER TYPE OF VARIABLE SHOULD BE DEFINED IN THE CONTEXT AND SEND AS DERIVED STATE
const initialState: State = {
  liquidityMode: LiquidityMode.ZAP,
  inputAmounts: {},
  showZapReview: false,
  balancedMode: false,
  spendFromWallet: true,
}

export const TridentAddLiquidityPageContext = createContext<{
  state: State
  pool: Pool
  parsedInputAmounts: Record<string, CurrencyAmount<Token> | undefined>
  tokens: { [x: string]: Token }
  execute: () => void
  handleInput: (amount: string, address: string, options?: HandleInputOptions) => void
  showReview: (x: boolean) => void
  dispatch: Dispatch<any>
}>({
  state: initialState,
  pool: null,
  parsedInputAmounts: {},
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

  const showReview = useCallback(
    (payload = true) => {
      dispatch({
        type: ActionType.SHOW_ZAP_REVIEW,
        payload,
      })
    },
    [dispatch]
  )

  const execute = useCallback(async () => {
    alert('Execute')

    // Close modal
    showReview(false)
  }, [showReview])

  // We don't want this in the state because the state should consist of primitive values only,
  // derived state should go here (in the context)
  const parsedInputAmounts = useMemo(() => {
    return Object.entries(state.inputAmounts).reduce((acc, [k, v]) => {
      acc[k] = tryParseAmount(v, tokens[k])
      return acc
    }, {})
  }, [state.inputAmounts, tokens])

  // This will be used for ZAP mode only
  const parsedOutputAmounts = useMemo(() => {
    return Object.entries(state.inputAmounts).reduce((acc, [k, v]) => {
      acc[k] = tryParseAmount(v, tokens[k])
      return acc
    }, {})
  }, [state.inputAmounts, tokens])

  return (
    <TridentAddLiquidityPageContext.Provider
      value={useMemo(
        () => ({ state, parsedInputAmounts, pool, tokens, handleInput, showReview, execute, dispatch }),
        [state, parsedInputAmounts, pool, tokens, handleInput, showReview, execute]
      )}
    >
      {children}
    </TridentAddLiquidityPageContext.Provider>
  )
}

export const useTridentAddLiquidityPageContext = () => useContext(TridentAddLiquidityPageContext)
export const useTridentAddLiquidityPageState = () => useContext(TridentAddLiquidityPageContext).state
export const useTridentAddLiquidityPageDispatch = () => useContext(TridentAddLiquidityPageContext).dispatch
