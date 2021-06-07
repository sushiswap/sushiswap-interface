import {
    blocksQuery,
    ethPriceQuery,
    liquidityPositionSubsetQuery,
    miniChefPoolsQuery,
    poolsQuery,
    poolsV2Query,
    tokenQuery,
} from '../queries'
import {
    exchange,
    getBundle,
    getLiquidityPositionSubset,
    getMasterChefV1Farms,
    getSushiPrice,
    masterChefV1,
    masterChefV2,
    miniChef,
} from '../fetchers'
import useSWR, { SWRConfiguration } from 'swr'

import { ChainId } from '@sushiswap/sdk'
import useActiveWeb3React from '../../../hooks/useActiveWeb3React'

export * from './blocks'
export * from './exchange'

export function useMasterChefV1Farms(swrConfig = undefined) {
    const { chainId } = useActiveWeb3React()
    const res = useSWR(
        chainId === ChainId.MAINNET ? [chainId, poolsQuery] : null,
        (_, query) => masterChefV1(query),
        swrConfig
    )
    return res
}

export function useMasterChefV2Farms(swrConfig: SWRConfiguration = undefined) {
    const { chainId } = useActiveWeb3React()
    const res = useSWR(
        chainId === ChainId.MAINNET ? [chainId, poolsV2Query] : null,
        (_, query) => masterChefV2(query),
        swrConfig
    )
    return res
}

export function useMiniChefFarms(swrConfig: SWRConfiguration = undefined) {
    const { chainId } = useActiveWeb3React()
    const res = useSWR(
        chainId === ChainId.MATIC ? [chainId, miniChefPoolsQuery] : null,
        (_, query) => miniChef(query),
        swrConfig
    )
    return res
}

export function useExchange(
    query,
    variables,
    swrConfig: SWRConfiguration = undefined
) {
    const { chainId } = useActiveWeb3React()
    const res = useSWR([chainId, query, variables], exchange, swrConfig)
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
