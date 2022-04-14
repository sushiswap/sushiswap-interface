import Chip from 'app/components/Chip'
import Typography from 'app/components/Typography'
import { formatNumber, formatPercent } from 'app/functions/format'
import { TridentPool } from 'app/services/graph/fetchers/pools'
import { useRollingPoolStats } from 'app/services/graph/hooks/pools'
import { useActiveWeb3React } from 'app/services/web3'
import React, { ReactNode, useMemo } from 'react'
import { UseFiltersOptions, UsePaginationOptions, UseSortByOptions, UseTableOptions } from 'react-table'

import { AllPoolType, chipPoolColorMapper, poolTypeNameMapper } from '../types'
import { PoolCell } from './PoolCell'
import { feeTiersFilter, filterForSearchQueryAndTWAP, poolTypesFilter } from './poolTableFilters'
import useAllPools from './useAllPools'

export interface DiscoverPoolsTableColumn {
  Header: string
  accessor: keyof TridentPool | 'actions'
  Cell: ReactNode
  filter?: any
  maxWidth?: number
}

type usePoolsTableData = () => {
  config: UseTableOptions<TridentPool> & UsePaginationOptions<any> & UseFiltersOptions<any> & UseSortByOptions<any>
  loading: boolean
  error: any
}

export const usePoolsTableData: usePoolsTableData = () => {
  const { chainId } = useActiveWeb3React()
  const { data, error, isValidating, isDataChanged } = useAllPools({ chainId })

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
        Cell: (props: { value: AllPoolType }) => (
          <Chip label={poolTypeNameMapper[props.value]} color={chipPoolColorMapper[props.value]} />
        ),
        // @ts-ignore TYPE NEEDS FIXING
        filter: poolTypesFilter,
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
        Header: 'Volume',
        accessor: 'volumeUSD',
        maxWidth: 100,
        // @ts-ignore TYPE NEEDS FIXING
        Cell: (props) => <span>{formatNumber(props.value, true)}</span>,
      },
      {
        Header: 'APY',
        accessor: 'apy',
        maxWidth: 100,
        // @ts-ignore TYPE NEEDS FIXING
        Cell: ({ row, value }) => {
          const { data: stats } = useRollingPoolStats({
            chainId,
            variables: {
              where: {
                id_in: data?.filter((el) => el.type !== AllPoolType.Legacy)?.map((el) => el.address.toLowerCase()),
              },
            },
            shouldFetch: !!chainId && !!data,
          })

          const apy = row.original.type === AllPoolType.Legacy ? value : stats?.[row.id]?.apy

          return (
            <Typography weight={700} className="w-full text-right text-high-emphesis">
              {formatPercent(apy)}
            </Typography>
          )
        },
      },
      // {
      //   Header: 'Actions',
      //   accessor: 'actions',
      //   maxWidth: 100,
      //   Cell: () => (
      //     /* Entire row is clickable, hence button does not need link */
      //     <Button color="blue" size="sm" variant="empty">
      //       Invest
      //     </Button>
      //   ),
      // },
    ]
  }, [chainId, data])

  return useMemo(
    () => ({
      config: {
        columns: columns as any,
        data: data ? data : [],
        initialState: {
          pageSize: 15,
          sortBy: [
            { id: 'liquidityUSD', desc: true },
            { id: 'volumeUSD', desc: true },
          ] as { id: DiscoverPoolsTableColumn['accessor']; desc: boolean }[],
        },
        getRowId: (original) => original.address,
        autoResetFilters: false,
        autoResetPage: !isDataChanged,
        autoResetSortBy: false,
      },
      loading: isValidating,
      error,
    }),
    [columns, data, error, isDataChanged, isValidating]
  )
}
