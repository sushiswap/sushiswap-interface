import { Signature } from '@ethersproject/bytes'
import { createReducer } from '@reduxjs/toolkit'
import { AppState } from 'app/state'

import {
  clear,
  Field,
  replaceLimitOrderState,
  selectCurrency,
  setFromBentoBalance,
  setLimitOrderApprovalPending,
  setLimitOrderAttemptingTxn,
  setLimitOrderBentoPermit,
  setLimitOrderInvertRate,
  setLimitOrderInvertState,
  setLimitOrderShowReview,
  setLimitPrice,
  setOrderExpiration,
  setRecipient,
  setStopLossInvertRate,
  setStopLossInvertState,
  setStopPrice,
  switchCurrencies,
  toggleEnableHigherStopRateThanMarketPrice,
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
  readonly typedField: Field
  readonly typedValue: string
  readonly limitPrice: string
  readonly stopPrice: string
  readonly inputCurrencyId: string
  readonly outputCurrencyId: string
  readonly recipient?: string
  readonly fromBentoBalance: boolean
  readonly limitOrderApprovalPending: string
  readonly orderExpiration: {
    value: OrderExpiration | string
    label: string
  }
  readonly bentoPermit?: Signature
  readonly attemptingTxn: boolean
  readonly showReview: boolean
  readonly invertRate: boolean
  readonly invertStopRate: boolean
  readonly enableHigherStopRateThanMarketPrice: boolean
}

const initialState: LimitOrderState = {
  typedField: Field.INPUT,
  typedValue: '',
  limitPrice: '',
  stopPrice: '',
  inputCurrencyId: 'ETH',
  outputCurrencyId: 'SUSHI',
  recipient: undefined,
  fromBentoBalance: false,
  limitOrderApprovalPending: '',
  orderExpiration: {
    value: OrderExpiration.never,
    label: 'Never',
  },
  bentoPermit: undefined,
  attemptingTxn: false,
  showReview: false,
  invertRate: false,
  invertStopRate: false,
  enableHigherStopRateThanMarketPrice: false,
}

export default createReducer<LimitOrderState>(initialState, (builder) =>
  builder
    .addCase(
      // @ts-ignore TYPE NEEDS FIXING
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
            stopPrice,
            orderExpiration,
          },
        }
      ) => ({
        inputCurrencyId,
        outputCurrencyId,
        independentField,
        typedValue: typedValue,
        recipient,
        fromBentoBalance,
        limitPrice,
        stopPrice,
        orderExpiration,
        limitOrderApprovalPending: state.limitOrderApprovalPending,
      })
    )
    .addCase(setLimitPrice, (state, { payload: limitPrice }) => {
      // @ts-ignore TYPE NEEDS FIXING
      state.limitPrice = limitPrice
    })
    .addCase(setStopPrice, (state, { payload: stopPrice }) => {
      // @ts-ignore TYPE NEEDS FIXING
      state.stopPrice = stopPrice
    })
    .addCase(setLimitOrderApprovalPending, (state, { payload: limitOrderApprovalPending }) => {
      state.limitOrderApprovalPending = limitOrderApprovalPending
    })
    .addCase(setOrderExpiration, (state, { payload: orderExpiration }) => {
      // @ts-ignore TYPE NEEDS FIXING
      state.orderExpiration = orderExpiration
    })
    .addCase(setFromBentoBalance, (state, { payload: fromBentoBalance }) => {
      state.fromBentoBalance = fromBentoBalance
    })
    .addCase(selectCurrency, (state, { payload: { currencyId, field } }) => {
      if (field === Field.INPUT) {
        state.limitPrice = ''
        state.inputCurrencyId = currencyId
      }
      if (field === Field.OUTPUT) {
        state.limitPrice = ''
        state.outputCurrencyId = currencyId
      }
    })
    .addCase(switchCurrencies, (state) => {
      return {
        ...state,
        inputCurrencyId: state.outputCurrencyId,
        outputCurrencyId: state.inputCurrencyId,
      }
    })
    .addCase(typeInput, (state, { payload: { field, typedValue } }) => {
      state.typedField = field
      state.typedValue = typedValue
    })
    .addCase(setRecipient, (state, { payload: recipient }) => {
      state.recipient = recipient
    })
    .addCase(clear, () => {
      return {
        ...initialState,
      }
    })
    .addCase(setLimitOrderBentoPermit, (state, { payload: bentoPermit }) => {
      state.bentoPermit = bentoPermit
    })
    .addCase(setLimitOrderAttemptingTxn, (state, { payload: attemptingTxn }) => {
      state.attemptingTxn = attemptingTxn
    })
    .addCase(setLimitOrderShowReview, (state, { payload: showReview }) => {
      state.showReview = showReview
    })
    .addCase(setLimitOrderInvertRate, (state, { payload: invertRate }) => {
      state.invertRate = invertRate
    })
    .addCase(setLimitOrderInvertState, (state, { payload: { invertRate, limitPrice } }) => {
      state.invertRate = invertRate
      state.limitPrice = limitPrice
    })
    .addCase(setStopLossInvertRate, (state, { payload: invertStopRate }) => {
      state.invertStopRate = invertStopRate
    })
    .addCase(setStopLossInvertState, (state, { payload: { invertStopRate, stopPrice } }) => {
      state.invertStopRate = invertStopRate
      state.stopPrice = stopPrice
    })
    .addCase(toggleEnableHigherStopRateThanMarketPrice, (state) => {
      state.enableHigherStopRateThanMarketPrice = !state.enableHigherStopRateThanMarketPrice
    })
)

type SelectLimitOrder = (state: AppState) => LimitOrderState
export const selectLimitOrder: SelectLimitOrder = (state: AppState) => state.limitOrder
