import { CurrencyLogo } from 'app/components/CurrencyLogo'
import Typography from 'app/components/Typography'
import { Assets } from 'app/features/trident/balances/AssetBalances/types'
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
        Cell: (props) => {
          return (
            <div className="flex gap-2.5 items-center">
              <CurrencyLogo currency={props.cell.value.currency} className="!rounded-full" size={28} />
              <Typography
                weight={isDesktop ? 400 : 700}
                variant={isDesktop ? 'sm' : 'base'}
                className="text-high-emphesis text-left"
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
        Cell: (props) => {
          return (
            <Typography
              weight={isDesktop ? 400 : 700}
              variant={isDesktop ? 'sm' : 'base'}
              className="text-high-emphesis text-left"
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
        Cell: (props) => {
          const usdcValue = useUSDCValue(props.cell.value)
          return (
            <Typography
              weight={700}
              variant={isDesktop ? 'sm' : 'base'}
              className="text-high-emphesis text-right w-full"
            >
              ${usdcValue?.toExact({})}
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
      },
    }),
    [AssetColumns, assets, defaultColumn]
  )
}
