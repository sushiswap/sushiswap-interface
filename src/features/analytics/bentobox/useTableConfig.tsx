import { getAddress } from '@ethersproject/address'
import { Token } from '@sushiswap/core-sdk'
import { CurrencyLogo } from 'app/components/CurrencyLogo'
import { formatNumber, formatPercent } from 'app/functions'
import React, { useMemo } from 'react'

export const useTableConfig = (chainId: number, tokens: any) => {
  const TokenColumns = useMemo(
    () => [
      {
        Header: 'Name',
        accessor: 'token',
        minWidth: 200,
        // @ts-ignore
        Cell: (props) => {
          const currency = useMemo(
            () =>
              new Token(
                chainId,
                getAddress(props.value.id),
                Number(props.value.decimals),
                props.value.symbol,
                props.value.name
              ),
            [props]
          )
          return (
            <div className="flex items-center gap-2">
              <CurrencyLogo currency={currency ?? undefined} className="!rounded-full" size={36} />
              {props.value.symbol}
            </div>
          )
        },
      },
      {
        Header: 'Price',
        accessor: 'price',
        maxWidth: 100,
        // @ts-ignore
        Cell: (props) => formatNumber(props.value, true, undefined, 2),
        align: 'right',
      },
      {
        Header: 'Liquidity',
        accessor: 'liquidity',
        // @ts-ignore
        Cell: (props) => formatNumber(props.value, true, false),
        align: 'right',
      },
      {
        id: 'target',
        Header: 'Strategy Target',
        accessor: 'strategy',
        // @ts-ignore
        Cell: (props) => formatPercent(props.value?.targetPercentage),
      },
      {
        id: 'utilisation',
        Header: 'Strategy Utilization',
        accessor: 'strategy',
        // @ts-ignore
        Cell: (props) => formatPercent(props.value?.utilization),
      },
      {
        Header: 'Strategy APY',
        accessor: 'strategy',
        // @ts-ignore
        Cell: (props) => formatPercent(props.value?.apy),
      },
    ],
    [chainId]
  )

  const defaultColumn = React.useMemo(() => ({ minWidth: 0 }), [])

  return useMemo(
    () => ({
      config: {
        columns: TokenColumns,
        data: tokens,
        defaultColumn,
        initialState: {
          sortBy: [{ id: 'liquidity', desc: true }],
        },
      },
    }),
    [TokenColumns, defaultColumn, tokens]
  )
}
