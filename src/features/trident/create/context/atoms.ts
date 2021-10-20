import { atom } from 'recoil'
import { PoolType } from '../../types'
import { FeeTier } from '../../../../services/graph/fetchers/pools'

export type CreatePoolStep = 1 | 2 | 3

export const currentStepAtom = atom<CreatePoolStep>({
  key: 'currentStepAtom',
  default: 1,
})

export const selectedPoolTypeAtom = atom<PoolType>({
  key: 'selectedPoolTypeAtom',
  default: PoolType.ConstantProduct,
})

export const selectedFeeTierAtom = atom<FeeTier | undefined>({
  key: 'selectedFeeTierAtom',
  default: undefined,
})

export const createAnOracleSelectionAtom = atom<boolean>({
  key: 'createAnOracleSelectionAtom',
  default: false,
})
