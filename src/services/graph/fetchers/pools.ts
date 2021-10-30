import { ChainId } from '@sushiswap/core-sdk'
import { PoolType } from 'features/trident/types'
import { GRAPH_HOST } from 'services/graph/constants'
import { getSwapsForPoolQuery, getTridentPoolsQuery } from 'services/graph/queries'

import { pager } from './pager'

const gqlPoolTypeMap: Record<string, PoolType> = {
  concentratedLiquidityPools: PoolType.ConcentratedLiquidity,
  constantProductPools: PoolType.ConstantProduct,
  hybridPools: PoolType.Hybrid,
  indexPools: PoolType.Weighted,
}

export type FeeTier = 1 | 0.3 | 0.05 | 0.01

export interface TridentPool {
  names: string[]
  symbols: string[]
  currencyIds: string[]
  type: PoolType
  totalValueLocked: string
  twapEnabled: boolean
  swapFeePercent: FeeTier
}

const formatPools = (pools: TridentPoolQueryResult): TridentPool[] =>
  Object.entries(pools)
    .filter(([, assets]) => assets.length)
    .flatMap(([poolType, poolList]: [string, PoolData[]]) =>
      poolList.map(({ assets, totalValueLockedUSD, twapEnabled, swapFee }) => ({
        currencyIds: assets.map((asset) => asset.id),
        symbols: assets.map((asset) => asset.metaData.symbol),
        type: gqlPoolTypeMap[poolType],
        totalValueLocked: totalValueLockedUSD,
        names: assets.map((asset) => asset.metaData.name),
        swapFeePercent: (parseInt(swapFee) / 100) as FeeTier,
        twapEnabled,
      }))
    )

interface PoolData {
  totalValueLockedUSD: string
  twapEnabled: boolean
  swapFee: string
  assets: {
    id: string
    metaData: {
      symbol: string
      name: string
    }
  }[]
}

interface TridentPoolQueryResult {
  concentratedLiquidityPools: PoolData[]
  constantProductPools: PoolData[]
  hybridPools: PoolData[]
  indexPools: PoolData[]
}

export const getTridentPools = async (chainId: ChainId = ChainId.ETHEREUM): Promise<TridentPool[]> => {
  const result: TridentPoolQueryResult = await pager(
    `${GRAPH_HOST[chainId]}/subgraphs/name/sushiswap/trident`,
    getTridentPoolsQuery
  )
  return formatPools(result)
}

export const getTridentPoolTransactions = async (poolAddress) => {
  return await pager('https://api.thegraph.com/subgraphs/name/sushiswap/trident', getSwapsForPoolQuery, {
    poolAddress: poolAddress.toLowerCase(),
  })
}
