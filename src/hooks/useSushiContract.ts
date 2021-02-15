import { Contract } from '@ethersproject/contracts'
import { ChainId } from '@sushiswap/sdk'
import { useMemo } from 'react'
import SUSHI_ABI from '../constants/sushiAbis/sushi.json'
import MASTERCHEF_ABI from '../constants/sushiAbis/masterchef.json'
import FACTORY_ABI from '../constants/sushiAbis/factory.json'
import ROUTER_ABI from '../constants/sushiAbis/router.json'
import SUSHIBAR_ABI from '../constants/sushiAbis/bar.json'
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
import { useActiveWeb3React } from './index'

// returns null on errors
function useContract(address: string | undefined, ABI: any, withSignerIfPossible = true): Contract | null {
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

export function useSushiContract(): Contract | null {
  const { chainId } = useActiveWeb3React()
  let address: string | undefined
  if (chainId) {
    switch (chainId) {
      case ChainId.MAINNET:
        address = '0x6B3595068778DD592e39A122f4f5a5cF09C90fE2'
        break
      case ChainId.ROPSTEN:
        address = '0x81db9c598b3ebbdc92426422fc0a1d06e77195ec'
        break
    }
  }
  return useContract(address, SUSHI_ABI, false)
}

export function useMasterChefContract(): Contract | null {
  const { chainId } = useActiveWeb3React()
  let address: string | undefined
  if (chainId) {
    switch (chainId) {
      case ChainId.MAINNET:
        address = '0xc2EdaD668740f1aA35E4D8f227fB8E17dcA888Cd'
        break
      case ChainId.ROPSTEN:
        address = '0xFF281cEF43111A83f09C656734Fa03E6375d432A'
        break
    }
  }
  return useContract(address, MASTERCHEF_ABI, false)
}

export function useFactoryContract(): Contract | null {
  const { chainId } = useActiveWeb3React()
  let address: string | undefined
  if (chainId) {
    switch (chainId) {
      case ChainId.MAINNET:
        address = '0xC0AEe478e3658e2610c5F7A4A2E1777cE9e4f2Ac'
        break
      case ChainId.ROPSTEN:
        address = '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f'
        break
    }
  }
  return useContract(address, FACTORY_ABI, false)
}

export function useRouterContract(): Contract | null {
  const { chainId } = useActiveWeb3React()
  let address: string | undefined
  if (chainId) {
    switch (chainId) {
      case ChainId.MAINNET:
        address = '0xd9e1cE17f2641f24aE83637ab66a2cca9C378B9F'
        break
      case ChainId.ROPSTEN:
        address = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D'
        break
    }
  }
  return useContract(address, ROUTER_ABI, false)
}

export function useSushiBarContract(): Contract | null {
  const { chainId } = useActiveWeb3React()
  let address: string | undefined
  if (chainId) {
    switch (chainId) {
      case ChainId.MAINNET:
        address = '0x8798249c2E607446EfB7Ad49eC89dD1865Ff4272'
        break
      case ChainId.ROPSTEN:
    }
  }
  return useContract(address, SUSHIBAR_ABI, false)
}

export function useMakerContract(): Contract | null {
  const { chainId } = useActiveWeb3React()
  let address: string | undefined
  if (chainId) {
    switch (chainId) {
      case ChainId.MAINNET:
        address = '0xE11fc0B43ab98Eb91e9836129d1ee7c3Bc95df50'
        break
      case ChainId.ROPSTEN:
    }
  }
  return useContract(address, MAKER_ABI, false)
}

export function useTimelockContract(): Contract | null {
  const { chainId } = useActiveWeb3React()
  let address: string | undefined
  if (chainId) {
    switch (chainId) {
      case ChainId.MAINNET:
        address = '0x9a8541ddf3a932a9a922b607e9cf7301f1d47bd1'
        break
      case ChainId.ROPSTEN:
    }
  }
  return useContract(address, TIMELOCK_ABI, false)
}

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
