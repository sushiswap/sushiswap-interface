import {
    ethPriceQuery,
    liquidityPositionSubsetQuery,
    pairSubsetQuery,
    tokenQuery,
} from '../queries'
import {
    exchange,
    getBundle,
    getLiquidityPositionSubset,
    getSushiPrice,
} from '../fetchers'
import { getEthPrice, getPairSubset, getPairs } from '../fetchers'
import useSWR, { SWRConfiguration } from 'swr'

import { ChainId } from '@sushiswap/sdk'
import { useActiveWeb3React } from '../../../hooks'

export function useExchange(
    query,
    variables,
    swrConfig: SWRConfiguration = undefined
) {
    const { chainId } = useActiveWeb3React()
    const res = useSWR([chainId, query, variables], exchange, swrConfig)
    return res
}

export function useEthPrice(swrConfig: SWRConfiguration = undefined) {
    const res = useSWR('ethPrice', () => getEthPrice(), swrConfig)
    return res
}

export function useSushiPrice(swrConfig: SWRConfiguration = undefined) {
    const res = useSWR('sushiPrice', () => getSushiPrice(), swrConfig)
    return res
}

export function useBundle(swrConfig: SWRConfiguration = undefined) {
    const res = useSWR([ChainId.MAINNET, ethPriceQuery], getBundle, swrConfig)
    return res
}

export function useLiquidityPositionSubset(
    user,
    swrConfig: SWRConfiguration = undefined
) {
    const { chainId } = useActiveWeb3React()
    const shouldFetch = chainId && user
    const res = useSWR(
        shouldFetch ? ['liquidityPositionSubset', chainId, user] : null,
        (_, chainId, user) => getLiquidityPositionSubset(chainId, user),
        swrConfig
    )
    return res
}

export function usePairs(swrConfig: SWRConfiguration = undefined) {
    const { chainId } = useActiveWeb3React()
    const shouldFetch = chainId
    const res = useSWR(
        shouldFetch ? ['pairs', chainId] : null,
        (_, chainId) => getPairs(chainId),
        swrConfig
    )

    return res
}

export function usePairSubset(
    pairAddresses,
    swrConfig: SWRConfiguration = undefined
) {
    const { chainId } = useActiveWeb3React()

    const shouldFetch = chainId && pairAddresses && pairAddresses.length

    const res = useSWR(
        shouldFetch ? ['pairSubset', chainId, pairAddresses] : null,
        (_, chainId, pairAddresses) =>
            getPairSubset(chainId, { pairAddresses }),
        swrConfig
    )

    return res
}
