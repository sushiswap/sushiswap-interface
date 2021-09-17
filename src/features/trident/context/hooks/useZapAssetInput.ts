import { atom, selector, useRecoilState, useRecoilValue } from 'recoil'
import { Currency, CurrencyAmount } from '@sushiswap/sdk'
import { tryParseAmount } from '../../../../functions'
import { t } from '@lingui/macro'
import { ConstantProductPoolState } from '../../../../hooks/useTridentClassicPools'
import { poolAtom, spendFromWalletAtom } from '../atoms'
import { useActiveWeb3React } from '../../../../hooks'
import { useLingui } from '@lingui/react'
import { useCurrencyBalance } from '../../../../state/wallet/hooks'
import { useBentoOrWalletBalance } from '../../../../hooks/useBentoOrWalletBalance'
import { useMemo } from 'react'

export const selectedZapCurrencyAtom = atom<Currency>({
  key: 'selectedZapCurrencyAtom',
  default: null,
})

export const zapInputAmountAtom = atom<string>({
  key: 'zapInputAmountAtom',
  default: '',
})

export const parsedZapAmountSelector = selector<CurrencyAmount<Currency>>({
  key: 'parsedZapAmountSelector',
  get: ({ get }) => {
    const value = get(zapInputAmountAtom)
    const currency = get(selectedZapCurrencyAtom)
    return tryParseAmount(value, currency)
  },
})

export const parsedZapSplitAmountsSelector = selector<[CurrencyAmount<Currency>, CurrencyAmount<Currency>]>({
  key: 'parsedZapSplitAmountsSelector',
  get: ({ get }) => {
    const inputAmount = get(parsedZapAmountSelector)
    return [inputAmount, null]
  },
})

export const useZapAssetInput = () => {
  const { i18n } = useLingui()
  const { account } = useActiveWeb3React()
  const [poolState] = useRecoilValue(poolAtom)
  const [zapCurrency, setZapCurrency] = useRecoilState(selectedZapCurrencyAtom)
  const currency = useMemo(() => [zapCurrency], [zapCurrency])
  const zapInputAmount = useRecoilState(zapInputAmountAtom)
  const parsedAmount = useRecoilValue(parsedZapAmountSelector)
  const parsedSplitAmounts = useRecoilValue(parsedZapSplitAmountsSelector)
  const spendFromWallet = useRecoilValue(spendFromWalletAtom)
  const balance = useBentoOrWalletBalance(account ?? undefined, currency, spendFromWallet)

  let error = !account
    ? i18n._(t`Connect Wallet`)
    : poolState === 3
    ? i18n._(t`Invalid pool`)
    : !zapInputAmount
    ? i18n._(t`Enter an amount`)
    : parsedAmount && balance?.[0].lessThan(parsedAmount)
    ? i18n._(t`Insufficient ${parsedAmount?.currency.symbol} balance`)
    : ''

  return useMemo(
    () => ({
      zapCurrency: [zapCurrency, setZapCurrency],
      zapInputAmount,
      parsedAmount,
      parsedSplitAmounts,
      error,
    }),
    [error, parsedAmount, parsedSplitAmounts, setZapCurrency, zapCurrency, zapInputAmount]
  )
}
