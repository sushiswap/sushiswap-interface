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
      return {
        ...state,
        inputAmounts:
          action.payload.position === 0
            ? [action.payload.amount, state.inputAmounts[1]]
            : [state.inputAmounts[0], action.payload.amount],
      }
    case ActionType.SET_CURRENCY:
      return {
        ...state,
        currencies:
          action.payload.position === 0
            ? [action.payload.currency, state.currencies[1]]
            : [state.currencies[0], action.payload.currency],
      }
    default:
      return state
  }
}

export default reducer
