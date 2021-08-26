import React from 'react'
import { ActionType, Reducer } from '../../../types'
import { ClassicPoolState } from './types'

const reducer: React.Reducer<ClassicPoolState, Reducer> = (state: any, action: any) => {
  switch (action.type) {
    case ActionType.SET_INPUT_TOKEN: {
      return {
        ...state,
        inputTokenAddress: action.payload,
      }
    }
    case ActionType.SET_SPEND_FROM_WALLET: {
      return {
        ...state,
        spendFromWallet: action.payload,
      }
    }
    case ActionType.SET_BALANCED_MODE: {
      return {
        ...state,
        balancedMode: action.payload,
      }
    }
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
      const inputAmounts = { ...state.inputAmounts }
      Object.keys(inputAmounts).forEach((key) => (inputAmounts[key] = ''))

      return {
        ...state,
        liquidityMode: action.payload,
        inputAmounts,
      }
    }
    case ActionType.SET_INPUT_AMOUNT: {
      return {
        ...state,
        inputAmounts: action.payload,
      }
    }
    case ActionType.SET_INPUT_AMOUNTS: {
      if (action.payload.noLiquidity) {
        // they're typing into the field they've last typed in
        if (action.payload.field === state.independentField) {
          return {
            ...state,
            independentField: action.payload.field,
            typedValue: action.payload.typedValue,
          }
        }
        // they're typing into a new field, store the other value
        else {
          return {
            ...state,
            independentField: action.payload.field,
            typedValue: action.payload.typedValue,
            otherTypedValue: state.typedValue,
          }
        }
      } else {
        return {
          ...state,
          independentField: action.payload.field,
          typedValue: action.payload.typedValue,
          otherTypedValue: '',
        }
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
    case ActionType.SET_MIN_PRICE: {
      return {
        ...state,
        minPrice: action.payload,
      }
    }
    case ActionType.SET_MAX_PRICE: {
      return {
        ...state,
        maxPrice: action.payload,
      }
    }
    case ActionType.SET_TX_HASH: {
      return {
        ...state,
        txHash: action.payload,
      }
    }
    case ActionType.SET_FIXED_RATIO_MODE: {
      return {
        ...state,
        fixedRatio: action.payload,
      }
    }
    default:
      return state
  }
}

export default reducer
