import React, { createContext, useContext, useReducer, Dispatch, useMemo } from 'react'
import reducer from './reducer'
import { Reducer, State } from './types'

const initialState: State = {}

export const TridentAddLiquidityPageContext = createContext<{ state: State; dispatch: Dispatch<any> }>({
  state: initialState,
  dispatch: () => null,
})

export const TridentAddLiquidityPageContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer<React.Reducer<State, Reducer>>(reducer, initialState)

  return (
    <TridentAddLiquidityPageContext.Provider value={useMemo(() => ({ state, dispatch }), [state])}>
      {children}
    </TridentAddLiquidityPageContext.Provider>
  )
}

export const useTridentAddLiquidityPageContext = () => {
  return useContext(TridentAddLiquidityPageContext)
}

export const useTridentAddLiquidityPageState = () => {
  return useContext(TridentAddLiquidityPageContext).state
}

export const useTridentAddLiquidityPageDispatch = () => {
  return useContext(TridentAddLiquidityPageContext).dispatch
}
