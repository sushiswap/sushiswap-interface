import { i18n } from '@lingui/core'
import { t } from '@lingui/macro'
import { ChainId, Currency, CurrencyAmount, JSBI, Price, SUSHI_ADDRESS, WNATIVE_ADDRESS } from '@sushiswap/core-sdk'
import { isAddress, tryParseAmount } from 'app/functions'
import { useCurrency } from 'app/hooks/Tokens'
import { useBentoOrWalletBalance } from 'app/hooks/useBentoOrWalletBalance'
import useENS from 'app/hooks/useENS'
import useParsedQueryString from 'app/hooks/useParsedQueryString'
import { useV2TradeExactIn as useTradeExactIn, useV2TradeExactOut as useTradeExactOut } from 'app/hooks/useV2Trades'
import { useActiveWeb3React } from 'app/services/web3'
import { AppDispatch } from 'app/state'
import { useAppDispatch } from 'app/state/hooks'
import { useExpertModeManager, useUserSingleHopOnly } from 'app/state/user/hooks'
import { ParsedQs } from 'qs'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Field, replaceLimitOrderState, selectCurrency, setRecipient, switchCurrencies, typeInput } from './actions'
import { LimitOrderState, OrderExpiration, selectLimitOrder } from './reducer'

export function useLimitOrderActionHandlers(): {
  onCurrencySelection(field: Field, currency: Currency): void
  onSwitchTokens(): void
  onUserInput(field: Field, typedValue: string): void
  onChangeRecipient(recipient?: string): void
} {
  const dispatch = useAppDispatch()
  const onCurrencySelection = useCallback(
    (field: Field, currency: Currency) => {
      dispatch(
        selectCurrency({
          field,
          currencyId: currency.isToken ? currency.address : currency.isNative ? 'ETH' : '',
        })
      )
    },
    [dispatch]
  )
  const onSwitchTokens = useCallback(() => {
    dispatch(switchCurrencies())
  }, [dispatch])

  const onUserInput = useCallback(
    (field: Field, typedValue: string) => {
      dispatch(typeInput({ field, typedValue }))
    },
    [dispatch]
  )

  const onChangeRecipient = useCallback(
    (recipient?: string) => {
      dispatch(setRecipient({ recipient }))
    },
    [dispatch]
  )

  return useMemo(() => {
    return {
      onSwitchTokens,
      onCurrencySelection,
      onUserInput,
      onChangeRecipient,
    }
  }, [onChangeRecipient, onCurrencySelection, onSwitchTokens, onUserInput])
}

export function useLimitOrderState(): LimitOrderState {
  return useSelector(selectLimitOrder)
}

function parseCurrencyFromURLParameter(urlParam: any): string {
  if (typeof urlParam === 'string') {
    const valid = isAddress(urlParam)
    if (valid) return valid
    if (urlParam.toUpperCase() === 'ETH') return 'ETH'
  }
  return ''
}

function parseTokenAmountURLParameter(urlParam: any): string {
  return typeof urlParam === 'string' && !isNaN(parseFloat(urlParam)) ? urlParam : ''
}

function parseIndependentFieldURLParameter(urlParam: any): Field {
  return typeof urlParam === 'string' && urlParam.toLowerCase() === 'output' ? Field.OUTPUT : Field.INPUT
}

function parseBooleanFieldParameter(urlParam: any): boolean {
  if (typeof urlParam !== 'string') return false
  if (urlParam.toLowerCase() === 'true') return true
  if (urlParam.toLowerCase() === 'false') return false
  return false
}

const ENS_NAME_REGEX = /^[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)?$/
const ADDRESS_REGEX = /^0x[a-fA-F0-9]{40}$/
function validatedRecipient(recipient: any): string | undefined {
  if (typeof recipient !== 'string') return undefined
  const address = isAddress(recipient)
  if (address) return address
  if (ENS_NAME_REGEX.test(recipient)) return recipient
  if (ADDRESS_REGEX.test(recipient)) return recipient
  return undefined
}

