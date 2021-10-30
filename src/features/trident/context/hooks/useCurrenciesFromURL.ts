import { Currency, NATIVE } from '@sushiswap/core-sdk'
import { SUSHI } from 'config/tokens'
import { useCurrency } from 'hooks/Tokens'
import { useActiveWeb3React } from 'hooks/useActiveWeb3React'
import { SUPPORTED_NETWORKS } from 'modals/NetworkModal'
import { useRouter } from 'next/router'
import { useCallback, useMemo } from 'react'

const useCurrenciesFromURL = (): {
  currencies: (Currency | undefined)[]
  switchCurrencies: () => Promise<void>
  setURLCurrency: (cur: Currency, index: number) => void
  fee: number
  twap: boolean
} => {
  const { chainId } = useActiveWeb3React()
  const router = useRouter()
  const currencyA = useCurrency(router.query.tokens?.[0]) || (chainId && NATIVE[chainId]) || undefined
  const currencyB = useCurrency(router.query.tokens?.[1]) || (chainId && SUSHI[chainId]) || undefined

  const fee = Number(router.query.fee ?? 30)
  const twap = router.query.twap !== 'false'

  const setURLCurrency = useCallback(
    async (cur: Currency, index: number) => {
      if (!chainId) return

      let tokens: string[] = []
      if (chainId && router.query?.tokens && router.query?.tokens.length > 0) {
        tokens = [...router.query.tokens]
        const newToken = cur.isNative ? NATIVE[chainId].symbol : cur.wrapped.address
        if (tokens.includes(newToken)) return // return if token already selected
        tokens[index] = newToken
      }

      if (!router.query?.tokens) {
        tokens[index] = cur.wrapped.address
        tokens[index % 1] =
          index === 1
            ? currencyA?.isNative
              ? SUPPORTED_NETWORKS[chainId]?.nativeCurrency.symbol
              : currencyA?.wrapped.address
            : currencyB?.isNative
            ? SUPPORTED_NETWORKS[chainId]?.nativeCurrency.symbol
            : currencyB?.wrapped.address
      }

      await router.push({
        pathname: router.pathname,
        query: {
          tokens,
        },
      })
    },
    [chainId, currencyA?.isNative, currencyA?.wrapped.address, currencyB?.isNative, currencyB?.wrapped.address, router]
  )

  const switchCurrencies = useCallback(async () => {
    let tokens: string[] = []
    if (router.query && router.query.tokens) {
      tokens = [router.query.tokens?.[1], router.query.tokens?.[0]]
    }

    await router.push({
      pathname: router.pathname,
      query: {
        tokens,
      },
    })
  }, [router])

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
