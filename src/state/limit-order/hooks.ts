import { AppDispatch, AppState } from '../index'
import { useDispatch, useSelector } from 'react-redux'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Field, replaceLimitOrderState, selectCurrency, setRecipient, switchCurrencies, typeInput } from './actions'
import { useCurrency } from '../../hooks/Tokens'
import { ChainId, Currency, CurrencyAmount, JSBI, Percent, Price, WNATIVE } from '@sushiswap/sdk'
import { useActiveWeb3React } from '../../hooks/useActiveWeb3React'
import { useCurrencyBalances } from '../wallet/hooks'
import { isAddress, tryParseAmount } from '../../functions'
import useParsedQueryString from '../../hooks/useParsedQueryString'
import { ParsedQs } from 'qs'
import { OrderExpiration } from './reducer'
import { useBentoBalances } from '../bentobox/hooks'
import { useV2TradeExactIn as useTradeExactIn, useV2TradeExactOut as useTradeExactOut } from '../../hooks/useV2Trades'
import useENS from '../../hooks/useENS'
import { t } from '@lingui/macro'
import { i18n } from '@lingui/core'
import { useUserSingleHopOnly } from '../user/hooks'

export function useLimitOrderActionHandlers(): {
  onCurrencySelection: (field: Field, currency: Currency) => void
  onSwitchTokens: () => void
  onUserInput: (field: Field, typedValue: string) => void
  onChangeRecipient: (recipient: string | null) => void
} {
  const dispatch = useDispatch<AppDispatch>()
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
    (recipient: string | null) => {
      dispatch(setRecipient({ recipient }))
    },
    [dispatch]
  )

  return {
    onSwitchTokens,
    onCurrencySelection,
    onUserInput,
    onChangeRecipient,
  }
}

const denominator = (decimals: number = 18) => JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(decimals))

