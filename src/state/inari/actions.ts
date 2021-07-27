import { createAction } from '@reduxjs/toolkit'

export const setStrategy = createAction<number>('inari/setStrategy')
export const setZapIn = createAction<boolean>('inari/setZapIn')
export const setZapInValue = createAction<string>('inari/setZapInValue')
