// TODO / Note (amiller68) - #SdkChange / #SdkPublish
import { tryParseAmount } from 'app/functions/parse'
import { useActiveWeb3React } from 'app/services/web3'
import { useTransactionAdder } from 'app/state/transactions/hooks'
import { useCurrencyBalance } from 'app/state/wallet/hooks'
import { useMemo } from 'react'
import { Currency, NATIVE, WNATIVE } from 'sdk'

import { useWETH9Contract } from './useContract'

export enum WrapType {
  NOT_APPLICABLE,
  WRAP,
  UNWRAP,
}

const NOT_APPLICABLE = { wrapType: WrapType.NOT_APPLICABLE }

/**
 * Given the selected input and output currency, return a wrap callback
 * @param inputCurrency the selected input currency
 * @param outputCurrency the selected output currency
 * @param typedValue the user input value
 */
export default function useWrapCallback(
  inputCurrency: Currency | undefined,
  outputCurrency: Currency | undefined,
  typedValue: string | undefined
): {
  wrapType: WrapType
  execute?: undefined | (() => Promise<void>)
  inputError?: string
} {
  // console.log('useWrapCallback: in: ', inputCurrency, ' out: ', outputCurrency, typedValue)
  const { chainId, account } = useActiveWeb3React()
  // TODO (amiller68): #WallabyOnly - make this work in wallaby
  const wethContract = useWETH9Contract()
  // const gasEstimate = use
  const balance = useCurrencyBalance(account ?? undefined, inputCurrency)
  // console.log('useWrapCallback -> useCurrencyBalance: inputBalance: ', balance)
  // we can always parse the amount typed as the input currency, since wrapping is 1:1
  const inputAmount = useMemo(() => tryParseAmount(typedValue, inputCurrency), [inputCurrency, typedValue])
  // console.log('useWrapCallback -> parseAmount: inputAmount: ', inputAmount)
  const addTransaction = useTransactionAdder()

  return useMemo(() => {
    // console.log('WrapCallback Start on chain: ', chainId)
    // Note (amiller68) - #WallabyOnly
    // if (!wethContract || !chainId || !inputCurrency || !outputCurrency || chainId === ChainId.CELO)
    if (!wethContract || !chainId || !inputCurrency || !outputCurrency) {
      console.log('useWrapCallback -> NOT_APPLICABLE: Bad input')
      return NOT_APPLICABLE
    }
    const wnative = WNATIVE[chainId]
    if (!wnative) {
      // console.log('useWrapCallback -> NOT_APPLICABLE: No wnative')
      return NOT_APPLICABLE
    }

    const hasInputAmount = Boolean(inputAmount?.greaterThan('0'))
    const sufficientBalance = inputAmount && balance && !balance.lessThan(inputAmount)

    if (inputCurrency.isNative && wnative.equals(outputCurrency)) {
      // console.log('useWrapCallback: type: WRAP')
      return {
        wrapType: WrapType.WRAP,
        execute:
          sufficientBalance && inputAmount
            ? async () => {
                try {
                  // TODO (amiller68): Estimate gas correctly or research how to do this with Wallaby / FVM
                  const gasEstimate = 1000000
                  console.log('useWrapCallback: deposit to wethContract: gasEstimate: ', gasEstimate)
                  // TODO (amiller68): Implement Wrapping
                  const txReceipt = await wethContract.deposit({
                    from: account,
                    // to: wethContract.address,
                    value: `0x${inputAmount.quotient.toString(16)}`,
                    gasLimit: 100000000,
                    gasPrice: gasEstimate,
                  })
                  console.log('useWrapCallback -> WrapCallback: txReceipt: ', txReceipt)
                  addTransaction(txReceipt, {
                    // @ts-ignore TYPE NEEDS FIXING
                    summary: `Wrap ${inputAmount.toSignificant(6)} ${NATIVE[chainId].symbol} to ${
                      WNATIVE[chainId].symbol
                    }`,
                  })
                } catch (error) {
                  console.error('Could not deposit', error)
                }
              }
            : undefined,
        inputError: sufficientBalance
          ? undefined
          : hasInputAmount
          ? // @ts-ignore TYPE NEEDS FIXING
            `Insufficient ${NATIVE[chainId].symbol} balance`
          : // @ts-ignore TYPE NEEDS FIXING
            `Enter ${NATIVE[chainId].symbol} amount`,
      }
    } else if (wnative.equals(inputCurrency) && outputCurrency.isNative) {
      console.log('useWrapCallback: type: UNWRAP')
      return {
        wrapType: WrapType.UNWRAP,
        execute:
          sufficientBalance && inputAmount
            ? async () => {
                try {
                  // TODO (amiller68): Implement Unwrapping
                  const txReceipt = await wethContract.withdraw(`0x${inputAmount.quotient.toString(16)}`)
                  addTransaction(txReceipt, {
                    summary: `Unwrap ${inputAmount.toSignificant(6)} ${WNATIVE[chainId].symbol} to ${
                      // @ts-ignore TYPE NEEDS FIXING
                      NATIVE[chainId].symbol
                    }`,
                  })
                } catch (error) {
                  console.error('Could not withdraw', error)
                }
              }
            : undefined,
        inputError: sufficientBalance
          ? undefined
          : hasInputAmount
          ? `Insufficient ${WNATIVE[chainId].symbol} balance`
          : `Enter ${WNATIVE[chainId].symbol} amount`,
      }
    } else {
      console.log('useWrapCallback: type: NOT_APPLICABLE')
      return NOT_APPLICABLE
    }
  }, [wethContract, chainId, inputCurrency, outputCurrency, inputAmount, balance, addTransaction])
}