export function queryParametersToSwapState(chainId: ChainId, parsedQs: ParsedQs) {
  let inputCurrency = parseCurrencyFromURLParameter(parsedQs.inputCurrency)
  let outputCurrency = parseCurrencyFromURLParameter(parsedQs.outputCurrency)
  const eth = chainId === ChainId.CELO ? WNATIVE_ADDRESS[chainId] : 'ETH'
  const sushi = SUSHI_ADDRESS[chainId]
  if (inputCurrency === '' && outputCurrency === '') {
    inputCurrency = eth
    outputCurrency = sushi
  } else if (inputCurrency === '') {
    inputCurrency = outputCurrency === eth ? sushi : eth
  } else if (outputCurrency === '' || inputCurrency === outputCurrency) {
    outputCurrency = inputCurrency === eth ? sushi : eth
  }

  return {
    inputCurrencyId: inputCurrency,
    outputCurrencyId: outputCurrency,
    typedValue: parseTokenAmountURLParameter(parsedQs.exactAmount),
    independentField: parseIndependentFieldURLParameter(parsedQs.exactField),
    recipient: validatedRecipient(parsedQs.recipient),
    limitPrice: parseTokenAmountURLParameter(parsedQs.exactRate),
    fromBentoBalance: parseBooleanFieldParameter(parsedQs.fromBento),
    orderExpiration: { value: OrderExpiration.never, label: i18n._(t`Never`) },
  }
}

// updates the swap state to use the defaults for a given network
export function useDefaultsFromURLSearch() {
  const { chainId } = useActiveWeb3React()
  const dispatch = useDispatch<AppDispatch>()
  const parsedQs = useParsedQueryString()
  const [expertMode] = useExpertModeManager()
  const [result, setResult] = useState<
    | {
        inputCurrencyId?: string
        outputCurrencyId?: string
      }
    | undefined
  >()

  useEffect(() => {
    if (!chainId) return

    const parsed = queryParametersToSwapState(chainId, parsedQs)
    dispatch(
      replaceLimitOrderState({
        ...parsed,
        recipient: expertMode ? parsed.recipient : undefined,
      })
    )

    setResult({
      inputCurrencyId: parsed.inputCurrencyId,
      outputCurrencyId: parsed.outputCurrencyId,
    })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, chainId, parsedQs])

  return result
}

type UseLimitOrderDerivedCurrencies = () => { inputCurrency?: Currency; outputCurrency?: Currency }
export const useLimitOrderDerivedCurrencies: UseLimitOrderDerivedCurrencies = () => {
  const { chainId } = useActiveWeb3React()

  const {
    [Field.INPUT]: { currencyId: inputCurrencyId },
    [Field.OUTPUT]: { currencyId: outputCurrencyId },
  } = useLimitOrderState()

  const inputCurrency = useCurrency(inputCurrencyId || 'ETH') ?? undefined
  // @ts-ignore TYPE NEEDS FIXING
  const outputCurrency = useCurrency(outputCurrencyId || SUSHI_ADDRESS[chainId]) ?? undefined

  return useMemo(() => {
    return {
      inputCurrency,
      outputCurrency,
    }
  }, [inputCurrency, outputCurrency])
}

type UseLimitOrderDerivedLimitPrice = () => Price<Currency, Currency> | undefined
export const useLimitOrderDerivedLimitPrice: UseLimitOrderDerivedLimitPrice = () => {
  const { limitPrice } = useLimitOrderState()
  const { inputCurrency, outputCurrency } = useLimitOrderDerivedCurrencies()

  return useMemo(() => {
    const baseAmount = tryParseAmount(limitPrice, inputCurrency)
    const quoteAmount = tryParseAmount('1', outputCurrency)

    return baseAmount && quoteAmount && inputCurrency && outputCurrency
      ? new Price(
          inputCurrency,
          outputCurrency,
          JSBI.BigInt(JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(inputCurrency.decimals))),
          JSBI.BigInt(baseAmount.quotient.toString())
        )
      : undefined
  }, [inputCurrency, limitPrice, outputCurrency])
}

type UseLimitOrderDerivedParsedAmount = () => {
  [Field.INPUT]?: CurrencyAmount<Currency>
  [Field.OUTPUT]?: CurrencyAmount<Currency>
}

