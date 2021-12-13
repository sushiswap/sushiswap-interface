import { defaultAbiCoder } from '@ethersproject/abi'
import { CurrencyAmount, Token } from '@sushiswap/core-sdk'
import { Auction } from 'app/features/miso/context/Auction'
import { TOPIC_ADDED_COMMITMENT } from 'app/features/miso/context/constants'
import { MisoAbiByTemplateId } from 'app/features/miso/context/utils'
import { useContract } from 'app/hooks'
import { useActiveWeb3React } from 'app/services/web3'
import { useEffect } from 'react'
import { atomFamily, useRecoilState } from 'recoil'

import { AuctionCommitment } from '../types'

const commitmentsAtomFamily = atomFamily<AuctionCommitment[], string>({
  key: 'useAuctionCommitments:commitmentsAtomFamily',
  default: [],
})

const useAuctionCommitments = (auction: Auction<Token, Token>) => {
  const { library, chainId } = useActiveWeb3React()
  const contract = useContract(
    auction?.auctionInfo.addr,
    chainId ? MisoAbiByTemplateId(chainId, auction.template) : undefined
  )
  const [commitments, setCommitments] = useRecoilState(commitmentsAtomFamily(auction?.auctionInfo.addr))

  // Get history commitments
  useEffect(() => {
    if (!library || !contract || commitments.length > 0) return

    const init = async () => {
      const logs = await library.getLogs({
        fromBlock: 0,
        toBlock: 'latest',
        address: auction.auctionInfo.addr,
        topics: [TOPIC_ADDED_COMMITMENT],
      })

      return logs.map(({ data, transactionHash, blockNumber, ...rest }) => {
        const [address, amount] = defaultAbiCoder.decode(['address', 'uint256'], data)
        return {
          txHash: transactionHash,
          blockNumber: blockNumber,
          address,
          amount: CurrencyAmount.fromRawAmount(auction.paymentToken, amount),
        }
      })
    }

    init().then((commitments) => setCommitments(commitments))
  }, [
    auction.auctionInfo.addr,
    auction.auctionToken.address,
    auction.paymentToken,
    commitments.length,
    contract,
    library,
    setCommitments,
  ])

  // Get new commitments realtime
  useEffect(() => {
    if (!contract) return

    // Subscribe
    contract.on({ address: auction.auctionToken.address, topics: [TOPIC_ADDED_COMMITMENT] }, (error, result) => {
      if (error) {
        const [address, amount] = defaultAbiCoder.decode(['address', 'uint256'], result.data)
        return {
          txHash: result.transactionHash,
          timestamp: result.blockNumber,
          address,
          amount: CurrencyAmount.fromRawAmount(auction.paymentToken, amount),
        }
      }
    })

    // Unsubscribe
    return () => {
      contract.off({ address: auction.auctionToken.address, topics: [TOPIC_ADDED_COMMITMENT] }, () => {
        console.log('unsubscribed')
      })
    }
  }, [auction.auctionToken.address, auction.paymentToken, contract])

  return commitments
}

export default useAuctionCommitments
