import React from 'react'
import { ActionType, Reducer, State } from './types'

const reducer: React.Reducer<State, Reducer> = (state: any, action: any) => {
  switch (action.type) {
    case ActionType.SET_LIQUIDITY_MODE:
      return {
        ...state,
        liquidityMode: action.payload,
      }
    case ActionType.SET_INPUT_AMOUNT:
      const inputAmounts = [...state.inputAmounts]
      inputAmounts[action.payload.position] = action.payload.amount

      return {
        ...state,
        inputAmounts,
      }
    case ActionType.SET_CURRENCY:
      const currencies = [...state.currencies]
      currencies[action.payload.position] = action.payload.currency

      return {
        ...state,
        currencies,
      }
    case ActionType.SHOW_ZAP_REVIEW:
      return {
        ...state,
        showZapReview: action.payload,
      }
    default:
      return state
  }
}

export default reducer
