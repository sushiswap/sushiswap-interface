import { parseEther, parseUnits } from '@ethersproject/units'
import { useCallback, useEffect, useState } from 'react'

import {
  getAuctionContract,
  useMisoHelperContract,
  useMisoMarketContract,
  getPostAuctionLauncherContract,
} from './useContracts'

import { BAD_AUCTIONS, DAI_MISO_FEE_ACCT, ETH_TOKEN_ADDRESS } from '../../constants/miso'
import { useActiveWeb3React } from '../../hooks/useActiveWeb3React'
import { useBlockNumber } from '../../state/application/hooks'
import { useTransactionAdder } from '../../state/transactions/hooks'

export const useGetPermissionList = (auction: string) => {
  const { library, account } = useActiveWeb3React()

  const [permissionListInfo, setPermissionListInfo] = useState({ address: null, status: null })
  const getPermissionList = useCallback(async () => {
    try {
      const auctionContract = await getAuctionContract(auction, library, account)
      const address = await auctionContract?.pointList()
      const marketStatus = await auctionContract?.marketStatus()
      setPermissionListInfo({ address: address, status: marketStatus.usePointList })
    } catch (error) {
      setPermissionListInfo({ address: null, status: null })
      console.error(error)
    }
  }, [])

  useEffect(() => {
    getPermissionList()
  }, [getPermissionList])

  return permissionListInfo
}

export const useGetDocuments = (auction: string) => {
  const misoHelperContract = useMisoHelperContract(false)

  const [auctionDocuments, setAuctionDocuments] = useState([])
  const getDocuments = useCallback(async () => {
    try {
      const documents = await misoHelperContract?.getDocuments(auction)
      setAuctionDocuments(documents)
    } catch (error) {
      setAuctionDocuments([])
      console.error(error)
    }
  }, [misoHelperContract])

  useEffect(() => {
    if (misoHelperContract) {
      getDocuments()
    }
  }, [getDocuments, misoHelperContract])

  return auctionDocuments
}

export const useAdminAuctions = () => {
  const addTransaction = useTransactionAdder()
  const { library, account } = useActiveWeb3React()

  const setDocument = useCallback(
    async (auctionAddress: string, name: string, data: string) => {
      try {
        const auctionContract = await getAuctionContract(auctionAddress, library, account)
        console.log(auctionContract)
        const tx = await auctionContract?.setDocument(name, data)
        console.log(tx)
        addTransaction(tx, { summary: 'Set Document' })
        return tx
      } catch (e) {
        console.error('set document error: ', e)
        return e
      }
    },
    [addTransaction]
  )

  const updatePermissionList = useCallback(
    async (auctionAddress: string, address: string) => {
      try {
        const auctionContract = await getAuctionContract(auctionAddress, library, account)
        console.log(auctionContract)
        const tx = await auctionContract?.setList(address)
        console.log(tx)
        addTransaction(tx, { summary: 'Set Permission List' })
        return tx
      } catch (e) {
        console.error('set permission list error: ', e)
        return e
      }
    },
    [addTransaction]
  )

  const updatePermissionListStatus = useCallback(
    async (auctionAddress: string, status: boolean) => {
      try {
        const auctionContract = await getAuctionContract(auctionAddress, library, account)
        console.log(auctionContract)
        const tx = await auctionContract?.enableList(status)
        console.log(tx)
        addTransaction(tx, { summary: 'Set Permission List Status' })
        return tx
      } catch (e) {
        console.error('set permission list status error: ', e)
        return e
      }
    },
    [addTransaction]
  )

  const cancelAuction = useCallback(
    async (auctionAddress: string) => {
      try {
        const auctionContract = await getAuctionContract(auctionAddress, library, account)
        const tx = await auctionContract?.cancelAuction()
        return addTransaction(tx, { summary: 'Cancel Auction' })
      } catch (e) {
        console.error('cancel auction error: ', e)
        return e
      }
    },
    [addTransaction]
  )

  return { setDocument, updatePermissionList, updatePermissionListStatus, cancelAuction }
}

