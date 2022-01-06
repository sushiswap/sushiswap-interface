import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { JSBI, Percent, TradeType, TradeVersion, WNATIVE, ZERO } from '@sushiswap/core-sdk'
import { maxAmountSpend, toAmountCurrencyAmount } from 'app/functions'
import { getTradeVersion } from 'app/functions/getTradeVersion'
import { tryParseAmount } from 'app/functions/parse'
import { useBentoOrWalletBalance } from 'app/hooks/useBentoOrWalletBalance'
import useBentoRebases from 'app/hooks/useBentoRebases'
import { useBestTridentTrade } from 'app/hooks/useBestTridentTrade'
import { useActiveWeb3React } from 'app/services/web3'
import { useCallback, useMemo, useState } from 'react'

import useCurrenciesFromURL from './useCurrenciesFromURL'

export enum TypedField {
  A,
  B,
}

const useSwapAssetPanelInputs = () => {
  const { i18n } = useLingui()
  const { account, chainId } = useActiveWeb3React()
  const {
    currencies: [currencyA, currencyB],
    switchCurrencies: switchURLCurrencies,
  } = useCurrenciesFromURL()
  const input = useState({ value: '', typedField: TypedField.A })
  const { value, typedField } = input[0]
  const spendFromWallet = useState(true)
  const receiveToWallet = useState(true)

  const inputCurrencyAmount = useMemo(() => {
    return tryParseAmount(value, typedField === TypedField.A ? currencyA : currencyB)
  }, [currencyA, currencyB, typedField, value])

  const { rebases, loading: rebasesLoading } = useBentoRebases([currencyA, currencyB])

  const isWrap =
    currencyA &&
    currencyB &&
    chainId &&
    ((currencyA?.isNative && WNATIVE[chainId].address === currencyB?.wrapped.address) ||
      (currencyB?.isNative && WNATIVE[chainId].address === currencyA?.wrapped.address))

  const { trade, priceImpact: _priceImpact } = useBestTridentTrade(
    typedField === TypedField.A ? TradeType.EXACT_INPUT : TradeType.EXACT_OUTPUT,
    inputCurrencyAmount,
    typedField === TypedField.A ? currencyA : currencyB,
    typedField === TypedField.A ? currencyB : currencyA
  )

  const priceImpact = useMemo(
    () =>
      _priceImpact
        ? new Percent(
            _priceImpact.toString().toBigNumber(18).toString(),
            JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(18))
          )
        : undefined,
    [_priceImpact]
  )

  // trade.output but in normal amounts instead of shares
  const tradeOutputAmount = useMemo(() => {
    if (!trade) return undefined
    if (getTradeVersion(trade) === TradeVersion.V2TRADE) return trade.outputAmount
    if (
      getTradeVersion(trade) === TradeVersion.V3TRADE &&
      !rebasesLoading &&
      trade.outputAmount?.currency.wrapped.address &&
      rebases[trade?.outputAmount?.currency.wrapped.address]
    )
      return toAmountCurrencyAmount(rebases[trade.outputAmount?.currency.wrapped.address], trade.outputAmount.wrapped)

    return undefined
  }, [rebases, rebasesLoading, trade])

  const balance = useBentoOrWalletBalance(account ?? undefined, currencyA, spendFromWallet[0])

  const formattedAmounts = useMemo(() => {
    if (isWrap) return [value, value]

    return [
      typedField === TypedField.A ? value : tradeOutputAmount?.toSignificant(6) ?? '',
      typedField === TypedField.B ? value : tradeOutputAmount?.toSignificant(6) ?? '',
    ]
  }, [isWrap, tradeOutputAmount, typedField, value])

  const parsedAmounts = useMemo(() => {
    if (isWrap) return [inputCurrencyAmount, inputCurrencyAmount]

    return [inputCurrencyAmount, tradeOutputAmount]
  }, [isWrap, inputCurrencyAmount, tradeOutputAmount])

  const switchCurrencies = useCallback(async () => {
    input[1]({ value: '', typedField: TypedField.A })
    await switchURLCurrencies()
  }, [input, switchURLCurrencies])

  const reset = useCallback(() => input[1]({ value: '', typedField: TypedField.A }), [input])

  let error = !account
    ? i18n._(t`Connect Wallet`)
    : maxAmountSpend(balance)?.equalTo(ZERO)
    ? i18n._(t`Insufficient balance to cover for fees`)
    : !trade?.inputAmount[0]?.greaterThan(ZERO) && !parsedAmounts[1]?.greaterThan(ZERO)
    ? i18n._(t`Enter an amount`)
    : trade === undefined && !isWrap
    ? i18n._(t`No route found`)
    : balance && trade && inputCurrencyAmount && maxAmountSpend(balance)?.lessThan(inputCurrencyAmount)
    ? i18n._(t`Insufficient ${inputCurrencyAmount?.currency.symbol} balance`)
    : ''

  return useMemo(
    () => ({
      input,
      isWrap,
      reset,
      error,
      trade,
      priceImpact,
      spendFromWallet,
      receiveToWallet,
      formattedAmounts,
      parsedAmounts,
      switchCurrencies,
    }),
    [
      input,
      priceImpact,
      isWrap,
      reset,
      error,
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
