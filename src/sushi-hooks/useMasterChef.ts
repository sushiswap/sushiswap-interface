import { useCallback } from 'react'
import { useMasterChefContract } from './useContract'
import { useTransactionAdder } from '../state/transactions/hooks'

const useMasterChef = () => {
  const addTransaction = useTransactionAdder()
  const masterChefContract = useMasterChefContract(true) // withSigner

  const harvest = useCallback(
    async (pid: number) => {
      try {
        const tx = await masterChefContract?.methods.deposit(pid, '0')
        return addTransaction(tx, { summary: 'Harvest' })
      } catch (e) {
        return e
      }
    },
    [addTransaction, masterChefContract]
  )

  return { harvest }
}

export default useMasterChef
