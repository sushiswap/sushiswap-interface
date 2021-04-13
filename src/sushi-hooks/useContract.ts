import { Contract } from '@ethersproject/contracts'
import { ChainId } from '@sushiswap/sdk'
import { useMemo } from 'react'

import ERC20_ABI from '../constants/sushiAbis/erc20.json'
import SUSHI_ABI from '../constants/sushiAbis/sushi.json'
import MASTERCHEF_ABI from '../constants/sushiAbis/masterchef.json'
import FACTORY_ABI from '../constants/sushiAbis/factory.json'
import ROUTER_ABI from '../constants/sushiAbis/router.json'
import BAR_ABI from '../constants/sushiAbis/bar.json'
import MAKER_ABI from '../constants/sushiAbis/maker.json'
import TIMELOCK_ABI from '../constants/sushiAbis/timelock.json'

import BENTOBOX_ABI from '../constants/sushiAbis/bentobox.json'
import KASHIPAIR_ABI from '../constants/sushiAbis/kashipair.json'
import KASHIPAIRHELPER_ABI from '../constants/sushiAbis/kashipairhelper.json'
import BASE_SWAPPER_ABI from '../constants/sushiAbis/swapper.json'
import CHAINLINK_ORACLE_ABI from '../constants/sushiAbis/chainlinkOracle.json'

import SAAVE_ABI from '../constants/sushiAbis/saave.json'
import { abi as UNI_FACTORY_ABI } from '@uniswap/v2-core/build/UniswapV2Factory.json'
import SUSHIROLL_ABI from '@sushiswap/core/build/abi/SushiRoll.json'

import DASHBOARD_ABI from '../constants/sushiAbis/dashboard.json'
import DASHBOARD2_ABI from '../constants/sushiAbis/dashboard2.json'
import PENDING_ABI from '../constants/sushiAbis/pending.json'

import { MULTICALL_ABI, MULTICALL_NETWORKS } from '../constants/multicall'
import { getContract } from '../utils'
import { useActiveWeb3React } from '../hooks/index'
import { FACTORY_ADDRESS as UNI_FACTORY_ADDRESS } from '@uniswap/sdk'

// Factory address already in SDK
import {
    FACTORY_ADDRESS,
    SUSHI_ADDRESS,
    MASTERCHEF_ADDRESS,
    BAR_ADDRESS,
    MAKER_ADDRESS,
    TIMELOCK_ADDRESS,
    ROUTER_ADDRESS
} from '@sushiswap/sdk'

import {
    BENTOBOX_ADDRESS,
    KASHI_ADDRESS,
    KASHI_HELPER_ADDRESS,
    SUSHISWAP_SWAPPER_ADDRESS,
    CHAINLINK_ORACLE_ADDRESS
} from 'kashi'

// returns null on errors
export function useContract(
    address: string | undefined | false,
    ABI: any,
    withSignerIfPossible = true
): Contract | null {
    const { library, account } = useActiveWeb3React()

    return useMemo(() => {
        if (!address || !ABI || !library) return null
        try {
            return getContract(address, ABI, library, withSignerIfPossible && account ? account : undefined)
        } catch (error) {
            console.error('Failed to get contract', error)
            return null
        }
    }, [address, ABI, library, withSignerIfPossible, account])
}

export function usePendingContract(): Contract | null {
    const { chainId } = useActiveWeb3React()
    let address: string | undefined
    if (chainId) {
        switch (chainId) {
            case ChainId.MAINNET:
                address = '0x9aeadfE6cd03A2b5730474bF6dd79802d5bCD029'
                break
        }
    }
    return useContract(address, PENDING_ABI, false)
}

export function useMulticallContract(): Contract | null {
    const { chainId } = useActiveWeb3React()
    return useContract(chainId && MULTICALL_NETWORKS[chainId], MULTICALL_ABI, false)
}

export function useTokenContract(tokenAddress?: string, withSignerIfPossible?: boolean): Contract | null {
    return useContract(tokenAddress, ERC20_ABI, withSignerIfPossible)
}

export function useSushiContract(withSignerIfPossible = true): Contract | null {
    const { chainId } = useActiveWeb3React()
    return useContract(chainId && SUSHI_ADDRESS[chainId], SUSHI_ABI, withSignerIfPossible)
}

export function useMasterChefContract(withSignerIfPossible?: boolean): Contract | null {
    const { chainId } = useActiveWeb3React()
    return useContract(chainId && MASTERCHEF_ADDRESS[chainId], MASTERCHEF_ABI, withSignerIfPossible)
}

