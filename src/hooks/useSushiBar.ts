import { Currency, CurrencyAmount, Token } from '@sushiswap/sdk'

import { useCallback } from 'react'
import { useSushiBarContract } from './useContract'
import { useTransactionAdder } from '../state/transactions/hooks'

const useSushiBar = () => {
  const addTransaction = useTransactionAdder()
  const barContract = useSushiBarContract()

  const enter = useCallback(
    async (amount: CurrencyAmount<Token> | undefined) => {
      if (amount?.quotient) {
        try {
          const tx = await barContract?.enter(amount?.quotient.toString())
          return addTransaction(tx, { summary: 'Enter SushiBar' })
        } catch (e) {
          return e
        }
      }
    },
    [addTransaction, barContract]
  )

  const leave = useCallback(
    async (amount: CurrencyAmount<Token> | undefined) => {
      if (amount?.quotient) {
        try {
          const tx = await barContract?.leave(amount?.quotient.toString())
          return addTransaction(tx, { summary: 'Leave SushiBar' })
        } catch (e) {
          return e
        }
      }
    },
    [addTransaction, barContract]
  )

  return { enter, leave }
}

export default useSushiBar
