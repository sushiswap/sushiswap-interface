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
    const res = useSWR(
        [
            'liquidityPositionSubset',
            chainId,
            liquidityPositionSubsetQuery,
            user,
        ],
        (_, chainId, liquidityPositionSubsetQuery, user) =>
            getLiquidityPositionSubset(
                chainId,
                liquidityPositionSubsetQuery,
                user
            ),
        swrConfig
    )
    return res
}

export function usePairs(swrConfig: SWRConfiguration = undefined) {
    const { chainId } = useActiveWeb3React()

    const res = useSWR(
        ['pairs', chainId],
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

    const res = useSWR(
        ['pairSubset', chainId, pairAddresses],
        (_, chainId, pairAddresses) =>
            getPairSubset(chainId, { pairAddresses }),
        swrConfig
    )

    return res
}
