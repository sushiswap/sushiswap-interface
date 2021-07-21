import { createAction } from '@reduxjs/toolkit'

export enum Field {
  INPUT = 'INPUT',
  OUTPUT = 'OUTPUT',
}

export const setLimitPrice = createAction<string | null>('limit-order/setLimitPrice')

export const setOrderExpiration = createAction<{
  value: string
  label: string
} | null>('limit-order/setOrderExpiration')

export const setFromBentoBalance = createAction<boolean>('limit-order/setFromBentoBalance')

export const setLimitOrderApprovalPending = createAction<string>('limit-order/setLimitOrderApprovalPending')

export const replaceLimitOrderState = createAction<{
  independentField: Field
  typedValue: string
  inputCurrencyId?: string
  outputCurrencyId?: string
  recipient: string | null
  fromBentoBalance?: boolean
  limitPrice: string
  orderExpiration?: { value: string; label: string }
}>('limit-order/replaceLimitOrderState')

export const selectCurrency = createAction<{
  field: Field
  currencyId: string
}>('limit-order/selectCurrency')

export const switchCurrencies = createAction<void>('limit-order/switchCurrencies')

export const typeInput = createAction<{ field: Field; typedValue: string }>('limit-order/typeInput')

export const setRecipient = createAction<{ recipient: string | null }>('limit-order/setRecipient')
