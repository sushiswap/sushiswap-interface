import { BigNumber } from '@ethersproject/bignumber'
import { ChainId, Currency, CurrencyAmount, Pair, Trade as LegacyTrade, TradeType, WNATIVE } from '@sushiswap/core-sdk'
import { RouteStatus } from '@sushiswap/tines'
import {
  ConstantProductPool,
  convertTinesSingleRouteToLegacyRoute,
  findMultiRouteExactIn,
  findMultiRouteExactOut,
  findSingleRouteExactIn,
  findSingleRouteExactOut,
  Trade,
} from '@sushiswap/trident-sdk'
import { PoolUnion } from 'app/features/trident/types'
import { toShareCurrencyAmount } from 'app/functions'
import { useBentoRebase } from 'app/hooks/useBentoRebases'
import { ConstantProductPoolState } from 'app/hooks/useConstantProductPools'
import { PairState, useV2Pairs } from 'app/hooks/useV2Pairs'
import { useActiveWeb3React } from 'app/services/web3'
import { useBlockNumber } from 'app/state/application/hooks'
import { useEffect, useMemo, useState } from 'react'

import { useAllCurrencyCombinations } from './useAllCurrencyCombinations'
import { useConstantProductPoolsPermutations } from './useConstantProductPools'

export function useAllCommonPools(currencyA?: Currency, currencyB?: Currency): (PoolUnion | Pair)[] {
  const currencyCombinations = useAllCurrencyCombinations(currencyA, currencyB)
  const constantProductPools = useConstantProductPoolsPermutations(currencyCombinations)
  const allPairs = useV2Pairs(currencyCombinations)

  // concentratedPools
  // hybridPools
  // indexPools

  const pools = useMemo(() => [...constantProductPools, ...allPairs], [allPairs, constantProductPools])
  return useMemo(
    () => [
      ...Object.values(
        pools.reduce<(PoolUnion | Pair)[]>((acc, result) => {
          if (!Array.isArray(result) && result.state === ConstantProductPoolState.EXISTS && result.pool) {
            acc.push(result.pool)
          }

          if (Array.isArray(result) && result[0] === PairState.EXISTS && result[1]) {
            acc.push(result[1])
          }

          return acc
        }, [])
      ),
    ],
    [pools]
  )
}

type UseBestTridentTradeOutput = {
  trade?:
    | Trade<Currency, Currency, TradeType.EXACT_INPUT | TradeType.EXACT_OUTPUT>
    | LegacyTrade<Currency, Currency, TradeType.EXACT_INPUT | TradeType.EXACT_OUTPUT>
  priceImpact?: number
}

/**
 * Returns best trident trade for a desired swap.
 * @param tradeType whether we request an exact output amount or we provide an exact input amount
 * @param amountSpecified the exact amount to swap in/out
 * @param otherCurrency the desired output/payment currency
 */
