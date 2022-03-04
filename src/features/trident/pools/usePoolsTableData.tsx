import { PoolType } from '@sushiswap/tines'
import Button from 'app/components/Button'
import Chip from 'app/components/Chip'
import { formatNumber, formatPercent } from 'app/functions/format'
import { TridentPool } from 'app/services/graph/fetchers/pools'
import { useGetAllTridentPools } from 'app/services/graph/hooks/pools'
import { useRollingPoolStats } from 'app/services/graph/hooks/pools'
import { useActiveWeb3React } from 'app/services/web3'
import React, { ReactNode, useMemo } from 'react'

import { chipPoolColorMapper, poolTypeNameMapper } from '../types'
import { PoolCell } from './PoolCell'
import { feeTiersFilter, filterForSearchQueryAndTWAP } from './poolTableFilters'

export interface DiscoverPoolsTableColumn {
  Header: string
  accessor: keyof TridentPool | 'actions'
  Cell: ReactNode
  filter?: any
  maxWidth?: number
}

export const usePoolsTableData = () => {
  const { chainId } = useActiveWeb3React()
  const { data, error, isValidating } = useGetAllTridentPools()

  const columns: DiscoverPoolsTableColumn[] = useMemo(() => {
    return [
      {
        Header: 'Assets',
        accessor: 'assets',
        // @ts-ignore TYPE NEEDS FIXING
        Cell: ({ value, row: { original } }) => {
          return <PoolCell assets={value} twapEnabled={original.twapEnabled} />
        },
        filter: filterForSearchQueryAndTWAP,
      },
      {
        Header: 'Pool Type',
        accessor: 'type',
        maxWidth: 100,
        Cell: (props: { value: PoolType }) => (
          <Chip label={poolTypeNameMapper[props.value]} color={chipPoolColorMapper[props.value]} />
        ),
        // @ts-ignore TYPE NEEDS FIXING
        filter: (rows, id, filterValue) =>
          // @ts-ignore TYPE NEEDS FIXING
          rows.filter((row) => !filterValue.length || filterValue.includes(row.values.type)),
      },
      {
        Header: 'Fee Tier',
        accessor: 'swapFee',
        maxWidth: 100,
        // @ts-ignore TYPE NEEDS FIXING
        Cell: (props) => <span>{props.value / 100}%</span>,
        filter: feeTiersFilter,
      },
      {
        Header: 'TVL',
        accessor: 'liquidityUSD',
        maxWidth: 100,
        // @ts-ignore TYPE NEEDS FIXING
        Cell: (props) => <span>{formatNumber(props.value, true)}</span>,
      },
      {
        Header: 'APY',
        accessor: 'apy',
        maxWidth: 100,
        // @ts-ignore TYPE NEEDS FIXING
        Cell: ({ row }) => {
          const { data: stats } = useRollingPoolStats({
            chainId,
            variables: { where: { id_in: data?.map((el) => el.address.toLowerCase()) } },
            shouldFetch: !!chainId && !!data,
          })

          return <span>{formatPercent(stats?.[row.id]?.apy)}</span>
        },
      },
      {
        Header: 'Actions',
        accessor: 'actions',
        maxWidth: 100,
        Cell: () => (
          /* Entire row is clickable, hence button does not need link */
          <Button color="blue" size="sm" variant="empty">
            Invest
          </Button>
        ),
      },
    ]
  }, [chainId, data])

  return useMemo(
    () => ({
      config: {
        columns: columns,
        data: data ?? [],
        initialState: {
          pageSize: 15,
          sortBy: [{ id: 'liquidityUSD' as DiscoverPoolsTableColumn['accessor'], desc: true }],
        },
        autoResetFilters: false,
      },
      loading: isValidating,
      error,
    }),
    [columns, data, error, isValidating]
  )
}
