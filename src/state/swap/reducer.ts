import { BigNumber } from '@ethersproject/bignumber'
import { createReducer } from '@reduxjs/toolkit'

import {
  Field,
  replaceSwapState,
  selectCurrency,
  setFees,
  setMaxFee,
  setPriorityFee,
  setRecipient,
  setSushiRelayChallenge,
  switchCurrencies,
  typeInput,
} from './actions'

export interface SwapState {
  readonly independentField: Field
  readonly typedValue: string
  readonly [Field.INPUT]: {
    readonly currencyId: string | undefined
  }
  readonly [Field.OUTPUT]: {
    readonly currencyId: string | undefined
  }
  // the typed recipient address or ENS name, or null if swap should go to sender
  readonly recipient?: string
  readonly sushiRelayChallenge?: string
  readonly maxFee?: string | BigNumber | null
  readonly maxPriorityFee?: string | BigNumber | null
}

/**
 * @interface SwapState
 *
 * @const {initialState}
 * @param recipient
 * @param sushiRelayChallenge
 * @param maxFee
 * @param maxPriorityFee
 */
const initialState: SwapState = {
  independentField: Field.INPUT,
  typedValue: '',
  [Field.INPUT]: {
    currencyId: '',
  },
  [Field.OUTPUT]: {
    currencyId: '',
  },
  recipient: undefined,
  sushiRelayChallenge: undefined,
  maxFee: undefined,
  /**
   * @param maxPriorityFee
   * @summary maxPriorityFee is adjusted to account for MEV bundle pricing
   * @see {@link https://docs.openmev.org/technical-reference/maxPriorityFee#overview}
   */
  maxPriorityFee: BigNumber.from('1650000000') ?? undefined,
}

export default createReducer<SwapState>(initialState, (builder) =>
  builder
    .addCase(
      replaceSwapState,
      (state, { payload: { typedValue, recipient, field, inputCurrencyId, outputCurrencyId } }) => {
        return {
          [Field.INPUT]: {
            currencyId: inputCurrencyId,
          },
          [Field.OUTPUT]: {
            currencyId: outputCurrencyId,
          },
          independentField: field,
          typedValue,
          recipient,
        }
      }
    )
    .addCase(selectCurrency, (state, { payload: { currencyId, field } }) => {
      const otherField = field === Field.INPUT ? Field.OUTPUT : Field.INPUT
      // console.log({ currencyId, other: state[otherField].currencyId, test: state[otherField].currencyId }, currencyId === state[otherField].currencyId)
      return currencyId === state[otherField].currencyId
        ? {
            ...state,
            independentField: state.independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT,
            [field]: { currencyId: currencyId },
            [otherField]: { currencyId: state[field].currencyId },
          }
        : {
            ...state,
            [field]: { currencyId },
          }
    })
    .addCase(switchCurrencies, (state) => {
      return {
        ...state,
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
    .addCase(setRecipient, (state, { payload: recipient }) => {
      state.recipient = recipient
    })
    .addCase(setSushiRelayChallenge, (state, { payload: sushiRelayChallenge }) => {
      state.sushiRelayChallenge = sushiRelayChallenge
    })
    .addCase(setFees, (state, { payload: { maxFee, maxPriorityFee } }) => {
      state.maxFee = maxFee
      state.maxPriorityFee = maxPriorityFee
    })
    .addCase(setMaxFee, (state, { payload: maxFee }) => {
      state.maxFee = maxFee
    })
    .addCase(setPriorityFee, (state, { payload: setPriorityFee }) => {
      state.maxPriorityFee = setPriorityFee
    })
)
