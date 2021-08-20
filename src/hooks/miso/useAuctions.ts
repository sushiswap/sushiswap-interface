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

export const useListAuctions = () => {
  const misoHelperContract = useMisoHelperContract(false)
  const blockNumber = useBlockNumber()

  const [auctions, setAuctions] = useState([])
  const fetchAuctions = useCallback(async () => {
    try {
      const auctions = await misoHelperContract?.getMarkets()
      const filtered = auctions.filter((auction) => !BAD_AUCTIONS.includes(auction.addr))
      setAuctions(filtered)
    } catch (error) {
      setAuctions([])
      throw error
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
        return addTransaction(tx, { summary: 'Create Auction for MISO' })
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
