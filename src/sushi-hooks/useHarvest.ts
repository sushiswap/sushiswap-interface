import { useCallback } from 'react'
import { Contract } from 'ethers'
//import { useActiveWeb3React } from '../hooks'
import { useMasterChefContract } from './useContract'
import { useTransactionAdder } from '../state/transactions/hooks'

const useHarvest = (pid: number) => {
  const addTransaction = useTransactionAdder()
  const masterChefContract = useMasterChefContract(true) // withSigner

  const harvest = async (masterChefContract: Contract | null, pid: number) => {
    return masterChefContract?.methods.deposit(pid, '0')
  }

  const handleHarvest = useCallback(async () => {
    await harvest(masterChefContract, pid)
      .then(tx => {
        return addTransaction(tx, { summary: 'Harvest' })
      })
      .catch(e => {
        // User denied transaction signature on MetaMask.
        if (e.message.includes('User denied')) {
          return e
        }
        return e
      })
  }, [addTransaction, masterChefContract, pid])

  return { onHarvest: handleHarvest }
}

export default useHarvest
