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
  [PoolType.Weighted]: 'Weighted',
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
        filter: (rows, id, filterValue) => {
          return rows.filter((row) => {
            // Allow searching for symbol (LINK) or name (chainlink)
            const searchableText = row.values.symbols.concat(row.original.names).join(' ').toLowerCase()
            return !filterValue.length || searchableText.includes(filterValue.toLowerCase())
          })
        },
      },
      {
        Header: 'Type',
        accessor: 'type',
        Cell: (props: { value: PoolType }) => poolTypeToStr[props.value],
        filter: (rows, id, filterValue) =>
          rows.filter((row) => !filterValue.length || filterValue.includes(poolTypeToStr[row.values.type])),
      },
      {
        Header: 'Fee',
        accessor: 'swapFeePercent',
        Cell: (props) => <span>{props.value}%</span>,
      },
      {
        Header: 'Twap',
        accessor: 'twapEnabled',
        Cell(props) {
          if (props.value) return <span>yes</span>
          return <span>no</span>
        },
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
        initialState: { pageSize: 15 },
        autoResetFilters: false,
      },
      loading: isValidating,
      error,
    }),
    [columns, data, error, isValidating]
  )
}
