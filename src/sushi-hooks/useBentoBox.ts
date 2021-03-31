import { useCallback } from 'react'
import { useBentoBoxContract } from './useContract'
import { useTransactionAdder } from '../state/transactions/hooks'
import { useActiveWeb3React } from '../hooks'
import { BalanceProps } from './useTokenBalance'
import { isAddress } from '../utils'
import { WETH } from '../kashi/constants'

const useBentoBox = () => {
  const { account, chainId } = useActiveWeb3React()

  const addTransaction = useTransactionAdder()
  const bentoBoxContract = useBentoBoxContract(true) // withSigner

  const deposit = useCallback(
    // todo: this should be updated with BigNumber as opposed to string
    async (tokenAddress: string, amount: BalanceProps | undefined) => {
      const tokenAddressChecksum = isAddress(tokenAddress)
      if (amount?.value && chainId) {
        try {
          //ethers.constants.HashZero
          if (tokenAddressChecksum === WETH[chainId]) {
            const tx = await bentoBoxContract?.deposit(
              '0x0000000000000000000000000000000000000000',
              account,
              account,
              amount?.value,
              0,
              { value: amount?.value }
            )
            console.log(tx)
            return addTransaction(tx, { summary: 'Deposit to Bentobox' })
          } else {
            const tx = await bentoBoxContract?.deposit(tokenAddressChecksum, account, account, amount?.value, 0)
            return addTransaction(tx, { summary: 'Deposit to Bentobox' })
          }
        } catch (e) {
          console.log('bentobox deposit error:', e)
          return e
        }
      }
    },
    [account, addTransaction, bentoBoxContract, chainId]
  )

  const withdraw = useCallback(
    // todo: this should be updated with BigNumber as opposed to string
    async (tokenAddress: string, amount: BalanceProps | undefined) => {
      let tokenAddressChecksum = isAddress(tokenAddress)
      if (amount?.value && chainId) {
        try {
          tokenAddressChecksum =
            tokenAddressChecksum === WETH[chainId] ? '0x0000000000000000000000000000000000000000' : tokenAddressChecksum
          const tx = await bentoBoxContract?.withdraw(tokenAddressChecksum, account, account, amount?.value, 0)
          return addTransaction(tx, { summary: 'Withdraw from Bentobox' })
        } catch (e) {
          console.log('bentobox withdraw error:', e)
          return e
        }
      }
    },
    [account, addTransaction, bentoBoxContract, chainId]
  )

  return { deposit, withdraw }
}

export default useBentoBox
