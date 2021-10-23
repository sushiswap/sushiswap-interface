import { getTridentPoolsQuery } from '../queries'

import { ChainId } from '@sushiswap/core-sdk'
import { GRAPH_HOST, TRIDENT } from '../constants'
import { PoolType } from '../../../features/trident/types'
import { pager } from './index'

export const fetcher = async (chainId = ChainId.MAINNET, query, variables = undefined) =>
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
  totalValueLockedUSD: number
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
      poolList.map(({ volumeUSD, totalValueLockedUSD, transactionCount, assets, swapFee, twapEnabled }) => ({
        type: gqlPoolTypeMap[poolType],
        volumeUSD: Number(volumeUSD),
        totalValueLockedUSD: Number(totalValueLockedUSD),
        transactionCount: Number(transactionCount),
        assets: assets.map((asset) => ({
          id: asset.id,
          symbol: asset.metaData.symbol,
          name: asset.metaData.name,
          decimals: Number(asset.metaData.decimals),
        })),
        swapFeePercent: (parseInt(swapFee) / 100) as FeeTier,
        twapEnabled,
      }))
    )

interface TridentPoolData {
  volumeUSD: string
  totalValueLockedUSD: string
  transactionCount: string
  twapEnabled: boolean
  swapFee: string
  assets: {
    id: string
    metaData: {
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
  chainId: ChainId = ChainId.MAINNET,
  variables: {} = undefined
): Promise<TridentPool[]> => {
  const result: TridentPoolQueryResult = await fetcher(chainId, getTridentPoolsQuery, variables)
  return formatPools(result)
}
