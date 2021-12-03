import { BigNumber } from '@ethersproject/bignumber'
import { ChainId, Currency, CurrencyAmount, Pair, TradeType, WNATIVE } from '@sushiswap/core-sdk'
import { RouteStatus } from '@sushiswap/tines'
import { ConstantProductPool, findMultiRouteExactIn, findSingleRouteExactIn, Trade } from '@sushiswap/trident-sdk'
import { toShareCurrencyAmount } from 'app/functions'
import { useBentoRebase } from 'app/hooks/useBentoRebases'
import { ConstantProductPoolState } from 'app/hooks/useTridentClassicPools'
import { PairState, useV2Pairs } from 'app/hooks/useV2Pairs'
import { useActiveWeb3React } from 'app/services/web3'
import { useBlockNumber } from 'app/state/application/hooks'
import { useEffect, useMemo, useState } from 'react'

import { useAllCurrencyCombinations } from './useAllCurrencyCombinations'
import { useConstantProductPools } from './useConstantProductPools'

function useAllCommonPools(currencyA?: Currency, currencyB?: Currency): (ConstantProductPool | Pair | null)[] {
  const currencyCombinations = useAllCurrencyCombinations(currencyA, currencyB)
  const constantProductPools = useConstantProductPools(currencyCombinations)
  const allPairs = useV2Pairs(currencyCombinations)

  // concentratedPools
  // hybridPools
  // indexPools

  const pools = useMemo(() => [...constantProductPools, ...allPairs], [allPairs, constantProductPools])
  return useMemo(
    () => [
      ...Object.values(
        pools
          // filter out invalid pool
          .filter((result) => {
            return (
              Boolean(result[0] === ConstantProductPoolState.EXISTS && result[1]) ||
              Boolean(result[0] === PairState.EXISTS && result[1])
            )
          })
          .map(([, pool]) => pool)
      ),
    ],
    [pools]
  )
}

type UseBestTridentTradeOutput = Trade<Currency, Currency, TradeType.EXACT_INPUT | TradeType.EXACT_OUTPUT> | undefined

/**
 * Returns best trident trade for a desired swap.
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
  const [trade, setTrade] = useState<UseBestTridentTradeOutput>(undefined)
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
      if (chainId && price && shareSpecified && amountSpecified && otherCurrency && allowedPools.length > 0) {
        const tridentRoute = findMultiRouteExactIn(
          shareSpecified.currency.wrapped,
          otherCurrency.wrapped,
          BigNumber.from(shareSpecified.quotient.toString()),
          allowedPools.filter((pool) => pool instanceof ConstantProductPool),
          WNATIVE[shareSpecified.currency.chainId],
          chainId === ChainId.KOVAN ? 750 * 1e9 : price
        )

        const legacyRoute = findSingleRouteExactIn(
          amountSpecified.currency.wrapped,
          otherCurrency.wrapped,
          BigNumber.from(amountSpecified.quotient.toString()),
          allowedPools.filter((pair) => pair instanceof Pair),
          WNATIVE[amountSpecified.currency.chainId],
          chainId === ChainId.KOVAN ? 750 * 1e9 : price
        )

        if (tridentRoute.amountOutBN.gt(legacyRoute.amountOutBN)) {
          if (tridentRoute.status === RouteStatus.Success) {
            if (tradeType === TradeType.EXACT_INPUT)
              return Trade.bestTradeExactIn(tridentRoute, shareSpecified, otherCurrency)
            if (tradeType === TradeType.EXACT_OUTPUT)
              return Trade.bestTradeExactOut(tridentRoute, otherCurrency, shareSpecified)
          }
        } else {
          if (legacyRoute.status === RouteStatus.Success) {
            if (tradeType === TradeType.EXACT_INPUT)
              return Trade.bestTradeExactIn(legacyRoute, amountSpecified, otherCurrency)
            if (tradeType === TradeType.EXACT_OUTPUT)
              return Trade.bestTradeExactOut(legacyRoute, otherCurrency, amountSpecified)
          }
        }
      }

      return undefined
    }

    bestTrade().then((trade) => setTrade(trade))
  }, [allowedPools, amountSpecified, chainId, gasPricePromise, otherCurrency, shareSpecified, tradeType])

  return trade
}
