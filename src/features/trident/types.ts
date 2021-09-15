import { ConstantProductPoolState } from '../../hooks/useTridentClassicPools'
import { ConstantProductPool } from '../../../../sushiswap-sdk'

export enum LiquidityMode {
  STANDARD = 'Standard Mode',
  ZAP = 'Zap Mode',
}

// TODO should be all
export type PoolAtomType = [ConstantProductPoolState, ConstantProductPool | null]
