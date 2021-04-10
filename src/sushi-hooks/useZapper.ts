import { useCallback, useEffect, useState } from 'react'
import { useZapperContract } from './useContract'
import { useTransactionAdder } from '../state/transactions/hooks'

import { useActiveWeb3React } from '../hooks'

const useZapper = () => {
  const { chainId } = useActiveWeb3React()
  const zapperContract = useZapperContract(true)

  const addTransaction = useTransactionAdder()
  // Mapping from token address => allowance amount
  const [allowances, setAllowance] = useState({})

  const zapIn = useCallback(
    async (fromTokenContractAddress, pairAddress, amount, minPoolTokens, swapTarget) => {
      try {
        const tx = await zapperContract?.ZapIn(
          fromTokenContractAddress,
          pairAddress,
          amount,
          minPoolTokens,
          swapTarget,
          // Unknown byte data param (swapData), is maybe something to do with routing?
          0x0,
          // Affiliate
          '0x0000000000000000000000000000000000000000',
          // Transfer residual
          true,
          {
            // Value for transfer should be 0 unless it's an ETH transfer
            value: fromTokenContractAddress === '0x0000000000000000000000000000000000000000' 
              ? amount 
              : 0
          }
        )
        return addTransaction(tx, { summary: 'Zap' })
      } catch (e) {
        console.log(e)
      }
    }, 
    [chainId]
  )

  return { zapIn }
}

export default useZapper