export const useLimitOrderDerivedParsedAmounts: UseLimitOrderDerivedParsedAmount = () => {
  const { inputCurrency, outputCurrency } = useLimitOrderDerivedCurrencies()
  const { independentField, typedValue } = useLimitOrderState()
  const parsedRate = useLimitOrderDerivedLimitPrice()

  return useMemo(() => {
    const exactIn = independentField === Field.INPUT
    const parsedInputAmount = tryParseAmount(typedValue, (exactIn ? inputCurrency : outputCurrency) ?? undefined)
    const parsedOutputAmount =
      inputCurrency && outputCurrency && parsedRate && parsedInputAmount
        ? exactIn
          ? parsedRate.quote(parsedInputAmount)
          : parsedRate.invert().quote(parsedInputAmount)
        : undefined

    return {
      [Field.INPUT]: independentField === Field.INPUT ? parsedInputAmount : parsedOutputAmount,
      [Field.OUTPUT]: independentField === Field.OUTPUT ? parsedInputAmount : parsedOutputAmount,
    }
  }, [independentField, inputCurrency, outputCurrency, parsedRate, typedValue])
}

type UseLimitOrderDerivedInputError = () => string
export const useLimitOrderDerivedInputError: UseLimitOrderDerivedInputError = () => {
  const { recipient, orderExpiration, fromBentoBalance } = useLimitOrderState()
  const { account } = useActiveWeb3React()
  const { [Field.INPUT]: parsedInputAmount, [Field.OUTPUT]: parsedOutputAmount } = useLimitOrderDerivedParsedAmounts()
  const { inputCurrency, outputCurrency } = useLimitOrderDerivedCurrencies()
  const recipientLookup = useENS(recipient)
  const to = !recipient ? account : recipientLookup.address
  const parsedRate = useLimitOrderDerivedLimitPrice()
  const balance = useBentoOrWalletBalance(account ?? undefined, inputCurrency, !fromBentoBalance)

  return useMemo(() => {
    return !account
      ? 'Connect Wallet'
      : !parsedInputAmount || !parsedOutputAmount
      ? i18n._(t`Enter an amount`)
      : !inputCurrency || !outputCurrency
      ? i18n._(t`Select a token`)
      : !to || !isAddress(to)
      ? i18n._(t`Enter a recipient`)
      : !parsedRate
      ? i18n._(t`Select a rate`)
      : !orderExpiration
      ? i18n._(t`Select an order expiration`)
      : !balance
      ? i18n._(t`Loading balance`)
      : balance && parsedInputAmount && balance.lessThan(parsedInputAmount)
      ? i18n._(t`Insufficient Balance`)
      : ''
  }, [
    account,
    balance,
    inputCurrency,
    orderExpiration,
    outputCurrency,
    parsedInputAmount,
    parsedOutputAmount,
    parsedRate,
    to,
  ])
}

export const useLimitOrderDerivedTrade = () => {
  const { independentField } = useLimitOrderState()
  const { inputCurrency, outputCurrency } = useLimitOrderDerivedCurrencies()
  const { [Field.INPUT]: parsedInputAmount, [Field.OUTPUT]: parsedOutputAmount } = useLimitOrderDerivedParsedAmounts()
  const [singleHopOnly] = useUserSingleHopOnly()
  const exactIn = independentField === Field.INPUT

  const bestTradeExactIn = useTradeExactIn(
    exactIn
      ? parsedInputAmount ||
          CurrencyAmount.fromRawAmount(
            // @ts-ignore TYPE NEEDS FIXING
            inputCurrency,
            // @ts-ignore TYPE NEEDS FIXING
            JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(inputCurrency.decimals))
          )
      : undefined,
    outputCurrency ?? undefined,
    {
      maxHops: singleHopOnly ? 1 : undefined,
    }
  )

  const bestTradeExactOut = useTradeExactOut(
    inputCurrency ?? undefined,
    !exactIn
      ? parsedOutputAmount ||
          CurrencyAmount.fromRawAmount(
            // @ts-ignore TYPE NEEDS FIXING
            outputCurrency,
            // @ts-ignore TYPE NEEDS FIXING
            JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(outputCurrency.decimals))
          )
      : undefined,
    {
      maxHops: singleHopOnly ? 1 : undefined,
    }
  )

  return useMemo(() => {
    return exactIn ? bestTradeExactIn : bestTradeExactOut
  }, [bestTradeExactIn, bestTradeExactOut, exactIn])
}

export default useLimitOrderDerivedCurrencies
