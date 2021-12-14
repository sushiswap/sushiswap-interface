import { Auction } from 'app/features/miso/context/Auction'
import { MisoAbiByTemplateId } from 'app/features/miso/context/utils'
import { useContract, useMisoHelperContract } from 'app/hooks'
import { useActiveWeb3React } from 'app/services/web3'
import { useSingleCallResult } from 'app/state/multicall/hooks'
import { useTransactionAdder } from 'app/state/transactions/hooks'
import { useCallback } from 'react'

interface Document {
  name: string
  data: string
}

export const useAuctionDocuments = (auction?: Auction) => {
  const { chainId } = useActiveWeb3React()
  const helper = useMisoHelperContract()
  const contract = useContract(
    auction?.auctionInfo.addr,
    chainId && auction ? MisoAbiByTemplateId(chainId, auction.template) : undefined
  )
  const addTransaction = useTransactionAdder()

  const { result } = useSingleCallResult(helper, 'getDocuments', [auction?.auctionInfo.addr])

  const setDocuments = useCallback(
    async (documents: Document[]) => {
      try {
        const [names, data] = documents.reduce<[string[], string[]]>(
          (acc, cur) => {
            acc[0].push(cur.name)
            acc[1].push(cur.data)

            return acc
          },
          [[], []]
        )
        const tx = await contract?.setDocuments(names, data)
        return addTransaction(tx, { summary: 'Set Auction Documents' })
      } catch (e) {
        console.error('set document error:', e)
        return e
      }
    },
    [addTransaction, contract]
  )

  if (Array.isArray(result) && result.length > 0) {
    return [
      result[0].reduce((acc, cur) => {
        acc[cur.name] = cur.data
        return acc
      }, {}),
      setDocuments,
    ]
  }

  return [undefined, setDocuments]
}
