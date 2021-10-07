import { useRouter } from 'next/router'
import { useCurrency } from '../../../../hooks/Tokens'
import { Currency, NATIVE } from '@sushiswap/core-sdk'
import { useCallback, useMemo } from 'react'
import { useActiveWeb3React } from '../../../../hooks'

const useCurrenciesFromURL = (): {
  currencies: (Currency | undefined)[]
  setURLCurrency: (cur: Currency, index: number) => void
  fee: number
  twap: boolean
} => {
  const { chainId } = useActiveWeb3React()
  const router = useRouter()

  const currencyA = useCurrency(router.query.tokens?.[0])
  const currencyB = useCurrency(router.query.tokens?.[1])

  const fee = Number(router.query.fee ?? 30)
  const twap = router.query.twap !== 'false'

  const setURLCurrency = useCallback(
    async (cur: Currency, index: number) => {
      let tokens: string[] = []
      if (chainId && router.query?.tokens && router.query?.tokens.length > 0) {
        tokens = [...router.query.tokens]
        const newToken = cur.isNative ? NATIVE[chainId].symbol : cur.wrapped.address
        if (tokens.includes(newToken)) return // return if token already selected
        tokens[index] = newToken
      }

      await router.push({
        pathname: router.pathname,
        query: {
          tokens,
        },
      })
    },
    [chainId, router]
  )

  return useMemo(
    () => ({
      currencies: [currencyA, currencyB],
      setURLCurrency,
      fee,
      twap,
    }),
    [currencyA, currencyB, setURLCurrency, fee, twap]
  )
}

export default useCurrenciesFromURL
