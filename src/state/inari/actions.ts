import { createAction } from '@reduxjs/toolkit'

export const setStrategy = createAction<string>('inari/setStrategy')
export const setZapIn = createAction<boolean>('inari/setZapIn')
export const setZapInValue = createAction<string>('inari/setZapInValue')
