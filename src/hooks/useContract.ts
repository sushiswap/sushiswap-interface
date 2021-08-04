import { ARCHER_ROUTER_ADDRESS, MINICHEF_ADDRESS, MULTICALL2_ADDRESS, ZAPPER_ADDRESS } from '../constants/addresses'
import {
  ARGENT_WALLET_DETECTOR_ABI,
  ARGENT_WALLET_DETECTOR_MAINNET_ADDRESS,
} from '../constants/abis/argent-wallet-detector'
import {
  BAR_ADDRESS,
  ChainId,
  FACTORY_ADDRESS,
  MAKER_ADDRESS,
  MASTERCHEF_ADDRESS,
  ROUTER_ADDRESS,
  SUSHI_ADDRESS,
  TIMELOCK_ADDRESS,
  WNATIVE,
} from '@sushiswap/sdk'
import {
  BENTOBOX_ADDRESS,
  BORING_HELPER_ADDRESS,
  CHAINLINK_ORACLE_ADDRESS,
  KASHI_ADDRESS,
  SUSHISWAP_SWAPPER_ADDRESS,
  SUSHISWAP_TWAP_0_ORACLE_ADDRESS,
  SUSHISWAP_TWAP_1_ORACLE_ADDRESS,
} from '../constants/kashi'
import { MERKLE_DISTRIBUTOR_ADDRESS, SUSHI } from '../constants'

import ALCX_REWARDER_ABI from '../constants/abis/alcx-rewarder.json'
import ARCHER_ROUTER_ABI from '../constants/abis/archer-router.json'
import BAR_ABI from '../constants/abis/bar.json'
import BASE_SWAPPER_ABI from '../constants/abis/swapper.json'
import BENTOBOX_ABI from '../constants/abis/bentobox.json'
import BORING_HELPER_ABI from '../constants/abis/boring-helper.json'
import CHAINLINK_ORACLE_ABI from '../constants/abis/chainlink-oracle.json'
import CLONE_REWARDER_ABI from '../constants/abis/clone-rewarder.json'
import COMPLEX_REWARDER_ABI from '../constants/abis/complex-rewarder.json'
import { Contract } from '@ethersproject/contracts'
import DASHBOARD_ABI from '../constants/abis/dashboard.json'
import EIP_2612_ABI from '../constants/abis/eip-2612.json'
import ENS_ABI from '../constants/abis/ens-registrar.json'
import ENS_PUBLIC_RESOLVER_ABI from '../constants/abis/ens-public-resolver.json'
import ERC20_ABI from '../constants/abis/erc20.json'
import { ERC20_BYTES32_ABI } from '../constants/abis/erc20'
import FACTORY_ABI from '../constants/abis/factory.json'
import INARI_ABI from '../constants/abis/inari.json'
import IUniswapV2PairABI from '../constants/abis/uniswap-v2-pair.json'
import KASHIPAIR_ABI from '../constants/abis/kashipair.json'
import LIMIT_ORDER_ABI from '../constants/abis/limit-order.json'
import LIMIT_ORDER_HELPER_ABI from '../constants/abis/limit-order-helper.json'
import MAKER_ABI from '../constants/abis/maker.json'
import MASTERCHEF_ABI from '../constants/abis/masterchef.json'
import MASTERCHEF_V2_ABI from '../constants/abis/masterchef-v2.json'
import MEOWSHI_ABI from '../constants/abis/meowshi.json'
import MERKLE_DISTRIBUTOR_ABI from '../constants/abis/merkle-distributor.json'
import MINICHEF_ABI from '../constants/abis/minichef-v2.json'
import MULTICALL2_ABI from '../constants/abis/multicall2.json'
import PENDING_ABI from '../constants/abis/pending.json'
import ROUTER_ABI from '../constants/abis/router.json'
import SAAVE_ABI from '../constants/abis/saave.json'
import SUSHIROLL_ABI from '@sushiswap/core/abi/SushiRoll.json'
import SUSHISWAP_TWAP_ORACLE_ABI from '../constants/abis/sushiswap-slp-oracle.json'
import SUSHI_ABI from '../constants/abis/sushi.json'
import TIMELOCK_ABI from '../constants/abis/timelock.json'
import UNI_FACTORY_ABI from '../constants/abis/uniswap-v2-factory.json'
import WETH9_ABI from '../constants/abis/weth.json'
import ZAPPER_ABI from '../constants/abis/zapper.json'
import ZENKO_ABI from '../constants/abis/zenko.json'
import { getContract } from '../functions/contract'
import { getVerifyingContract } from 'limitorderv2-sdk'
import { useActiveWeb3React } from './useActiveWeb3React'
import { useMemo } from 'react'

