import { Fee } from '@sushiswap/trident-sdk'
import { TableInstance } from 'app/features/transactions/types'
import { atom, selector } from 'recoil'

export const searchQueryAtom = atom<string>({
  key: 'searchQueryAtom',
  default: '',
})

export const farmsOnlyAtom = atom<boolean>({
  key: 'farmsOnlyAtom',
  default: false,
})

export const showTWAPOnlyAtom = atom<boolean>({
  key: 'showTWAPOnlyAtom',
  default: false,
})

export const feeTiersFilterAtom = atom<Fee[]>({
  key: 'feeTiersFilterAtom',
  default: [],
})

export const sortTableFuncAtom = atom<TableInstance['toggleSortBy']>({
  key: 'sortTableFunc',
  default: () => undefined,
})

export const filterInUseSelector = selector<boolean>({
  key: 'filterInUse',
  get: ({ get }) => {
    const selectedFeeTiers = get(feeTiersFilterAtom)
    const twapOnlySelected = get(showTWAPOnlyAtom)
    const farmsOnlySelected = get(farmsOnlyAtom)
    return farmsOnlySelected || twapOnlySelected || selectedFeeTiers.length > 0
  },
})
