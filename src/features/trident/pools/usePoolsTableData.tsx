import React, { useMemo } from 'react'
import useSWR from 'swr'
import { getTridentPools } from '../../../services/graph/fetchers/pools'
import { formatNumber } from '../../../functions'
import { PoolType } from '../types'
import { PoolCell } from './PoolCell'

export const poolTypeToStr: Record<PoolType, string> = {
  [PoolType.ConstantProduct]: 'Classic',
  [PoolType.ConcentratedLiquidity]: 'Concentrated',
  [PoolType.Hybrid]: 'Hybrid',
  [PoolType.Weighted]: 'Index',
}

export const usePoolsTableData = () => {
  const { data, error, isValidating } = useSWR('getAllTridentPools', () => getTridentPools())

  const columns = useMemo(() => {
    return [
      {
        Header: 'Pool',
        accessor: 'symbols',
        Cell: (props) => {
          return <PoolCell symbols={props.value} currencyIds={props.row.original.currencyIds} />
        },
      },
      {
        Header: 'Type',
        accessor: 'type',
        Cell: (props: { value: PoolType }) => poolTypeToStr[props.value],
      },
      {
        Header: 'TVL',
        accessor: 'totalValueLocked',
        Cell: (props) => <span>{formatNumber(props.value, true)}</span>,
      },
    ]
  }, [])

  return useMemo(
    () => ({
      config: {
        columns: columns,
        data: data ?? [],
      },
      loading: isValidating,
      error,
    }),
    [columns, data, error, isValidating]
  )
}
