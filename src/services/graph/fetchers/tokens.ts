import { ChainId, Currency, CurrencyAmount } from '@sushiswap/core-sdk'
import { STABLECOIN_AMOUNT_OUT } from 'app/hooks/useUSDCPrice'
import { fetcher } from 'app/services/graph'
import { getTridentTokenPriceQuery, getTridentTokenPricesQuery } from 'app/services/graph/queries'

const formatCurrencyAmounts = (chainId: ChainId, tokenPrices: TokenPrice[]) => {
  return tokenPrices.map(({ derivedUSD }) => {
    const decimals = STABLECOIN_AMOUNT_OUT[chainId].currency.decimals
    return CurrencyAmount.fromRawAmount(
      STABLECOIN_AMOUNT_OUT[chainId].currency,
      Number(derivedUSD).toFixed(decimals).toBigNumber(decimals).toString()
    )
  })
}

interface TokenPrice {
  derivedUSD: string
}

interface TridentTokenPricesQueryResult {
  tokenPrices: TokenPrice[]
}

export const getTridentTokenPrices = async (
  chainId: ChainId = ChainId.ETHEREUM,
  variables: {} = undefined
): Promise<CurrencyAmount<Currency>[]> => {
  const { tokenPrices }: TridentTokenPricesQueryResult = await fetcher(chainId, getTridentTokenPricesQuery, variables)
  return formatCurrencyAmounts(chainId, tokenPrices)
}

interface TridentTokenPriceQueryResult {
  tokenPrice: TokenPrice
}

export const getTridentTokenPrice = async (
  chainId: ChainId = ChainId.ETHEREUM,
  variables: {} = undefined
): Promise<CurrencyAmount<Currency>> => {
  try {
    const { tokenPrice }: TridentTokenPriceQueryResult = await fetcher(chainId, getTridentTokenPriceQuery, variables)
    return formatCurrencyAmounts(chainId, [tokenPrice])?.[0]
  } catch (e) {
    console.log(e)
  }
}
