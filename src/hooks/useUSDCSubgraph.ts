import { Currency, CurrencyAmount, Price, Token, USD } from '@sushiswap/core-sdk'
import { useEthPrice, useTokens, useTridentTokens } from 'app/services/graph'
import { useActiveWeb3React } from 'app/services/web3'
import { useMemo } from 'react'

/**
 * Returns the price in USDC of the input currency
 * @param currency currency to compute the USDC price of
 * @param useTrident for possible compatibility reasons
 */
export default function useUSDCPriceSubgraph(
  currency?: Currency,
  useTrident = false
): Price<Currency, Token> | undefined {
  const { chainId } = useActiveWeb3React()

  const stablecoin = chainId ? CurrencyAmount.fromRawAmount(USD[chainId], 0).currency : undefined

  const ethPrice = useEthPrice()
  const tokenLegacy = useTokens({
    chainId,
    variables: { first: 1, where: { id_in: [currency?.wrapped.address.toLowerCase()] } },
    shouldFetch: !!currency?.wrapped.address,
  })?.[0]
  const { data: tokensTrident } = useTridentTokens({
    chainId,
    variables: {
      first: 1,
      where: { id_in: [currency?.wrapped.address.toLowerCase()] },
      shouldFetch: !!currency?.wrapped.address,
    },
  })

  const tokenTrident = tokensTrident?.[0]

  return useMemo(() => {
    if (!currency || !stablecoin || !(tokenLegacy || tokenTrident)) {
      return undefined
    }

    let price: number | undefined = undefined

    // handle usdc
    if (currency?.wrapped.equals(stablecoin)) {
      return new Price(stablecoin, stablecoin, '1', '1')
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
      const quote = Math.floor(price * base)
      try {
        return new Price(currency, stablecoin, (base * 10 ** currency.decimals) / 10 ** stablecoin.decimals, quote)
      } catch (e) {
        console.log(currency.wrapped.name, price, base, quote, e)
      }
    }

    return undefined
  }, [currency, stablecoin, tokenLegacy, tokenTrident, ethPrice])
}

export function useUSDCValueSubgraph(
  currencyAmount: CurrencyAmount<Currency> | undefined | null,
  includeTrident = false
) {
  const price = useUSDCPriceSubgraph(currencyAmount?.currency, includeTrident)

  return useMemo(() => {
    if (!price || !currencyAmount) return null
    try {
      return price.quote(currencyAmount)
    } catch (error) {
      return null
    }
  }, [currencyAmount, price])
}
