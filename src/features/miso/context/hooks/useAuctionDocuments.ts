import { AuctionDocument } from 'app/features/miso/context/types'
import { MisoAbiByTemplateId } from 'app/features/miso/context/utils'
import { useContract, useMisoHelperContract } from 'app/hooks'
import { useActiveWeb3React } from 'app/services/web3'
import { useSingleCallResult, useSingleContractMultipleData } from 'app/state/multicall/hooks'
import { useTransactionAdder } from 'app/state/transactions/hooks'
import { useCallback } from 'react'

export interface DocumentInput {
  name: string
  data: string
}

const arrayToMap = (result) =>
  result.reduce((acc, cur) => {
    acc[cur.name] = cur.data
    return acc
  }, {})

export const useAuctionDocuments = (addresses: string[]): (AuctionDocument | undefined)[] => {
  const contract = useMisoHelperContract()
  const results = useSingleContractMultipleData(
    contract,
    'getDocuments',
    addresses.map((el) => [el])
  )

  if (results && Array.isArray(results) && results.length === addresses.length) {
    return results.map<AuctionDocument | undefined>((el) => {
      if (el.result && Array.isArray(el.result) && el.result.length > 0) {
        return arrayToMap(el.result[0])
      }

      return undefined
    })
  }

  return Array(addresses.length).fill(undefined)
}

export const useAuctionDocument = (address: string): AuctionDocument | undefined => {
  const contract = useMisoHelperContract()
  const { result } = useSingleCallResult(contract, 'getDocuments', [address])
  if (result && Array.isArray(result) && result.length > 0) {
    return arrayToMap(result[0])
  }

  return undefined
}

export const useSetAuctionDocuments = (address: string, templateId?: number) => {
  const { chainId } = useActiveWeb3React()
  const addTransaction = useTransactionAdder()
  const contract = useContract(address, chainId && templateId ? MisoAbiByTemplateId(chainId, templateId) : undefined)

  return useCallback(
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
        console.error('set document error:', e)
        return e
      }
    },
    [addTransaction, contract]
  )
}

export default useAuctionDocuments
