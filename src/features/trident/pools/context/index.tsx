import React, { createContext, useContext, useReducer, Dispatch, useMemo } from 'react'
import reducer from './reducer'
import { Reducer, State } from './types'

// STATE SHOULD ONLY CONTAIN PRIMITIVE VALUES,
// ANY OTHER TYPE OF VARIABLE SHOULD BE DEFINED IN THE CONTEXT AND SEND AS DERIVED STATE
const initialState: State = {
  sortType: 0,
  searchQuery: null,
  filters: {
    poolTypes: [],
    feeTiers: [],
  },
}

export const TridentPoolsPageContext = createContext<{ state: State; dispatch: Dispatch<any> }>({
  state: initialState,
  dispatch: () => null,
})

export const TridentPoolsPageContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer<React.Reducer<State, Reducer>>(reducer, initialState)

  return (
    <TridentPoolsPageContext.Provider value={useMemo(() => ({ state, dispatch }), [state])}>
      {children}
    </TridentPoolsPageContext.Provider>
  )
}

export const useTridentPoolsPageContext = () => useContext(TridentPoolsPageContext)
export const useTridentPoolsPageState = () => useContext(TridentPoolsPageContext).state
export const useTridentPoolsPageDispatch = () => useContext(TridentPoolsPageContext).dispatch
