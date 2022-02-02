import { getAddress } from '@ethersproject/address'
import { BigNumber } from '@ethersproject/bignumber'
import { AddressZero } from '@ethersproject/constants'
import { JSBI, WNATIVE_ADDRESS } from '@sushiswap/core-sdk'
import { useActiveWeb3React } from 'app/services/web3'
import { useTransactionAdder } from 'app/state/transactions/hooks'
import { useCallback } from 'react'

import { useBentoBoxContract } from './useContract'

function useBentoBox() {
  const { account, chainId } = useActiveWeb3React()

  const addTransaction = useTransactionAdder()
  const bentoBoxContract = useBentoBoxContract()

  const deposit = useCallback(
    async (tokenAddress: string, value: BigNumber) => {
      if (value && chainId) {
        try {
          const tokenAddressChecksum = getAddress(tokenAddress)
          if (tokenAddressChecksum === WNATIVE_ADDRESS[chainId]) {
            const tx = await bentoBoxContract?.deposit(AddressZero, account, account, value, 0, {
              value,
            })
            return addTransaction(tx, { summary: 'Deposit to Bentobox' })
          } else {
            const tx = await bentoBoxContract?.deposit(tokenAddressChecksum, account, account, value, 0)
            return addTransaction(tx, { summary: 'Deposit to Bentobox' })
          }
        } catch (e) {
          console.error('bentobox deposit error:', e)
          return e
        }
      }
    },
    [account, addTransaction, bentoBoxContract, chainId]
  )

  const withdraw = useCallback(
    async (tokenAddress: string, value: BigNumber, share?: JSBI) => {
      if (value && chainId) {
        try {
          const tokenAddressChecksum = getAddress(tokenAddress)
          const tx = await bentoBoxContract?.withdraw(
            tokenAddressChecksum === WNATIVE_ADDRESS[chainId]
              ? '0x0000000000000000000000000000000000000000'
              : tokenAddressChecksum,
            account,
            account,
            value,
            share ? share.toString() : 0
          )
          return addTransaction(tx, { summary: 'Withdraw from Bentobox' })
        } catch (e) {
          console.error('bentobox withdraw error:', e)
          return e
        }
      }
    },
    [account, addTransaction, bentoBoxContract, chainId]
  )

  const harvest = useCallback(async (tokenAddress: string, rebalance: boolean = false) => {
    if (chainId) {
      try {
        const tx = await bentoBoxContract?.harvest(tokenAddress, rebalance, 0)
        return addTransaction(tx, { summary: rebalance ? 'Harvest & Rebalance' : 'Harvest' })
      } catch (e) {
        console.error('bentobox harvest error:', e)
        return e
      }
    }
  }, [])

  return { deposit, withdraw, harvest }
}

export default useBentoBox
