import { useCallback } from 'react'
import { ethers } from 'ethers'
import { useSushiContract, useSushiBarContract } from './useContract'
import { useTransactionAdder } from '../state/transactions/hooks'

const { BigNumber } = ethers

const useSushiBar = () => {
  const addTransaction = useTransactionAdder()
  const sushiContract = useSushiContract(true)
  const barContract = useSushiBarContract(true)

  const approve = useCallback(async () => {
    try {
      const tx = await sushiContract?.approve(barContract?.address, ethers.constants.MaxUint256.toString())
      return addTransaction(tx, { summary: 'Approve' })
    } catch (e) {
      return e
    }
  }, [addTransaction, barContract, sushiContract])

  const enter = useCallback(
    async (amount: string) => {
      try {
        const tx = await barContract?.enter(
          BigNumber.from(amount)
            .mul(BigNumber.from(10).pow(18))
            .toString()
        )
        return addTransaction(tx, { summary: 'Enter SushiBar' })
      } catch (e) {
        return e
      }
    },
    [addTransaction, barContract]
  )

  const leave = useCallback(
    async (amount: string) => {
      try {
        const tx = await barContract?.leave(
          BigNumber.from(amount)
            .mul(BigNumber.from(10).pow(18))
            .toString()
        )
        return addTransaction(tx, { summary: 'Leave SushiBar' })
      } catch (e) {
        return e
      }
    },
    [addTransaction, barContract]
  )

  return { approve, enter, leave }
}

export default useSushiBar
