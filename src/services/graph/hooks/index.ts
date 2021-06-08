import {
    getMasterChefV1Farms,
    getMasterChefV2Farms,
    getMiniChefFarms,
} from '../fetchers'
import useSWR, { SWRConfiguration } from 'swr'

import { ChainId } from '@sushiswap/sdk'
import useActiveWeb3React from '../../../hooks/useActiveWeb3React'

export * from './blocks'
export * from './exchange'

export function useMasterChefV1Farms(swrConfig = undefined) {
    const { chainId } = useActiveWeb3React()
    const shouldFetch = chainId && chainId === ChainId.MAINNET
    const res = useSWR(
        shouldFetch ? 'masterChefV1Farms' : null,
        () => getMasterChefV1Farms(),
        swrConfig
    )
    return res
}

export function useMasterChefV2Farms(swrConfig: SWRConfiguration = undefined) {
    const { chainId } = useActiveWeb3React()
    const shouldFetch = chainId && chainId === ChainId.MAINNET
    const res = useSWR(
        shouldFetch ? 'masterChefV2Farms' : null,
        () => getMasterChefV2Farms(),
        swrConfig
    )
    return res
}

export function useMiniChefFarms(swrConfig: SWRConfiguration = undefined) {
    const { chainId } = useActiveWeb3React()
    const shouldFetch = chainId && chainId === ChainId.MATIC
    const res = useSWR(
        shouldFetch ? 'miniChefFarms' : null,
        () => getMiniChefFarms(),
        swrConfig
    )
    return res
}
