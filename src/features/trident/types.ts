import { ConstantProductPool, HybridPool } from '@sushiswap/trident-sdk'
import { ChipColor } from 'app/components/Chip'
import { ConstantProductPoolState } from 'app/hooks/useTridentClassicPools'
import { StablePoolState } from 'app/hooks/useTridentStablePools'
import { PoolType } from '@sushiswap/tines'

// TODO add last two pool types
export type PoolUnion = ConstantProductPool | HybridPool

export const poolTypeNameMapper: Record<PoolType, string> = {
  ConstantProduct: 'Classic',
  ConcentratedLiquidity: 'Concentrated',
  Hybrid: 'Stable',
  Weighted: 'Index',
}

export const chipPoolColorMapper: Record<PoolType, ChipColor> = {
  ConstantProduct: 'purple',
  ConcentratedLiquidity: 'green',
  Hybrid: 'yellow',
  Weighted: 'blue',
}

export enum LiquidityMode {
  STANDARD = 'Standard Mode',
  ZAP = 'Zap Mode',
}

// TODO should be all
export type PoolAtomType = [ConstantProductPoolState | StablePoolState, PoolUnion | null]

export type LiquidityInput = {
  token: string
  native: boolean
  amount: string
}

export type LiquidityOutput = {
  token: string
  amount: string
}
