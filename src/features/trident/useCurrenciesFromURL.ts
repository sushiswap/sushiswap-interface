import { ChainId, Currency, NATIVE, SUSHI } from '@sushiswap/core-sdk'
import { Fee } from '@sushiswap/trident-sdk'
import { useCurrency } from 'app/hooks/Tokens'
import { useActiveWeb3React } from 'app/services/web3'
import { useRouter } from 'next/router'
import { useCallback, useMemo } from 'react'

const getToken = (urlToken: string | undefined, chainId: ChainId | undefined) => {
  if (!urlToken || !chainId) return undefined
  return [NATIVE[chainId].symbol, 'ETH'].includes(urlToken) ? 'ETH' : urlToken
}

const useCurrenciesFromURL = (): {
  currencies: (Currency | undefined)[]
  switchCurrencies: () => Promise<void>
  setURLCurrency: (cur: Currency, index: 'inputCurrency' | 'outputCurrency') => void
  fee: number
  twap: boolean
} => {
  const { chainId } = useActiveWeb3React()
  const router = useRouter()

  const currencyA =
    useCurrency(getToken(router.query.inputCurrency as string, chainId)) || (chainId && NATIVE[chainId]) || undefined
  const currencyB =
    useCurrency(getToken(router.query.outputCurrency as string, chainId)) ||
    (chainId && SUSHI[chainId as ChainId]) ||
    undefined

  const fee = Number(router.query.fee ?? Fee.DEFAULT)
  const twap = router.query.twap !== 'false'

  const switchCurrencies = useCallback(async () => {
    if (!chainId) return

    let tokens: {}
    const nativeSymbol = NATIVE[chainId].symbol
    if (router.query && router.query.outputCurrency && router.query.inputCurrency) {
      tokens = { inputCurrency: router.query.outputCurrency, outputCurrency: router.query.inputCurrency }
    } else {
      tokens = {
        inputCurrency: currencyB?.isNative ? nativeSymbol : currencyB?.wrapped.address,
        outputCurrency: currencyA?.isNative ? nativeSymbol : currencyA?.wrapped.address,
      }
    }

    await router.push({
      pathname: router.pathname,
      query: {
        ...tokens,
        ...(router.pathname !== '/swap' && {
          fee,
          twap,
        }),
      },
    })
  }, [
    chainId,
    currencyA?.isNative,
    currencyA?.wrapped.address,
    currencyB?.isNative,
    currencyB?.wrapped.address,
    fee,
    router,
    twap,
  ])

  const setURLCurrency = useCallback(
    async (cur: Currency, index: 'inputCurrency' | 'outputCurrency') => {
      if (!chainId) return

      const nativeSymbol = NATIVE[chainId].symbol
      let tokens = {
        inputCurrency: currencyA?.isNative ? nativeSymbol : currencyA?.wrapped.address,
        outputCurrency: currencyB?.isNative ? nativeSymbol : currencyB?.wrapped.address,
      }

      if (chainId && router.query.inputCurrency && router.query.outputCurrency) {
        tokens = {
          inputCurrency: router.query.inputCurrency as string,
          outputCurrency: router.query.outputCurrency as string,
        }

        // If selected currency is already in URL, switch currencies
        if (tokens[index] === (cur.isNative ? nativeSymbol : cur.wrapped.address)) {
          return switchCurrencies()
        }

        const newToken = cur.isNative ? NATIVE[chainId].symbol : cur.wrapped.address
        if (tokens[index] === newToken) return // return if token already selected
        tokens[index] = newToken
      }

      if (!router.query.inputCurrency || !router.query.outputCurrency) {
        tokens = {
          ...tokens,
          [index]:
            index === 'outputCurrency'
              ? cur.isNative
                ? nativeSymbol
                : cur?.wrapped.address
              : cur.isNative
              ? nativeSymbol
              : cur?.wrapped.address,
        }
      }

      await router.push({
        pathname: router.pathname,
        query: {
          ...tokens,
          ...(router.pathname !== '/swap' && {
            fee,
            twap,
          }),
        },
      })
    },
    [
      chainId,
      currencyA?.isNative,
      currencyA?.wrapped.address,
      currencyB?.isNative,
      currencyB?.wrapped.address,
      fee,
      router,
      switchCurrencies,
      twap,
    ]
  )

  return useMemo(
    () => ({
      currencies: [currencyA, currencyB],
      setURLCurrency,
      switchCurrencies,
      fee,
      twap,
    }),
    [currencyA, currencyB, setURLCurrency, switchCurrencies, fee, twap]
  )
}

export default useCurrenciesFromURL
