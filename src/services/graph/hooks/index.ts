import { masterChefV1, masterChefV2, miniChef } from '../fetchers'
import { miniChefPoolsQuery, poolsQuery, poolsV2Query } from '../queries'
import useSWR, { SWRConfiguration } from 'swr'

import { ChainId } from '@sushiswap/sdk'
import useActiveWeb3React from '../../../hooks/useActiveWeb3React'

export * from './blocks'
export * from './exchange'

export function useMasterChefV1Farms(swrConfig = undefined) {
    const { chainId } = useActiveWeb3React()
    const shouldFetch = chainId && chainId === ChainId.MAINNET
    const res = useSWR(
        shouldFetch ? [chainId, poolsQuery] : null,
        (_, query) => masterChefV1(query),
        swrConfig
    )
    return res
}

export function useMasterChefV2Farms(swrConfig: SWRConfiguration = undefined) {
    const { chainId } = useActiveWeb3React()
    const shouldFetch = chainId && chainId === ChainId.MAINNET
    const res = useSWR(
        shouldFetch ? [chainId, poolsV2Query] : null,
        (_, query) => masterChefV2(query),
        swrConfig
    )
    return res
}

export function useMiniChefFarms(swrConfig: SWRConfiguration = undefined) {
    const { chainId } = useActiveWeb3React()
    const shouldFetch = chainId && chainId === ChainId.MATIC
    const res = useSWR(
        shouldFetch ? [chainId, miniChefPoolsQuery] : null,
        (_, query) => miniChef(query),
        swrConfig
    )
    return res
}
