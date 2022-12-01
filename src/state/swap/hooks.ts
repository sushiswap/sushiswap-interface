// TODO / NOTE (amiller68): #SdkChange / #SdkPublish
import {
  ChainId,
  Currency,
  CurrencyAmount,
  Percent,
  SUSHI_ADDRESS,
  Trade as V2Trade,
  TradeType,
  WNATIVE_ADDRESS,
} from '@figswap/core-sdk'
import { NATIVE } from '@figswap/core-sdk'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { currencyId } from 'app/functions'
import { tryParseAmount } from 'app/functions/parse'
import { isAddress } from 'app/functions/validate'
import { useCurrency } from 'app/hooks/Tokens'
import useENS from 'app/hooks/useENS'
import useParsedQueryString from 'app/hooks/useParsedQueryString'
import useSwapSlippageTolerance from 'app/hooks/useSwapSlippageTollerence'
import { useV2TradeExactIn as useTradeExactIn, useV2TradeExactOut as useTradeExactOut } from 'app/hooks/useV2Trades'
import { useActiveWeb3React } from 'app/services/web3'
import { AppState } from 'app/state'
import { useAppDispatch, useAppSelector } from 'app/state/hooks'
import { useExpertModeManager, useUserSingleHopOnly } from 'app/state/user/hooks'
import { useCurrencyBalances } from 'app/state/wallet/hooks'
import { useRouter } from 'next/router'
import { ParsedQs } from 'qs'
import { useCallback, useEffect, useState } from 'react'

// import {
//   EstimatedSwapCall,
//   SuccessfulCall,
//   useSwapCallArguments,
// } from "../../hooks/useSwapCallback";
import { Field, replaceSwapState, selectCurrency, setRecipient, switchCurrencies, typeInput } from './actions'
import { SwapState } from './reducer'

export function useSwapState(): AppState['swap'] {
  return useAppSelector((state) => state.swap)
}

