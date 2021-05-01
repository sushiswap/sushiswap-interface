import { Contract } from '@ethersproject/contracts'
import SUSHIROLL_ABI from '@sushiswap/core/abi/SushiRoll.json'
import {
    BAR_ADDRESS,
    ChainId,
    FACTORY_ADDRESS,
    MAKER_ADDRESS,
    MASTERCHEF_ADDRESS,
    ROUTER_ADDRESS,
    SUSHI_ADDRESS,
    TIMELOCK_ADDRESS,
    WETH
} from '@sushiswap/sdk'
import { abi as UNI_ABI } from '@uniswap/governance/build/Uni.json'
import { abi as STAKING_REWARDS_ABI } from '@uniswap/liquidity-staker/build/StakingRewards.json'
import { abi as MERKLE_DISTRIBUTOR_ABI } from '@uniswap/merkle-distributor/build/MerkleDistributor.json'
import { FACTORY_ADDRESS as UNI_FACTORY_ADDRESS } from '@uniswap/sdk'
import { abi as IUniswapV2PairABI } from '@uniswap/v2-core/build/IUniswapV2Pair.json'
import { abi as UNI_FACTORY_ABI } from '@uniswap/v2-core/build/UniswapV2Factory.json'
import {
    BENTOBOX_ADDRESS,
    CHAINLINK_ORACLE_ADDRESS,
    KASHI_ADDRESS,
    SUSHISWAP_SWAPPER_ADDRESS,
    SUSHISWAP_MULTISWAPPER_ADDRESS
} from 'kashi'
import { useMemo } from 'react'
import { BORING_HELPER_ADDRESS, MERKLE_DISTRIBUTOR_ADDRESS, SUSHI } from '../constants'
import {
    ARGENT_WALLET_DETECTOR_ABI,
    ARGENT_WALLET_DETECTOR_MAINNET_ADDRESS
} from '../constants/abis/argent-wallet-detector'
import BORING_HELPER_ABI from '../constants/abis/boring-helper.json'
import ENS_PUBLIC_RESOLVER_ABI from '../constants/abis/ens-public-resolver.json'
import ENS_ABI from '../constants/abis/ens-registrar.json'
import { ERC20_BYTES32_ABI } from '../constants/abis/erc20'
import ERC20_ABI from '../constants/abis/erc20.json'
import { MIGRATOR_ABI, MIGRATOR_ADDRESS } from '../constants/abis/migrator'
import WETH_ABI from '../constants/abis/weth.json'
import { MULTICALL_ABI, MULTICALL_NETWORKS } from '../constants/multicall'
import BAR_ABI from '../constants/abis/bar.json'
import BENTOBOX_ABI from '../constants/abis/bentobox.json'
import CHAINLINK_ORACLE_ABI from '../constants/abis/chainlink-oracle.json'
import DASHBOARD_ABI from '../constants/abis/dashboard.json'
import DASHBOARD2_ABI from '../constants/abis/dashboard2.json'
import FACTORY_ABI from '../constants/abis/factory.json'
import KASHIPAIR_ABI from '../constants/abis/kashipair.json'
import MAKER_ABI from '../constants/abis/maker.json'
import MASTERCHEF_ABI from '../constants/abis/masterchef.json'
import PENDING_ABI from '../constants/abis/pending.json'
import ROUTER_ABI from '../constants/abis/router.json'
import SAAVE_ABI from '../constants/abis/saave.json'
import SUSHI_ABI from '../constants/abis/sushi.json'
import BASE_SWAPPER_ABI from '../constants/abis/swapper.json'
import TIMELOCK_ABI from '../constants/abis/timelock.json'
import SUSHISWAP_MULTISWAPPER_ABI from '../constants/abis/sushiswapmultiswapper.json'
import ZAPPER_ABI from '../constants/abis/zapper.json'
import { V1_EXCHANGE_ABI, V1_FACTORY_ABI, V1_FACTORY_ADDRESSES } from '../constants/v1'
import { getContract } from '../utils'
import { useActiveWeb3React } from './index'

