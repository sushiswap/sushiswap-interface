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
import BASEINFO_ABI from '../constants/sushiAbis/baseInfo.json'
import USERINFO_ABI from '../constants/sushiAbis/userInfo.json'
import MAKERINFO_ABI from '../constants/sushiAbis/makerInfo.json'
import DASHBOARD_ABI from '../constants/sushiAbis/dashboard.json'
import DASHBOARD2_ABI from '../constants/sushiAbis/dashboard2.json'
import PENDING_ABI from '../constants/sushiAbis/pending.json'

import BENTOBOX_ABI from '../constants/sushiAbis/bentobox.json'
import KASHIPAIR_ABI from '../constants/sushiAbis/kashipair.json'
import BENTOHELPER_ABI from '../constants/sushiAbis/bentoHelper2.json'
import KASHIPAIRHELPER_ABI from '../constants/sushiAbis/kashipairhelper.json'

import SAAVE_ABI from '../constants/sushiAbis/saave.json'

import { MULTICALL_ABI, MULTICALL_NETWORKS } from '../constants/multicall'
import { getContract } from '../utils'
import { useActiveWeb3React } from '../hooks/index'

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

// TODO: Leaving these alone for now, since I'm unsure of whether these should
// live in sushiswap/sdk or somewhere else. Sync with Bart on BentoBox.
export function useBentoBoxContract(withSignerIfPossible?: boolean): Contract | null {
  const { chainId } = useActiveWeb3React()
  let address: string | undefined
  if (chainId) {
    switch (chainId) {
      case ChainId.MAINNET:
        address = '0xB5891167796722331b7ea7824F036b3Bdcb4531C'
        break
      case ChainId.ROPSTEN:
        address = '0xB5891167796722331b7ea7824F036b3Bdcb4531C'
        break
    }
  }
  return useContract(address, BENTOBOX_ABI, withSignerIfPossible)
}

export function useKashiPairContract(withSignerIfPossible?: boolean): Contract | null {
  const { chainId } = useActiveWeb3React()
  let address: string | undefined
  if (chainId) {
    switch (chainId) {
      case ChainId.MAINNET:
        address = '0x009e9cFaD18132D9fB258984196191BdB6D58CFF'
        break
      case ChainId.ROPSTEN:
        address = '0x009e9cFaD18132D9fB258984196191BdB6D58CFF'
        //address = '0xd43960bF734ACaFE8BDb6DCF53212eF58a5FA4f3'
        break
    }
  }
  return useContract(address, KASHIPAIR_ABI, withSignerIfPossible)
}

export function useKashiPairHelperContract(withSignerIfPossible?: boolean): Contract | null {
  const { chainId } = useActiveWeb3React()
  let address: string | undefined
  if (chainId) {
    switch (chainId) {
      case ChainId.MAINNET:
        address = ''
        break
      case ChainId.ROPSTEN:
        address = '0xAe338e484372e4487B5438421c48342c100c9E16'
        //address = '0x8013a86d098c722890b1666575a20a41825e9c34'
        break
    }
  }
  return useContract(address, KASHIPAIRHELPER_ABI, withSignerIfPossible)
}

export function useBentoHelperContract(): Contract | null {
  const { chainId } = useActiveWeb3React()
  let address: string | undefined
  if (chainId) {
    switch (chainId) {
      // case ChainId.MAINNET:
      //   address = '0x835766B30eB2dCD07F392c7CB56d16E2141eef4D'
      //   break
      case ChainId.ROPSTEN:
        address = '0x24f2ee10c05ad21ed6870c5c8a34a36a5f8fdc69'
        break
    }
  }
  return useContract(address, BENTOHELPER_ABI, false)
}

export function useBaseInfoContract(): Contract | null {
  const { chainId } = useActiveWeb3React()
  let address: string | undefined
  if (chainId) {
    switch (chainId) {
      case ChainId.MAINNET:
        address = '0xBb7dF27209ea65Ae02Fe02E76cC1C0247765dcFF'
        break
      case ChainId.ROPSTEN:
        address = '0x39Bb002c6400f7F1679090fdAc722BC08e2a8C1e'
        break
    }
  }
  return useContract(address, BASEINFO_ABI, false)
}

export function useUserInfoContract(): Contract | null {
  const { chainId } = useActiveWeb3React()
  let address: string | undefined
  if (chainId) {
    switch (chainId) {
      case ChainId.MAINNET:
        address = '0x39Ec6247dE60d885239aD0bcE1bC9f1553f4EF75'
        break
      case ChainId.ROPSTEN:
        address = '0xe8f852908A61e074032382E9B5058F86fe2a0ea7'
        break
    }
  }
  return useContract(address, USERINFO_ABI, false)
}

export function useMakerInfoContract(): Contract | null {
  const { chainId } = useActiveWeb3React()
  let address: string | undefined
  if (chainId) {
    switch (chainId) {
      case ChainId.MAINNET:
        address = '0x001c92D884fe654A6C5438fa85a222aA400C1999'
        break
    }
  }
  return useContract(address, MAKERINFO_ABI, false)
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
