import { Field, replaceCreateState, selectCurrency, switchCurrencies, typeInput } from './actions'

import { createReducer } from '@reduxjs/toolkit'

export interface CreateState {
  readonly independentField: Field
  readonly typedValue: string
  readonly [Field.CURRENCY_A]: {
    readonly currencyId: string | undefined
  }
  readonly [Field.CURRENCY_B]: {
    readonly currencyId: string | undefined
  }
  // the typed recipient address or ENS name, or null if swap should go to sender
  readonly recipient: string | null
}

const initialState: CreateState = {
  independentField: Field.CURRENCY_A,
  typedValue: '',
  [Field.CURRENCY_A]: {
    currencyId: '',
  },
  [Field.CURRENCY_B]: {
    currencyId: '',
  },
  recipient: null,
}

export default createReducer<CreateState>(initialState, (builder) =>
  builder
    .addCase(replaceCreateState, (state, { payload: { typedValue, recipient, field, currencyAId, currencyBId } }) => {
      return {
        [Field.CURRENCY_A]: {
          currencyId: currencyAId,
        },
        [Field.CURRENCY_B]: {
          currencyId: currencyBId,
        },
        independentField: field,
        typedValue: typedValue,
        recipient,
      }
    })
    .addCase(selectCurrency, (state, { payload: { currencyId, field } }) => {
      const otherField = field === Field.CURRENCY_A ? Field.CURRENCY_B : Field.CURRENCY_A
      if (currencyId === state[otherField].currencyId) {
        // the case where we have to swap the order
        return {
          ...state,
          independentField: state.independentField === Field.CURRENCY_A ? Field.CURRENCY_B : Field.CURRENCY_A,
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
        independentField: state.independentField === Field.CURRENCY_A ? Field.CURRENCY_B : Field.CURRENCY_A,
        [Field.CURRENCY_A]: { currencyId: state[Field.CURRENCY_B].currencyId },
        [Field.CURRENCY_B]: { currencyId: state[Field.CURRENCY_A].currencyId },
      }
    })
    .addCase(typeInput, (state, { payload: { field, typedValue } }) => {
      return {
        ...state,
        independentField: field,
        typedValue,
      }
    })
)
