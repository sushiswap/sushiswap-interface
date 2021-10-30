import { ConstantProductPool, HybridPool } from '@sushiswap/trident-sdk'
import { ChipColor } from 'components/Chip'
import { ConstantProductPoolState } from 'hooks/useTridentClassicPools'
import { StablePoolState } from 'hooks/useTridentStablePools'

// TODO add last two pool types
export type PoolUnion = ConstantProductPool | HybridPool

export enum PoolType {
  Classic = 'Classic',
  Concentrated = 'Concentrated',
  Index = 'Index',
  Stable = 'Stable',
}

export const chipPoolColorMapper: Record<PoolType, ChipColor> = {
  [PoolType.Classic]: 'purple',
  [PoolType.Concentrated]: 'green',
  [PoolType.Index]: 'blue',
  [PoolType.Stable]: 'yellow',
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
