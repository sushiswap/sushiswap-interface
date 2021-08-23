import { Contract } from '@ethersproject/contracts'
import { useCallback, useEffect, useState } from 'react'

import { useMisoHelperContract } from './useContracts'

import { useBlockNumber } from '../../state/application/hooks'
import { useTransactionAdder } from '../../state/transactions/hooks'

export const useListDocuments = (auctionAddress: string) => {
  const misoHelperContract = useMisoHelperContract(false)
  const blockNumber = useBlockNumber()

  const [documents, setDocuments] = useState([])
  const fetchDocuments = useCallback(async () => {
    try {
      const documents = await misoHelperContract?.getDocuments(auctionAddress)
      setDocuments(documents)
    } catch (error) {
      setDocuments([])
      console.error(error)
    }
  }, [misoHelperContract])
  useEffect(() => {
    if (misoHelperContract) {
      fetchDocuments()
    }
  }, [fetchDocuments, misoHelperContract, blockNumber])

  return documents
}

function useDocuments() {
  const addTransaction = useTransactionAdder()

  const setDocument = useCallback(
    async (contract: Contract, name: string, data: string) => {
      try {
        const tx = await contract?.setDocument(name, data)
        return addTransaction(tx, { summary: 'Set Auction Document' })
      } catch (e) {
        console.error('set document error:', e)
        return e
      }
    },
    [addTransaction]
  )

  return { setDocument }
}

export default useDocuments
