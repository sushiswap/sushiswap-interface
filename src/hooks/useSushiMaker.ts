import { useTransactionAdder } from 'app/state/transactions/hooks'
import { useCallback } from 'react'

import { useMakerContract } from './useContract'

const useMaker = () => {
  const addTransaction = useTransactionAdder()
  const makerContract = useMakerContract()

  // Serve
  const serve = useCallback(
    async (token0: string, token1: string) => {
      try {
        const tx = await makerContract?.methods.convert(token0, token1)
        return addTransaction(tx, { summary: 'Serve' })
      } catch (error) {
        return error
      }
    },
    [addTransaction, makerContract]
  )

  // TODO: Serve all?

  return { serve }
}

export default useMaker
