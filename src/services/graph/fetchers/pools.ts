import { getTridentPoolsQuery } from '../queries'

import { ChainId } from '@sushiswap/core-sdk'
import { GRAPH_HOST } from '../constants'
import { PoolType } from '../../../features/trident/types'
import { pager } from './index'

const gqlPoolTypeMap: Record<string, PoolType> = {
  concentratedLiquidityPools: PoolType.ConcentratedLiquidity,
  constantProductPools: PoolType.ConstantProduct,
  hybridPools: PoolType.Hybrid,
  indexPools: PoolType.Weighted,
}

interface TridentPool {
  names: string[]
  symbols: string[]
  currencyIds: string[]
  type: PoolType
  totalValueLocked: string
}

const formatPools = (pools: TridentPoolQueryResult): TridentPool[] =>
  Object.entries(pools)
    .filter(([, assets]) => assets.length)
    .flatMap(([poolType, poolList]) =>
      poolList.map(
        ({ assets, totalValueLockedUSD }) =>
          ({
            currencyIds: assets.map((asset) => asset.id),
            symbols: assets.map((asset) => asset.symbol),
            type: gqlPoolTypeMap[poolType],
            totalValueLocked: totalValueLockedUSD,
            names: assets.map((asset) => asset.name),
          } as TridentPool)
      )
    )

interface PoolData {
  totalValueLockedUSD: string
  assets: {
    id: string
    symbol: string
    name: string
  }[]
}

interface TridentPoolQueryResult {
  concentratedLiquidityPools: PoolData[]
  constantProductPools: PoolData[]
  hybridPools: PoolData[]
  indexPools: PoolData[]
}

export const getTridentPools = async (chainId: ChainId = ChainId.MAINNET): Promise<TridentPool[]> => {
  const result: TridentPoolQueryResult = await pager(
    `${GRAPH_HOST[chainId]}/subgraphs/name/sushiswap/trident`,
    getTridentPoolsQuery
  )
  return formatPools(result)
}
