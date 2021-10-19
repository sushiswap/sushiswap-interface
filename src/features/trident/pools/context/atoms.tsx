import { atom } from 'recoil'
import { PoolFilterType } from './types'
import { FeeFilterType } from '../../constants'
import { FeeTier } from '../../../../services/graph/fetchers/pools'
import { TableInstance } from '../../../transactions/types'

export const sortTypeAtom = atom<number>({
  key: 'sortTypeAtom',
  default: 0,
})

export const searchQueryAtom = atom<string>({
  key: 'searchQueryAtom',
  default: '',
})

export const poolTypesAtom = atom<PoolFilterType[]>({
  key: 'poolTypesAtom',
  default: [],
})

export const feeTiersAtom = atom<FeeFilterType[]>({
  key: 'feeTiersAtom',
  default: [],
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
