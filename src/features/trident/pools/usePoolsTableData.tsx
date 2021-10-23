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
import { useActiveWeb3React } from '../../../hooks'

export const usePoolsTableData = () => {
  const { chainId } = useActiveWeb3React()
  const { data, error, isValidating } = useSWR('getAllTridentPools', () => getTridentPools(chainId))

  const columns = useMemo(() => {
    return [
      {
        Header: 'Assets',
        accessor: 'assets',
        Cell: ({ value, row: { original } }) => {
          return <PoolCell assets={value} twapEnabled={original.twapEnabled} />
        },
        filter: filterForSearchQueryAndTWAP,
      },
      {
        Header: 'Pool Type',
        accessor: 'type',
        maxWidth: 100,
        Cell: (props: { value: PoolType }) => <Chip label={props.value} color={chipPoolColorMapper[props.value]} />,
        filter: (rows, id, filterValue) =>
          rows.filter((row) => !filterValue.length || filterValue.includes(row.values.type)),
      },
      {
        Header: 'Fee Tier',
        accessor: 'swapFeePercent',
        maxWidth: 100,
        Cell: (props) => <span>{props.value}%</span>,
        filter: feeTiersFilter,
      },
      {
        Header: 'TVL',
        accessor: 'totalValueLockedUSD',
        maxWidth: 100,
        Cell: (props) => <span>{formatNumber(props.value, true)}</span>,
      },
      {
        Header: 'APY',
        accessor: 'apy',
        maxWidth: 100,
        Cell: (props) => <span>{formatPercent(props.value)}</span>,
      },
      {
        Header: 'Actions',
        accessor: 'actions',
        maxWidth: 100,
        Cell: ({ row: { original } }) => {
          const poolPath = `/trident/pool/${original.type.toLowerCase()}/${original.assets
            .map((asset) => asset.id)
            .join('/')}`

          return (
            <Link href={poolPath} passHref>
              {/* DIV needed for forwardRef issue */}
              <div>
                <Button color="gradient" variant="outlined" className="h-8 text-sm font-bold text-white">
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