export function useDerivedLimitOrderInfo(): {
  currencies: { [field in Field]?: Currency }
  parsedAmounts: { [field in Field]?: CurrencyAmount<Currency> }
  walletBalances: { [field in Field]?: CurrencyAmount<Currency> }
  bentoboxBalances: { [field in Field]?: CurrencyAmount<Currency> }
  inputError?: string
  currentPrice: Price<Currency, Currency>
} {
  const { account } = useActiveWeb3React()
  const [singleHopOnly] = useUserSingleHopOnly()
  const {
    [Field.INPUT]: { currencyId: inputCurrencyId },
    [Field.OUTPUT]: { currencyId: outputCurrencyId },
    typedValue,
    independentField,
    limitPrice,
    fromBentoBalance,
    recipient,
    orderExpiration,
  } = useLimitOrderState()

  const inputCurrency = useCurrency(inputCurrencyId)
  const outputCurrency = useCurrency(outputCurrencyId)
  const recipientLookup = useENS(recipient ?? undefined)
  const to: string | null = (recipient === null ? account : recipientLookup.address) ?? null

  const isExactIn: boolean = independentField === Field.INPUT
  const parsedAmount = tryParseAmount(typedValue, (isExactIn ? inputCurrency : outputCurrency) ?? undefined)
  const parsedRate = tryParseAmount(limitPrice, (isExactIn ? inputCurrency : outputCurrency) ?? undefined)

  const parsedOutputAmount =
    outputCurrency && parsedRate && parsedAmount
      ? isExactIn
        ? CurrencyAmount.fromRawAmount(
            outputCurrency,
            new Percent(parsedRate.quotient, denominator(outputCurrency.decimals)).multiply(parsedAmount).quotient
          )
        : CurrencyAmount.fromRawAmount(
            inputCurrency,
            new Percent(parsedAmount.quotient, parsedRate.quotient).multiply(denominator(inputCurrency.decimals))
              .quotient
          )
      : undefined

  const bestTradeExactIn = useTradeExactIn(isExactIn ? parsedAmount : undefined, outputCurrency ?? undefined, {
    maxHops: singleHopOnly ? 1 : undefined,
  })

  const bestTradeExactOut = useTradeExactOut(inputCurrency ?? undefined, !isExactIn ? parsedAmount : undefined, {
    maxHops: singleHopOnly ? 1 : undefined,
  })

  const trade = isExactIn ? bestTradeExactIn : bestTradeExactOut
  const rate = trade?.executionPrice

  const bentoBoxBalances = useBentoBalances()
  const balance = useMemo(
    () => bentoBoxBalances?.find((el) => el.address === inputCurrency?.wrapped.address),
    [bentoBoxBalances, inputCurrency?.wrapped.address]
  )

  const relevantTokenBalances = useCurrencyBalances(account ?? undefined, [
    inputCurrency ?? undefined,
    outputCurrency ?? undefined,
  ])

  const walletBalances = {
    [Field.INPUT]: relevantTokenBalances[0],
    [Field.OUTPUT]: relevantTokenBalances[1],
  }

  const bentoboxBalances = {
    [Field.INPUT]: inputCurrency
      ? CurrencyAmount.fromRawAmount(inputCurrency, balance?.bentoBalance ? balance.bentoBalance : 0)
      : undefined,
    [Field.OUTPUT]: outputCurrency
      ? CurrencyAmount.fromRawAmount(outputCurrency, balance?.bentoBalance ? balance.bentoBalance : 0)
      : undefined,
  }

  const parsedAmounts = {
    [Field.INPUT]: independentField === Field.INPUT ? parsedAmount : parsedOutputAmount,
    [Field.OUTPUT]: independentField === Field.OUTPUT ? parsedAmount : parsedOutputAmount,
  }

  const currencies: { [field in Field]?: Currency } = {
    [Field.INPUT]: inputCurrency ?? undefined,
    [Field.OUTPUT]: outputCurrency ?? undefined,
  }

  let inputError: string | undefined
  if (!account) {
    inputError = 'Connect Wallet'
  }

  if (!parsedAmount || !parsedOutputAmount) {
    inputError = inputError ?? i18n._(t`Enter an amount`)
  }

  if (!currencies[Field.INPUT] || !currencies[Field.OUTPUT]) {
    inputError = inputError ?? i18n._(t`Select a token`)
  }

  const formattedTo = isAddress(to)
  if (!to || !formattedTo) {
    inputError = inputError ?? i18n._(t`Enter a recipient`)
  }

  if (!limitPrice) {
    inputError = inputError ?? i18n._(t`Select a rate`)
  }

  if (!orderExpiration) {
    inputError = inputError ?? i18n._(t`Select an order expiration`)
  }

  // compare input balance to max input based on version
  const [balanceIn, amountIn] = [
    fromBentoBalance ? bentoboxBalances[Field.INPUT] : walletBalances[Field.INPUT],
    parsedAmounts[Field.INPUT],
  ]

  if (!balanceIn) {
    inputError = i18n._(t`Loading balance`)
  }

  if (balanceIn && amountIn && balanceIn.lessThan(amountIn)) {
    inputError = i18n._(t`Insufficient ${currencies[Field.INPUT]?.symbol} balance`)
  }

  return {
    currencies,
    parsedAmounts,
    walletBalances,
    bentoboxBalances,
    inputError,
    currentPrice: rate,
  }
}

export function useLimitOrderState(): AppState['limitOrder'] {
  return useSelector<AppState, AppState['limitOrder']>((state) => state.limitOrder)
}

export function useLimitOrderApprovalPending(): string {
  return useSelector((state: AppState) => state.limitOrder.limitOrderApprovalPending)
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
function validatedRecipient(recipient: any): string | null {
  if (typeof recipient !== 'string') return null
  const address = isAddress(recipient)
  if (address) return address
  if (ENS_NAME_REGEX.test(recipient)) return recipient
  if (ADDRESS_REGEX.test(recipient)) return recipient
  return null
}

export function queryParametersToSwapState(chainId: ChainId, parsedQs: ParsedQs) {
  let inputCurrency = parseCurrencyFromURLParameter(parsedQs.inputCurrency)
  let outputCurrency = parseCurrencyFromURLParameter(parsedQs.outputCurrency)
  if (inputCurrency === '' && outputCurrency === '') {
    inputCurrency = WNATIVE[chainId].address
  } else if (inputCurrency === outputCurrency) {
    outputCurrency = ''
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
  const [result, setResult] = useState<
    | {
        inputCurrencyId: string | undefined
        outputCurrencyId: string | undefined
      }
    | undefined
  >()

  useEffect(() => {
    if (!chainId) return

    const parsed = queryParametersToSwapState(chainId, parsedQs)
    dispatch(
      replaceLimitOrderState({
        ...parsed,
      })
    )

    setResult({
      inputCurrencyId: parsed.inputCurrencyId,
      outputCurrencyId: parsed.outputCurrencyId,
    })
  }, [dispatch, chainId, parsedQs])

  return result
}
