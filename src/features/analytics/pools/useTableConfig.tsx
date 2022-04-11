import { getAddress } from '@ethersproject/address'
import { Token } from '@sushiswap/core-sdk'
import { CurrencyLogoArray } from 'app/components/CurrencyLogo'
import { formatNumber, getApy } from 'app/functions'
import { useOneDayBlock, useOneWeekBlock, useSushiPairs } from 'app/services/graph'
import Image from 'next/image'
import React, { useMemo } from 'react'

import { filterForSearchQuery } from './poolTableFilters'

export const useTableConfig = (chainId: number) => {
  const block1d = useOneDayBlock({ chainId, shouldFetch: !!chainId })

  const block1w = useOneWeekBlock({ chainId, shouldFetch: !!chainId })

  const pairs = useSushiPairs({ chainId })
  const pairs1d = useSushiPairs({ variables: { block: block1d }, shouldFetch: !!block1d, chainId })

  const pairs1w = useSushiPairs({ variables: { block: block1w }, shouldFetch: !!block1w, chainId })

  const data = useMemo(() => {
    return (
      pairs
        // @ts-ignore TYPE NEEDS FIXING
        ?.map((pair) => {
          // @ts-ignore TYPE NEEDS FIXING
          const pair1d = pairs1d?.find((p) => pair.id === p.id) ?? pair
          // @ts-ignore TYPE NEEDS FIXING
          const pair1w = pairs1w?.find((p) => pair.id === p.id) ?? pair1d
          const volume1d = pair.volumeUSD - pair1d.volumeUSD
          const volume1w = pair.volumeUSD - pair1w.volumeUSD
          const fees1d = volume1d * 0.003
          const fees1w = volume1w * 0.003
          const liquidity = pair.reserveUSD
          return {
            pair: {
              token0: pair.token0,
              token1: pair.token1,
              id: pair.id,
            },
            liquidity,
            volume1d,
            volume1w,
            fees1d,
            fees1w,
            apy: getApy(volume1w, pair.reserveUSD),
          }
        })
        // @ts-ignore TYPE NEEDS FIXING
        .sort((a, b) => b.liquidityChangeNumber1d - a.liquidityChangeNumber1d)
    )
  }, [pairs, pairs1d, pairs1w])

  const columns = useMemo(
    () => [
      {
        Header: 'Name',
        accessor: 'pair',
        maxWidth: 150,
        // @ts-ignore
        Cell: (props) => {
          const currency0 = useMemo(
            () =>
              new Token(
                chainId,
                getAddress(props.value.token0.id),
                Number(props.value.token0.decimals),
                props.value.token0.symbol,
                props.value.token0.name
              ),
            [props]
          )
          const currency1 = useMemo(
            () =>
              new Token(
                chainId,
                getAddress(props.value.token1.id),
                Number(props.value.token1.decimals),
                props.value.token1.symbol,
                props.value.token1.name
              ),
            [props]
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
      },
    ],
    [chainId]
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
      },
      // loading: isValidating,
      // error,
    }),
    [columns, data]
  )
}
