import { atom, selector, useRecoilState, useRecoilValue } from 'recoil'
import { Currency, CurrencyAmount } from '@sushiswap/core-sdk'
import { toAmountCurrencyAmount, toShareCurrencyAmount, tryParseAmount } from '../../../../functions'
import { t } from '@lingui/macro'
import { bentoboxRebasesAtom, noLiquiditySelector, poolAtom, spendFromWalletAtom } from '../atoms'
import { useActiveWeb3React } from '../../../../hooks'
import { useLingui } from '@lingui/react'
import { useBentoOrWalletBalances } from '../../../../hooks/useBentoOrWalletBalance'
import { useMemo } from 'react'

export const selectedZapCurrencyAtom = atom<Currency | undefined>({
  key: 'selectedZapCurrencyAtom',
  default: undefined,
})

export const zapInputAmountAtom = atom<string>({
  key: 'zapInputAmountAtom',
  default: '',
})

export const parsedZapAmountSelector = selector<CurrencyAmount<Currency> | undefined>({
  key: 'parsedZapAmountSelector',
  get: ({ get }) => {
    const value = get(zapInputAmountAtom)
    const currency = get(selectedZapCurrencyAtom)
    if (currency) {
      return tryParseAmount(value, currency)
    }

    return undefined
  },
})

export const parsedZapSplitAmountsSelector = selector<
  [CurrencyAmount<Currency> | undefined, CurrencyAmount<Currency> | undefined]
>({
  key: 'parsedZapSplitAmountsSelector',
  get: ({ get }) => {
    const { pool } = get(poolAtom)
    const parsedAmount = get(parsedZapAmountSelector)
    const rebases = get(bentoboxRebasesAtom)

    if (pool && parsedAmount) {
      const index = pool.token0.address === parsedAmount.currency.wrapped.address ? 0 : 1
      const otherAmount = toAmountCurrencyAmount(
        rebases[index === 0 ? 1 : 0],
        pool
          .priceOf(parsedAmount.currency.wrapped)
          .quote(toShareCurrencyAmount(rebases[index], parsedAmount?.divide(2).wrapped))
      )

      return [index === 0 ? parsedAmount.divide(2) : otherAmount, index === 1 ? parsedAmount.divide(2) : otherAmount]
    }

    return [undefined, undefined]
  },
})

export const useZapAssetInput = () => {
  const { i18n } = useLingui()
  const { account } = useActiveWeb3React()
  const { state: poolState } = useRecoilValue(poolAtom)
  const noLiquidity = useRecoilValue(noLiquiditySelector)
  const zapCurrencyState = useRecoilState(selectedZapCurrencyAtom)
  const [zapCurrency] = zapCurrencyState

  const currency = useMemo(() => [zapCurrency], [zapCurrency])
  const zapInputAmount = useRecoilState(zapInputAmountAtom)
  const parsedAmount = useRecoilValue(parsedZapAmountSelector)
  const parsedSplitAmounts = useRecoilValue(parsedZapSplitAmountsSelector)
  const spendFromWallet = useRecoilValue(spendFromWalletAtom)
  const balance = useBentoOrWalletBalances(account ?? undefined, currency, spendFromWallet)

  let error = !account
    ? i18n._(t`Connect Wallet`)
    : poolState === 3
    ? i18n._(t`Invalid pool`)
    : !zapInputAmount
    ? i18n._(t`Enter an amount`)
    : parsedAmount && balance[0]?.lessThan(parsedAmount)
    ? i18n._(t`Insufficient ${parsedAmount?.currency.symbol} balance`)
    : noLiquidity
    ? i18n._(t`No liquidity`)
    : ''

  return useMemo(
    () => ({
      zapCurrency: zapCurrencyState,
      zapInputAmount,
      parsedAmount,
      parsedSplitAmounts,
      error,
    }),
    [error, parsedAmount, parsedSplitAmounts, zapCurrencyState, zapInputAmount]
  )
}
