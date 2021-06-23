import { createAction } from '@reduxjs/toolkit'

export enum Field {
  CURRENCY_A = 'CURRENCY_A',
  CURRENCY_B = 'CURRENCY_B',
}

export enum Context {
  SWAP = 'SWAP',
  LENDING = 'LENDING',
}

export const selectContext = createAction<{
  context: Context
}>('create/selectContext')

export const selectCurrency = createAction<{
  field: Field
  currencyId: string
}>('create/selectCurrency')

export const switchCurrencies = createAction<void>('create/switchCurrencies')

export const typeInput = createAction<{ field: Field; typedValue: string }>('create/typeInput')

export const replaceCreateState = createAction<{
  field: Field
  typedValue: string
  currencyAId?: string
  currencyBId?: string
  recipient: string | null
}>('create/replaceSwapState')
