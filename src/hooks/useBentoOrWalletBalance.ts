import { Currency, Token } from '@sushiswap/core-sdk'
import { useCurrencyBalances } from '../state/wallet/hooks'
import { useBentoBalances2 } from '../state/bentobox/hooks'
import { useMemo } from 'react'

export const useBentoOrWalletBalance = (
  account: string,
  currencies: (Currency | Token)[],
  walletOrBento: Record<string, boolean>
) => {
  const tokens = useMemo(() => currencies.map((el) => el?.wrapped), [currencies])
  const balance = useCurrencyBalances(account, currencies)
  const bentoBalance = useBentoBalances2(account, tokens)
  const serializedBalance = useMemo(() => balance.map((el) => el?.serialize()).join('-'), [balance])

  return useMemo(() => {
    return tokens.reduce((acc, cur) => {
      if (walletOrBento?.[cur?.wrapped.address] === true) {
        acc.push(balance.find((el) => el?.currency.wrapped.address === cur?.wrapped.address))
      }

      if (walletOrBento?.[cur?.wrapped.address] === false) {
        acc.push(bentoBalance[cur?.wrapped.address])
      }

      return acc
    }, [])

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serializedBalance, bentoBalance, tokens, walletOrBento])
}
