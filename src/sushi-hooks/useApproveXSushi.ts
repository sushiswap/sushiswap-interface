import { useCallback } from 'react'
import { Contract, ethers } from 'ethers'
//import { useActiveWeb3React } from '../hooks'
import { useSushiContract, useSushiBarContract } from './useContract'
import { useTransactionAdder } from '../state/transactions/hooks'

const useApproveXSushi = () => {
  //const { account } = useActiveWeb3React()
  const addTransaction = useTransactionAdder()
  const sushiContract = useSushiContract(true) // withSigner
  const barContract = useSushiBarContract()

  const approve = async (sushiContract: Contract | null, barContract: Contract | null) => {
    return sushiContract?.approve(barContract?.address, ethers.constants.MaxUint256.toString())
  }

  const handleApprove = useCallback(async () => {
    await approve(sushiContract, barContract)
      .then(tx => {
        return addTransaction(tx, { summary: 'Approve' })
      })
      .catch(e => {
        // User denied transaction signature on MetaMask.
        if (e.message.includes('User denied')) {
          return e
        }
        return e
      })
  }, [addTransaction, barContract, sushiContract])

  return { onApprove: handleApprove }
}

export default useApproveXSushi
