import { createAction } from '@reduxjs/toolkit'

export interface SerializedToken {
  chainId: number
  address: string
  decimals: number
  symbol?: string
  name?: string
}

export interface SerializedPair {
  token0: SerializedToken
  token1: SerializedToken
}

export const updateMatchesDarkMode = createAction<{ matchesDarkMode: boolean }>('user/updateMatchesDarkMode')
export const updateUserDarkMode = createAction<{ userDarkMode: boolean }>('user/updateUserDarkMode')
export const updateUserExpertMode = createAction<{ userExpertMode: boolean }>('user/updateUserExpertMode')
export const updateUserSingleHopOnly = createAction<{
  userSingleHopOnly: boolean
}>('user/updateUserSingleHopOnly')
export const updateUserSlippageTolerance = createAction<{
  userSlippageTolerance: number | 'auto'
}>('user/updateUserSlippageTolerance')
export const updateUserDeadline = createAction<{ userDeadline: number }>('user/updateUserDeadline')
export const addSerializedToken = createAction<{
  serializedToken: SerializedToken
}>('user/addSerializedToken')
export const removeSerializedToken = createAction<{
  chainId: number
  address: string
}>('user/removeSerializedToken')
export const addSerializedPair = createAction<{
  serializedPair: SerializedPair
}>('user/addSerializedPair')
export const removeSerializedPair = createAction<{
  chainId: number
  tokenAAddress: string
  tokenBAddress: string
}>('user/removeSerializedPair')
// @openmev
// @exports updateUserOpenMevUseRelay
export const updateUserOpenMevUseRelay = createAction<{
  userOpenMevUseRelay: boolean
}>('user/updateUserOpenMevUseRelay')

/**
 export const updateUserOpenMevGasPrice = createAction<{
  userOpenMevGasPrice: string
}>('user/updateUserOpenMevGasPrice')
export const updateUserOpenMevETHTip = createAction<{
  userOpenMevETHTip: string
}>('user/updateUserOpenMevETHTip')
export const updateUserOpenMevGasEstimate = createAction<{
  userOpenMevGasEstimate: string
}>('user/updateUserOpenMevGasEstimate')
export const updateUserOpenMevTipManualOverride = createAction<{
  userOpenMevTipManualOverride: boolean
}>('user/updateUserOpenMevTipManualOverride')

 */

export const toggleURLWarning = createAction<void>('app/toggleURLWarning')
// @archerdao
export const updateUserArcherUseRelay = createAction<{
  userArcherUseRelay: boolean
}>('user/updateUserArcherUseRelay')
export const updateUserArcherGasPrice = createAction<{
  userArcherGasPrice: string
}>('user/updateUserArcherGasPrice')
export const updateUserArcherETHTip = createAction<{
  userArcherETHTip: string
}>('user/updateUserArcherETHTip')
export const updateUserArcherGasEstimate = createAction<{
  userArcherGasEstimate: string
}>('user/updateUserArcherGasEstimate')
export const updateUserArcherTipManualOverride = createAction<{
  userArcherTipManualOverride: boolean
}>('user/updateUserArcherTipManualOverride')
