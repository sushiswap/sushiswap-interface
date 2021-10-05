import { atom, selector, useRecoilState, useRecoilValue } from 'recoil'
import { Currency, CurrencyAmount } from '@sushiswap/core-sdk'
import { tryParseAmount } from '../../../../functions'
import { t } from '@lingui/macro'
import { noLiquiditySelector, poolAtom, spendFromWalletAtom } from '../atoms'
import { useActiveWeb3React } from '../../../../hooks'
import { useLingui } from '@lingui/react'
import { useBentoOrWalletBalance } from '../../../../hooks/useBentoOrWalletBalance'
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
    const [, pool] = get(poolAtom)

    // TODO ramin: output amount calculation
    if (pool) return [CurrencyAmount.fromRawAmount(pool?.token0, '0'), CurrencyAmount.fromRawAmount(pool?.token1, '0')]
    return [undefined, undefined]
  },
})

export const useZapAssetInput = () => {
  const { i18n } = useLingui()
  const { account } = useActiveWeb3React()
  const [poolState] = useRecoilValue(poolAtom)
  const noLiquidity = useRecoilValue(noLiquiditySelector)
  const zapCurrencyState = useRecoilState(selectedZapCurrencyAtom)
  const [zapCurrency] = zapCurrencyState

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
