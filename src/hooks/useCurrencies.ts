import { ADDITIONAL_BASES, BASES_TO_CHECK_TRADES_AGAINST, CUSTOM_BASES } from '../constants/routing'
import { Currency, Token } from '@sushiswap/sdk'

import flatMap from 'lodash/flatMap'
import { useActiveWeb3React } from './useActiveWeb3React'
import { useMemo } from 'react'
import { wrappedCurrency } from '../functions'

export function useCurrencies(currencyA?: Currency, currencyB?: Currency): [Token, Token][] {
    const { chainId } = useActiveWeb3React()

    //   const [tokenA, tokenB] = chainId ? [currencyA?.wrapped, currencyB?.wrapped] : [undefined, undefined]

    const [tokenA, tokenB] = useMemo(
        () => [wrappedCurrency(currencyA, chainId), wrappedCurrency(currencyB, chainId)],
        [currencyA, currencyB, chainId]
    )

    const bases: Token[] = useMemo(() => {
        if (!chainId) return []

        const common = BASES_TO_CHECK_TRADES_AGAINST[chainId] ?? []
        const additionalA = tokenA ? ADDITIONAL_BASES[chainId]?.[tokenA.address] ?? [] : []
        const additionalB = tokenB ? ADDITIONAL_BASES[chainId]?.[tokenB.address] ?? [] : []

        return [...common, ...additionalA, ...additionalB]
    }, [chainId, tokenA, tokenB])

    const basePairs: [Token, Token][] = useMemo(
        () => flatMap(bases, (base): [Token, Token][] => bases.map((otherBase) => [base, otherBase])),
        [bases]
    )

    return useMemo(
        () =>
            tokenA && tokenB
                ? [
                      // the direct pair
                      [tokenA, tokenB],
                      // token A against all bases
                      ...bases.map((base): [Token, Token] => [tokenA, base]),
                      // token B against all bases
                      ...bases.map((base): [Token, Token] => [tokenB, base]),
                      // each base against all bases
                      ...basePairs,
                  ]
                      .filter((tokens): tokens is [Token, Token] => Boolean(tokens[0] && tokens[1]))
                      .filter(([t0, t1]) => t0.address !== t1.address)
                      .filter(([tokenA, tokenB]) => {
                          if (!chainId) return true
                          const customBases = CUSTOM_BASES[chainId]

                          const customBasesA: Token[] | undefined = customBases?.[tokenA.address]
                          const customBasesB: Token[] | undefined = customBases?.[tokenB.address]

                          if (!customBasesA && !customBasesB) return true

                          if (customBasesA && !customBasesA.find((base) => tokenB.equals(base))) return false
                          if (customBasesB && !customBasesB.find((base) => tokenA.equals(base))) return false

                          return true
                      })
                : [],
        [tokenA, tokenB, bases, basePairs, chainId]
    )
}
