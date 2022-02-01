import { CurrencyLogo } from 'app/components/CurrencyLogo'
import Typography from 'app/components/Typography'
import { Assets } from 'app/features/trident/balances/AssetBalances/types'
import { currencyFormatter } from 'app/functions'
import { useUSDCPriceWithLoadingIndicator, useUSDCValueWithLoadingIndicator } from 'app/hooks/useUSDCPrice'
import React, { useMemo } from 'react'

export const useTableConfig = (assets?: Assets[], balancesLoading?: boolean) => {
  const AssetColumns = useMemo(
    () => [
      {
        id: 'asset',
        Header: 'Asset',
        accessor: 'asset',
        minWidth: 100,
        className: 'text-left',
        // @ts-ignore TYPE NEEDS FIXING
        Cell: (props) => {
          const { price, loading } = useUSDCPriceWithLoadingIndicator(
            balancesLoading ? undefined : props.cell.value.currency
          )

          if (loading || balancesLoading) {
            return (
              <div className="flex gap-2.5 items-center w-full h-10">
                <div className="bg-dark-800 rounded-full w-9 h-9 animate-pulse" />
                <div className="flex flex-col gap-1.5">
                  <div className="h-4 bg-dark-700 rounded animate-pulse w-[50px]" />
                  <div className="h-2 bg-dark-800 rounded animate-pulse w-[50px]" />
                </div>
              </div>
            )
          }

          return (
            <div className="flex gap-2.5 items-center h-10">
              <CurrencyLogo currency={props.cell.value.currency} className="!rounded-full" size={36} />
              <div className="flex flex-col">
                <Typography weight={700} className="text-left text-high-emphesis">
                  {props.cell.value.currency.symbol}
                </Typography>
                {price && (
                  <Typography weight={400} variant="sm" className="text-left text-low-emphesis">
                    {currencyFormatter.format(Number(price?.toFixed()))}
                  </Typography>
                )}
              </div>
            </div>
          )
        },
      },
      {
        id: 'value',
        Header: 'Value',
        accessor: 'asset',
        maxWidth: 100,
        className: 'text-right flex justify-end',
        // @ts-ignore TYPE NEEDS FIXING
        Cell: (props) => {
          const { value, loading } = useUSDCValueWithLoadingIndicator(balancesLoading ? undefined : props.cell.value)
          if (loading || balancesLoading) {
            return (
              <div className="flex gap-2.5 items-center justify-end w-full">
                <div className="flex flex-col gap-1.5">
                  <div className="h-4 bg-dark-700 rounded animate-pulse w-[50px]" />
                  <div className="h-2 bg-dark-800 rounded animate-pulse w-[50px]" />
                </div>
              </div>
            )
          }

          return (
            <div className="flex flex-col">
              <Typography weight={700} className="w-full text-right text-high-emphesis">
                {value ? `${currencyFormatter.format(Number(value.toExact()))}` : '-'}
              </Typography>
              <Typography weight={400} variant="sm" className="text-right text-low-emphesis">
                {props.cell.value.toSignificant(6)}
              </Typography>
            </div>
          )
        },
      },
    ],
    [balancesLoading]
  )

  const defaultColumn = React.useMemo(() => ({ minWidth: 0 }), [])

  return useMemo(
    () => ({
      config: {
        columns: AssetColumns,
        data: balancesLoading ? new Array(5).fill({ asset: undefined }) : assets,
        defaultColumn,
        initialState: {
          sortBy: [{ id: 'value', desc: true }],
        },
        manualPagination: true,
      },
    }),
    [AssetColumns, assets, balancesLoading, defaultColumn]
  )
}
