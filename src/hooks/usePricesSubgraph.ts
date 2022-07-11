import { Currency, CurrencyAmount, USD } from '@sushiswap/core-sdk'
import { useNativePrice, useTokens, useTridentTokens } from 'app/services/graph'
import { useActiveWeb3React } from 'app/services/web3'
import { useMemo } from 'react'

export function useKashiPricesSubgraph(
  currencies?: Currency[],
  useTrident = false
): { [symbol: string]: BigInt } | undefined {
  const { chainId } = useActiveWeb3React()

  const stablecoin = chainId ? CurrencyAmount.fromRawAmount(USD[chainId], 0).currency : undefined

  const { data: ethPrice } = useNativePrice({ chainId })
  const tokensLegacy = useTokens({
    chainId,
    variables: { where: { id_in: currencies?.map((currency) => currency.wrapped.address.toLowerCase()) } },
    shouldFetch: currencies && currencies?.length > 0,
  }) as any[] | undefined
  const { data: tokensTrident } = useTridentTokens({
    chainId,
    variables: {
      where: { id_in: currencies?.map((currency) => currency.wrapped.address.toLowerCase()) },
    },
    shouldFetch: currencies && currencies?.length > 0,
  })

  return useMemo(() => {
    if (!currencies || currencies.length === 0 || !stablecoin || !(tokensLegacy || tokensTrident)) {
      return undefined
    }

    const prices: { [symbol: string]: BigInt } = {}

    currencies.map((currency) => {
      let price: number | undefined = undefined

      const tokenLegacy = tokensLegacy?.find((token) => token.id === currency.wrapped.address.toLowerCase())
      const tokenTrident = tokensTrident?.find((token) => token.id === currency.wrapped.address.toLowerCase())

      // handle usdc
      if (currency?.wrapped.equals(stablecoin)) {
        if (currency.wrapped.symbol) {
          prices[currency.wrapped.symbol] = BigInt('100000000')
        }
        return
      }

      if (tokenLegacy && tokenTrident) {
        if (tokenLegacy.liquidity > tokenTrident.kpi.liquidity) {
          price = ethPrice * tokenLegacy.derivedETH
        } else {
          price = tokenTrident.price.derivedUSD
        }
      } else if (ethPrice && tokenLegacy) {
        price = ethPrice * tokenLegacy.derivedETH
      } else if (tokenTrident) {
        price = tokenTrident.price.derivedUSD
      }

      if (price !== undefined && price !== 0) {
        const base = 10 ** (String(price).split('.')?.[1]?.length ?? 0)
        const quote = Math.floor(price * 10 ** 8)
        try {
          if (currency.wrapped.symbol) {
            prices[currency.wrapped.symbol] = BigInt(quote)
            //prices[currency.wrapped.symbol] = (quote * (base * 10 ** currency.decimals)) / 10 ** stablecoin.decimals
          }
        } catch {}
      }
    })

    return prices
  }, [currencies, stablecoin, tokensLegacy, tokensTrident, ethPrice])
}

export function useKashiPricesSubgraphWithLoadingIndicator(currencies?: Currency[], useTrident = false) {
  // Bandaid solution for now, might become permanent
  const data = useKashiPricesSubgraph(currencies, useTrident)
  return useMemo(() => {
    if (!data) return { data: {}, loading: true }
    try {
      return { data: data, loading: false }
    } catch (error) {
      return { data: {}, loading: true }
    }
  }, [data])
}
