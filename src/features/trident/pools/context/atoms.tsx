import { atom } from 'recoil'
import { PoolFilterType } from './types'
import { FeeFilterType } from '../../constants'

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
