import React from 'react'
import { ActionType, Reducer, State } from './types'

const reducer: React.Reducer<State, Reducer> = (state: any, action: any) => {
  switch (action.type) {
    case ActionType.SET_PERCENTAGE_AMOUNT: {
      return {
        ...state,
        percentageAmount: action.payload,
      }
    }
    case ActionType.SET_OUTPUT_TOKEN: {
      return {
        ...state,
        outputTokenAddress: action.payload,
      }
    }
    case ActionType.SET_LIQUIDITY_MODE: {
      return {
        ...state,
        liquidityMode: action.payload,
        inputAmounts: {},
      }
    }
    case ActionType.SET_INPUT_AMOUNT: {
      const inputAmounts = { ...state.inputAmounts }
      inputAmounts[action.payload.address] = action.payload.amount

      return {
        ...state,
        inputAmounts,
      }
    }
    case ActionType.SET_INPUT_AMOUNTS: {
      const inputAmounts = { ...state.inputAmounts }
      action.payload.forEach((el) => (inputAmounts[el.address] = el.amount))

      return {
        ...state,
        inputAmounts,
      }
    }
    case ActionType.SET_INPUT_AMOUNT_WITH_CLEAR: {
      const inputAmounts = {}
      Object.keys(state.inputAmounts).forEach((key) => (inputAmounts[key] = ''))
      inputAmounts[action.payload.address] = action.payload.amount

      return {
        ...state,
        inputAmounts,
      }
    }
    case ActionType.SHOW_ZAP_REVIEW: {
      return {
        ...state,
        showZapReview: action.payload,
      }
    }
    default:
      return state
  }
}

export default reducer