const UNI_FACTORY_ADDRESS = '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f'

export function useEIP2612Contract(tokenAddress?: string): Contract | null {
  return useContract(tokenAddress, EIP_2612_ABI, false)
}

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

export function useTokenContract(tokenAddress?: string, withSignerIfPossible?: boolean): Contract | null {
  return useContract(tokenAddress, ERC20_ABI, withSignerIfPossible)
}

export function useWETH9Contract(withSignerIfPossible?: boolean): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId ? WNATIVE[chainId].address : undefined, WETH9_ABI, withSignerIfPossible)
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

export function useBoringHelperContract(): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId && BORING_HELPER_ADDRESS[chainId], BORING_HELPER_ABI, false)
}

export function usePendingContract(): Contract | null {
  return useContract('0x9aeadfE6cd03A2b5730474bF6dd79802d5bCD029', PENDING_ABI, false)
}

export function useMulticall2Contract() {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId && MULTICALL2_ADDRESS[chainId], MULTICALL2_ABI, false)
}

export function useSushiContract(withSignerIfPossible = true): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId && SUSHI_ADDRESS[chainId], SUSHI_ABI, withSignerIfPossible)
}

export function useMasterChefContract(withSignerIfPossible?: boolean): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId && MASTERCHEF_ADDRESS[chainId], MASTERCHEF_ABI, withSignerIfPossible)
}

export function useMasterChefV2Contract(withSignerIfPossible?: boolean): Contract | null {
  return useContract('0xEF0881eC094552b2e128Cf945EF17a6752B4Ec5d', MASTERCHEF_V2_ABI, withSignerIfPossible)
}
export function useMiniChefContract(withSignerIfPossible?: boolean): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId && MINICHEF_ADDRESS[chainId], MINICHEF_ABI, withSignerIfPossible)
}

export function useFactoryContract(): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId && FACTORY_ADDRESS[chainId], FACTORY_ABI, false)
}

export function useRouterContract(useArcher = false, withSignerIfPossible?: boolean): Contract | null {
  const { chainId } = useActiveWeb3React()

  const address = useArcher ? ARCHER_ROUTER_ADDRESS[chainId] : ROUTER_ADDRESS[chainId]
  const abi = useArcher ? ARCHER_ROUTER_ABI : ROUTER_ABI

  return useContract(address, abi, withSignerIfPossible)
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
  const { chainId } = useActiveWeb3React()
  return useContract(chainId && BENTOBOX_ADDRESS[chainId], BENTOBOX_ABI, withSignerIfPossible)
}

export function useKashiPairContract(withSignerIfPossible?: boolean): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId && KASHI_ADDRESS[chainId], KASHIPAIR_ABI, withSignerIfPossible)
}

export function useKashiPairCloneContract(address: string, withSignerIfPossible?: boolean): Contract | null {
  return useContract(address, KASHIPAIR_ABI, withSignerIfPossible)
}

