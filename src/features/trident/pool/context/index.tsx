import React, { createContext, useContext, useReducer, Dispatch, useMemo, FC } from 'react'
import reducer from './reducer'
import { Reducer, State } from './types'
import { Pool, PoolType } from '../../types'
import { useRouter } from 'next/router'
import { useTridentPool } from '../../../../hooks/useTridentPools'

// STATE SHOULD ONLY CONTAIN PRIMITIVE VALUES,
// ANY OTHER TYPE OF VARIABLE SHOULD BE DEFINED IN THE CONTEXT AND SEND AS DERIVED STATE
const initialState: State = {}

export const TridentPoolPageContext = createContext<{ state: State; pool: Pool; dispatch: Dispatch<any> }>({
  state: initialState,
  pool: null,
  dispatch: () => null,
})

const ParentProvider: FC<{ poolType: PoolType }> = ({ children, poolType }) => {
  const { query } = useRouter()
  const [pool] = useTridentPool(query.tokens, poolType)
  const [state, dispatch] = useReducer<React.Reducer<State, Reducer>>(reducer, initialState)

  return (
    <TridentPoolPageContext.Provider value={useMemo(() => ({ state, pool, dispatch }), [pool, state])}>
      {children}
    </TridentPoolPageContext.Provider>
  )
}

export const TridentPoolPageContextProvider = (poolType: PoolType) => {
  return ({ children }) => <ParentProvider poolType={poolType}>{children}</ParentProvider>
}

export const useTridentPoolPageContext = () => useContext(TridentPoolPageContext)
export const useTridentPoolPageState = () => useContext(TridentPoolPageContext).state
export const useTridentPoolPageDispatch = () => useContext(TridentPoolPageContext).dispatch
