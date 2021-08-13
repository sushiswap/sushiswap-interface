import React, { createContext, useContext, useReducer, Dispatch, useMemo, useCallback } from 'react'
import reducer from './reducer'
import { ActionType, HandleInputOptions, LiquidityMode, Reducer, State } from './types'
import { useRouter } from 'next/router'
import { useTridentPool } from '../../../../hooks/useTridentPools'
import { Pool } from '../../types'

const initialState: State = {
  liquidityMode: LiquidityMode.ZAP,
  inputAmounts: {},
  showZapReview: false,
}

export const TridentRemoveLiquidityPageContext = createContext<{
  state: State
  pool: Pool
  execute: () => void
  handleInput: (amount: string, address: string, options?: HandleInputOptions) => void
  showReview: () => void
  dispatch: Dispatch<any>
}>({
  state: initialState,
  pool: null,
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

  const showReview = useCallback(() => {
    dispatch({
      type: ActionType.SHOW_ZAP_REVIEW,
      payload: true,
    })
  }, [dispatch])

  const execute = useCallback(async () => {
    alert('Execute')

    // Close modal
    dispatch({
      type: ActionType.SHOW_ZAP_REVIEW,
      payload: false,
    })
  }, [])

  return (
    <TridentRemoveLiquidityPageContext.Provider
      value={useMemo(
        () => ({ state, pool, handleInput, showReview, execute, dispatch }),
        [execute, handleInput, showReview, pool, state]
      )}
    >
      {children}
    </TridentRemoveLiquidityPageContext.Provider>
  )
}

export const useTridentRemoveLiquidityPageContext = () => useContext(TridentRemoveLiquidityPageContext)
export const useTridentRemoveLiquidityPageState = () => useContext(TridentRemoveLiquidityPageContext).state
export const useTridentRemoveLiquidityPageDispatch = () => useContext(TridentRemoveLiquidityPageContext).dispatch
