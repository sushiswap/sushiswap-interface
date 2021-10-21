import { atom } from 'recoil'
import { PoolType } from '../../types'

export type CreatePoolStep = 1 | 2 | 3

export const currentStepAtom = atom<CreatePoolStep>({
  key: 'currentStepAtom',
  default: 1,
})

export const selectedPoolTypeAtom = atom<PoolType>({
  key: 'selectedPoolTypeAtom',
  default: PoolType.ConstantProduct,
})

// TODO: Should import Fee enum from @sushiswap/trident-sdk when enums are updated
export const selectedFeeTierAtom = atom<10 | 30 | 50 | 100 | undefined>({
  key: 'selectedFeeTierAtom',
  default: undefined,
})

export const createAnOracleSelectionAtom = atom<boolean>({
  key: 'createAnOracleSelectionAtom',
  default: false,
})

// TODO: Unused in new flow. Is this needed or reduntant to createAnOracleSelectionAtom?
export const twapAtom = atom<boolean>({
  key: 'twapAtom',
  default: true,
})
