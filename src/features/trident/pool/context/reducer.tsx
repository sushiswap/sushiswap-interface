import React from 'react'
import { Reducer, State, ActionType } from './types'

const reducer: React.Reducer<State, Reducer> = (state: any, action: any) => {
  switch (action.type) {
    case ActionType.SEARCH:
      return {
        ...state,
        searchQuery: action.payload,
      }
    case ActionType.SET_SORT_TYPE:
      return {
        ...state,
        sortType: action.payload,
      }
    default:
      return state
  }
}

export default reducer
