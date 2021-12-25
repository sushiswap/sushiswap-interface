import { defaultAbiCoder } from '@ethersproject/abi'
import { CurrencyAmount } from '@sushiswap/core-sdk'
import { Auction } from 'app/features/miso/context/Auction'
import { TOPIC_ADDED_COMMITMENT } from 'app/features/miso/context/constants'
import { MisoAbiByTemplateId } from 'app/features/miso/context/utils'
import { useContract } from 'app/hooks'
import { useActiveWeb3React } from 'app/services/web3'
import { useBlockNumber } from 'app/state/application/hooks'
import { useEffect } from 'react'
import { atomFamily, useRecoilState } from 'recoil'

import { AuctionCommitment } from '../types'

const commitmentsAtomFamily = atomFamily<AuctionCommitment[], string>({
  key: 'useAuctionCommitments:commitmentsAtomFamily',
  default: [],
})

export const useAuctionCommitments = (auction: Auction) => {
  const { library, chainId } = useActiveWeb3React()
  const blockNumber = useBlockNumber()
  const contract = useContract(
    auction?.auctionInfo.addr,
    chainId ? MisoAbiByTemplateId(chainId, auction.template) : undefined
  )
  const [commitments, setCommitments] = useRecoilState(commitmentsAtomFamily(auction?.auctionInfo.addr))

  // Get history commitments
  useEffect(() => {
    if (!library || !contract || commitments.length > 0 || !blockNumber) return

    const init = async () => {
      const logs = await library.getLogs({
        fromBlock: blockNumber - 100000,
        toBlock: blockNumber,
        address: auction.auctionInfo.addr,
        topics: [TOPIC_ADDED_COMMITMENT],
      })

      return logs.map(({ data, transactionHash, blockNumber }) => {
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
    auction.auctionToken,
    auction.paymentToken,
    blockNumber,
    commitments.length,
    contract,
    library,
    setCommitments,
  ])

  // Get new commitments realtime
  useEffect(() => {
    if (!contract) return

    // Subscribe
    contract.on({ address: auction.auctionToken.address, topics: [TOPIC_ADDED_COMMITMENT] }, (_, __, result) => {
      if (result) {
        const [address, amount] = defaultAbiCoder.decode(['address', 'uint256'], result.data)
        setCommitments((prevState) => {
          if (!prevState.find((el) => el.txHash === result.transactionHash)) {
            return [
              {
                txHash: result.transactionHash,
                blockNumber: result.blockNumber,
                address,
                amount: CurrencyAmount.fromRawAmount(auction.paymentToken, amount),
              },
              ...prevState,
            ]
          } else return prevState
        })
      }
    })

    // Unsubscribe
    return () => {
      contract.off({ address: auction.auctionToken.address, topics: [TOPIC_ADDED_COMMITMENT] }, () => {
        console.log('unsubscribed')
      })
    }
  }, [auction.auctionToken, auction.paymentToken, contract, setCommitments])

  return commitments
}

export default useAuctionCommitments
