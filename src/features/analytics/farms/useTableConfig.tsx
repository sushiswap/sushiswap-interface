import { getAddress } from '@ethersproject/address'
import { Token } from '@sushiswap/core-sdk'
import { CurrencyLogoArray } from 'app/components/CurrencyLogo'
import useFarmRewards from 'app/hooks/useFarmRewards'
import { useMemo } from 'react'

import { filterForSearchQuery } from './farmTableFilters'

export const useTableConfig = (chainId: number) => {
  const farms = useFarmRewards(useMemo(() => ({ chainId }), [chainId]))

  // const farms = useMemo(() => [], [])

  const data = useMemo(() => {
    return (
      farms
        // @ts-ignore
        ?.map((farm: any) => ({
          pair: {
            id: farm.pair.id,
            token0: farm.pair.token0,
            token1: farm.pair.token1,
            name: farm.pair.symbol ?? `${farm.pair.token0.symbol}-${farm.pair.token1.symbol}`,
            type: farm.pair.symbol ? 'Kashi Farm' : 'Sushi Farm',
          },
          rewards: farm.rewards,
          liquidity: farm.tvl,
          apr: {
            daily: farm.roiPerDay * 100,
            monthly: farm.roiPerMonth * 100,
            annual: farm.roiPerYear * 100,
          },
        }))
        .filter((farm) => (farm ? true : false))
    )
  }, [farms])

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
          const currencies = useMemo(() => [currency0, currency1], [currency0, currency1])
          return (
            <div className="flex items-center gap-2 overflow-hidden">
              <CurrencyLogoArray currencies={currencies} size={40} dense />
              <div
                id={`farm-${props.value.token0.symbol}/${props.value.token1.symbol}`}
                className="overflow-hidden font-bold text-high-emphesis overflow-ellipsis whitespace-nowrap"
              >
                <div className="flex flex-col ml-3 whitespace-nowrap">
                  <div className="font-bold text-high-emphesis">{props.value.name}</div>
                  <div className="text-secondary">{props.value.type}</div>
                </div>
              </div>
            </div>
          )
        },
        filter: filterForSearchQuery,
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
          sortBy: [{ id: 'liquidity', desc: true }],
        },
        autoResetFilters: false,
      },
      // loading: isValidating,
      // error,
    }),
    [columns, data]
  )
}
