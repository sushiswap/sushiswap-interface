import React, { createContext, useContext, useReducer, Dispatch, useMemo, useCallback, useEffect } from 'react'
import reducer from './reducer'
import { ActionType, LiquidityMode, Reducer, State } from './types'
import { useRouter } from 'next/router'
import { useTridentPool } from '../../../../hooks/useTridentPools'
import { Pool } from '../../types'

const initialState: State = {
  liquidityMode: LiquidityMode.ZAP,
  currencies: [],
  inputAmounts: [],
  showZapReview: false,
}

export const TridentAddLiquidityPageContext = createContext<{
  state: State
  pool: Pool
  execute: () => void
  dispatch: Dispatch<any>
}>({
  state: initialState,
  pool: null,
  execute: () => null,
  dispatch: () => null,
})

export const TridentAddLiquidityPageContextProvider = ({ children }) => {
  const { query } = useRouter()
  const [pool] = useTridentPool(query.tokens)
  const [state, dispatch] = useReducer<React.Reducer<State, Reducer>>(reducer, {
    ...initialState,
    currencies: pool.tokens,
  })

  const execute = useCallback(async () => {
    alert('Execute')

    // Close modal
    dispatch({
      type: ActionType.SHOW_ZAP_REVIEW,
      payload: false,
    })
  }, [])

  return (
    <TridentAddLiquidityPageContext.Provider
      value={useMemo(() => ({ state, pool, execute, dispatch }), [execute, pool, state])}
    >
      {children}
    </TridentAddLiquidityPageContext.Provider>
  )
}

export const useTridentAddLiquidityPageContext = () => useContext(TridentAddLiquidityPageContext)
export const useTridentAddLiquidityPageState = () => useContext(TridentAddLiquidityPageContext).state
export const useTridentAddLiquidityPageDispatch = () => useContext(TridentAddLiquidityPageContext).dispatch
