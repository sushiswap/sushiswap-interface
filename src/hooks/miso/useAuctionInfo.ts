import { Contract } from '@ethersproject/contracts'
import { getAddress } from '@ethersproject/address'
import { Web3Provider } from '@ethersproject/providers'
import { parseUnits } from '@ethersproject/units'
import { useCallback, useEffect, useState } from 'react'

import { useAuctionContract, useMisoHelperContract } from './useContracts'

import BASE_AUCTION_ABI from '../../constants/abis/base-auction.json'
import { useActiveWeb3React } from '../../hooks/useActiveWeb3React'
import { useContract } from '../../hooks/useContract'
import { getContract } from '../../functions/contract'

export const useMarketTemplate = (auctionAddress: string) => {
  const auctionAddressChecksum = getAddress(auctionAddress)
  const auctionContract = useContract(auctionAddressChecksum ? auctionAddress : undefined, BASE_AUCTION_ABI, false) // withoutSigner

  const [marketTemplate, setMarketTemplate] = useState('0')
  const fetchMarketTemplate = useCallback(async () => {
    try {
      const marketTemplate = await auctionContract?.marketTemplate()
      setMarketTemplate(marketTemplate.toString())
    } catch (error) {
      setMarketTemplate('0')
      throw error
    }
  }, [auctionContract])
  useEffect(() => {
    if (auctionContract) {
      fetchMarketTemplate()
    }
  }, [fetchMarketTemplate, auctionContract])

  return marketTemplate
}

export const getMarketTemplate = async (library: Web3Provider, auctionAddress: string) => {
  const auctionAddressChecksum = getAddress(auctionAddress)
  const auctionContract = getContract(auctionAddressChecksum ? auctionAddress : undefined, BASE_AUCTION_ABI, library)

  try {
    const marketTemplate = await auctionContract?.marketTemplate()
    return marketTemplate.toString()
  } catch (error) {
    console.error('Failed to get market template', error)
    return '0'
  }
}

const getCrowdsaleInfo = async (misoHelperContract: Contract, auctionAddress: string) => {
  try {
    const info = await misoHelperContract?.getCrowdsaleInfo(auctionAddress)
    return info
  } catch (error) {
    console.error('Failed to get crowdsale info', error)
    return []
  }
}

const getDutchAuctionInfo = async (misoHelperContract: Contract, auctionAddress: string) => {
  try {
    const info = await misoHelperContract?.getDutchAuctionInfo(auctionAddress)
    return info
  } catch (error) {
    console.error('Failed to get crowdsale info', error)
    return []
  }
}

const getBatchAuctionInfo = async (misoHelperContract: Contract, auctionAddress: string) => {
  try {
    const info = await misoHelperContract?.getBatchAuctionInfo(auctionAddress)
    return info
  } catch (error) {
    console.error('Failed to get crowdsale info', error)
    return []
  }
}

export const useAuctionInfo = (auctionAddress: string) => {
  const marketTemplate = useMarketTemplate(auctionAddress)
  const misoHelperContract = useMisoHelperContract()

  const [auctionInfo, setAuctionInfo] = useState([])
  const fetchContract = useCallback(async () => {
    try {
      let auctionInfo = null
      switch (marketTemplate) {
        case '1':
          auctionInfo = await getCrowdsaleInfo(misoHelperContract, auctionAddress)
          break
        case '2':
          auctionInfo = await getDutchAuctionInfo(misoHelperContract, auctionAddress)
          break
        case '3':
          auctionInfo = await getBatchAuctionInfo(misoHelperContract, auctionAddress)
          break
        default:
          break
      }
      setAuctionInfo(auctionInfo)
    } catch (error) {
      setAuctionInfo([])
      throw error
    }
  }, [marketTemplate, misoHelperContract])

  useEffect(() => {
    fetchContract()
  }, [marketTemplate, misoHelperContract, fetchContract])

  return auctionInfo
}

export const useCommitments = (auctionAddress: string, decimals: string | Number) => {
  const auctionAddressChecksum = getAddress(auctionAddress)
  const auctionContract = useAuctionContract(auctionAddressChecksum ? auctionAddress : undefined, false) // withoutSigner

  const [commitments, setCommitments] = useState([])
  const fetchCommitments = useCallback(async () => {
    try {
      const logs = await auctionContract?.queryFilter(auctionContract?.filters.AddedCommitment())
      const filtered = logs.map((log: any) => {
        const args = log.args
        return {
          txHash: log.transactionHash,
          timestamp: log.blockNumber,
          address: args.addr,
          amount: parseUnits(args.commitment.toString(), decimals.toString()),
        }
      })
      setCommitments(filtered)
    } catch (error) {
      setCommitments([])
      throw error
    }
  }, [auctionContract])

  useEffect(() => {
    if (auctionContract) {
      fetchCommitments()
    }
  }, [fetchCommitments, auctionContract])

  return commitments
}
