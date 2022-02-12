import { PoolType } from '@sushiswap/tines'
import Button from 'app/components/Button'
import Chip from 'app/components/Chip'
import Typography from 'app/components/Typography'
import { PoolCell } from 'app/features/trident/pools/PoolCell'
import { feeTiersFilter, filterForSearchQueryAndTWAP } from 'app/features/trident/pools/poolTableFilters'
import { chipPoolColorMapper, poolTypeNameMapper } from 'app/features/trident/types'
import { formatPercent } from 'app/functions'
import { TridentPositionRow } from 'app/services/graph'
import { useRollingPoolStats } from 'app/services/graph/hooks/pools'
import { useActiveWeb3React } from 'app/services/web3'
import Link from 'next/link'
import React, { useMemo } from 'react'

export const useLPTableConfig = (positions?: TridentPositionRow[]) => {
  const { chainId } = useActiveWeb3React()

  const AssetColumns = useMemo(
    () =>
      chainId
        ? [
            {
              Header: 'Assets',
              accessor: 'assets',
              className: 'text-left',
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
              className: 'text-left hidden lg:flex',
              Cell: (props: { value: PoolType }) => {
                return <Chip label={poolTypeNameMapper[props.value]} color={chipPoolColorMapper[props.value]} />
              },
              // @ts-ignore TYPE NEEDS FIXING
              filter: (rows, id, filterValue) =>
                // @ts-ignore TYPE NEEDS FIXING
                rows.filter((row) => !filterValue.length || filterValue.includes(row.values.type)),
            },
            {
              Header: 'Fee Tier',
              accessor: 'swapFeePercent',
              maxWidth: 100,
              className: 'text-left hidden lg:flex',
              // @ts-ignore TYPE NEEDS FIXING
              Cell: (props) => <span>{props.value}%</span>,
              filter: feeTiersFilter,
            },
            {
              id: 'value',
              Header: 'Value',
              accessor: 'value',
              maxWidth: 100,
              className: 'text-right flex justify-end',
              // @ts-ignore TYPE NEEDS FIXING
              Cell: (props) => {
                return (
                  <Typography weight={700} className="text-high-emphesis text-right w-full">
                    ${props.value.toFixed(2)}
                  </Typography>
                )
              },
            },
            {
              Header: 'APY',
              accessor: 'apy',
              maxWidth: 100,
              className: 'text-right flex justify-end',
              // @ts-ignore TYPE NEEDS FIXING
              Cell: ({ row }) => {
                const { data: stats } = useRollingPoolStats({
                  chainId,
                  variables: { where: { id_in: positions?.map((el) => el.id.toLowerCase()) } },
                  shouldFetch: !!chainId && !!positions,
                })

                return (
                  <Typography weight={700} className="text-high-emphesis text-right w-full">
                    {formatPercent(stats?.[row.id]?.apy)}
                  </Typography>
                )
              },
            },
            {
              id: 'actions',
              Header: 'Actions',
              accessor: 'type',
              maxWidth: 100,
              className: 'text-right flex justify-end',
              cellClassName: 'justify-end',
              // @ts-ignore TYPE NEEDS FIXING
              Cell: ({ row: { original } }) => {
                return (
                  <Link
                    href={{
                      pathname: `/trident/pool`,
                      query: {
                        // @ts-ignore TYPE NEEDS FIXING
                        tokens: original.assets.map((el) => el.address),
                        fee: original.swapFeePercent * 100,
                        twap: original.twapEnabled,
                      },
                    }}
                    passHref={true}
                  >
                    <Button color="blue" size="sm" variant="empty">
                      Manage
                    </Button>
                  </Link>
                )
              },
            },
          ]
        : [],
    [chainId]
  )

  const defaultColumn = React.useMemo(() => ({ minWidth: 0 }), [])

  return useMemo(
    () => ({
      config: {
        columns: AssetColumns,
        data: positions || [],
        defaultColumn,
        initialState: {
          pageSize: 15,
          sortBy: [{ id: 'value', desc: true }],
        },
        autoResetFilters: false,
      },
    }),
    [AssetColumns, defaultColumn, positions]
  )
}
