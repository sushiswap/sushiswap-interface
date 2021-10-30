import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Currency, CurrencyAmount, TradeType, ZERO } from '@sushiswap/core-sdk'
import { tryParseAmount } from 'functions'
import { useActiveWeb3React } from 'hooks/useActiveWeb3React'
import { useBentoOrWalletBalance } from 'hooks/useBentoOrWalletBalance'
import { useBestTridentTrade } from 'hooks/useBestTridentTrade'
import { useMemo } from 'react'
import { atom, selector, useRecoilCallback, useRecoilState, useRecoilValue, useResetRecoilState } from 'recoil'

import { currenciesAtom } from '../atoms'
import useCurrenciesFromURL from './useCurrenciesFromURL'

export enum TypedField {
  A,
  B,
}

export const typedFieldAtom = atom<TypedField>({
  key: 'useSwapAssetPanelInputs:typedFieldAtom',
  default: TypedField.A,
})

export const spendFromWalletAtom = atom<boolean>({
  key: 'useSwapAssetPanelInputs:spendFromWalletAtom',
  default: true,
})

export const receiveToWalletAtom = atom<boolean>({
  key: 'useSwapAssetPanelInputs:receiveToWalletAtom',
  default: true,
})

export const mainInputAtom = atom<string>({
  key: 'useSwapAssetPanelInputs:mainInputAtom',
  default: '',
})

export const secondaryInputAtom = atom<string>({
  key: 'useSwapAssetPanelInputs:secondaryInputAtom',
  default: '',
})

export const mainInputCurrencyAmountSelector = selector<CurrencyAmount<Currency> | undefined>({
  key: 'useSwapAssetPanelInputs:mainInputCurrencyAmountSelector',
  get: ({ get }) => {
    const value = get(mainInputAtom)
    const [currencyA] = get(currenciesAtom)
    return tryParseAmount(value, currencyA)
  },
})

export const secondaryInputCurrencyAmountSelector = selector<CurrencyAmount<Currency> | undefined>({
  key: 'useSwapAssetPanelInputs:secondaryInputCurrencyAmountSelector',
  get: ({ get }) => {
    const value = get(mainInputAtom)
    const [currencyA] = get(currenciesAtom)
    return tryParseAmount(value, currencyA)
  },
})

const useSwapAssetPanelInputs = () => {
  const { i18n } = useLingui()
  const { account } = useActiveWeb3React()
  const {
    currencies: [currencyA, currencyB],
    switchCurrencies: switchURLCurrencies,
  } = useCurrenciesFromURL()
  const typedField = useRecoilState(typedFieldAtom)
  const mainInput = useRecoilState(mainInputAtom)
  const secondaryInput = useRecoilState(secondaryInputAtom)
  const spendFromWallet = useRecoilState(spendFromWalletAtom)
  const receiveToWallet = useRecoilState(receiveToWalletAtom)
  const mainInputCurrencyAmount = useRecoilValue(mainInputCurrencyAmountSelector)
  const secondaryInputCurrencyAmount = useRecoilValue(secondaryInputCurrencyAmountSelector)
  const trade = useBestTridentTrade(
    typedField[0] === TypedField.A ? TradeType.EXACT_INPUT : TradeType.EXACT_OUTPUT,
    typedField[0] === TypedField.A ? mainInputCurrencyAmount : secondaryInputCurrencyAmount,
    typedField[0] === TypedField.A ? currencyB : currencyA
  )
  const balance = useBentoOrWalletBalance(account ?? undefined, trade?.inputAmount.currency, spendFromWallet[0])

  const formattedAmounts = useMemo(() => {
    return [
      (typedField[0] === TypedField.A ? mainInput[0] : trade?.outputAmount?.toSignificant(6)) ?? '',
      (typedField[0] === TypedField.B ? secondaryInput[0] : trade?.outputAmount?.toSignificant(6)) ?? '',
    ]
  }, [mainInput, secondaryInput, trade?.outputAmount, typedField])

  const parsedAmounts = useMemo(() => {
    return [trade?.inputAmount, trade?.outputAmount]
  }, [trade?.inputAmount, trade?.outputAmount])

  const switchCurrencies = useRecoilCallback(
    ({ set }) =>
      async () => {
        const outputAmount = trade?.outputAmount.toExact()
        set(mainInputAtom, undefined)
        await switchURLCurrencies()
        set(mainInputAtom, outputAmount)
      },
    [switchURLCurrencies, trade?.outputAmount]
  )

  const reset = useResetRecoilState(mainInputAtom)

  let error = !account
    ? i18n._(t`Connect Wallet`)
    : !trade?.inputAmount[0]?.greaterThan(ZERO) && !parsedAmounts[1]?.greaterThan(ZERO)
    ? i18n._(t`Enter an amount`)
    : balance && trade && balance.lessThan(trade.inputAmount)
    ? i18n._(t`Insufficient ${trade?.inputAmount.currency.symbol} balance`)
    : ''

  return useMemo(
    () => ({
      reset,
      error,
      typedField,
      mainInput,
      secondaryInput,
      trade,
      spendFromWallet,
      receiveToWallet,
      formattedAmounts,
      parsedAmounts,
      switchCurrencies,
    }),
    [
      reset,
      error,
      typedField,
      mainInput,
      secondaryInput,
      trade,
      spendFromWallet,
      receiveToWallet,
      formattedAmounts,
      parsedAmounts,
      switchCurrencies,
    ]
  )
}

export default useSwapAssetPanelInputs