export function useBestTridentTrade(
  tradeType: TradeType.EXACT_INPUT | TradeType.EXACT_OUTPUT,
  amountSpecified?: CurrencyAmount<Currency>,
  otherCurrency?: Currency
): UseBestTridentTradeOutput {
  const { chainId, library } = useActiveWeb3React()
  const blockNumber = useBlockNumber()
  const [trade, setTrade] = useState<UseBestTridentTradeOutput>({ trade: undefined, priceImpact: undefined })
  const { rebase } = useBentoRebase(amountSpecified?.currency)

  const shareSpecified = useMemo(() => {
    if (!amountSpecified || !rebase) return
    return CurrencyAmount.fromRawAmount(
      amountSpecified.currency,
      toShareCurrencyAmount(rebase, amountSpecified.wrapped).quotient.toString()
    )
  }, [amountSpecified, rebase])

  const [currencyIn, currencyOut] = useMemo(
    () =>
      tradeType === TradeType.EXACT_INPUT
        ? [amountSpecified?.currency, otherCurrency]
        : [otherCurrency, amountSpecified?.currency],
    [tradeType, amountSpecified, otherCurrency]
  )

  const gasPricePromise = useMemo(async () => {
    if (!library) return

    const gas = await library.getGasPrice()
    return gas.toNumber()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [library, blockNumber])

  const allowedPools = useAllCommonPools(currencyIn, currencyOut)

  useEffect(() => {
    const bestTrade = async () => {
      const price = await gasPricePromise
      if (
        currencyIn &&
        currencyOut &&
        currencyIn.wrapped.address !== currencyOut.wrapped.address &&
        chainId &&
        price &&
        shareSpecified &&
        amountSpecified &&
        otherCurrency &&
        allowedPools.length > 0
      ) {
        const tridentPools = allowedPools.filter((pool) => pool instanceof ConstantProductPool) as ConstantProductPool[]
        const legacyPools = allowedPools.filter((pair) => pair instanceof Pair) as Pair[]

        if (tradeType === TradeType.EXACT_INPUT) {
          const tridentRoute = findMultiRouteExactIn(
            currencyIn.wrapped,
            currencyOut.wrapped,
            BigNumber.from(shareSpecified.quotient.toString()),
            tridentPools,
            WNATIVE[shareSpecified.currency.chainId],
            chainId === ChainId.KOVAN ? 750 * 1e9 : price
          )

          const legacyRoute = findSingleRouteExactIn(
            currencyIn.wrapped,
            currencyOut.wrapped,
            BigNumber.from(amountSpecified.quotient.toString()),
            legacyPools,
            WNATIVE[amountSpecified.currency.chainId],
            chainId === ChainId.KOVAN ? 750 * 1e9 : price
          )

          if (tridentRoute.amountOutBN.gt(legacyRoute.amountOutBN)) {
            if (tridentRoute.status === RouteStatus.Success) {
              const priceImpact = tridentRoute.priceImpact
              return { trade: Trade.bestTradeExactIn(tridentRoute, shareSpecified, currencyOut), priceImpact }
            }
          } else {
            if (legacyRoute.status === RouteStatus.Success) {
              const priceImpact = legacyRoute.priceImpact
              return {
                trade: LegacyTrade.exactIn(
                  convertTinesSingleRouteToLegacyRoute(legacyRoute, legacyPools, currencyIn, currencyOut),
                  amountSpecified
                ),
                priceImpact,
              }
            }
          }
        } else {
          const tridentRoute = findMultiRouteExactOut(
            currencyIn.wrapped,
            currencyOut.wrapped,
            BigNumber.from(shareSpecified.quotient.toString()),
            tridentPools,
            WNATIVE[shareSpecified.currency.chainId],
            chainId === ChainId.KOVAN ? 750 * 1e9 : price
          )

          const legacyRoute = findSingleRouteExactOut(
            currencyIn.wrapped,
            currencyOut.wrapped,
            BigNumber.from(amountSpecified.quotient.toString()),
            legacyPools,
            WNATIVE[amountSpecified.currency.chainId],
            chainId === ChainId.KOVAN ? 750 * 1e9 : price
          )

          if (tridentRoute.amountInBN.lt(legacyRoute.amountInBN)) {
            if (tridentRoute.status === RouteStatus.Success) {
              const priceImpact = tridentRoute.priceImpact
              return { trade: Trade.bestTradeExactOut(tridentRoute, currencyIn, shareSpecified), priceImpact }
            }
          } else {
            if (legacyRoute.status === RouteStatus.Success) {
              const priceImpact = legacyRoute.priceImpact
              return {
                trade: LegacyTrade.exactOut(
                  convertTinesSingleRouteToLegacyRoute(legacyRoute, legacyPools, currencyIn, currencyOut),
                  amountSpecified
                ),
                priceImpact,
              }
            }
          }
        }
      }

      return {
        trade: undefined,
        priceImpact: undefined,
      }
    }

    bestTrade().then((trade) => setTrade(trade))
  }, [
    currencyIn,
    currencyOut,
    allowedPools,
    amountSpecified,
    chainId,
    gasPricePromise,
    otherCurrency,
    shareSpecified,
    tradeType,
    blockNumber,
  ])

  return trade
}
