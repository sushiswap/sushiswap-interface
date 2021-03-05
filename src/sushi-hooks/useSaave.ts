import { useCallback } from 'react'
import ethers from 'ethers'
import { useSaaveContract } from './useContract'
import { useTransactionAdder } from '../state/transactions/hooks'

const useMaker = () => {
  const addTransaction = useTransactionAdder()
  const saaveContract = useSaaveContract(true) // withSigner

  // Serve
  const saave = useCallback(
    async (amount: string) => {
      console.log('saaveContract', saaveContract)
      try {
        const tx = await saaveContract?.saave(ethers.utils.parseUnits(amount))
        return addTransaction(tx, { summary: 'SUSHI → xSUSHI → aXSUSHI' })
      } catch (e) {
        return e
      }
    },
    [addTransaction, saaveContract]
  )

  return { saave }
}

export default useMaker
