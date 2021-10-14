import React, { useMemo } from 'react'
import { useRecoilValue } from 'recoil'
import { poolTypesAtom, searchQueryAtom } from './context/atoms'
import { PoolFilterType } from './context/types'
import { TableInstance } from '../../transactions/types'

export const useInstantiateFilters = (setFilter: TableInstance['setFilter']) => {
  /* Search Box */
  const searchQuery = useRecoilValue(searchQueryAtom)
  useMemo(() => setFilter('symbols', searchQuery), [searchQuery, setFilter])

  /* Pool filter toggles */
  const poolTypes: PoolFilterType[] = useRecoilValue(poolTypesAtom)
  useMemo(
    () =>
      setFilter(
        'type',
        poolTypes.map((type) => type.label)
      ),
    [poolTypes, setFilter]
  )
}
