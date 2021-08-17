import React, { createContext, useContext, useReducer, Dispatch, useMemo, useCallback, useEffect } from 'react'
import reducer from './reducer'
import { ActionType, LiquidityMode, Reducer, State } from './types'
import { useRouter } from 'next/router'
import { useTridentPool } from '../../../../hooks/useTridentPools'
import { Pool } from '../../types'
import { HandleInputOptions } from '../../remove/context/types'
import { Token } from '@sushiswap/sdk'

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
  tokens: { [x: string]: Token }
  execute: () => void
  handleInput: (amount: string, address: string, options?: HandleInputOptions) => void
  showReview: (x: boolean) => void
  dispatch: Dispatch<any>
}>({
  state: initialState,
  pool: null,
  tokens: {},
  execute: () => null,
  handleInput: () => null,
  showReview: (x: boolean) => null,
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

  return (
    <TridentAddLiquidityPageContext.Provider
      value={useMemo(
        () => ({ state, pool, tokens, handleInput, showReview, execute, dispatch }),
        [execute, handleInput, showReview, pool, tokens, state]
      )}
    >
      {children}
    </TridentAddLiquidityPageContext.Provider>
  )
}

export const useTridentAddLiquidityPageContext = () => useContext(TridentAddLiquidityPageContext)
export const useTridentAddLiquidityPageState = () => useContext(TridentAddLiquidityPageContext).state
export const useTridentAddLiquidityPageDispatch = () => useContext(TridentAddLiquidityPageContext).dispatch
