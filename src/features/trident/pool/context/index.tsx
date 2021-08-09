import React, { createContext, useContext, useReducer, Dispatch, useMemo } from 'react'
import reducer from './reducer'
import { Reducer, State } from './types'
import { Pool } from '../../types'
import { useRouter } from 'next/router'
import { useTridentPool } from '../../../../hooks/useTridentPools'

const initialState: State = {}

export const TridentPoolPageContext = createContext<{ state: State; pool: Pool; dispatch: Dispatch<any> }>({
  state: initialState,
  pool: null,
  dispatch: () => null,
})

export const TridentPoolPageContextProvider = ({ children }) => {
  const { query } = useRouter()
  const [pool] = useTridentPool(query.tokens)
  const [state, dispatch] = useReducer<React.Reducer<State, Reducer>>(reducer, initialState)

  return (
    <TridentPoolPageContext.Provider value={useMemo(() => ({ state, pool, dispatch }), [pool, state])}>
      {children}
    </TridentPoolPageContext.Provider>
  )
}

export const useTridentPoolPageContext = () => useContext(TridentPoolPageContext)
export const useTridentPoolPageState = () => useContext(TridentPoolPageContext).state
export const useTridentPoolPageDispatch = () => useContext(TridentPoolPageContext).dispatch
