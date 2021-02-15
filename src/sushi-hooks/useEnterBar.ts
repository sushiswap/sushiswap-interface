import { useCallback } from 'react'
import { Contract } from 'ethers'
import { BigNumber } from '@ethersproject/bignumber'
//import { useActiveWeb3React } from '../hooks'
import { useSushiBarContract } from './useContract'
import { useTransactionAdder } from '../state/transactions/hooks'

const useEnterBar = () => {
  const addTransaction = useTransactionAdder()
  const barContract = useSushiBarContract(true) //with Signer

  const enter = async (barContract: Contract | null, amount: string) => {
    console.log('barContract:', barContract)
    return barContract?.enter(
      BigNumber.from(amount)
        .mul(BigNumber.from(10).pow(18))
        .toString()
    )
  }

  const handle = useCallback(
    async (amount: string) => {
      await enter(barContract, amount)
        .then(tx => {
          return addTransaction(tx, { summary: 'Enter SushiBar' })
        })
        .catch(e => {
          // User denied transaction signature on MetaMask.
          if (e.message.includes('User denied')) {
            return e
          }
          return e
        })
    },
    [addTransaction, barContract]
  )

  return { onEnter: handle }
}

export default useEnterBar
