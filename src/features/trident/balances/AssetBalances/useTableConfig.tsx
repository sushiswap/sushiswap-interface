import { CurrencyLogo } from 'app/components/CurrencyLogo'
import Typography from 'app/components/Typography'
import { Assets } from 'app/features/trident/balances/AssetBalances/types'
import { currencyFormatter } from 'app/functions'
import useDesktopMediaQuery from 'app/hooks/useDesktopMediaQuery'
import { useUSDCValue } from 'app/hooks/useUSDCPrice'
import React, { useMemo } from 'react'

export const useTableConfig = (assets?: Assets[]) => {
  const isDesktop = useDesktopMediaQuery()
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
          return (
            <div className="flex gap-2.5 items-center">
              <CurrencyLogo currency={props.cell.value.currency} className="!rounded-full" size={28} />
              <Typography
                weight={isDesktop ? 400 : 700}
                variant={isDesktop ? 'sm' : 'base'}
                className="text-left text-high-emphesis"
              >
                {props.cell.value.currency.symbol}
              </Typography>
            </div>
          )
        },
      },
      {
        id: 'balance',
        Header: 'Balance',
        accessor: 'asset',
        maxWidth: 100,
        className: 'text-left',
        // @ts-ignore TYPE NEEDS FIXING
        Cell: (props) => {
          return (
            <Typography
              weight={isDesktop ? 400 : 700}
              variant={isDesktop ? 'sm' : 'base'}
              className="text-left text-high-emphesis"
            >
              {props.cell.value.toSignificant(6)}
            </Typography>
          )
        },
        cellClassName: '',
      },
      {
        id: 'value',
        Header: 'Value',
        accessor: 'asset',
        maxWidth: 100,
        className: 'text-right flex justify-end',
        // @ts-ignore TYPE NEEDS FIXING
        Cell: (props) => {
          const usdcValue = useUSDCValue(props.cell.value)
          return (
            <Typography
              weight={700}
              variant={isDesktop ? 'sm' : 'base'}
              className="w-full text-right text-high-emphesis"
            >
              {usdcValue ? `${currencyFormatter.format(Number(usdcValue.toExact()))}` : '-'}
            </Typography>
          )
        },
      },
    ],
    [isDesktop]
  )

  const defaultColumn = React.useMemo(() => ({ minWidth: 0 }), [])

  return useMemo(
    () => ({
      config: {
        columns: AssetColumns,
        data: assets,
        defaultColumn,
        initialState: {
          sortBy: [{ id: 'value', desc: true }],
        },
        manualPagination: true,
      },
    }),
    [AssetColumns, assets, defaultColumn]
  )
}
