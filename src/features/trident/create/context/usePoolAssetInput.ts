import { Currency } from '@sushiswap/core-sdk'
import { useSetPoolAssetErrorState } from 'app/features/trident/create/context/useSetPoolAssetErrorState'
import { useMemo } from 'react'
import { atomFamily, useRecoilCallback, useRecoilState } from 'recoil'

import { SelectedAsset, SpendSource } from './SelectedAsset'

type IndexOfSelectedAsset = number

export const selectedAssetAtomFamily = atomFamily<SelectedAsset, IndexOfSelectedAsset>({
  key: 'selectedAssetAtom',
  default: new SelectedAsset({}),
})

export const usePoolAssetInput = (index: number) => {
  const [asset, setAsset] = useRecoilState(selectedAssetAtomFamily(index))

  useSetPoolAssetErrorState(asset, setAsset)

  const setCurrency = useRecoilCallback(
    ({ snapshot, set }) =>
      async (currency: Currency) => {
        const asset = await snapshot.getPromise(selectedAssetAtomFamily(index))
        set(selectedAssetAtomFamily(index), new SelectedAsset({ ...asset, currency }))
      },
    [index]
  )

  const setAmount = useRecoilCallback(
    ({ snapshot, set }) =>
      async (amount: string) => {
        const asset = await snapshot.getPromise(selectedAssetAtomFamily(index))
        set(selectedAssetAtomFamily(index), new SelectedAsset({ ...asset, amount, amountInteractedWith: true }))
      },
    [index]
  )

  const setWalletSource = useRecoilCallback(
    ({ snapshot, set }) =>
      async (spendFromSource: SpendSource) => {
        const asset = await snapshot.getPromise(selectedAssetAtomFamily(index))
        set(selectedAssetAtomFamily(index), new SelectedAsset({ ...asset, spendFromSource }))
      },
    [index]
  )

  return useMemo(
    () => ({
      asset,
      setCurrency,
      setAmount,
      setWalletSource,
    }),
    [asset, setCurrency, setAmount, setWalletSource]
  )
}
