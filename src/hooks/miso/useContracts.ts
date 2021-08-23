import { Contract } from '@ethersproject/contracts'
import { Web3Provider } from '@ethersproject/providers'
import { useCallback, useEffect, useState } from 'react'

import { useMarketTemplate, getMarketTemplate } from './useAuctionInfo'

import { MISO_HELPER_ADDRESS, TOKEN_FACTORY_ADDRESS, MISO_MARKET_ADDRESS } from '../../constants/miso'
import BATCH_AUCTION_ABI from '../../constants/abis/batch-auction.json'
import CROWDSALE_ABI from '../../constants/abis/crowdsale.json'
import DUTCH_AUCITON_ABI from '../../constants/abis/dutch-auction.json'
import MISO_HELPER_ABI from '../../constants/abis/miso-helper.json'
import MISO_MARKET_ABI from '../../constants/abis/miso-market.json'
import POST_AUCTION_LAUNCHER_ABI from '../../constants/abis/post-auction-launcher.json'
import TOKEN_FACTORY_ABI from '../../constants/abis/token-factory.json'
import { getContract } from '../../functions/contract'
import { useActiveWeb3React } from '../../hooks/useActiveWeb3React'
import { useContract } from '../../hooks/useContract'

function getCrowdsaleContract(
  auctionAddress: string,
  library: Web3Provider,
  account: string,
  withSignerIfPossible = true
): Contract | null {
  try {
    return getContract(auctionAddress, CROWDSALE_ABI, library, withSignerIfPossible && account ? account : undefined)
  } catch (error) {
    console.error('Failed to get contract', error)
    return null
  }
}

function getDutchAuctionContract(
  auctionAddress: string,
  library: Web3Provider,
  account: string,
  withSignerIfPossible = true
): Contract | null {
  try {
    return getContract(
      auctionAddress,
      DUTCH_AUCITON_ABI,
      library,
      withSignerIfPossible && account ? account : undefined
    )
  } catch (error) {
    console.error('Failed to get contract', error)
    return null
  }
}

function getBatchAuctionContract(
  auctionAddress: string,
  library: Web3Provider,
  account: string,
  withSignerIfPossible = true
): Contract | null {
  try {
    return getContract(
      auctionAddress,
      BATCH_AUCTION_ABI,
      library,
      withSignerIfPossible && account ? account : undefined
    )
  } catch (error) {
    console.error('Failed to get contract', error)
    return null
  }
}

export const useAuctionContract = (auctionAddress: string, withSignerIfPossible = true) => {
  const marketTemplate = useMarketTemplate(auctionAddress)
  const { library, account } = useActiveWeb3React()

  const [contract, setContract] = useState(null)

  const fetchContract = useCallback(async () => {
    try {
      let contract = null
      switch (marketTemplate) {
        case '1':
          contract = getCrowdsaleContract(auctionAddress, library, account, withSignerIfPossible)
          break
        case '2':
          contract = getDutchAuctionContract(auctionAddress, library, account, withSignerIfPossible)
          break
        case '3':
          contract = getBatchAuctionContract(auctionAddress, library, account, withSignerIfPossible)
          break
        default:
          break
      }
      setContract(contract)
    } catch (error) {
      setContract(null)
      console.error(error)
    }
  }, [marketTemplate])
  useEffect(() => {
    fetchContract()
  }, [marketTemplate, fetchContract])

  return contract
}

export const getAuctionContract = async (
  auctionAddress: string,
  library: Web3Provider,
  account: string,
  withSignerIfPossible = true
) => {
  const marketTemplate = await getMarketTemplate(library, auctionAddress)

  try {
    let contract = null
    switch (marketTemplate) {
      case '1':
        contract = getCrowdsaleContract(auctionAddress, library, account, withSignerIfPossible)
        break
      case '2':
        contract = getDutchAuctionContract(auctionAddress, library, account, withSignerIfPossible)
        break
      case '3':
        contract = getBatchAuctionContract(auctionAddress, library, account, withSignerIfPossible)
        break
      default:
        break
    }
    return contract
  } catch (error) {
    console.error('Failed to get auction contract', error)
    return null
  }
}

export function useMisoHelperContract(withSignerIfPossible = true): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId && MISO_HELPER_ADDRESS[chainId], MISO_HELPER_ABI, withSignerIfPossible)
}

export function useTokenFactoryContract(withSignerIfPossible = true): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId && TOKEN_FACTORY_ADDRESS[chainId], TOKEN_FACTORY_ABI, withSignerIfPossible)
}

export function useMisoMarketContract(withSignerIfPossible = true): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId && MISO_MARKET_ADDRESS[chainId], MISO_MARKET_ABI, withSignerIfPossible)
}

export function usePostAuctionLauncherContract(auctionAddress: string, withSignerIfPossible = true): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(auctionAddress, POST_AUCTION_LAUNCHER_ABI, withSignerIfPossible)
}

export function getPostAuctionLauncherContract(
  auctionAddress: string,
  library: Web3Provider,
  account: string,
  withSignerIfPossible = true
): Contract | null {
  try {
    return getContract(
      auctionAddress,
      POST_AUCTION_LAUNCHER_ABI,
      library,
      withSignerIfPossible && account ? account : undefined
    )
  } catch (error) {
    console.error('Failed to get contract', error)
    return null
  }
}
