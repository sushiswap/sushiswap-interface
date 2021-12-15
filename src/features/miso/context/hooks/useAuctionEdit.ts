import { DocumentInput } from 'app/features/miso/context/hooks/useAuctionDocuments'
import { MisoAbiByTemplateId } from 'app/features/miso/context/utils'
import { useContract } from 'app/hooks'
import { useActiveWeb3React } from 'app/services/web3'
import { useTransactionAdder } from 'app/state/transactions/hooks'
import { useCallback } from 'react'

export const useAuctionEdit = (address: string, templateId?: number) => {
  const { chainId } = useActiveWeb3React()
  const addTransaction = useTransactionAdder()
  const contract = useContract(address, chainId && templateId ? MisoAbiByTemplateId(chainId, templateId) : undefined)

  const editDocuments = useCallback(
    async (documents: DocumentInput[]) => {
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
        addTransaction(tx, { summary: 'Set Auction Documents' })

        return tx
      } catch (e) {
        console.error('set document error:', e.message)
      }
    },
    [addTransaction, contract]
  )

  const cancelAuction = useCallback(async () => {
    try {
      const tx = await contract?.cancelAuction()
      addTransaction(tx, { summary: 'Cancel Auction' })

      return tx
    } catch (e) {
      console.error('cancel auction error:', e.message)
    }
  }, [addTransaction, contract])

  return {
    editDocuments,
    cancelAuction,
  }
}

export default useAuctionEdit
