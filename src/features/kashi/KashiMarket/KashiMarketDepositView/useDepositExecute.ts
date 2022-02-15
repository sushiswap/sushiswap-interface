import { TransactionResponse } from '@ethersproject/providers'
import { Currency, CurrencyAmount } from '@sushiswap/core-sdk'
import { useCallback } from 'react'

export interface DepositExecutePayload {
  repayAmount?: CurrencyAmount<Currency>
  removeAmount?: CurrencyAmount<Currency>
  repayFromWallet: boolean
  removeToWallet: boolean
  closePosition: boolean
}

type UseDepositExecute = () => (x: DepositExecutePayload) => Promise<TransactionResponse | undefined>

export const useDepositExecute: UseDepositExecute = () => {
  return useCallback(async ({ repayAmount, removeAmount, removeToWallet, repayFromWallet, closePosition }) => {
    return undefined
  }, [])
}
