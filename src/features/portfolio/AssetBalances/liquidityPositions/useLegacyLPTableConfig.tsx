import { Token } from '@sushiswap/core-sdk'
import Button from 'app/components/Button'
import Chip from 'app/components/Chip'
import Typography from 'app/components/Typography'
import { PoolCell } from 'app/features/trident/pools/PoolCell'
import { useActiveWeb3React } from 'app/services/web3'
import Link from 'next/link'
import React, { useMemo } from 'react'

interface LegacyPosition {
  id: string
  assets: Token[]
  value: number
  apy: number
}

export const useLegacyLPTableConfig = (positions?: LegacyPosition[]) => {
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
              Cell: ({ value }) => {
                return <PoolCell assets={value} twapEnabled={false} />
              },
            },
            {
              Header: 'Pool Type',
              accessor: 'type',
              maxWidth: 100,
              className: 'text-left hidden lg:flex',
              Cell: () => {
                return <Chip label="Classic" color="purple" />
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
              Cell: () => <span>0.3%</span>,
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
                  <Typography weight={700} className="w-full text-right text-high-emphesis">
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
              Cell: ({ value }) => {
                return (
                  <Typography weight={700} className="w-full text-right text-high-emphesis">
                    {value}
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
                      pathname: `/add`,
                      query: {
                        // @ts-ignore TYPE NEEDS FIXING
                        tokens: original.assets.map((el) => el.address),
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
