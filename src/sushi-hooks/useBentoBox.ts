import { useCallback } from 'react'
import { useBentoBoxContract } from './useContract'
import { useTransactionAdder } from '../state/transactions/hooks'

import { useActiveWeb3React } from '../hooks'
import { BalanceProps } from './queries/useTokenBalance'
import { isAddress } from '../utils'

//import Fraction from '../constants/Fraction'
//import ethers from 'ethers'
//const { BigNumber } = ethers

const useBentoBox = () => {
  const { account } = useActiveWeb3React()

  const addTransaction = useTransactionAdder()
  const bentoBoxContract = useBentoBoxContract(true) // withSigner

  const deposit = useCallback(
    // todo: this should be updated with BigNumber as opposed to string
    async (tokenAddress: string, amount: BalanceProps | undefined) => {
      const tokenAddressChecksum = isAddress(tokenAddress)
      if (amount?.value) {
        try {
          const tx = await bentoBoxContract?.deposit(tokenAddressChecksum, account, account, amount?.value, 0)
          return addTransaction(tx, { summary: 'Deposit to Bentobox' })
        } catch (e) {
          console.log('bentobox deposit error:', e)
          return e
        }
      }
    },
    [account, addTransaction, bentoBoxContract]
  )

  const withdraw = useCallback(
    // todo: this should be updated with BigNumber as opposed to string
    async (tokenAddress: string, amount: BalanceProps | undefined) => {
      const tokenAddressChecksum = isAddress(tokenAddress)
      if (amount?.value) {
        try {
          const tx = await bentoBoxContract?.withdraw(tokenAddressChecksum, account, account, amount?.value, 0)
          return addTransaction(tx, { summary: 'Withdraw from Bentobox' })
        } catch (e) {
          console.log('bentobox withdraw error:', e)
          return e
        }
      }
    },
    [account, addTransaction, bentoBoxContract]
  )

  return { deposit, withdraw }
}

export default useBentoBox
