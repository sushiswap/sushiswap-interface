import { PoolType } from '@sushiswap/tines'
import Button from 'app/components/Button'
import Chip from 'app/components/Chip'
import Typography from 'app/components/Typography'
import { PoolCell } from 'app/features/trident/pools/PoolCell'
import { feeTiersFilter, filterForSearchQueryAndTWAP } from 'app/features/trident/pools/poolTableFilters'
import { chipPoolColorMapper, poolTypeNameMapper } from 'app/features/trident/types'
import { formatPercent, formatPoolLink } from 'app/functions'
import { TridentPositionRow } from 'app/services/graph'
import { useActiveWeb3React } from 'app/services/web3'
import Link from 'next/link'
import React, { useCallback, useMemo } from 'react'

export const useLPTableConfig = (positions?: TridentPositionRow[]) => {
  const { chainId } = useActiveWeb3React()

  const poolSlug = useCallback((poolType) => {
    switch (poolType) {
      case PoolType.ConstantProduct:
        return 'classic'
      case PoolType.Hybrid:
        return 'hybrid'
      case PoolType.ConcentratedLiquidity:
        return 'concentrated'
      case PoolType.Weighted:
        return 'weighted'
    }
  }, [])

  const AssetColumns = useMemo(
    () =>
      chainId
        ? [
            {
              Header: 'Assets',
              accessor: 'assets',
              className: 'text-left',
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
              filter: (rows, id, filterValue) =>
                rows.filter((row) => !filterValue.length || filterValue.includes(row.values.type)),
            },
            {
              Header: 'Fee Tier',
              accessor: 'swapFeePercent',
              maxWidth: 100,
              className: 'text-left hidden lg:flex',
              Cell: (props) => <span>{props.value}%</span>,
              filter: feeTiersFilter,
            },
            {
              id: 'value',
              Header: 'Value',
              accessor: 'value',
              maxWidth: 200,
              className: 'text-right flex justify-end',
              Cell: (props) => {
                return (
                  <Typography weight={700} className="text-high-emphesis text-right w-full">
                    ${props.value}
                  </Typography>
                )
              },
            },
            {
              Header: 'APY',
              accessor: 'apy',
              maxWidth: 100,
              className: 'text-right flex justify-end',
              Cell: (props) => (
                <Typography weight={700} className="text-high-emphesis text-right w-full">
                  {formatPercent(props.value)}
                </Typography>
              ),
            },
            {
              id: 'actions',
              Header: 'Actions',
              accessor: 'type',
              maxWidth: 100,
              className: 'text-right flex justify-end',
              cellClassName: 'justify-end',
              Cell: ({ value, row: { original } }) => {
                return (
                  <Link
                    href={`/trident/pool/${poolSlug(value)}?${formatPoolLink(
                      original.assets,
                      original.swapFeePercent * 100,
                      original.twapEnabled
                    )}`}
                    passHref={true}
                  >
                    <Button color="gradient" variant="outlined" className="text-sm font-bold text-white h-8">
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
