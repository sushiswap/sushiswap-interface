import { getAddress } from '@ethersproject/address'
import { ChainId, Token } from '@figswap/core-sdk'
import { Fee, PoolType } from '@sushiswap/trident-sdk'
import { GRAPH_HOST, TRIDENT } from 'app/services/graph/constants'
import {
  getTransactionsForPoolQuery,
  getTridentPoolsQuery,
  poolDaySnapshotsQuery,
  poolHourSnapshotsQuery,
  poolKpiQuery,
  poolKpisQuery,
} from 'app/services/graph/queries'
import { WrappedTokenInfo } from 'app/state/lists/wrappedTokenInfo'

import { TridentTransactionRawData, tridentTransactionsRawDataFormatter } from '../hooks/transactions/trident'
import { pager } from './pager'

// @ts-ignore TYPE NEEDS FIXING
export const fetcher = async <T>(chainId = ChainId.ETHEREUM, query, variables: {} = undefined): Promise<T> => {
  // @ts-ignore TYPE NEEDS FIXING
  return pager(`${GRAPH_HOST[chainId]}/subgraphs/name/${TRIDENT[chainId]}`, query, variables)
}

const gqlPoolTypeMap: Record<string, PoolType> = {
  concentratedLiquidityPools: PoolType.ConcentratedLiquidity,
  constantProductPools: PoolType.ConstantProduct,
  hybridPools: PoolType.Hybrid,
  indexPools: PoolType.Weighted,
}

export interface TridentPool {
  address: string
  // type: PoolType
  volumeUSD: number
  liquidity: number
  liquidityUSD: number
  // transactionCount: number
  apy: string
  token0: WrappedTokenInfo | Token
  token1: WrappedTokenInfo | Token
  reserve0: number
  reserve1: number
  swapFee: Fee
  twapEnabled: boolean
  // apr: string
}

const formatPools = (chainId: ChainId, pools: TridentPoolQueryResult, tokens: Record<string, Token>): TridentPool[] =>
  Object.entries(pools)
    .filter(([, pools]) => pools.length)
    .flatMap(([poolType, poolList]: [string, TridentPoolData[]]) =>
      poolList
        .filter(({ token0, token1 }) => {
          const token0Address = getAddress(token0.id)
          const token1Address = getAddress(token1.id)
          return token0Address in tokens && token1Address in tokens
        })
        .map(
          ({
            transactionCount,
            liquidityUSD,
            liquidity,
            volumeUSD,
            swapFee,
            twapEnabled,
            token0: _token0,
            token1: _token1,
            reserve0,
            reserve1,
            apr,
            id,
          }) => {
            const token0Address = getAddress(_token0.id)
            const token0 =
              token0Address in tokens
                ? tokens[token0Address]
                : new Token(chainId, token0Address, Number(_token0.decimals), _token0.symbol, _token0.name)
            const token1Address = getAddress(_token1.id)
            const token1 =
              token1Address in tokens
                ? tokens[token1Address]
                : new Token(chainId, token1Address, Number(_token1.decimals), _token1.symbol, _token1.name)
            return {
              address: id,
              type: gqlPoolTypeMap[poolType],
              volumeUSD: Number(volumeUSD),
              liquidity: Number(liquidity),
              liquidityUSD: Number(liquidityUSD),
              apy: apr, // TODO: Needs subgraph support
              transactionCount: Number(transactionCount),
              token0,
              token1,
              reserve0,
              reserve1,
              swapFee: Number(swapFee),
              twapEnabled,
            }
          }
        )
    )

export interface TridentPoolData {
  __typename: string
  id: string
  volumeUSD: string
  liquidity: string
  liquidityUSD: string
  transactionCount: string
  twapEnabled: boolean
  swapFee: string
  token0: {
    id: string
    symbol: string
    name: string
    decimals: string
  }
  token1: {
    id: string
    symbol: string
    name: string
    decimals: string
  }
  reserve0: number
  reserve1: number
  apr: string
}

interface TridentPoolQueryResult {
  concentratedLiquidityPools: TridentPoolData[]
  constantProductPools: TridentPoolData[]
  hybridPools: TridentPoolData[]
  indexPools: TridentPoolData[]
}

export const getTridentPools = async ({
  chainId = ChainId.ETHEREUM,
  // @ts-ignore TYPE NEEDS FIXING
  variables = undefined,
  tokens = {},
}: {
  chainId?: ChainId
  variables?: {}
  tokens?: Record<string, Token>
}): Promise<TridentPool[]> => {
  // @ts-ignore TYPE NEEDS FIXING
  const result: TridentPoolQueryResult = await fetcher(chainId, getTridentPoolsQuery, variables)
  return formatPools(chainId, result, tokens)
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
    // @ts-ignore TYPE NEEDS FIXING
    await fetcher(chainId, poolHourSnapshotsQuery, variables)
  )?.[0] as PoolBucketQueryResult[]
  return formatBuckets(result)
}

// @ts-ignore TYPE NEEDS FIXING
export const getPoolDayBuckets = async (chainId: ChainId = ChainId.ETHEREUM, variables): Promise<PoolBucket[]> => {
  const result: PoolBucketQueryResult[] = Object.values(
    // @ts-ignore TYPE NEEDS FIXING 
    await fetcher(chainId, poolDaySnapshotsQuery, variables)
  )?.[0] as PoolBucketQueryResult[]
  return formatBuckets(result)
}

// @ts-ignore TYPE NEEDS FIXING
export const getTridentPoolTransactions = async (chainId: ChainId = ChainId.ETHEREUM, variables) => {
  const result = await fetcher<TridentTransactionRawData>(chainId, getTransactionsForPoolQuery, variables)
  return tridentTransactionsRawDataFormatter(result)
}

export interface PoolKpiQueryResult {
  id: string
  feesUSD: string
  volumeUSD: string
  liquidity: string
  liquidityUSD: string
  transactionCount: string
}

export interface PoolKpi {
  id: string
  feesUSD: number
  volumeUSD: number
  liquidity: number
  liquidityUSD: number
  transactionCount: number
}

const formatKpi = ({ id, feesUSD, volumeUSD, liquidity, liquidityUSD, transactionCount }: PoolKpiQueryResult) => ({
  id,
  // fees: Number(fees),
  feesUSD: Number(feesUSD),
  // volume: Number(volume),
  volumeUSD: Number(volumeUSD),
  liquidity: Number(liquidity),
  liquidityUSD: Number(liquidityUSD),
  transactionCount: Number(transactionCount),
})

// @ts-ignore TYPE NEEDS FIXING
export const getPoolKpis = async (chainId: ChainId = ChainId.ETHEREUM, variables = {}): Promise<PoolKpi[]> => {
  const result: PoolKpiQueryResult[] = Object.values(
    // @ts-ignore TYPE NEEDS FIXING
    await fetcher(chainId, poolKpisQuery, variables)
  )?.[0] as PoolKpiQueryResult[]
  return result.map(formatKpi)
}

export const getPoolKpi = async (chainId: ChainId = ChainId.ETHEREUM, variables = {}): Promise<PoolKpi> => {
  const result: PoolKpiQueryResult = Object.values(
    // @ts-ignore TYPE NEEDS FIXING
    await fetcher(chainId, poolKpiQuery, variables)
  )?.[0] as PoolKpiQueryResult
  return formatKpi(result)
}
