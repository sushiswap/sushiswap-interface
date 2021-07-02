import { createAction } from '@reduxjs/toolkit'
import { Currency, CurrencyAmount } from '@sushiswap/sdk'

export const setStrategy = createAction<string>('inari/setStrategy')
export const setZapIn = createAction<boolean>('inari/setZapIn')
export const setZapInValue = createAction<string>('inari/setZapInValue')
