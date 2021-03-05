import { useCallback } from 'react'
import { Contract, ethers } from 'ethers'

import { useSushiContract, useSaaveContract } from './useContract'
import { useTransactionAdder } from '../state/transactions/hooks'

const useApprove = () => {
  //const { account } = useActiveWeb3React()
  const addTransaction = useTransactionAdder()
  const saaveContract = useSaaveContract()
  const sushiContract = useSushiContract(true) // withSigner

  const approve = async (Contract: Contract | null, InteractingContract: Contract | null) => {
    return Contract?.approve(InteractingContract?.address, ethers.constants.MaxUint256.toString())
  }

  const handleApprove = useCallback(async () => {
    try {
      const tx = await approve(sushiContract, saaveContract)
      return addTransaction(tx, { summary: 'Approve Saave' })
    } catch (e) {
      return e
    }
  }, [addTransaction, saaveContract, sushiContract])

  return { onApprove: handleApprove }
}

export default useApprove
