import { ChainId, Currency, CurrencyAmount } from '@sushiswap/core-sdk'
import { STABLECOIN_AMOUNT_OUT } from 'app/hooks/useUSDCPrice'
import { fetcher } from 'app/services/graph'
import {
  getTridentTokenDaySnapshotsQuery,
  getTridentTokenHourSnapshotsQuery,
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

interface TokenBucketQueryResult {
  id: string
  date: string
  liquidityUSD: string
  volumeUSD: string
  feesUSD: string
  priceUSD: string
  transactionCount: string
}

export interface TokenBucket {
  date: Date
  liquidityUSD: number
  volumeUSD: number
  feesUSD: number
  priceUSD: number
  transactionCount: number
}

const formatBuckets = (buckets: TokenBucketQueryResult[]): TokenBucket[] =>
  buckets.map((bucket) => ({
    date: new Date(Number(bucket.date) * 1000),
    liquidityUSD: Number(bucket.liquidityUSD),
    volumeUSD: Number(bucket.volumeUSD),
    feesUSD: Number(bucket.feesUSD),
    priceUSD: Number(bucket.priceUSD),
    transactionCount: Number(bucket.transactionCount),
  }))

export const getTridentTokenHourBuckets = async (
  chainId: ChainId = ChainId.ETHEREUM,
  variables: any
): Promise<TokenBucket[]> => {
  const result: TokenBucketQueryResult[] = Object.values(
    await fetcher(chainId, getTridentTokenHourSnapshotsQuery, variables)
  )?.[0] as TokenBucketQueryResult[]
  return formatBuckets(result)
}

export const getTridentTokenDayBuckets = async (
  chainId: ChainId = ChainId.ETHEREUM,
  variables: any
): Promise<TokenBucket[]> => {
  const result: TokenBucketQueryResult[] = Object.values(
    await fetcher(chainId, getTridentTokenDaySnapshotsQuery, variables)
  )?.[0] as TokenBucketQueryResult[]
  return formatBuckets(result)
}

export interface TokenKpiQueryResult {
  id: string
  fees: string
  feesUSD: string
  volume: string
  volumeUSD: string
  liquidity: string
  liquidityUSD: string
  transactionCount: string
}

export interface TokenKpi {
  id: string
  fees: number
  feesUSD: number
  volume: number
  volumeUSD: number
  liquidity: number
  liquidityUSD: number
  transactionCount: number
}

const formatKpi = ({
  id,
  fees,
  feesUSD,
  volume,
  volumeUSD,
  liquidity,
  liquidityUSD,
  transactionCount,
}: TokenKpiQueryResult) => ({
  id,
  fees: Number(fees),
  feesUSD: Number(feesUSD),
  volume: Number(volume),
  volumeUSD: Number(volumeUSD),
  liquidity: Number(liquidity),
  liquidityUSD: Number(liquidityUSD),
  transactionCount: Number(transactionCount),
})

// @ts-ignore TYPE NEEDS FIXING
export const getTridentTokenKpis = async (chainId: ChainId = ChainId.ETHEREUM, variables = {}): Promise<TokenKpi[]> => {
  const result: TokenKpiQueryResult[] = Object.values(
    await fetcher(chainId, getTridentTokenKpis, variables)
  )?.[0] as TokenKpiQueryResult[]
  return result.map(formatKpi)
}

export const getTridentTokenKpi = async (chainId: ChainId = ChainId.ETHEREUM, variables = {}): Promise<TokenKpi> => {
  const result: TokenKpiQueryResult = Object.values(
    await fetcher(chainId, getTridentTokenKpi, variables)
  )?.[0] as TokenKpiQueryResult
  return formatKpi(result)
}
