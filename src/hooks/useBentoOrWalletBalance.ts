import { Currency, CurrencyAmount, Token } from '@sushiswap/core-sdk'
import { useCurrencyBalances } from '../state/wallet/hooks'
import { useBentoBalances2 } from '../state/bentobox/hooks'
import { useMemo } from 'react'

export const useBentoOrWalletBalance = (
  account: string | undefined,
  currencies: (Currency | Token | undefined)[],
  walletOrBento: Record<string, boolean> | undefined
) => {
  const tokens = useMemo(() => currencies.map((el) => el?.wrapped), [currencies])
  const balance = useCurrencyBalances(account, currencies)
  const bentoBalance = useBentoBalances2(account, tokens)
  const serializedBalance = useMemo(() => balance.map((el) => el?.serialize()).join('-'), [balance])

  return useMemo(() => {
    return currencies.reduce<(CurrencyAmount<Currency> | undefined)[]>((acc, cur) => {
      if (!cur) {
        acc.push(undefined)
        return acc
      }

      if (walletOrBento?.[cur?.wrapped.address] === true) {
        const element = balance.find((el) => el?.currency.wrapped.address === cur?.wrapped.address)
        if (element) acc.push(element)
      }

      if (walletOrBento?.[cur?.wrapped.address] === false) {
        const element = bentoBalance[cur?.wrapped.address]
        if (element) acc.push(element)
      }

      return acc
    }, [])

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serializedBalance, bentoBalance, tokens, walletOrBento])
}