// returns null on errors
export function useContract(address: string | undefined, ABI: any, withSignerIfPossible = true): Contract | null {
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

export function useV1FactoryContract(): Contract | null {
    const { chainId } = useActiveWeb3React()
    return useContract(chainId && V1_FACTORY_ADDRESSES[chainId], V1_FACTORY_ABI, false)
}

export function useV2MigratorContract(): Contract | null {
    return useContract(MIGRATOR_ADDRESS, MIGRATOR_ABI, true)
}

export function useV1ExchangeContract(address?: string, withSignerIfPossible?: boolean): Contract | null {
    return useContract(address, V1_EXCHANGE_ABI, withSignerIfPossible)
}

export function useTokenContract(tokenAddress?: string, withSignerIfPossible?: boolean): Contract | null {
    return useContract(tokenAddress, ERC20_ABI, withSignerIfPossible)
}

export function useWETHContract(withSignerIfPossible?: boolean): Contract | null {
    const { chainId } = useActiveWeb3React()
    return useContract(chainId ? WETH[chainId].address : undefined, WETH_ABI, withSignerIfPossible)
}

export function useArgentWalletDetectorContract(): Contract | null {
    const { chainId } = useActiveWeb3React()
    return useContract(
        chainId === ChainId.MAINNET ? ARGENT_WALLET_DETECTOR_MAINNET_ADDRESS : undefined,
        ARGENT_WALLET_DETECTOR_ABI,
        false
    )
}

export function useENSRegistrarContract(withSignerIfPossible?: boolean): Contract | null {
    const { chainId } = useActiveWeb3React()
    let address: string | undefined
    if (chainId) {
        switch (chainId) {
            case ChainId.MAINNET:
            case ChainId.GÖRLI:
            case ChainId.ROPSTEN:
            case ChainId.RINKEBY:
                address = '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e'
                break
        }
    }
    return useContract(address, ENS_ABI, withSignerIfPossible)
}

export function useENSResolverContract(address: string | undefined, withSignerIfPossible?: boolean): Contract | null {
    return useContract(address, ENS_PUBLIC_RESOLVER_ABI, withSignerIfPossible)
}

export function useBytes32TokenContract(tokenAddress?: string, withSignerIfPossible?: boolean): Contract | null {
    return useContract(tokenAddress, ERC20_BYTES32_ABI, withSignerIfPossible)
}

export function usePairContract(pairAddress?: string, withSignerIfPossible?: boolean): Contract | null {
    return useContract(pairAddress, IUniswapV2PairABI, withSignerIfPossible)
}

export function useMerkleDistributorContract(): Contract | null {
    const { chainId } = useActiveWeb3React()
    return useContract(chainId ? MERKLE_DISTRIBUTOR_ADDRESS[chainId] : undefined, MERKLE_DISTRIBUTOR_ABI, true)
}

export function useUniContract(): Contract | null {
    const { chainId } = useActiveWeb3React()
    return useContract(chainId ? SUSHI[chainId]?.address : undefined, UNI_ABI, true)
}

export function useStakingContract(stakingAddress?: string, withSignerIfPossible?: boolean): Contract | null {
    return useContract(stakingAddress, STAKING_REWARDS_ABI, withSignerIfPossible)
}

export function useBoringHelperContract(): Contract | null {
    return useContract(BORING_HELPER_ADDRESS, BORING_HELPER_ABI, false)
}

export function usePendingContract(): Contract | null {
    return useContract('0x9aeadfE6cd03A2b5730474bF6dd79802d5bCD029', PENDING_ABI, false)
}

export function useMulticallContract(): Contract | null {
    const { chainId } = useActiveWeb3React()
    return useContract(chainId && MULTICALL_NETWORKS[chainId], MULTICALL_ABI, false)
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
    return useContract(chainId && ROUTER_ADDRESS[chainId], ROUTER_ABI, true)
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
    return useContract('0x364762C00b32c4b448f39efaA9CeFC67a25603ff', SAAVE_ABI, withSignerIfPossible)
}
export function useSwaave(withSignerIfPossible?: boolean): Contract | null {
    return useContract('0xA70e346Ca3825b46EB4c8d0d94Ff204DB76BC289', SAAVE_ABI, withSignerIfPossible)
}

export function useUniV2FactoryContract(): Contract | null {
    return useContract(UNI_FACTORY_ADDRESS, UNI_FACTORY_ABI, false)
}

export function usePancakeV1FactoryContract(): Contract | null {
    return useContract(
        '0xBCfCcbde45cE874adCB698cC183deBcF17952812',
        [
            {
                inputs: [{ internalType: 'address', name: '_feeToSetter', type: 'address' }],
                payable: false,
                stateMutability: 'nonpayable',
                type: 'constructor'
            },
            {
                anonymous: false,
                inputs: [
                    { indexed: true, internalType: 'address', name: 'token0', type: 'address' },
                    { indexed: true, internalType: 'address', name: 'token1', type: 'address' },
                    { indexed: false, internalType: 'address', name: 'pair', type: 'address' },
                    { indexed: false, internalType: 'uint256', name: '', type: 'uint256' }
                ],
                name: 'PairCreated',
                type: 'event'
            },
            {
                constant: true,
                inputs: [],
                name: 'INIT_CODE_PAIR_HASH',
                outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
                payable: false,
                stateMutability: 'view',
                type: 'function'
            },
            {
                constant: true,
                inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
                name: 'allPairs',
                outputs: [{ internalType: 'address', name: '', type: 'address' }],
                payable: false,
                stateMutability: 'view',
                type: 'function'
            },
            {
                constant: true,
                inputs: [],
                name: 'allPairsLength',
                outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
                payable: false,
                stateMutability: 'view',
                type: 'function'
            },
            {
                constant: false,
                inputs: [
                    { internalType: 'address', name: 'tokenA', type: 'address' },
                    { internalType: 'address', name: 'tokenB', type: 'address' }
                ],
                name: 'createPair',
                outputs: [{ internalType: 'address', name: 'pair', type: 'address' }],
                payable: false,
                stateMutability: 'nonpayable',
                type: 'function'
            },
            {
                constant: true,
                inputs: [],
                name: 'feeTo',
                outputs: [{ internalType: 'address', name: '', type: 'address' }],
                payable: false,
                stateMutability: 'view',
                type: 'function'
            },
            {
                constant: true,
                inputs: [],
                name: 'feeToSetter',
                outputs: [{ internalType: 'address', name: '', type: 'address' }],
                payable: false,
                stateMutability: 'view',
                type: 'function'
            },
            {
                constant: true,
                inputs: [
                    { internalType: 'address', name: '', type: 'address' },
                    { internalType: 'address', name: '', type: 'address' }
                ],
                name: 'getPair',
                outputs: [{ internalType: 'address', name: '', type: 'address' }],
                payable: false,
                stateMutability: 'view',
                type: 'function'
            },
            {
                constant: false,
                inputs: [{ internalType: 'address', name: '_feeTo', type: 'address' }],
                name: 'setFeeTo',
                outputs: [],
                payable: false,
                stateMutability: 'nonpayable',
                type: 'function'
            },
            {
                constant: false,
                inputs: [{ internalType: 'address', name: '_feeToSetter', type: 'address' }],
                name: 'setFeeToSetter',
                outputs: [],
                payable: false,
                stateMutability: 'nonpayable',
                type: 'function'
            }
        ],
        false
    )
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
            case ChainId.BSC:
                address = '0x677978dE066b3f5414eeA56644d9fCa3c75482a1'
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

            case ChainId.BSC:
                address = '0xCFbc963f223e39727e7d4075b759E97035457b48'
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
            case ChainId.BSC:
                address = '0x06d149A4a3f4Ac20e992F9321Af571b3B4Da64C4'
                break
        }
    }
    return useContract(address, DASHBOARD2_ABI, false)
}

export function useSushiSwapMultiSwapper(): Contract | null {
    const { chainId } = useActiveWeb3React()
    return useContract(chainId && SUSHISWAP_MULTISWAPPER_ADDRESS[chainId], SUSHISWAP_MULTISWAPPER_ABI)
}

export function useZapperContract(withSignerIfPossible?: boolean): Contract | null {
    const { chainId } = useActiveWeb3React()
    let address: string | undefined
    if (chainId) {
        switch (chainId) {
            case ChainId.MAINNET:
                address = '0xcff6eF0B9916682B37D80c19cFF8949bc1886bC2'
                break
            case ChainId.ROPSTEN:
                address = '0x169c54a9826caf9f14bd30688296021533fe23ae'
                break
        }
    }
    return useContract(address, ZAPPER_ABI, withSignerIfPossible)
}
