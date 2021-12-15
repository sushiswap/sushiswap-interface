import MISO from '@sushiswap/miso/exports/all.json'
import { DocumentInput } from 'app/features/miso/context/hooks/useAuctionDocuments'
import { MisoAbiByTemplateId } from 'app/features/miso/context/utils'
import { useContract } from 'app/hooks'
import { useActiveWeb3React } from 'app/services/web3'
import { useTransactionAdder } from 'app/state/transactions/hooks'
import { useCallback } from 'react'

export const useAuctionEdit = (address?: string, templateId?: number, liquidityTemplate?: number) => {
  const { chainId, account } = useActiveWeb3React()
  const addTransaction = useTransactionAdder()
  const liquidityLauncherContract = useContract(
    address,
    chainId ? MISO[chainId]?.['ropsten']?.contracts.PostAuctionLauncher.abi : undefined
  )

  console.log(chainId && templateId ? MisoAbiByTemplateId(chainId, templateId) : undefined)
  const auctionContract = useContract(
    address,
    chainId && templateId ? MisoAbiByTemplateId(chainId, templateId) : undefined,
    true
  )

  const editDocuments = useCallback(
    async (documents: DocumentInput[]) => {
      if (!auctionContract) return

      try {
        const [names, data] = documents.reduce<[string[], string[]]>(
          (acc, cur) => {
            acc[0].push(cur.name)
            acc[1].push(cur.data)

            return acc
          },
          [[], []]
        )
        const tx = await auctionContract.setDocuments(names, data)
        addTransaction(tx, { summary: 'Set Auction Documents' })

        return tx
      } catch (e) {
        console.error('set document error:', e.message)
      }
    },
    [addTransaction, auctionContract]
  )

  const cancelAuction = useCallback(async () => {
    if (!auctionContract) return

    try {
      const tx = await auctionContract.cancelAuction()
      addTransaction(tx, { summary: 'Cancel Auction' })

      return tx
    } catch (e) {
      console.error('cancel auction error:', e.message)
    }
  }, [addTransaction, auctionContract])

  const claimTokens = useCallback(async () => {
    if (!auctionContract || !account) return

    try {
      const tx = await auctionContract.withdrawTokens(account)
      addTransaction(tx, { summary: 'Claim tokens' })

      return tx
    } catch (e) {
      console.error('withdraw tokens error: ', e)
    }
  }, [account, addTransaction, auctionContract])

  const finalizeAuction = useCallback(async () => {
    if (!auctionContract || !liquidityLauncherContract) return

    try {
      let tx
      if (liquidityTemplate && liquidityTemplate > 0) {
        tx = await liquidityLauncherContract.finalize()
      } else {
        tx = await auctionContract.finalize()
      }
      addTransaction(tx, { summary: 'Finalize Auction' })
      return tx
    } catch (e) {
      console.error('finalize auction error: ', e)
      return e
    }
  }, [addTransaction, auctionContract, liquidityLauncherContract, liquidityTemplate])

  return {
    editDocuments,
    cancelAuction,
    claimTokens,
    finalizeAuction,
  }
}

export default useAuctionEdit
