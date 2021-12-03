import { Currency, CurrencyAmount } from '@sushiswap/core-sdk'
import { PoolType } from '@sushiswap/tines'
import { Fee } from '@sushiswap/trident-sdk'
import { SelectedAsset } from 'app/features/trident/create/context/SelectedAsset'
import { atom, atomFamily, selector } from 'recoil'

export type CreatePoolStep = 1 | 2

export const currentStepAtom = atom<CreatePoolStep>({
  key: 'currentStepAtom',
  default: 1,
})

export const selectedPoolTypeAtom = atom<PoolType>({
  key: 'selectedPoolTypeAtom',
  default: PoolType.ConstantProduct,
})

export const selectedFeeTierAtom = atom<Fee | undefined>({
  key: 'selectedFeeTierAtom',
  default: undefined,
})

export const createAnOracleSelectionAtom = atom<boolean>({
  key: 'createAnOracleSelectionAtom',
  default: false,
})

type IndexOfSelectedAsset = number

export const selectedAssetAtomFamily = atomFamily<SelectedAsset, IndexOfSelectedAsset>({
  key: 'selectedAssetAtom',
  default: new SelectedAsset({}),
})

export const getAllSelectedAssetsSelector = selector<SelectedAsset[]>({
  key: 'getAllSelectedAssetsSelector',
  get: ({ get }) => {
    // Will need to generalize for multiple assets in the future
    return [get(selectedAssetAtomFamily(0)), get(selectedAssetAtomFamily(1))]
  },
})

export const getAllParsedAmountsSelector = selector<(CurrencyAmount<Currency> | undefined)[]>({
  key: 'getAllParsedAmountsSelector',
  get: ({ get }) => get(getAllSelectedAssetsSelector).map((asset) => asset.parsedAmount),
})
