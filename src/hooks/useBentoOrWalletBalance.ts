import { Currency, CurrencyAmount, JSBI, Rebase, Token } from '@sushiswap/core-sdk'
import { toAmountCurrencyAmount } from 'app/functions'
import { useBoringHelperContract } from 'app/hooks/useContract'
import { useActiveWeb3React } from 'app/services/web3'
import { useSingleCallResult } from 'app/state/multicall/hooks'
import { useCurrencyBalances } from 'app/state/wallet/hooks'
import { useMemo } from 'react'

export const useBentoBalances = (tokens?: Token[]) => {
  const { account } = useActiveWeb3React()
  const boringHelperContract = useBoringHelperContract()
  const tokenAddresses = useMemo(() => (tokens ? tokens.map((el) => el.address) : undefined), [tokens])
  const inputs = useMemo(() => [account, tokenAddresses], [account, tokenAddresses])
  const balanceData = useSingleCallResult(boringHelperContract, 'getBalances', inputs)

  return useMemo(() => {
    if (!tokens || !tokenAddresses || !balanceData.result) return []

    return tokenAddresses.map((cur, index) => {
      return toAmountCurrencyAmount(
        {
          elastic: JSBI.BigInt(balanceData.result[0][index].bentoAmount.toString()),
          base: JSBI.BigInt(balanceData.result[0][index].bentoShare.toString()),
        } as Rebase,
        CurrencyAmount.fromRawAmount(tokens[index], balanceData.result[0][index].bentoBalance)
      )
    }, [])

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [balanceData, tokenAddresses])
}

export const useBentoOrWalletBalances = (
  account: string | undefined,
  currencies: (Currency | Token | undefined)[],
  fromWallet?: (boolean | undefined)[]
) => {
  const tokens = useMemo(
    () => (currencies.every((el) => el) ? currencies.map((el: Currency) => el.wrapped) : undefined),
    [currencies]
  )

  const balance = useCurrencyBalances(account, currencies)
  const bentoBalance = useBentoBalances(tokens)

  return useMemo(() => {
    if (!currencies.every((el) => !!el) || !bentoBalance) {
      return []
    }

    return currencies.map((cur, index) => {
      if (!cur) {
        return undefined
      }

      let element: CurrencyAmount<Currency> | undefined
      const tokenBalanceFromWallet = fromWallet?.[index]
      if (tokenBalanceFromWallet === false) {
        element = bentoBalance.find((el) => el?.currency.wrapped.address === cur.wrapped.address)
      } else {
        element = balance.find((el) => el?.currency.wrapped.address === cur.wrapped.address)
      }

      if (!element) {
        element = CurrencyAmount.fromRawAmount(cur.wrapped, '0')
      }

      return element
    }, [])
  }, [currencies, bentoBalance, fromWallet, balance])
}

export const useBentoOrWalletBalance = (account?: string, currency?: Currency, fromWallet?: boolean) => {
  const currencies = useMemo(() => [currency], [currency])
  const flags = useMemo(() => [fromWallet], [fromWallet])
  const balances = useBentoOrWalletBalances(account, currencies, flags)
  return useMemo(() => (balances ? balances[0] : undefined), [balances])
}
