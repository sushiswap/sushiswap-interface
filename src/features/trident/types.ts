import { ConstantProductPool, HybridPool, PoolType } from '@sushiswap/trident-sdk'
import { ChipColor } from 'app/components/Chip'
import { ConstantProductPoolState } from 'app/hooks/useTridentClassicPools'
import { StablePoolState } from 'app/hooks/useTridentStablePools'

// TODO add last two pool types
export type PoolUnion = ConstantProductPool | HybridPool

export const poolTypeNameMapper: Record<AllPoolType, string> = {
  ConstantProduct: 'Classic',
  ConcentratedLiquidity: 'Concentrated',
  Hybrid: 'Stable',
  Weighted: 'Index',
  Legacy: 'Legacy',
}

export const chipPoolColorMapper: Record<AllPoolType, ChipColor> = {
  ConstantProduct: 'purple',
  ConcentratedLiquidity: 'green',
  Hybrid: 'yellow',
  Weighted: 'blue',
  Legacy: 'purple',
}

export enum LiquidityMode {
  STANDARD = 'Standard Mode',
  ZAP = 'Zap Mode',
}

// TODO should be all
// TODO figure out if we need separate states for every pool type
export type PoolAtomType = {
  state?: ConstantProductPoolState | StablePoolState
  pool?: PoolUnion
}

export type LiquidityInput = {
  token: string
  native: boolean
  amount: string
}

export type LiquidityOutput = {
  token: string
  amount: string
}

export enum TypedField {
  A,
  B,
}

export enum ActiveModal {
  MENU = 'MENU',
  WALLET_MENU = 'WALLET_MENU',
  BENTOBOX_MENU = 'BENTOBOX_MENU',
  WITHDRAW = 'WITHDRAW',
  DEPOSIT = 'DEPOSIT',
}

enum LegacyPool {
  Legacy = 'Legacy',
}

// Not a nice solution, but TS doesn't support extending enums yet...
export const AllPoolType = { ...LegacyPool, ...PoolType }
export type AllPoolType = typeof AllPoolType[keyof typeof AllPoolType]

export const UsedPoolType = { ...LegacyPool, [PoolType['ConstantProduct']]: PoolType['ConstantProduct'] }
export type UsedPoolType = typeof UsedPoolType[keyof typeof UsedPoolType]
