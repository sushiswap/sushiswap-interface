import { ConstantProductPoolState } from '../../hooks/useTridentClassicPools'
import { ConstantProductPool, HybridPool } from '@sushiswap/trident-sdk'
import { HybridPoolState } from '../../hooks/useTridentHybridPools'
import { ChipColor } from '../../components/Chip'

// TODO add last two pool types
export type PoolUnion = ConstantProductPool | HybridPool

export enum PoolType {
  ConstantProduct = 'Classic',
  ConcentratedLiquidity = 'Concentrated',
  Weighted = 'Index',
  Hybrid = 'Stable',
}

export const chipPoolColorMapper: Record<PoolType, ChipColor> = {
  [PoolType.ConstantProduct]: 'purple',
  [PoolType.ConcentratedLiquidity]: 'green',
  [PoolType.Weighted]: 'blue',
  [PoolType.Hybrid]: 'yellow',
}

export enum LiquidityMode {
  STANDARD = 'Standard Mode',
  ZAP = 'Zap Mode',
}

// TODO should be all
export type PoolAtomType = [ConstantProductPoolState | HybridPoolState, PoolUnion | null]

export type LiquidityInput = {
  token: string
  native: boolean
  amount: string
}

export type LiquidityOutput = {
  token: string
  amount: string
}
