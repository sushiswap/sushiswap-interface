import { Currency, CurrencyAmount, Token } from '@figswap/core-sdk'
import { useCurrencyBalances } from 'app/state/wallet/hooks'
import { useMemo } from 'react'

export const useBentoOrWalletBalances = (
  account: string | undefined,
  currencies: (Currency | Token | undefined)[],
  fromWallet?: (boolean | undefined)[]
) => {
  const tokenAddresses = useMemo(
    // @ts-ignore TYPE NEEDS FIXING
    () => (currencies.every((el) => el) ? currencies.map((el: Currency) => el.wrapped.address) : undefined),
    [currencies]
  )

  const balance = useCurrencyBalances(account, currencies)

  return useMemo(() => {
    if (!currencies.every((el) => !!el)) {
      return []
    }

    return currencies.map((cur, index) => {
      if (!cur) {
        return undefined
      }

      let element: CurrencyAmount<Currency> | undefined
      const tokenBalanceFromWallet = fromWallet?.[index]
      element = balance.find((el) => el?.currency.wrapped.address === cur.wrapped.address)

      if (!element) {
        element = CurrencyAmount.fromRawAmount(cur.wrapped, '0')
      }

      return element
    }, [])
  }, [currencies, fromWallet, balance])
}

export const useBentoOrWalletBalance = (account?: string, currency?: Currency, fromWallet?: boolean) => {
  // console.log('useBentoOrWalletBalance: ', account, currency, fromWallet)
  const currencies = useMemo(() => [currency], [currency])
  const flags = useMemo(() => [fromWallet], [fromWallet])
  const balances = useBentoOrWalletBalances(account, currencies, flags)
  return useMemo(() => (balances ? balances[0] : undefined), [balances])
}
