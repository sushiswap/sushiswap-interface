import { createReducer } from '@reduxjs/toolkit'
import { AppState } from 'app/state'

import {
  Field,
  replaceLimitOrderState,
  selectCurrency,
  setFromBentoBalance,
  setLimitOrderApprovalPending,
  setLimitPrice,
  setOrderExpiration,
  setRecipient,
  switchCurrencies,
  typeInput,
} from './actions'

export enum OrderExpiration {
  never = 'never',
  hour = 'hour',
  day = 'day',
  week = 'week',
  month = 'month',
}

export interface LimitOrderState {
  readonly independentField: Field
  readonly typedValue: string
  readonly limitPrice: string
  readonly [Field.INPUT]: {
    readonly currencyId?: string
  }
  readonly [Field.OUTPUT]: {
    readonly currencyId?: string
  }
  // the typed recipient address or ENS name, or null if swap should go to sender
  readonly recipient?: string
  readonly fromBentoBalance: boolean
  readonly limitOrderApprovalPending: string
  readonly orderExpiration: {
    value: OrderExpiration | string
    label: string
  }
}

const initialState: LimitOrderState = {
  independentField: Field.INPUT,
  typedValue: '',
  limitPrice: '',
  [Field.INPUT]: {
    currencyId: '',
  },
  [Field.OUTPUT]: {
    currencyId: '',
  },
  recipient: undefined,
  fromBentoBalance: false,
  limitOrderApprovalPending: '',
  orderExpiration: {
    value: '',
    label: '',
  },
}

export default createReducer<LimitOrderState>(initialState, (builder) =>
  builder
    .addCase(
      replaceLimitOrderState,
      (
        state,
        {
          payload: {
            typedValue,
            recipient,
            independentField,
            inputCurrencyId,
            outputCurrencyId,
            fromBentoBalance,
            limitPrice,
            orderExpiration,
          },
        }
      ) => ({
        [Field.INPUT]: {
          currencyId: inputCurrencyId,
        },
        [Field.OUTPUT]: {
          currencyId: outputCurrencyId,
        },
        independentField,
        typedValue: typedValue,
        recipient,
        fromBentoBalance,
        limitPrice,
        orderExpiration,
        limitOrderApprovalPending: state.limitOrderApprovalPending,
      })
    )
    .addCase(setLimitPrice, (state, { payload: limitPrice }) => {
      state.limitPrice = limitPrice
    })
    .addCase(setLimitOrderApprovalPending, (state, { payload: limitOrderApprovalPending }) => {
      state.limitOrderApprovalPending = limitOrderApprovalPending
    })
    .addCase(setOrderExpiration, (state, { payload: orderExpiration }) => {
      state.orderExpiration = orderExpiration
    })
    .addCase(setFromBentoBalance, (state, { payload: fromBentoBalance }) => {
      state.fromBentoBalance = fromBentoBalance
    })
    .addCase(selectCurrency, (state, { payload: { currencyId, field } }) => {
      const otherField = field === Field.INPUT ? Field.OUTPUT : Field.INPUT
      if (currencyId === state[otherField].currencyId) {
        // the case where we have to swap the order
        return {
          ...state,
          independentField: state.independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT,
          [field]: { currencyId: currencyId },
          [otherField]: { currencyId: state[field].currencyId },
        }
      } else {
        // the normal case
        return {
          ...state,
          [field]: { currencyId: currencyId },
        }
      }
    })
    .addCase(switchCurrencies, (state) => {
      return {
        ...state,
        limitPrice: +state.limitPrice > 0 ? (1 / +state.limitPrice).toString() : '0.0',
        independentField: state.independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT,
        [Field.INPUT]: { currencyId: state[Field.OUTPUT].currencyId },
        [Field.OUTPUT]: { currencyId: state[Field.INPUT].currencyId },
      }
    })
    .addCase(typeInput, (state, { payload: { field, typedValue } }) => {
      return {
        ...state,
        independentField: field,
        typedValue,
      }
    })
    .addCase(setRecipient, (state, { payload: { recipient } }) => {
      state.recipient = recipient
    })
)

type SelectLimitOrder = (state: AppState) => LimitOrderState
export const selectLimitOrder: SelectLimitOrder = (state: AppState) => state.limitOrder
export const selectLimitOrderBentoBalance = (state: AppState) => state.limitOrder.fromBentoBalance
