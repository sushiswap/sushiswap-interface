import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Currency, CurrencyAmount, TradeType, WNATIVE, ZERO } from '@sushiswap/core-sdk'
import { maxAmountSpend, toAmountCurrencyAmount, toShareCurrencyAmount } from 'app/functions'
import { tryParseAmount } from 'app/functions/parse'
import { useBentoOrWalletBalance } from 'app/hooks/useBentoOrWalletBalance'
import useBentoRebases from 'app/hooks/useBentoRebases'
import { useBestTridentTrade } from 'app/hooks/useBestTridentTrade'
import useSwapSlippageTolerance from 'app/hooks/useSwapSlippageTollerence'
import { useActiveWeb3React } from 'app/services/web3'
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
    const value = get(secondaryInputAtom)
    const [, currencyB] = get(currenciesAtom)
    return tryParseAmount(value, currencyB)
  },
})

const useSwapAssetPanelInputs = () => {
  const { i18n } = useLingui()
  const { account, chainId } = useActiveWeb3React()
  const { currencies, switchCurrencies: switchURLCurrencies } = useCurrenciesFromURL()
  const typedField = useRecoilState(typedFieldAtom)
  const mainInput = useRecoilState(mainInputAtom)
  const secondaryInput = useRecoilState(secondaryInputAtom)
  const spendFromWallet = useRecoilState(spendFromWalletAtom)
  const receiveToWallet = useRecoilState(receiveToWalletAtom)
  const mainInputCurrencyAmount = useRecoilValue(mainInputCurrencyAmountSelector)
  const secondaryInputCurrencyAmount = useRecoilValue(secondaryInputCurrencyAmountSelector)
  const { rebases, loading: rebasesLoading } = useBentoRebases(currencies)

  const isWrap =
    currencies[0] &&
    currencies[1] &&
    chainId &&
    ((currencies[0]?.isNative && WNATIVE[chainId].address === currencies[1]?.wrapped.address) ||
      (currencies[1]?.isNative && WNATIVE[chainId].address === currencies[0]?.wrapped.address))

  const mainInputShare = useMemo(() => {
    return mainInputCurrencyAmount && rebases[mainInputCurrencyAmount.currency.wrapped.address]
      ? toShareCurrencyAmount(
          rebases[mainInputCurrencyAmount.currency.wrapped.address],
          mainInputCurrencyAmount.wrapped
        )
      : undefined
  }, [mainInputCurrencyAmount, rebases])

  const secondaryInputShare = useMemo(() => {
    return secondaryInputCurrencyAmount && rebases[secondaryInputCurrencyAmount.currency.wrapped.address]
      ? toShareCurrencyAmount(
          rebases[secondaryInputCurrencyAmount.currency.wrapped.address],
          secondaryInputCurrencyAmount.wrapped
        )
      : undefined
  }, [secondaryInputCurrencyAmount, rebases])

  const trade = useBestTridentTrade(
    typedField[0] === TypedField.A ? TradeType.EXACT_INPUT : TradeType.EXACT_OUTPUT,
    typedField[0] === TypedField.A ? mainInputShare : secondaryInputShare,
    typedField[0] === TypedField.A ? currencies[1] : currencies[0]
  )

  const allowedSlippage = useSwapSlippageTolerance(trade)

  // trade.output but in normal amounts instead of shares
  const tradeOutputAmount = useMemo(
    () =>
      !rebasesLoading &&
      trade &&
      trade.outputAmount?.currency.wrapped.address &&
      rebases[trade?.outputAmount?.currency.wrapped.address]
        ? toAmountCurrencyAmount(rebases[trade.outputAmount?.currency.wrapped.address], trade.outputAmount.wrapped)
        : undefined,
    [rebases, rebasesLoading, trade]
  )

  const tradeMinimumOutputAmount = useMemo(
    () =>
      !rebasesLoading &&
      trade &&
      trade.outputAmount?.currency.wrapped.address &&
      rebases[trade?.minimumAmountOut(allowedSlippage)?.currency.wrapped.address]
        ? toAmountCurrencyAmount(
            rebases[trade?.minimumAmountOut(allowedSlippage)?.currency.wrapped.address],
            trade?.minimumAmountOut(allowedSlippage).wrapped
          )
        : undefined,
    [allowedSlippage, rebases, rebasesLoading, trade]
  )

  const balance = useBentoOrWalletBalance(account ?? undefined, trade?.inputAmount.currency, spendFromWallet[0])

  const formattedAmounts = useMemo(() => {
    if (isWrap) return [mainInput[0], mainInput[0]]

    return [
      typedField[0] === TypedField.A ? mainInput[0] : tradeOutputAmount?.toSignificant(6) ?? '',
      typedField[0] === TypedField.B ? secondaryInput[0] : tradeOutputAmount?.toSignificant(6) ?? '',
    ]
  }, [isWrap, mainInput, secondaryInput, tradeOutputAmount, typedField])

  const parsedAmounts = useMemo(() => {
    if (isWrap) return [mainInputCurrencyAmount, mainInputCurrencyAmount]

    return [mainInputCurrencyAmount, tradeOutputAmount, tradeMinimumOutputAmount]
  }, [isWrap, mainInputCurrencyAmount, tradeOutputAmount, tradeMinimumOutputAmount])

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
    : trade === undefined
    ? i18n._(t`No route found`)
    : !trade?.inputAmount[0]?.greaterThan(ZERO) && !parsedAmounts[1]?.greaterThan(ZERO)
    ? i18n._(t`Enter an amount`)
    : balance && trade && maxAmountSpend(balance)?.lessThan(trade.inputAmount)
    ? i18n._(t`Insufficient ${trade?.inputAmount.currency.symbol} balance`)
    : ''

  return useMemo(
    () => ({
      isWrap,
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
      isWrap,
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
