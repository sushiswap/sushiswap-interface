import { TableInstance } from 'app/features/transactions/types'
import { useMemo } from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'

import { feeTiersFilterAtom, searchQueryAtom, showTWAPOnlyAtom, sortTableFuncAtom } from './context/atoms'

const useInstantiateFilters = (setFilter: TableInstance['setFilter']) => {
  const searchQuery = useRecoilValue(searchQueryAtom)
  const twapEnabled = useRecoilValue(showTWAPOnlyAtom)
  useMemo(() => setFilter('assets', { searchQuery, twapEnabled }), [searchQuery, setFilter, twapEnabled])

  const feeTiersSelected = useRecoilValue(feeTiersFilterAtom)
  useMemo(() => setFilter('swapFee', { feeTiersSelected }), [feeTiersSelected, setFilter])
}

export const useInstantiateSorting = (toggleSortBy: TableInstance['toggleSortBy']) => {
  /* Gives sort dropdown access to sort table */
  const setSortFuncAtom = useSetRecoilState(sortTableFuncAtom)
  useMemo(() => {
    setSortFuncAtom(() => toggleSortBy)
  }, [setSortFuncAtom, toggleSortBy])
}

export const useInstantiateTableFeatures = (
  setFilter: TableInstance['setFilter'],
  toggleSortBy: TableInstance['toggleSortBy']
) => {
  useInstantiateFilters(setFilter)
  useInstantiateSorting(toggleSortBy)
}