export const useListAuctions = (type: string, owner: string) => {
  const misoHelperContract = useMisoHelperContract(false)
  const blockNumber = useBlockNumber()

  const [auctions, setAuctions] = useState([])
  const fetchAuctions = useCallback(async () => {
    try {
      const auctions = await misoHelperContract?.getMarkets()
      let filtered = auctions.filter((auction) => !BAD_AUCTIONS.includes(auction.addr))
      if (type == 'live') {
        filtered = filtered.filter((auction) => {
          const currentTimestamp = Math.floor(new Date().getTime() / 1000)
          return (
            currentTimestamp >= parseInt(auction.startTime) &&
            currentTimestamp < parseInt(auction.endTime) &&
            !auction.finalized
          )
        })
      } else if (type == 'upcoming') {
        filtered = filtered.filter((auction) => {
          const currentTimestamp = Math.floor(new Date().getTime() / 1000)
          return currentTimestamp < parseInt(auction.startTime) && !auction.finalized
        })
      } else if (type == 'finished') {
        filtered = filtered.filter((auction) => {
          const currentTimestamp = Math.floor(new Date().getTime() / 1000)
          return currentTimestamp > parseInt(auction.endTime) || auction.finalized
        })
      }
      if (owner) {
        let ownerAuctions = []
        for (const auction of filtered) {
          const userInfo = await misoHelperContract?.getUserMarketInfo(auction.addr, owner)
          if (userInfo.isAdmin) {
            ownerAuctions.push(auction)
          }
        }
        filtered = ownerAuctions
      }
      setAuctions(filtered)
    } catch (error) {
      setAuctions([])
      console.error(error)
    }
  }, [misoHelperContract])
  useEffect(() => {
    if (misoHelperContract) {
      fetchAuctions()
    }
  }, [fetchAuctions, misoHelperContract, blockNumber])

  return auctions
}

function useAuctions() {
  const addTransaction = useTransactionAdder()
  const misoMarketContract = useMisoMarketContract()
  const { library, account } = useActiveWeb3React()

  const createMarket = useCallback(
    async (auctionType: string, tokenAddress: string, totalSupply: string | Number, data: string) => {
      try {
        const auctionTemplateId = await misoMarketContract?.currentTemplateId(auctionType)
        const tx = await misoMarketContract?.createMarket(
          auctionTemplateId,
          tokenAddress,
          parseEther(totalSupply.toString()),
          DAI_MISO_FEE_ACCT,
          data
        )
        addTransaction(tx, { summary: 'Create Auction for MISO' })
        return tx
      } catch (e) {
        console.error('create market error:', e)
        return e
      }
    },
    [addTransaction, misoMarketContract]
  )

  const withdrawAuction = useCallback(
    async (auctionAddress: string) => {
      try {
        const auctionContract = await getAuctionContract(auctionAddress, library, account)
        const tx = await auctionContract?.withdrawTokens(account)
        return addTransaction(tx, { summary: 'Claim tokens' })
      } catch (e) {
        console.error('withdraw tokens error: ', e)
        return e
      }
    },
    [addTransaction]
  )

  const cancelAuction = useCallback(
    async (auctionAddress: string) => {
      try {
        const auctionContract = await getAuctionContract(auctionAddress, library, account)
        const tx = await auctionContract?.cancelAuction()
        return addTransaction(tx, { summary: 'Cancel Auction' })
      } catch (e) {
        console.error('cancel auction error: ', e)
        return e
      }
    },
    [addTransaction]
  )

  const finalizeAuction = useCallback(
    async (auctionAddress: string, liquidityTemplate: number = 0) => {
      try {
        let contract = null
        if (liquidityTemplate && liquidityTemplate > 0) {
          contract = await getPostAuctionLauncherContract(auctionAddress, library, account)
        } else {
          contract = await getAuctionContract(auctionAddress, library, account)
        }
        const tx = await contract?.finalize()
        return addTransaction(tx, { summary: 'Finalize Auction' })
      } catch (e) {
        console.error('finalize auction error: ', e)
        return e
      }
    },
    [addTransaction]
  )

  const commitAuction = useCallback(
    async (
      auctionAddress: string,
      selectedTokenQuantity: string | Number,
      tokenAddr: string,
      decimals: string | Number
    ) => {
      try {
        const auctionContract = await getAuctionContract(auctionAddress, library, account)
        console.log(auctionContract)
        let tx
        if (tokenAddr === ETH_TOKEN_ADDRESS) {
          tx = await auctionContract?.commitEth(account, true, { value: parseEther(selectedTokenQuantity.toString()) })
        } else {
          tx = await auctionContract?.commitTokens(
            parseUnits(selectedTokenQuantity.toString(), decimals.toString()),
            true
          )
        }
        console.log(tx)
        return addTransaction(tx, { summary: 'Commit Auction' })
      } catch (e) {
        console.error('commit auction error: ', e)
        return e
      }
    },
    [addTransaction]
  )

  return { createMarket, withdrawAuction, cancelAuction, finalizeAuction, commitAuction }
}

export default useAuctions
