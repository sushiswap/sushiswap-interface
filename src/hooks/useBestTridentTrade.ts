import { BigNumber } from '@ethersproject/bignumber'
import { Currency, CurrencyAmount, TradeType, WNATIVE } from '@sushiswap/core-sdk'
import { ConstantProductRPool, findMultiRouteExactIn,RouteStatus, RPool, RToken } from '@sushiswap/tines'
import { Pool, PoolState, Trade } from '@sushiswap/trident-sdk'
import { useMemo } from 'react'
import useSWR, { SWRResponse } from 'swr'

import { useAllCurrencyCombinations } from './useAllCurrencyCombinations'
import { useConstantProductPools } from './useConstantProductPools'

function useAllCommonPools(currencyA?: Currency, currencyB?: Currency): Pool[] {
  const currencyCombinations = useAllCurrencyCombinations(currencyA, currencyB)
  const constantProductPools = useConstantProductPools(currencyCombinations)
  // concentratedPools
  // hybridPools
  // indexPools

  const pools = useMemo(() => [...constantProductPools], [constantProductPools])
  return useMemo(
    () =>
      Object.values(
        pools
          // filter out invalid pool
          .filter((result): result is [PoolState.EXISTS, Pool] => Boolean(result[0] === PoolState.EXISTS && result[1]))
          .map(([, pool]) => pool)
      ),
    [pools]
  )
}

/**
 * Returns best trident trade for a desired swap.
 * @param amountSpecified the exact amount to swap in/out
 * @param otherCurrency the desired output/payment currency
 */
export function useBestTridentTrade(
  tradeType: TradeType.EXACT_INPUT | TradeType.EXACT_OUTPUT,
  amountSpecified?: CurrencyAmount<Currency>,
  otherCurrency?: Currency
): Trade<Currency, Currency, TradeType.EXACT_INPUT | TradeType.EXACT_OUTPUT> | undefined {
  // TODO ramin:
  const { data, error }: SWRResponse<{ average: number }, Error> = useSWR(
    'https://ethgasstation.info/api/ethgasAPI.json?',
    (url) => fetch(url).then((r) => r.json())
  )

  const [currencyIn, currencyOut] = useMemo(
    () =>
      tradeType === TradeType.EXACT_INPUT
        ? [amountSpecified?.currency, otherCurrency]
        : [otherCurrency, amountSpecified?.currency],
    [tradeType, amountSpecified, otherCurrency]
  )

  const allowedPools = useAllCommonPools(currencyIn, currencyOut)
  return useMemo(() => {
    if (amountSpecified && amountSpecified && otherCurrency && allowedPools.length > 0) {
      const route = findMultiRouteExactIn(
        amountSpecified.currency.wrapped as RToken,
        otherCurrency.wrapped as RToken,
        BigNumber.from(amountSpecified.quotient.toString()),
        allowedPools.map((pool) => {
          return new ConstantProductRPool(
            pool.liquidityToken.address,
            pool.assets[0].wrapped as RToken,
            pool.assets[1].wrapped as RToken,
            pool.fee / 10000,
            BigNumber.from(pool.reserves[0].quotient.toString()),
            BigNumber.from(pool.reserves[1].quotient.toString())
          )
        }) as RPool[],
        WNATIVE[amountSpecified.currency.chainId] as RToken,
        750 * 1e9 // TODO: should be a dynamic gas price
      )

      if (route.status === RouteStatus.Success) {
        if (tradeType === TradeType.EXACT_INPUT) return Trade.bestTradeExactIn(route, amountSpecified, otherCurrency)
        if (tradeType === TradeType.EXACT_OUTPUT) return Trade.bestTradeExactOut(route, otherCurrency, amountSpecified)
      }
    }

    return undefined
  }, [amountSpecified, otherCurrency, allowedPools, tradeType])
}
