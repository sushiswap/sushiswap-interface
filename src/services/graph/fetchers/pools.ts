import { ChainId } from '@sushiswap/core-sdk'
import { PoolType } from '@sushiswap/tines'
import { GRAPH_HOST, TRIDENT } from 'services/graph/constants'
import {
  getSwapsForPoolQuery,
  getTridentPoolsQuery,
  poolDayBucketsQuery,
  poolHourBucketsQuery,
} from 'services/graph/queries'

import { pager } from './pager'

export const fetcher = async (chainId = ChainId.ETHEREUM, query, variables = undefined) =>
  pager(`${GRAPH_HOST[chainId]}/subgraphs/name/${TRIDENT[chainId]}`, query, variables)

const gqlPoolTypeMap: Record<string, PoolType> = {
  concentratedLiquidityPools: PoolType.ConcentratedLiquidity,
  constantProductPools: PoolType.ConstantProduct,
  hybridPools: PoolType.Hybrid,
  indexPools: PoolType.Weighted,
}

export type FeeTier = 1 | 0.3 | 0.05 | 0.01

export interface TridentPool {
  type: PoolType
  volumeUSD: number
  liquidityUSD: number
  transactionCount: number
  assets: {
    id: string
    symbol: string
    name: string
    decimals: number
  }[]
  swapFeePercent: FeeTier
  twapEnabled: boolean
}

const formatPools = (pools: TridentPoolQueryResult): TridentPool[] =>
  Object.entries(pools)
    .filter(([, assets]) => assets.length)
    .flatMap(([poolType, poolList]: [string, TridentPoolData[]]) =>
      poolList.map(({ kpi, assets, swapFee, twapEnabled }) => ({
        type: gqlPoolTypeMap[poolType],
        volumeUSD: Number(kpi.volumeUSD),
        liquidityUSD: Number(kpi.liquidityUSD),
        transactionCount: Number(kpi.transactionCount),
        assets: assets.map((asset) => ({
          id: asset.token.id,
          symbol: asset.token.symbol,
          name: asset.token.name,
          decimals: Number(asset.token.decimals),
        })),
        swapFeePercent: (parseInt(swapFee) / 100) as FeeTier,
        twapEnabled,
      }))
    )

interface TridentPoolData {
  kpi: {
    volumeUSD: string
    liquidityUSD: string
    transactionCount: string
  }
  twapEnabled: boolean
  swapFee: string
  assets: {
    token: {
      id: string
      symbol: string
      name: string
      decimals: string
    }
  }[]
}

interface TridentPoolQueryResult {
  concentratedLiquidityPools: TridentPoolData[]
  constantProductPools: TridentPoolData[]
  hybridPools: TridentPoolData[]
  indexPools: TridentPoolData[]
}

export const getTridentPools = async (
  chainId: ChainId = ChainId.ETHEREUM,
  variables: {} = undefined
): Promise<TridentPool[]> => {
  const result: TridentPoolQueryResult = await fetcher(chainId, getTridentPoolsQuery, variables)
  return formatPools(result)
}

interface PoolBucketQueryResult {
  id: string
  date: string
  liquidityUSD: string
  volumeUSD: string
  feesUSD: string
  transactionCount: string
}

export interface PoolBucket {
  date: Date
  liquidityUSD: number
  volumeUSD: number
  feesUSD: number
  transactionCount: number
}

const formatBuckets = (buckets: PoolBucketQueryResult[]): PoolBucket[] =>
  buckets.map((bucket) => ({
    date: new Date(Number(bucket.date) * 1000),
    liquidityUSD: Number(bucket.liquidityUSD),
    volumeUSD: Number(bucket.volumeUSD),
    feesUSD: Number(bucket.feesUSD),
    transactionCount: Number(bucket.transactionCount),
  }))

export const getPoolHourBuckets = async (chainId: ChainId = ChainId.ETHEREUM, variables): Promise<PoolBucket[]> => {
  const result: PoolBucketQueryResult[] = Object.values(
    await fetcher(chainId, poolHourBucketsQuery, variables)
  )?.[0] as PoolBucketQueryResult[]
  return formatBuckets(result)
}

export const getPoolDayBuckets = async (chainId: ChainId = ChainId.ETHEREUM, variables): Promise<PoolBucket[]> => {
  const result: PoolBucketQueryResult[] = Object.values(
    await fetcher(chainId, poolDayBucketsQuery, variables)
  )?.[0] as PoolBucketQueryResult[]
  return formatBuckets(result)
}

export const getTridentPoolTransactions = async (poolAddress) => {
  return await pager('https://api.thegraph.com/subgraphs/name/sushiswap/trident', getSwapsForPoolQuery, {
    poolAddress: poolAddress.toLowerCase(),
  })
}
