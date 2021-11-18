import { PoolType } from '@sushiswap/tines'
import Button from 'app/components/Button'
import Chip from 'app/components/Chip'
import { formatNumber, formatPercent } from 'app/functions/format'
import { getTridentPools } from 'app/services/graph/fetchers/pools'
import { useActiveWeb3React } from 'app/services/web3'
import React, { useMemo } from 'react'
import useSWR from 'swr'

import { chipPoolColorMapper, poolTypeNameMapper } from '../types'
import { PoolCell } from './PoolCell'
import { feeTiersFilter, filterForSearchQueryAndTWAP } from './poolTableFilters'

export const usePoolsTableData = () => {
  const { chainId } = useActiveWeb3React()
  const { data, error, isValidating } = useSWR(['getAllTridentPools', chainId], () => getTridentPools(chainId))

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
        Cell: (props: { value: PoolType }) => (
          <Chip label={poolTypeNameMapper[props.value]} color={chipPoolColorMapper[props.value]} />
        ),
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
        Cell: () => (
          /* Entire row is clickable, hence button does not need link */
          <Button color="gradient" variant="outlined" className="text-sm font-bold text-white h-8">
            Invest
          </Button>
        ),
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
