import { Currency, Token } from '@sushiswap/core-sdk'
import { useCurrencyBalances } from '../state/wallet/hooks'
import { useBentoBalances2 } from '../state/bentobox/hooks'
import { useMemo } from 'react'

export const useBentoOrWalletBalance = (
  account: string,
  currencies: (Currency | Token)[],
  wallet: Record<string, boolean>
) => {
  const tokens = useMemo(() => currencies.map((el) => el?.wrapped), [currencies])
  const balance = useCurrencyBalances(account, currencies)
  const bentoBalance = useBentoBalances2(account, tokens)

  return useMemo(() => {
    return tokens.reduce((acc, cur) => {
      if (wallet?.[cur?.wrapped.address]) {
        acc.push(balance[cur?.wrapped.address])
      } else {
        acc.push(bentoBalance[cur?.wrapped.address])
      }
      return acc
    }, [])
  }, [balance, bentoBalance, tokens, wallet])
}
