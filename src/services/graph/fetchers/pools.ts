import { ChainId, Token } from '@sushiswap/core-sdk'
import { PoolType } from '@sushiswap/tines'
import { Fee } from '@sushiswap/trident-sdk'
import { GRAPH_HOST, TRIDENT } from 'app/services/graph/constants'
import {
  getSwapsForPoolQuery,
  getTridentPoolsQuery,
  poolDaySnapshotsQuery,
  poolHourSnapshotsQuery,
  poolKpisQuery,
} from 'app/services/graph/queries'

import { TridentTransactionRawData, tridentTransactionsRawDataFormatter } from '../hooks/transactions/trident'
import { pager } from './pager'

// @ts-ignore TYPE NEEDS FIXING
export const fetcher = async (chainId = ChainId.ETHEREUM, query, variables: {} = undefined) =>
  // @ts-ignore TYPE NEEDS FIXING
  pager(`${GRAPH_HOST[chainId]}/subgraphs/name/${TRIDENT[chainId]}`, query, variables)

const gqlPoolTypeMap: Record<string, PoolType> = {
  concentratedLiquidityPools: PoolType.ConcentratedLiquidity,
  constantProductPools: PoolType.ConstantProduct,
  hybridPools: PoolType.Hybrid,
  indexPools: PoolType.Weighted,
}

export interface TridentPool {
  address: string
  type: PoolType
  volumeUSD: number
  liquidityUSD: number
  transactionCount: number
  apy: string
  assets: Token[]
  swapFee: Fee
  twapEnabled: boolean
}

const formatPools = (chainId: ChainId, pools: TridentPoolQueryResult): TridentPool[] =>
  Object.entries(pools)
    .filter(([, assets]) => assets.length)
    .flatMap(([poolType, poolList]: [string, TridentPoolData[]]) =>
      poolList.map(({ kpi, assets, swapFee, twapEnabled, id }) => ({
        address: id,
        type: gqlPoolTypeMap[poolType],
        volumeUSD: Number(kpi.volumeUSD),
        liquidityUSD: Number(kpi.liquidityUSD),
        apy: '12.34', // TODO: Needs subgraph support
        transactionCount: Number(kpi.transactionCount),
        assets: assets.map(
          ({ token }) => new Token(chainId, token.id, Number(token.decimals), token.symbol, token.name)
        ),
        swapFee: Number(swapFee),
        twapEnabled,
      }))
    )

export interface TridentPoolData {
  __typename: string
  id: string
  kpi: {
    volumeUSD: string
    liquidity: string
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
  // @ts-ignore TYPE NEEDS FIXING
  variables: {} = undefined
): Promise<TridentPool[]> => {
  // @ts-ignore TYPE NEEDS FIXING
  const result: TridentPoolQueryResult = await fetcher(chainId, getTridentPoolsQuery, variables)
  return formatPools(chainId, result)
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

// @ts-ignore TYPE NEEDS FIXING
export const getPoolHourBuckets = async (chainId: ChainId = ChainId.ETHEREUM, variables): Promise<PoolBucket[]> => {
  const result: PoolBucketQueryResult[] = Object.values(
    await fetcher(chainId, poolHourSnapshotsQuery, variables)
  )?.[0] as PoolBucketQueryResult[]
  return formatBuckets(result)
}

// @ts-ignore TYPE NEEDS FIXING
export const getPoolDayBuckets = async (chainId: ChainId = ChainId.ETHEREUM, variables): Promise<PoolBucket[]> => {
  const result: PoolBucketQueryResult[] = Object.values(
    await fetcher(chainId, poolDaySnapshotsQuery, variables)
  )?.[0] as PoolBucketQueryResult[]
  return formatBuckets(result)
}

// @ts-ignore TYPE NEEDS FIXING
export const getTridentPoolTransactions = async (chainId: ChainId = ChainId.ETHEREUM, variables) => {
  const result = (await fetcher(chainId, getSwapsForPoolQuery, variables)).swaps as TridentTransactionRawData[]
  return tridentTransactionsRawDataFormatter(result || [])
}

export interface PoolKpiQueryResult {
  fees: string
  feesUSD: string
  volume: string
  volumeUSD: string
  liquidity: string
  liquidityUSD: string
  transactionCount: string
}

export interface PoolKpi {
  fees: number
  feesUSD: number
  volume: number
  volumeUSD: number
  liquidity: number
  liquidityUSD: number
  transactionCount: number
}

const formatKpis = (kpis: PoolKpiQueryResult[]): PoolKpi[] =>
  kpis.map(({ fees, feesUSD, volume, volumeUSD, liquidity, liquidityUSD, transactionCount }) => ({
    fees: Number(fees),
    feesUSD: Number(feesUSD),
    volume: Number(volume),
    volumeUSD: Number(volumeUSD),
    liquidity: Number(liquidity),
    liquidityUSD: Number(liquidityUSD),
    transactionCount: Number(transactionCount),
  }))

// @ts-ignore TYPE NEEDS FIXING
export const getPoolKpis = async (chainId: ChainId = ChainId.ETHEREUM, variables): Promise<PoolKpi[]> => {
  const result: PoolKpiQueryResult[] = Object.values(
    await fetcher(chainId, poolKpisQuery, variables)
  )?.[0] as PoolKpiQueryResult[]
  return formatKpis(result)
}