export function useFactoryContract(): Contract | null {
    const { chainId } = useActiveWeb3React()
    return useContract(chainId && FACTORY_ADDRESS[chainId], FACTORY_ABI, false)
}

export function useRouterContract(): Contract | null {
    const { chainId } = useActiveWeb3React()
    return useContract(chainId && ROUTER_ADDRESS[chainId], ROUTER_ABI, false)
}

export function useSushiBarContract(withSignerIfPossible?: boolean): Contract | null {
    const { chainId } = useActiveWeb3React()
    return useContract(chainId && BAR_ADDRESS[chainId], BAR_ABI, withSignerIfPossible)
}

export function useMakerContract(): Contract | null {
    const { chainId } = useActiveWeb3React()
    return useContract(chainId && MAKER_ADDRESS[chainId], MAKER_ABI, false)
}

export function useTimelockContract(): Contract | null {
    const { chainId } = useActiveWeb3React()
    return useContract(chainId && TIMELOCK_ADDRESS[chainId], TIMELOCK_ABI, false)
}

export function useBentoBoxContract(withSignerIfPossible?: boolean): Contract | null {
    return useContract(BENTOBOX_ADDRESS, BENTOBOX_ABI, withSignerIfPossible)
}

export function useKashiPairContract(withSignerIfPossible?: boolean): Contract | null {
    return useContract(KASHI_ADDRESS, KASHIPAIR_ABI, withSignerIfPossible)
}

export function useSushiSwapSwapper(): Contract | null {
    return useContract(SUSHISWAP_SWAPPER_ADDRESS, BASE_SWAPPER_ABI, false)
}

export function useChainlinkOracle(): Contract | null {
    return useContract(CHAINLINK_ORACLE_ADDRESS, CHAINLINK_ORACLE_ABI, false)
}

// experimental:
export function useSaaveContract(withSignerIfPossible?: boolean): Contract | null {
    const { chainId } = useActiveWeb3React()
    let address: string | undefined
    if (chainId) {
        switch (chainId) {
            case ChainId.MAINNET:
                address = '0x364762C00b32c4b448f39efaA9CeFC67a25603ff'
                break
        }
    }
    return useContract(address, SAAVE_ABI, withSignerIfPossible)
}
export function useSwaave(withSignerIfPossible?: boolean): Contract | null {
    const { chainId } = useActiveWeb3React()
    let address: string | undefined
    if (chainId) {
        switch (chainId) {
            case ChainId.MAINNET:
                address = '0xA70e346Ca3825b46EB4c8d0d94Ff204DB76BC289'
                break
        }
    }
    return useContract(address, SAAVE_ABI, withSignerIfPossible)
}

// legacy:
export function useKashiPairHelperContract(withSignerIfPossible?: boolean): Contract | null {
    const { chainId } = useActiveWeb3React()
    return useContract(chainId ? KASHI_HELPER_ADDRESS[chainId] : undefined, KASHIPAIRHELPER_ABI, withSignerIfPossible)
}

export function useUniV2FactoryContract(): Contract | null {
    return useContract(UNI_FACTORY_ADDRESS, UNI_FACTORY_ABI, false)
}

export function useSushiRollContract(): Contract | null {
    const { chainId } = useActiveWeb3React()
    let address: string | undefined
    if (chainId) {
        switch (chainId) {
            case ChainId.MAINNET:
                address = '0x16E58463eb9792Bc236d8860F5BC69A81E26E32B'
                break
            case ChainId.ROPSTEN:
                address = '0xCaAbdD9Cf4b61813D4a52f980d6BC1B713FE66F5'
                break
        }
    }
    return useContract(address, SUSHIROLL_ABI, true)
}

export function useDashboardContract(): Contract | null {
    const { chainId } = useActiveWeb3React()
    let address: string | undefined
    if (chainId) {
        switch (chainId) {
            case ChainId.MAINNET:
                address = '0xD132Ce8eA8865348Ac25E416d95ab1Ba84D216AF'
                break
            case ChainId.ROPSTEN:
                address = '0xC95678C10CB8b3305b694FF4bfC14CDB8aD3AB35'
                break
        }
    }
    return useContract(address, DASHBOARD_ABI, false)
}

export function useDashboard2Contract(): Contract | null {
    const { chainId } = useActiveWeb3React()
    let address: string | undefined
    if (chainId) {
        switch (chainId) {
            case ChainId.MAINNET:
                address = '0x1B13fC91c6f976959E7c236Ac1CF17E052d113Fc'
                break
            case ChainId.ROPSTEN:
                address = '0xbB7091524A6a42228E396480C9C43f1C4f6c50e2'
                break
        }
    }
    return useContract(address, DASHBOARD2_ABI, false)
}
