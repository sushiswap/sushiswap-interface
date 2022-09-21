import { getAddress } from '@ethersproject/address'
import { Token } from '@sushiswap/core-sdk'
import { CurrencyLogo } from 'app/components/CurrencyLogo'
import { formatNumber, formatPercent } from 'app/functions'
import { useAllTokens } from 'app/hooks/Tokens'
import React, { useMemo } from 'react'
import useSWR from 'swr'

import { AnalyticsBentobox } from './getAnalyticsBentobox'
import { filterForSearchQuery } from './tokenTableFilters'

export const useTableConfig = (chainId: number) => {
  const allTokens = useAllTokens()

  const { data } = useSWR<AnalyticsBentobox>(chainId ? `/api/analytics/bentobox/${chainId}` : null, (url: string) =>
    fetch(url).then((response) => response.json())
  )

  const bentoBoxTokens = data?.bentoBoxTokens

  const columns = useMemo(
    () => [
      {
        Header: 'Name',
        accessor: 'token',
        maxWidth: 100,
        // @ts-ignore
        Cell: (props) => {
          const address = getAddress(props.value.id)
          const currency = useMemo(
            () =>
              address in allTokens
                ? allTokens[address]
                : new Token(chainId, address, Number(props.value.decimals), props.value.symbol, props.value.name),
            [props, address]
          )
          return (
            <div className="flex items-center gap-2">
              <CurrencyLogo currency={currency ?? undefined} className="!rounded-full" size={36} />
              {props.value.symbol}
            </div>
          )
        },
        filter: filterForSearchQuery,
      },
      {
        Header: 'Price',
        accessor: 'price',
        minWidth: 150,
        // @ts-ignore
        Cell: (props) => formatNumber(props.value, true, undefined, 2),
        align: 'right',
      },
      {
        Header: 'Liquidity',
        accessor: 'liquidity',
        minWidth: 150,
        // @ts-ignore
        Cell: (props) => formatNumber(props.value, true, false),
        align: 'right',
      },
      {
        id: 'target',
        Header: 'Strategy Target',
        accessor: 'strategy.targetPercentage',
        minWidth: 150,
        // @ts-ignore
        Cell: (props) => formatPercent(props.value),
      },
      {
        id: 'utilisation',
        Header: 'Strategy Utilization',
        accessor: 'strategy.utilization',
        minWidth: 150,
        // @ts-ignore
        Cell: (props) => formatPercent(props.value),
      },
      {
        Header: 'APY',
        accessor: 'strategy.apy',
        minWidth: 150,
        // @ts-ignore
        Cell: (props) => formatPercent(props.value),
      },
    ],
    [allTokens, chainId]
  )

  return useMemo(
    () => ({
      config: {
        columns,
        data: bentoBoxTokens ?? [],
        initialState: {
          sortBy: [
            { id: 'liquidity', desc: true },
            { id: 'price', desc: true },
            { id: 'targetPercentage', desc: true },
            { id: 'utilization', desc: true },
            { id: 'apy', desc: true },
          ],
        },
        autoResetFilters: false,
      },
      // loading: isValidating,
      // error,
    }),
    [columns, bentoBoxTokens]
  )
}
