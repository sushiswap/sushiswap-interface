import { atom, selector } from 'recoil'
import { FeeTier } from '../../../../services/graph/fetchers/pools'
import { TableInstance } from '../../../transactions/types'

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

export const feeTiersFilterAtom = atom<FeeTier[]>({
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
