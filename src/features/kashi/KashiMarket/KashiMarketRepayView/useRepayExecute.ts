import { TransactionResponse } from '@ethersproject/providers'
import { Currency, CurrencyAmount } from '@sushiswap/core-sdk'
import { useCallback } from 'react'

export interface RepayExecutePayload {
  repayAmount?: CurrencyAmount<Currency>
  removeAmount?: CurrencyAmount<Currency>
  repayFromWallet: boolean
  removeToWallet: boolean
  closePosition: boolean
}

type UseRepayExecute = () => (x: RepayExecutePayload) => Promise<TransactionResponse | undefined>

export const useRepayExecute: UseRepayExecute = () => {
  return useCallback(async ({ repayAmount, removeAmount, removeToWallet, repayFromWallet, closePosition }) => {
    return undefined
  }, [])
}
