import { BASES_TO_CHECK_TRADES_AGAINST, BETTER_TRADE_LESS_HOPS_THRESHOLD, CUSTOM_BASES } from '../constants'
import { ChainId, Currency, CurrencyAmount, Pair, Token, Trade } from '@sushiswap/sdk'
import { PairState, usePairs } from './usePairs'

import { isTradeBetter } from '../functions/trade'
import { useActiveWeb3React } from './useActiveWeb3React'
import { useMemo } from 'react'
import { useUnsupportedTokens } from './Tokens'
import { useUserSingleHopOnly } from '../state/user/hooks'
import { wrappedCurrency } from '../functions/currency'

function generateAllRoutePairs(tokenA?: Token, tokenB?: Token, chainId?: ChainId): [Token, Token][] {
    const bases: Token[] = chainId ? BASES_TO_CHECK_TRADES_AGAINST[chainId] : []
    const customBases = chainId !== undefined ? CUSTOM_BASES[chainId] : undefined
    const customBasesA = customBases && tokenA ? customBases[tokenA.address] ?? [] : []
    const customBasesB = customBases && tokenB ? customBases[tokenB.address] ?? [] : []

    const allBases = [...new Set([...bases, ...customBasesA, ...customBasesB])]

    const basePairs: [Token, Token][] = []
    for (let i = 0; i < allBases.length; i++) {
        for (let j = i + 1; j < allBases.length; j++) {
            basePairs.push([allBases[i], allBases[j]])
        }
    }

    return [
        // the direct pair
        [tokenA, tokenB],
        // token A against all bases
        ...allBases.map((base): [Token | undefined, Token] => [tokenA, base]),
        // token B against all bases
        ...allBases.map((base): [Token | undefined, Token] => [tokenB, base]),
        // each base against all bases
        ...basePairs
    ]
        .filter((tokens): tokens is [Token, Token] => Boolean(tokens[0] && tokens[1]))
        .filter(([t0, t1]) => t0.address !== t1.address)
        .filter(([tokenA, tokenB]) => {
            if (!chainId) return true
            const restrictedBases = CUSTOM_BASES[chainId]
            if (!restrictedBases) return true

            const restrictedBasesA: Token[] | undefined = restrictedBases[tokenA.address]
            const restrictedBasesB: Token[] | undefined = restrictedBases[tokenB.address]

            if (!restrictedBasesA && !restrictedBasesB) return true

            if (restrictedBasesA && !restrictedBasesA.find(base => tokenB.equals(base))) return false
            if (restrictedBasesB && !restrictedBasesB.find(base => tokenA.equals(base))) return false

            return true
        })
}

function useAllCommonPairs(currencyA?: Currency, currencyB?: Currency): Pair[] {
    const { chainId } = useActiveWeb3React()

    const [tokenA, tokenB] = chainId
        ? [wrappedCurrency(currencyA, chainId), wrappedCurrency(currencyB, chainId)]
        : [undefined, undefined]

    const allPairCombinations: [Token, Token][] = useMemo(() => generateAllRoutePairs(tokenA, tokenB, chainId), [
        tokenA,
        tokenB,
        chainId
    ])

    const allPairs = usePairs(allPairCombinations)

    // only pass along valid pairs, non-duplicated pairs
    return useMemo(
        () =>
            Object.values(
                allPairs
                    // filter out invalid pairs
                    .filter((result): result is [PairState.EXISTS, Pair] =>
                        Boolean(result[0] === PairState.EXISTS && result[1])
                    )
                    // filter out duplicated pairs
                    .reduce<{ [pairAddress: string]: Pair }>((memo, [, curr]) => {
                        memo[curr.liquidityToken.address] = memo[curr.liquidityToken.address] ?? curr
                        return memo
                    }, {})
            ),
        [allPairs]
    )
}

const MAX_HOPS = 3

/**
 * Returns the best trade for the exact amount of tokens in to the given token out
 */
export function useTradeExactIn(currencyAmountIn?: CurrencyAmount, currencyOut?: Currency): Trade | null {
    const allowedPairs = useAllCommonPairs(currencyAmountIn?.currency, currencyOut)

    const [singleHopOnly] = useUserSingleHopOnly()

    return useMemo(() => {
        if (currencyAmountIn && currencyOut && allowedPairs.length > 0) {
            if (singleHopOnly) {
                return (
                    Trade.bestTradeExactIn(allowedPairs, currencyAmountIn, currencyOut, {
                        maxHops: 1,
                        maxNumResults: 1
                    })[0] ?? null
                )
            }
            // search through trades with varying hops, find best trade out of them
            let bestTradeSoFar: Trade | null = null
            for (let i = 1; i <= MAX_HOPS; i++) {
                const currentTrade: Trade | null =
                    Trade.bestTradeExactIn(allowedPairs, currencyAmountIn, currencyOut, {
                        maxHops: i,
                        maxNumResults: 1
                    })[0] ?? null
                // if current trade is best yet, save it
                if (isTradeBetter(bestTradeSoFar, currentTrade, BETTER_TRADE_LESS_HOPS_THRESHOLD)) {
                    bestTradeSoFar = currentTrade
                }
            }
            return bestTradeSoFar
        }

        return null
    }, [allowedPairs, currencyAmountIn, currencyOut, singleHopOnly])
}

/**
 * Returns the best trade for the token in to the exact amount of token out
 */
export function useTradeExactOut(currencyIn?: Currency, currencyAmountOut?: CurrencyAmount): Trade | null {
    const allowedPairs = useAllCommonPairs(currencyIn, currencyAmountOut?.currency)

    const [singleHopOnly] = useUserSingleHopOnly()

    return useMemo(() => {
        if (currencyIn && currencyAmountOut && allowedPairs.length > 0) {
            if (singleHopOnly) {
                return (
                    Trade.bestTradeExactOut(allowedPairs, currencyIn, currencyAmountOut, {
                        maxHops: 1,
                        maxNumResults: 1
                    })[0] ?? null
                )
            }
            // search through trades with varying hops, find best trade out of them
            let bestTradeSoFar: Trade | null = null
            for (let i = 1; i <= MAX_HOPS; i++) {
                const currentTrade =
                    Trade.bestTradeExactOut(allowedPairs, currencyIn, currencyAmountOut, {
                        maxHops: i,
                        maxNumResults: 1
                    })[0] ?? null
                if (isTradeBetter(bestTradeSoFar, currentTrade, BETTER_TRADE_LESS_HOPS_THRESHOLD)) {
                    bestTradeSoFar = currentTrade
                }
            }
            return bestTradeSoFar
        }
        return null
    }, [currencyIn, currencyAmountOut, allowedPairs, singleHopOnly])
}

export function useIsTransactionUnsupported(currencyIn?: Currency, currencyOut?: Currency): boolean {
    const unsupportedToken: { [address: string]: Token } = useUnsupportedTokens()
    const { chainId } = useActiveWeb3React()

    const tokenIn = wrappedCurrency(currencyIn, chainId)
    const tokenOut = wrappedCurrency(currencyOut, chainId)

    // if unsupported list loaded & either token on list, mark as unsupported
    if (unsupportedToken) {
        if (tokenIn && Object.keys(unsupportedToken).includes(tokenIn.address)) {
            return true
        }
        if (tokenOut && Object.keys(unsupportedToken).includes(tokenOut.address)) {
            return true
        }
    }

    return false
}
