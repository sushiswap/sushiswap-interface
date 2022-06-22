import { ChainId, Currency, CurrencyAmount } from '@sushiswap/core-sdk'
import { STABLECOIN_AMOUNT_OUT } from 'app/hooks/useUSDCPrice'
import { fetcher } from 'app/services/graph'
import {
  getTridentTokenPriceQuery,
  getTridentTokenPricesQuery,
  getTridentTokensQuery,
} from 'app/services/graph/queries'

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
  // @ts-ignore TYPE NEEDS FIXING
  variables: {} = undefined
): Promise<CurrencyAmount<Currency>[]> => {
  // @ts-ignore TYPE NEEDS FIXING
  const { tokenPrices }: TridentTokenPricesQueryResult = await fetcher(chainId, getTridentTokenPricesQuery, variables)
  return formatCurrencyAmounts(chainId, tokenPrices)
}

interface TridentTokenPriceQueryResult {
  tokenPrice: TokenPrice
}

export const getTridentTokenPrice = async (
  chainId: ChainId = ChainId.ETHEREUM,
  // @ts-ignore TYPE NEEDS FIXING
  variables: {} = undefined
  // @ts-ignore TYPE NEEDS FIXING
): Promise<CurrencyAmount<Currency>> => {
  try {
    // @ts-ignore TYPE NEEDS FIXING
    const { tokenPrice }: TridentTokenPriceQueryResult = await fetcher(chainId, getTridentTokenPriceQuery, variables)
    return formatCurrencyAmounts(chainId, [tokenPrice])?.[0]
  } catch (e) {
    console.log(e)
  }
}

interface TridentTokenQueryResult {
  tokens: {
    id: string
    price: {
      derivedNative: string
      derivedUSD: string
    }
    kpi: {
      liquidity: string
      liquidityNative: string
      liquidityUSD: string
      volume: string
      volumeNative: string
      volumeUSD: string
      fees: string
      feesNative: string
      feesUSD: string
      transactionCount: string
    }
    rebase: {
      base: string
      elastic: string
    }
    symbol: string
    name: string
    decimals: string
  }[]
}

export const getTridentTokens = async (
  chainId: ChainId = ChainId.ETHEREUM,
  // @ts-ignore TYPE NEEDS FIXING
  variables: {} = undefined
) => {
  // @ts-ignore TYPE NEEDS FIXING
  const { tokens }: TridentTokenQueryResult = await fetcher(chainId, getTridentTokensQuery, variables)
  return tokens.map((token) => ({
    id: token.id,
    price: {
      derivedNative: token.price ? Number(token.price.derivedNative) : 0,
      derivedUSD: token.price ? Number(token.price.derivedUSD) : 0,
    },
    kpi: {
      liquidity: token.kpi ? Number(token.kpi.liquidity) : 0,
      liquidityNative: token.kpi ? Number(token.kpi.liquidityNative) : 0,
      liquidityUSD: token.kpi ? Number(token.kpi.liquidityUSD) : 0,
      volume: token.kpi ? Number(token.kpi.volume) : 0,
      volumeNative: token.kpi ? Number(token.kpi.volumeNative) : 0,
      volumeUSD: token.kpi ? Number(token.kpi.volumeUSD) : 0,
      fees: token.kpi ? Number(token.kpi.fees) : 0,
      feesNative: token.kpi ? Number(token.kpi.feesNative) : 0,
      feesUSD: token.kpi ? Number(token.kpi.feesUSD) : 0,
      transactionCount: token.kpi ? Number(token.kpi.transactionCount) : 0,
    },
    rebase: {
      base: token.rebase ? Number(token.rebase.base) : 0,
      elastic: token.rebase ? Number(token.rebase.elastic) : 0,
    },
    symbol: token.symbol,
    name: token.name,
    decimals: Number(token.decimals),
  }))
}
