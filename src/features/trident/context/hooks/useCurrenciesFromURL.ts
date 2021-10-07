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
        tokens[index] = cur.isNative ? NATIVE[chainId].symbol : cur.wrapped.address
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

  const currencies = useMemo(
    () =>
      currencyA && currencyB
        ? currencyA.wrapped.sortsBefore(currencyB.wrapped)
          ? [currencyA, currencyB]
          : [currencyB, currencyA]
        : [undefined, undefined],
    [currencyA, currencyB]
  )

  return {
    currencies,
    setURLCurrency,
    fee,
    twap,
  }
}

export default useCurrenciesFromURL