export function useSwapActionHandlers(): {
  onCurrencySelection: (field: Field, currency: Currency) => void
  onSwitchTokens: () => void
  onUserInput: (field: Field, typedValue: string) => void
  onChangeRecipient: (recipient?: string) => void
} {
  const dispatch = useAppDispatch()
  const { chainId } = useActiveWeb3React()
  const router = useRouter()

  const inputCurrencyId = router.query.inputCurrency || 'ETH'
  const outputCurrencyId =
    router.query.outputCurrency || (chainId && chainId in SUSHI_ADDRESS ? SUSHI_ADDRESS[chainId] : undefined)

  // TODO (amiller68): This can be simplified
  const onCurrencySelection = useCallback(
    // Note (amiller68): Update Router Query
    (field: Field, currency: Currency) => {
      // TODO (amiller68): Unjank this
      let currencyChainNativeSymbol: string = NATIVE[currency.chainId].symbol ?? 'FIL'
      let currencySymbol: string = currency.isToken ? currency.address : currencyChainNativeSymbol

      if (field === Field.INPUT) {
        const inputCurrency = currency
        console.log('Currency Input Selected: ', field, ' | ', currency)
        const newInputCurrencyId = currencyId(inputCurrency)
        console.log('Currency Input ID: ', newInputCurrencyId)
        // Note (amiller68): If the new selected currency is the same as the output currency, swap them
        if (outputCurrencyId === newInputCurrencyId) {
          // If there's an output currency, swap the input and output
          if (outputCurrencyId) {
            router.replace({
              pathname: window.location.pathname,
              query: { ...router.query, inputCurrency: newInputCurrencyId, outputCurrency: inputCurrencyId },
            })
          }
          // Note (amiller68): Note sure if this ever arises (page doesn't render undefined in deployed version), but
          // if there's no output currency, just reset state to this default
          else {
            // Note (amiller68): #WallabyOnly - We aint got no ETH
            // router.replace({ pathname: window.location.pathname, query: { ...router.query, inputCurrency: 'ETH' } })
            // Note (amiller68): #WallabyOnly - I don't have access to chainId, so I will need to do figure out
            // representing FIL vs tFIL in the interface, maybe. Does this get rid of the output?
            router.replace({ pathname: window.location.pathname, query: { ...router.query, inputCurrency: 'FIL' } })
          }
        }
        // Note (amiller68): Otherwise if the new currency is different
        else {
          // If there's an output currency, just update the input currency
          if (outputCurrencyId) {
            router.replace({
              pathname: window.location.pathname,
              query: { ...router.query, inputCurrency: newInputCurrencyId, outputCurrency: outputCurrencyId },
            })
          }
          // Note (amiller68): If there's no output currency, just set the input currency
          else {
            router.replace({
              pathname: window.location.pathname,
              query: { ...router.query, inputCurrency: newInputCurrencyId },
            })
          }
        }
      }
      // Note (amiller68): If the field is the output
      if (field === Field.OUTPUT) {
        const outputCurrency = currency
        console.log('Currency Output Selected: ', field, ' | ', currency)
        const newOutputCurrencyId = currencyId(outputCurrency)
        console.log('Currency Input ID: ', newOutputCurrencyId)
        // Note (amiller68): If the new selected currency is the same as the input currency, swap them
        if (inputCurrencyId === newOutputCurrencyId) {
          if (outputCurrencyId) {
            router.replace({
              pathname: window.location.pathname,
              query: { ...router.query, inputCurrency: outputCurrencyId, outputCurrency: newOutputCurrencyId },
            })
          } else {
            router.replace({
              pathname: window.location.pathname,
              // Note (amiller68): #WallabyOnly - We aint got no ETH
              // query: { ...router.query, inputCurrency: 'ETH', outputCurrency: newOutputCurrencyId },
              // Note (amiller68): #WallabyOnly - I don't have access to chainId, so need to figure out tFIl vs FIL in
              // app logic
              query: { ...router.query, inputCurrency: currencyChainNativeSymbol, outputCurrency: newOutputCurrencyId },
            })
          }
        }
        // Note (amiller68): Otherwise if the new currency is different
        else {
          // Swap the input and output currencies
          if (inputCurrencyId) {
            router.replace({
              pathname: window.location.pathname,
              query: { ...router.query, inputCurrency: inputCurrencyId, outputCurrency: newOutputCurrencyId },
            })
          } else {
            router.replace({
              pathname: window.location.pathname,
              // query: { ...router.query, inputCurrency: 'ETH', outputCurrency: newOutputCurrencyId },
              // Note (amiller68): #WallabyOnly - I don't have access to chainId, so need to figure out tFIl vs FIL in
              // app logic
              query: { ...router.query, inputCurrency: currencyChainNativeSymbol, outputCurrency: newOutputCurrencyId },
            })
          }
        }
      }
      console.log('Currency Selection Dispatched: ', field, ' | ', currency)

      // Note (amiller68): Update the state
      dispatch(
        //  Note (amiller68): #WallabyOnly
        // selectCurrency({
        //   field,
        //   currencyId: currency.isToken
        //     ? currency.address
        //     : currency.isNative && currency.chainId !== ChainId.CELO
        //     ? 'ETH'
        //     : '',
        // })
        // TODO (amiller68): #FilecoinMainnet
        selectCurrency({
          field,
          currencyId: currencySymbol,
        })
      )
    },
    [dispatch, inputCurrencyId, outputCurrencyId, router]
  )

  const onSwitchTokens = useCallback(() => {
    router.replace({
      pathname: window.location.pathname,
      query: { ...router.query, inputCurrency: outputCurrencyId, outputCurrency: inputCurrencyId },
    })
    dispatch(switchCurrencies())
  }, [dispatch, inputCurrencyId, outputCurrencyId, router])

  const onUserInput = useCallback(
    (field: Field, typedValue: string) => {
      dispatch(typeInput({ field, typedValue }))
    },
    [dispatch]
  )

  const onChangeRecipient = useCallback(
    (recipient?: string) => {
      dispatch(setRecipient(recipient))
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

// TODO: Swtich for ours...
const BAD_RECIPIENT_ADDRESSES: { [chainId: string]: { [address: string]: true } } = {
  // Note (amiller68) - #WallabyOnly
  // [ChainId.ETHEREUM]: {
  //   '0xC0AEe478e3658e2610c5F7A4A2E1777cE9e4f2Ac': true, // v2 factory
  //   '0xd9e1cE17f2641f24aE83637ab66a2cca9C378B9F': true, // v2 router 02
  // },
}

/**
 * Returns true if any of the pairs or tokens in a trade have the given checksummed address
 * @param trade to check for the given address
 * @param checksummedAddress address to check in the pairs and tokens
 */
function involvesAddress(trade: V2Trade<Currency, Currency, TradeType>, checksummedAddress: string): boolean {
  const path = trade.route.path
  return (
    path.some((token) => token.address === checksummedAddress) ||
    (trade instanceof V2Trade
      ? trade.route.pairs.some((pair) => pair.liquidityToken.address === checksummedAddress)
      : false)
  )
}

// from the current swap inputs, compute the best trade and return it.
export function useDerivedSwapInfo(): {
  to?: string
  currencies: { [field in Field]?: Currency }
  currencyBalances: { [field in Field]?: CurrencyAmount<Currency> }
  parsedAmount: CurrencyAmount<Currency> | undefined
  inputError?: string
  v2Trade: V2Trade<Currency, Currency, TradeType> | undefined
  allowedSlippage: Percent
} {
  const { i18n } = useLingui()
  const { account, chainId } = useActiveWeb3React()
  const [singleHopOnly] = useUserSingleHopOnly()
  const {
    independentField,
    typedValue,
    [Field.INPUT]: { currencyId: inputCurrencyId },
    [Field.OUTPUT]: { currencyId: outputCurrencyId },
    recipient,
  } = useSwapState()
  const inputCurrency = useCurrency(inputCurrencyId)
  const outputCurrency = useCurrency(outputCurrencyId)
  const recipientLookup = useENS(recipient ?? undefined)

  const to = (recipient === undefined ? account : recipientLookup.address) ?? undefined

  const relevantTokenBalances = useCurrencyBalances(account ?? undefined, [
    inputCurrency ?? undefined,
    outputCurrency ?? undefined,
  ])

  const isExactIn: boolean = independentField === Field.INPUT

  // Try to parse the amount of the independent field
  const parsedAmount = tryParseAmount(typedValue, (isExactIn ? inputCurrency : outputCurrency) ?? undefined)

  const bestTradeExactIn = useTradeExactIn(isExactIn ? parsedAmount : undefined, outputCurrency ?? undefined, {
    maxHops: singleHopOnly ? 1 : undefined,
  })

  const bestTradeExactOut = useTradeExactOut(inputCurrency ?? undefined, !isExactIn ? parsedAmount : undefined, {
    maxHops: singleHopOnly ? 1 : undefined,
  })

  const v2Trade = isExactIn ? bestTradeExactIn : bestTradeExactOut

  const currencyBalances = {
    [Field.INPUT]: relevantTokenBalances[0],
    [Field.OUTPUT]: relevantTokenBalances[1],
  }

  const currencies: { [field in Field]?: Currency } = {
    [Field.INPUT]: inputCurrency ?? undefined,
    [Field.OUTPUT]: outputCurrency ?? undefined,
  }

  let inputError: string | undefined

  if (!account) {
    inputError = 'Connect Wallet'
  }

  if (!parsedAmount) {
    inputError = inputError ?? i18n._(t`Enter an amount`)
  }

  if (!currencies[Field.INPUT] || !currencies[Field.OUTPUT]) {
    inputError = inputError ?? i18n._(t`Select a token`)
  }

  const formattedTo = isAddress(to)
  if (!to || !formattedTo) {
    inputError = inputError ?? i18n._(t`Enter a recipient`)
  } else {
    if (
      // @ts-ignore TYPE NEEDS FIXING
      BAD_RECIPIENT_ADDRESSES?.[chainId]?.[formattedTo] ||
      (bestTradeExactIn && involvesAddress(bestTradeExactIn, formattedTo)) ||
      (bestTradeExactOut && involvesAddress(bestTradeExactOut, formattedTo))
    ) {
      inputError = inputError ?? i18n._(t`Invalid recipient`)
    }
  }

  // @ts-ignore TYPE NEEDS FIXING
  const allowedSlippage = useSwapSlippageTolerance(v2Trade)

  // compare input balance to max input based on version
  const [balanceIn, amountIn] = [currencyBalances[Field.INPUT], v2Trade?.maximumAmountIn(allowedSlippage)]

  if (balanceIn && amountIn && balanceIn.lessThan(amountIn)) {
    inputError = i18n._(t`Insufficient Balance`)
  }

  return {
    to,
    currencies,
    currencyBalances,
    parsedAmount,
    inputError,
    v2Trade: v2Trade ?? undefined,
    allowedSlippage,
  }
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
// TODO / Note (amiller68) - #WallabyOnly / #FilecoinMainnet
// Note (amiller68) - Can't we just use config.defaultChainId here or something?
// export function queryParametersToSwapState(parsedQs: ParsedQs, chainId: ChainId = ChainId.ETHEREUM): SwapState {
export function queryParametersToSwapState(parsedQs: ParsedQs, chainId: ChainId = ChainId.WALLABY): SwapState {
  let inputCurrency = parseCurrencyFromURLParameter(parsedQs.inputCurrency)
  console.log('Input Currency: ', inputCurrency)
  let outputCurrency = parseCurrencyFromURLParameter(parsedQs.outputCurrency)
  console.log('Output Currency: ', outputCurrency)
  // Note (amiller68): #WallabyOnly
  // const eth = chainId === ChainId.CELO ? WNATIVE_ADDRESS[chainId] : 'ETH'
  // TODO (amiller68): Make this Generic for Native Currencys on other chains
  const fil = NATIVE[chainId].symbol ?? 'FIL'
  // Note (amiller68): #WallabyOnly we don't have a Token, but we can use WFIL
  // const sushi = chainId === ChainId.BOBA_AVAX ? '0x4200000000000000000000000000000000000023' : SUSHI_ADDRESS[chainId]
  // TODO (amiller68): #FilecoinMainnet
  const wfil = WNATIVE_ADDRESS[chainId]
  if (inputCurrency === '' && outputCurrency === '') {
    inputCurrency = fil
    outputCurrency = ''
  } else if (inputCurrency === '') {
    inputCurrency = outputCurrency === fil ? wfil : fil
  } else if (outputCurrency === '' || inputCurrency === outputCurrency) {
    outputCurrency = inputCurrency === fil ? wfil : fil
  }

  const recipient = validatedRecipient(parsedQs.recipient)

  return {
    [Field.INPUT]: {
      currencyId: inputCurrency,
    },
    [Field.OUTPUT]: {
      currencyId: outputCurrency,
    },
    typedValue: parseTokenAmountURLParameter(parsedQs.exactAmount),
    independentField: parseIndependentFieldURLParameter(parsedQs.exactField),
    recipient,
  }
}

// updates the swap state to use the defaults for a given network
export function useDefaultsFromURLSearch():
  | {
      inputCurrencyId: string | undefined
      outputCurrencyId: string | undefined
    }
  | undefined {
  const { chainId } = useActiveWeb3React()
  const router = useRouter()
  const dispatch = useAppDispatch()
  const parsedQs = useParsedQueryString()
  const [expertMode] = useExpertModeManager()
  const [result, setResult] = useState<
    | {
        inputCurrencyId: string | undefined
        outputCurrencyId: string | undefined
      }
    | undefined
  >()

  useEffect(() => {
    if (!chainId) return
    const parsed = queryParametersToSwapState(parsedQs, chainId)
    console.log('Parsed URL: ', parsed)

    dispatch(
      replaceSwapState({
        typedValue: parsed.typedValue,
        field: parsed.independentField,
        inputCurrencyId: parsed[Field.INPUT].currencyId,
        outputCurrencyId: parsed[Field.OUTPUT].currencyId,
        recipient: expertMode ? parsed.recipient : undefined,
      })
    )

    setResult({
      inputCurrencyId: parsed[Field.INPUT].currencyId,
      outputCurrencyId: parsed[Field.OUTPUT].currencyId,
    })

    router.replace(
      `/swap?inputCurrency=${parsed[Field.INPUT].currencyId}&outputCurrency=${parsed[Field.OUTPUT].currencyId}`
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, chainId])

  return result
}
