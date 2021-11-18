import { PoolType } from '@sushiswap/tines'
import { ConstantProductPool, HybridPool, Pool } from '@sushiswap/trident-sdk'

export const poolEntityMapper = (poolClass: Pool): PoolType => {
  if (poolClass instanceof ConstantProductPool) return PoolType.ConstantProduct
  if (poolClass instanceof HybridPool) return PoolType.Hybrid
  throw new Error(`Pool class: ${poolClass} not mapped`)
}
