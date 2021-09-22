import { Currency, Token } from '@sushiswap/core-sdk'
import { useCurrencyBalances } from '../state/wallet/hooks'
import { useBentoBalances2 } from '../state/bentobox/hooks'
import { useMemo } from 'react'

export const useBentoOrWalletBalance = (account: string, currencies: (Currency | Token)[], wallet = true) => {
  const tokens = useMemo(() => currencies.map((el) => el?.wrapped), [currencies])
  const balance = useCurrencyBalances(account, currencies)
  const bentoBalance = useBentoBalances2(account, tokens)
  return useMemo(() => (wallet ? balance : Object.values(bentoBalance)), [balance, bentoBalance, wallet])
}
