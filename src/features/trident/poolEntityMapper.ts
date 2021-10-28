import { ConstantProductPool, HybridPool, Pool } from '@sushiswap/trident-sdk'
import { PoolType } from './types'

export const poolEntityMapper = (poolClass: Pool): PoolType => {
  if (poolClass instanceof ConstantProductPool) return PoolType.Classic
  if (poolClass instanceof HybridPool) return PoolType.Stable
  throw new Error(`Pool class: ${poolClass} not mapped`)
}
