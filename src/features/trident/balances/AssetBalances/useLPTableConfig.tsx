import CurrencyLogo from 'app/components/CurrencyLogo'
import Typography from 'app/components/Typography'
import { Assets } from 'app/features/trident/balances/AssetBalances/types'
import useDesktopMediaQuery from 'app/hooks/useDesktopMediaQuery'
import { useUSDCValue } from 'app/hooks/useUSDCPrice'
import React, { useMemo } from 'react'

// TODO ramin: fix
export const useLPTableConfig = (assets?: Assets[]) => {
  const AssetColumns = useMemo(
    () => [
      {
        id: 'asset',
        Header: 'Asset',
        accessor: 'asset',
        minWidth: 100,
        className: 'text-left',
        Cell: (props) => {
          const isDesktop = useDesktopMediaQuery()

          return (
            <div className="flex gap-2.5 items-center">
              <CurrencyLogo currency={props.cell.value.currency} className="rounded-full" size={28} />
              <Typography
                variant={isDesktop ? 'sm' : 'base'}
                weight={isDesktop ? 400 : 700}
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
        maxWidth: 200,
        className: 'text-left',
        Cell: (props) => {
          const isDesktop = useDesktopMediaQuery()

          return (
            <Typography
              variant={isDesktop ? 'sm' : 'base'}
              weight={isDesktop ? 400 : 700}
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
        maxWidth: 200,
        className: 'text-right',
        Cell: (props) => {
          const isDesktop = useDesktopMediaQuery()
          const usdcValue = useUSDCValue(props.cell.value)
          return (
            <Typography
              variant={isDesktop ? 'sm' : 'base'}
              weight={700}
              className="text-high-emphesis text-right w-full"
            >
              ${usdcValue?.toExact()}
            </Typography>
          )
        },
      },
    ],
    []
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
