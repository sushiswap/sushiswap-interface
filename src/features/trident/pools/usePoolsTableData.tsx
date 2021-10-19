import React, { useMemo } from 'react'
import useSWR from 'swr'
import { getTridentPools } from '../../../services/graph/fetchers/pools'
import { formatNumber, formatPercent } from '../../../functions'
import { PoolCell } from './PoolCell'
import { chipPoolColorMapper, PoolType } from '../types'
import Chip from '../../../components/Chip'
import Button from '../../../components/Button'
import Link from 'next/link'
import { feeTiersFilter, filterForSearchQueryAndTWAP } from './poolTableFilters'

export const usePoolsTableData = () => {
  const { data, error, isValidating } = useSWR('getAllTridentPools', () => getTridentPools())

  const columns = useMemo(() => {
    return [
      {
        Header: 'Assets',
        accessor: 'symbols',
        minWidth: 200,
        Cell: ({ value, row: { original } }) => {
          return <PoolCell symbols={value} currencyIds={original.currencyIds} twapEnabled={original.twapEnabled} />
        },
        filter: filterForSearchQueryAndTWAP,
      },
      {
        Header: 'Pool Type',
        accessor: 'type',
        Cell: (props: { value: PoolType }) => <Chip label={props.value} color={chipPoolColorMapper[props.value]} />,
        filter: (rows, id, filterValue) =>
          rows.filter((row) => !filterValue.length || filterValue.includes(row.values.type)),
      },
      {
        Header: 'Fee Tier',
        accessor: 'swapFeePercent',
        Cell: (props) => <span>{props.value}%</span>,
        filter: feeTiersFilter,
      },
      {
        Header: 'TVL',
        accessor: 'totalValueLocked',
        Cell: (props) => <span>{formatNumber(props.value, true)}</span>,
      },
      {
        Header: 'APY',
        accessor: 'apy',
        Cell: (props) => <span>{formatPercent(props.value)}</span>,
      },
      {
        Header: 'Actions',
        accessor: 'actions',
        Cell: ({ row: { original } }) => {
          const poolPath = `/trident/pool/${original.type.toLowerCase()}/${original.currencyIds.join('/')}`

          return (
            <Link href={poolPath} passHref>
              {/* DIV needed for forwardRef issue */}
              <div>
                <Button color="gradient" variant="outlined" className="text-sm font-bold text-white h-8">
                  Invest
                </Button>
              </div>
            </Link>
          )
        },
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