export function useSushiSwapSwapper(): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId && SUSHISWAP_SWAPPER_ADDRESS[chainId], BASE_SWAPPER_ABI, false)
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
        inputs: [
          {
            internalType: 'address',
            name: '_feeToSetter',
            type: 'address',
          },
        ],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'constructor',
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: 'address',
            name: 'token0',
            type: 'address',
          },
          {
            indexed: true,
            internalType: 'address',
            name: 'token1',
            type: 'address',
          },
          {
            indexed: false,
            internalType: 'address',
            name: 'pair',
            type: 'address',
          },
          {
            indexed: false,
            internalType: 'uint256',
            name: '',
            type: 'uint256',
          },
        ],
        name: 'PairCreated',
        type: 'event',
      },
      {
        constant: true,
        inputs: [],
        name: 'INIT_CODE_PAIR_HASH',
        outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      {
        constant: true,
        inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        name: 'allPairs',
        outputs: [{ internalType: 'address', name: '', type: 'address' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      {
        constant: true,
        inputs: [],
        name: 'allPairsLength',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      {
        constant: false,
        inputs: [
          {
            internalType: 'address',
            name: 'tokenA',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'tokenB',
            type: 'address',
          },
        ],
        name: 'createPair',
        outputs: [{ internalType: 'address', name: 'pair', type: 'address' }],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        constant: true,
        inputs: [],
        name: 'feeTo',
        outputs: [{ internalType: 'address', name: '', type: 'address' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      {
        constant: true,
        inputs: [],
        name: 'feeToSetter',
        outputs: [{ internalType: 'address', name: '', type: 'address' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      {
        constant: true,
        inputs: [
          { internalType: 'address', name: '', type: 'address' },
          { internalType: 'address', name: '', type: 'address' },
        ],
        name: 'getPair',
        outputs: [{ internalType: 'address', name: '', type: 'address' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      {
        constant: false,
        inputs: [
          {
            internalType: 'address',
            name: '_feeTo',
            type: 'address',
          },
        ],
        name: 'setFeeTo',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        constant: false,
        inputs: [
          {
            internalType: 'address',
            name: '_feeToSetter',
            type: 'address',
          },
        ],
        name: 'setFeeToSetter',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
      },
    ],
    false
  )
}

export function useSushiRollContract(version: 'v1' | 'v2' = 'v2'): Contract | null {
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
        if (version === 'v1') {
          address = '0x677978dE066b3f5414eeA56644d9fCa3c75482a1'
        } else if (version === 'v2') {
          address = '0x2DD1aB1956BeD7C2d938d0d7378C22Fd01135a5e'
        }
        break
      case ChainId.MATIC:
        address = '0x0053957E18A0994D3526Cf879A4cA7Be88e8936A'
        break
    }
  }
  return useContract(address, SUSHIROLL_ABI, true)
}

// export function usePancakeRollV1Contract(): Contract | null {
//     return useContract('0x677978dE066b3f5414eeA56644d9fCa3c75482a1', SUSHIROLL_ABI, true)
// }

// export function usePancakeRollV2Contract(): Contract | null {
//     return useContract('', SUSHIROLL_ABI, true)
// }

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

export function useSushiSwapTWAP0Oracle(): Contract | null {
  return useContract(SUSHISWAP_TWAP_0_ORACLE_ADDRESS, SUSHISWAP_TWAP_ORACLE_ABI)
}

export function useSushiSwapTWAP1Oracle(): Contract | null {
  return useContract(SUSHISWAP_TWAP_1_ORACLE_ADDRESS, SUSHISWAP_TWAP_ORACLE_ABI)
}

export function useSushiSwapTWAPContract(address?: string): Contract | null {
  const TWAP_0 = useContract(SUSHISWAP_TWAP_0_ORACLE_ADDRESS, SUSHISWAP_TWAP_ORACLE_ABI)
  const TWAP_1 = useContract(SUSHISWAP_TWAP_1_ORACLE_ADDRESS, SUSHISWAP_TWAP_ORACLE_ABI)
  if (address === SUSHISWAP_TWAP_0_ORACLE_ADDRESS) {
    return TWAP_0
  } else if (address === SUSHISWAP_TWAP_1_ORACLE_ADDRESS) {
    return TWAP_1
  }
  return undefined
}

export function useZapperContract(withSignerIfPossible?: boolean): Contract | null {
  const { chainId } = useActiveWeb3React()
  const address = ZAPPER_ADDRESS[chainId]
  return useContract(address, ZAPPER_ABI, withSignerIfPossible)
}

export function useQuickSwapFactoryContract(): Contract | null {
  return useContract(
    '0x5757371414417b8C6CAad45bAeF941aBc7d3Ab32',
    [
      {
        type: 'constructor',
        stateMutability: 'nonpayable',
        payable: false,
        inputs: [
          {
            type: 'address',
            name: '_feeToSetter',
            internalType: 'address',
          },
        ],
      },
      {
        type: 'event',
        name: 'PairCreated',
        inputs: [
          {
            type: 'address',
            name: 'token0',
            internalType: 'address',
            indexed: true,
          },
          {
            type: 'address',
            name: 'token1',
            internalType: 'address',
            indexed: true,
          },
          {
            type: 'address',
            name: 'pair',
            internalType: 'address',
            indexed: false,
          },
          {
            type: 'uint256',
            name: '',
            internalType: 'uint256',
            indexed: false,
          },
        ],
        anonymous: false,
      },
      {
        type: 'function',
        stateMutability: 'view',
        payable: false,
        outputs: [{ type: 'address', name: '', internalType: 'address' }],
        name: 'allPairs',
        inputs: [{ type: 'uint256', name: '', internalType: 'uint256' }],
        constant: true,
      },
      {
        type: 'function',
        stateMutability: 'view',
        payable: false,
        outputs: [{ type: 'uint256', name: '', internalType: 'uint256' }],
        name: 'allPairsLength',
        inputs: [],
        constant: true,
      },
      {
        type: 'function',
        stateMutability: 'nonpayable',
        payable: false,
        outputs: [{ type: 'address', name: 'pair', internalType: 'address' }],
        name: 'createPair',
        inputs: [
          {
            type: 'address',
            name: 'tokenA',
            internalType: 'address',
          },
          {
            type: 'address',
            name: 'tokenB',
            internalType: 'address',
          },
        ],
        constant: false,
      },
      {
        type: 'function',
        stateMutability: 'view',
        payable: false,
        outputs: [{ type: 'address', name: '', internalType: 'address' }],
        name: 'feeTo',
        inputs: [],
        constant: true,
      },
      {
        type: 'function',
        stateMutability: 'view',
        payable: false,
        outputs: [{ type: 'address', name: '', internalType: 'address' }],
        name: 'feeToSetter',
        inputs: [],
        constant: true,
      },
      {
        type: 'function',
        stateMutability: 'view',
        payable: false,
        outputs: [{ type: 'address', name: '', internalType: 'address' }],
        name: 'getPair',
        inputs: [
          { type: 'address', name: '', internalType: 'address' },
          { type: 'address', name: '', internalType: 'address' },
        ],
        constant: true,
      },
      {
        type: 'function',
        stateMutability: 'nonpayable',
        payable: false,
        outputs: [],
        name: 'setFeeTo',
        inputs: [
          {
            type: 'address',
            name: '_feeTo',
            internalType: 'address',
          },
        ],
        constant: false,
      },
      {
        type: 'function',
        stateMutability: 'nonpayable',
        payable: false,
        outputs: [],
        name: 'setFeeToSetter',
        inputs: [
          {
            type: 'address',
            name: '_feeToSetter',
            internalType: 'address',
          },
        ],
        constant: false,
      },
    ],
    false
  )
}

export function useComplexRewarderContract(address, withSignerIfPossible?: boolean): Contract | null {
  return useContract(address, COMPLEX_REWARDER_ABI, withSignerIfPossible)
}

export function useAlcxRewarderContract(withSignerIfPossible?: boolean): Contract | null {
  return useContract('0x7519C93fC5073E15d89131fD38118D73A72370F8', ALCX_REWARDER_ABI, withSignerIfPossible)
}

export function useCloneRewarderContract(address, withSignerIfPossibe?: boolean): Contract | null {
  return useContract(address, CLONE_REWARDER_ABI, withSignerIfPossibe)
}

export function useMeowshiContract(withSignerIfPossible?: boolean): Contract | null {
  return useContract('0x650F44eD6F1FE0E1417cb4b3115d52494B4D9b6D', MEOWSHI_ABI, withSignerIfPossible)
}

export function useLimitOrderContract(withSignerIfPossibe?: boolean): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(getVerifyingContract(chainId), LIMIT_ORDER_ABI, withSignerIfPossibe)
}

export function useLimitOrderHelperContract(withSignerIfPossible?: boolean): Contract | null {
  return useContract('0xe2f736B7d1f6071124CBb5FC23E93d141CD24E12', LIMIT_ORDER_HELPER_ABI, withSignerIfPossible)
}

export function useInariContract(withSignerIfPossible?: boolean): Contract | null {
  return useContract('0x195E8262AA81Ba560478EC6Ca4dA73745547073f', INARI_ABI, withSignerIfPossible)
}

export function useZenkoContract(withSignerIfPossible?: boolean): Contract | null {
  return useContract('0xa8f676c49f91655ab3b7c3ea2b73bb3088b2bc1f', ZENKO_ABI, withSignerIfPossible)
}
