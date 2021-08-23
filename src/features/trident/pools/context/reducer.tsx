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
    case ActionType.ADD_POOL_TYPE_FILTER:
      return {
        ...state,
        filters: {
          ...state.filters,
          poolTypes: [...state.filters.poolTypes, action.payload],
        },
      }
    case ActionType.ADD_FEE_TIER_FILTER:
      return {
        ...state,
        filters: {
          ...state.filters,
          feeTiers: [...state.filters.feeTiers, action.payload],
        },
      }
    case ActionType.DELETE_POOL_TYPE_FILTER:
      return {
        ...state,
        filters: {
          ...state.filters,
          poolTypes: state.filters.poolTypes.filter((el) => el.label !== action.payload.label),
        },
      }
    case ActionType.DELETE_FEE_TIER_FILTER:
      return {
        ...state,
        filters: {
          ...state.filters,
          feeTiers: state.filters.feeTiers.filter((el) => el.label !== action.payload.label),
        },
      }
    default:
      return state
  }
}

export default reducer
