import { useCallback } from 'react'
import { useMasterChefContract } from './useContract'
import { useTransactionAdder } from '../state/transactions/hooks'
import { BigNumber } from '@ethersproject/bignumber'
import { ethers } from 'ethers'

const useMasterChef = () => {
  const addTransaction = useTransactionAdder()
  const masterChefContract = useMasterChefContract(true) // withSigner

  // Deposit
  const deposit = useCallback(
    async (pid: number, amount: string, name: string) => {
      console.log('depositing...', pid, amount)
      try {
        const tx = await masterChefContract?.deposit(pid, ethers.utils.parseUnits(amount))
        return addTransaction(tx, { summary: `Deposit ${name} LP` })
      } catch (e) {
        console.error(e)
        return e
      }
    },
    [addTransaction, masterChefContract]
  )

  // Withdraw
  const withdraw = useCallback(
    async (pid: number, amount: string, name: string) => {
      try {
        const tx = await masterChefContract?.withdraw(pid, ethers.utils.parseUnits(amount))
        return addTransaction(tx, { summary: `Withdraw ${name} LP` })
      } catch (e) {
        console.error(e)
        return e
      }
    },
    [addTransaction, masterChefContract]
  )

  const harvest = useCallback(
    async (pid: number, name: string) => {
      try {
        const tx = await masterChefContract?.deposit(pid, '0')
        return addTransaction(tx, { summary: `Harvest ${name} LP` })
      } catch (e) {
        console.error(e)
        return e
      }
    },
    [addTransaction, masterChefContract]
  )

  return { deposit, withdraw, harvest }
}

export default useMasterChef
