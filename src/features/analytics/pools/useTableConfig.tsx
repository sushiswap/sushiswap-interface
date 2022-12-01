import { getAddress } from '@ethersproject/address'
import { Token } from '@figswap/core-sdk'
import { CurrencyLogoArray } from 'app/components/CurrencyLogo'
import { formatNumber } from 'app/functions'
import { useAllTokens } from 'app/hooks/Tokens'
import Image from 'next/image'
import React, { useMemo } from 'react'
import { UsePaginationOptions, UseSortByOptions } from 'react-table'
import useSWR from 'swr'

import { filterForSearchQuery } from './poolTableFilters'

export const useTableConfig = (chainId: number) => {
  const allTokens = useAllTokens()

  const { data } = useSWR(chainId ? `/api/analytics/pairs/${chainId}` : null, (url: string) =>
    fetch(url).then((response) => response.json())
  )

  const columns = useMemo(
    () => [
      {
        Header: 'Name',
        accessor: 'pair',
        maxWidth: 150,
        // @ts-ignore
        Cell: (props) => {
          const currency0Address = getAddress(props.value.token0.id)
          const currency0 = useMemo(
            () =>
              currency0Address in allTokens
                ? allTokens[currency0Address]
                : new Token(
                    chainId,
                    getAddress(props.value.token0.id),
                    Number(props.value.token0.decimals),
                    props.value.token0.symbol,
                    props.value.token0.name
                  ),
            [props, currency0Address]
          )
          const currency1Address = getAddress(props.value.token1.id)
          const currency1 = useMemo(
            () =>
              currency1Address in allTokens
                ? allTokens[currency1Address]
                : new Token(
                    chainId,
                    currency1Address,
                    Number(props.value.token1.decimals),
                    props.value.token1.symbol,
                    props.value.token1.name
                  ),
            [props, currency1Address]
          )
          return (
            <div className="flex items-center gap-2 overflow-hidden">
              <CurrencyLogoArray currencies={[currency0, currency1]} size={40} dense />
              <div
                id={`pool-${props.value.token0.symbol}/${props.value.token1.symbol}`}
                className="overflow-hidden font-bold text-high-emphesis overflow-ellipsis whitespace-nowrap"
              >
                {props.value.token0.symbol}/{props.value.token1.symbol}
              </div>
              <div className="w-3.5">
                <Image
                  src="https://app.sushi.com/images/rss.svg"
                  alt="rss icon"
                  layout="fixed"
                  width="14"
                  height="14"
                />
              </div>
            </div>
          )
        },
        filter: filterForSearchQuery,
      },
      {
        Header: 'TVL',
        accessor: 'liquidity',
        minWidth: 150,
        // @ts-ignore
        Cell: (props) => formatNumber(props.value, true, false, 2),
        align: 'right',
      },
      {
        Header: 'Volume 1d',
        accessor: 'volume1d',
        minWidth: 150,
        // @ts-ignore
        Cell: (props) => formatNumber(props.value, true, false, 2),
        align: 'right',
      },
      {
        Header: 'Fees 1d',
        accessor: 'fees1d',
        minWidth: 150,
        // @ts-ignore
        Cell: (props) => formatNumber(props.value, true, false, 2),
        align: 'right',
      },
      {
        Header: 'APY',
        accessor: 'apy',
        minWidth: 150,
        // @ts-ignore
        Cell: (props) => {
          return (
            <>
              {props.value}{' '}
              {props.value !== '-' &&
                (props.row.original.utilisation1dChange > 0 ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 ml-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 ml-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 13a1 1 0 100 2h5a1 1 0 001-1V9a1 1 0 10-2 0v2.586l-4.293-4.293a1 1 0 00-1.414 0L8 9.586 3.707 5.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0L11 9.414 14.586 13H12z"
                      clipRule="evenodd"
                    />
                  </svg>
                ))}
            </>
          )
        },
      },
    ],
    [allTokens, chainId]
  )

  return useMemo(
    () => ({
      config: {
        columns,
        data: data ?? [],
        initialState: {
          sortBy: [
            { id: 'liquidity', desc: true },
            { id: 'apy', desc: true },
          ],
        },
        autoResetFilters: false,
        autoResetPage: false,
      } as UseSortByOptions<any> & UsePaginationOptions<any>,
      // loading: isValidating,
      // error,
    }),
    [columns, data]
  )
}
