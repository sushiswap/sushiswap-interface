import { Contract } from '@ethersproject/contracts'
import { ChainId } from '@sushiswap/sdk'
import { useMemo } from 'react'
import SUSHI_ABI from '../constants/sushiAbis/sushi.json'
import MASTERCHEF_ABI from '../constants/sushiAbis/masterchef.json'
import FACTORY_ABI from '../constants/sushiAbis/factory.json'
import ROUTER_ABI from '../constants/sushiAbis/router.json'
import BAR_ABI from '../constants/sushiAbis/bar.json'
import MAKER_ABI from '../constants/sushiAbis/maker.json'
import TIMELOCK_ABI from '../constants/sushiAbis/timelock.json'
import BENTOBOX_ABI from '../constants/sushiAbis/bentobox.json'
import BASEINFO_ABI from '../constants/sushiAbis/baseInfo.json'
import USERINFO_ABI from '../constants/sushiAbis/userInfo.json'
import MAKERINFO_ABI from '../constants/sushiAbis/makerInfo.json'
import DASHBOARD_ABI from '../constants/sushiAbis/dashboard.json'
import DASHBOARD2_ABI from '../constants/sushiAbis/dashboard2.json'
import PENDING_ABI from '../constants/sushiAbis/pending.json'
import BENTOHELPER_ABI from '../constants/sushiAbis/bentoHelper.json'

import { MULTICALL_ABI, MULTICALL_NETWORKS } from '../constants/multicall'
import { getContract } from '../utils'
import { useActiveWeb3React } from '../hooks/index'

// TODO: Sync with Omakase on plan for Sushi Hooks, seems like intention
// is to extract this as reusable package at some point.

// These maps should probably be moved into the SDK since they will be
// consumed by UI, and potentially independent libs like sushi hooks
// so a single source of truth would be preferable.

// TODO: Move to SDK
export const SUSHI_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: '0x6B3595068778DD592e39A122f4f5a5cF09C90fE2',
  [ChainId.ROPSTEN]: '0x63058b298f1d083beDcC2Dd77Aa4667909aC357B',
  [ChainId.RINKEBY]: '0x63058b298f1d083beDcC2Dd77Aa4667909aC357B',
  [ChainId.GÖRLI]: '0x63058b298f1d083beDcC2Dd77Aa4667909aC357B',
  [ChainId.KOVAN]: '0x63058b298f1d083beDcC2Dd77Aa4667909aC357B'
}

// TODO: Move to SDK
export const MASTERCHEF_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: '0xc2EdaD668740f1aA35E4D8f227fB8E17dcA888Cd',
  [ChainId.ROPSTEN]: '0x921f083A931E74ba2A8ba55a4881a3c58f4f271d',
  [ChainId.RINKEBY]: '0x921f083A931E74ba2A8ba55a4881a3c58f4f271d',
  [ChainId.GÖRLI]: '0x921f083A931E74ba2A8ba55a4881a3c58f4f271d',
  [ChainId.KOVAN]: '0x921f083A931E74ba2A8ba55a4881a3c58f4f271d'
}

// Factory address already in SDK
import { FACTORY_ADDRESS } from '@sushiswap/sdk'

// TODO: Router address has been moved to SDK but needs re-publishing
// and removing from constants
import { ROUTER_ADDRESS } from '../constants'

// TODO: Move to SDK
export const BAR_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: '0x8798249c2E607446EfB7Ad49eC89dD1865Ff4272',
  [ChainId.ROPSTEN]: '0x86E403D507815138F749DFd5C9680a5178b3fEbC',
  [ChainId.RINKEBY]: '0x86E403D507815138F749DFd5C9680a5178b3fEbC',
  [ChainId.GÖRLI]: '0x86E403D507815138F749DFd5C9680a5178b3fEbC',
  [ChainId.KOVAN]: '0x86E403D507815138F749DFd5C9680a5178b3fEbC'
}

// TODO: Move to SDK
export const MAKER_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: '0xE11fc0B43ab98Eb91e9836129d1ee7c3Bc95df50',
  [ChainId.ROPSTEN]: '0x2dC7d393151D5205610501F2DA11ee52f07c731B',
  [ChainId.RINKEBY]: '0x2dC7d393151D5205610501F2DA11ee52f07c731B',
  [ChainId.GÖRLI]: '0x2dC7d393151D5205610501F2DA11ee52f07c731B',
  [ChainId.KOVAN]: '0x2dC7d393151D5205610501F2DA11ee52f07c731B'
}

// TODO: Move to SDK (Need to deploy on other networks as well)
export const TIMELOCK_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: '0x9a8541Ddf3a932a9A922B607e9CF7301f1d47bD1',
  [ChainId.ROPSTEN]: '',
  [ChainId.RINKEBY]: '',
  [ChainId.GÖRLI]: '',
  [ChainId.KOVAN]: ''
}

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

// TODO: Leaving these alone for now, since I'm unsure of whether these should
// live in sushiswap/sdk or somewhere else. Sync with Bart on BentoBox.
export function useBentoBoxContract(): Contract | null {
  const { chainId } = useActiveWeb3React()
  let address: string | undefined
  if (chainId) {
    switch (chainId) {
      case ChainId.MAINNET:
        address = '0xFBBe6BD840aFfc96547854a1F821d797a8c662D9'
        break
      case ChainId.ROPSTEN:
        address = '0x066b83CE269aa9851704d30Ce7e838a8B772b340'
        break
    }
  }
  return useContract(address, BENTOBOX_ABI, false)
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

export function useBentoHelperContract(): Contract | null {
  const { chainId } = useActiveWeb3React()
  let address: string | undefined
  if (chainId) {
    switch (chainId) {
      case ChainId.MAINNET:
        address = '0x835766B30eB2dCD07F392c7CB56d16E2141eef4D'
        break
      case ChainId.ROPSTEN:
        address = '0x74420A0a3828796694Dc9ac5ce35419e8fBb6dec'
        break
    }
  }
  return useContract(address, BENTOHELPER_ABI, false)
}
