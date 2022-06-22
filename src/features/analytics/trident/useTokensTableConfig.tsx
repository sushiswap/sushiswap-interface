import { getAddress } from '@ethersproject/address'
import { Token } from '@sushiswap/core-sdk'
import { CurrencyLogo } from 'app/components/CurrencyLogo'
import { formatNumber } from 'app/functions'
import { useAllTokens } from 'app/hooks/Tokens'
import { useTridentTokens } from 'app/services/graph'
import { useMemo } from 'react'
import { UsePaginationOptions, UseSortByOptions } from 'react-table'

import { filterForSearchQuery } from './tokenTableFilters'

export const useTokensTableConfig = (chainId: number) => {
  const { data } = useTridentTokens({
    chainId,
    variables: {},
  })

  const allTokens = useAllTokens()
  const columns = useMemo(
    () => [
      {
        Header: 'Name',
        accessor: 'name',
        maxWidth: 100,
        // @ts-ignore
        Cell: (props) => {
          const currency = useMemo(() => {
            const token = props.row.original
            const address = getAddress(token.id)
            return address in allTokens
              ? allTokens[address]
              : new Token(chainId, address, Number(token.decimals), token.symbol, token.name)
          }, [props])
          return (
            <div className="flex items-center gap-2 font-bold">
              <CurrencyLogo currency={currency ?? undefined} className="!rounded-full" size={36} />
              {props.row.original.symbol}
            </div>
          )
        },
        filter: filterForSearchQuery,
      },
      {
        Header: 'Price',
        accessor: 'price.derivedUSD',
        minWidth: 150,
        // @ts-ignore
        Cell: (props) => formatNumber(props.value, true, undefined, 2),
        align: 'right',
      },
      {
        Header: 'Liquidity',
        accessor: 'kpi.liquidityUSD',
        minWidth: 150,
        // @ts-ignore
        Cell: (props) => formatNumber(props.value, true, false),
        align: 'right',
      },
      {
        Header: 'Volume',
        accessor: 'volumeUSD',
        minWidth: 150,
        // @ts-ignore
        Cell: (props) => formatNumber(props.value, true, false),
        align: 'right',
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
          sortBy: [{ id: 'kpi.liquidityUSD', desc: true }],
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
