import { useCallback, useEffect, useState } from 'react'
import { Currency, CurrencyAmount } from '@sushiswap/sdk';
import { useZapperContract } from './useContract'
import { useTransactionAdder } from '../state/transactions/hooks'

import { useActiveWeb3React } from '../hooks'
import { useApproveCallback } from 'hooks/useApproveCallback';

const useZapper = (currency?: Currency) => {
  const { chainId } = useActiveWeb3React()
  const zapperContract = useZapperContract(true)
  const addTransaction = useTransactionAdder()

  const zapIn = useCallback(
    async (fromTokenContractAddress, pairAddress, amount: CurrencyAmount | undefined, minPoolTokens, swapTarget) => {
      try {
        const tx = await zapperContract?.ZapIn(
          fromTokenContractAddress,
          pairAddress,
          amount?.raw.toString(),
          minPoolTokens,
          swapTarget,
          // Unknown byte data param (swapData), is maybe something to do with routing for non native lp tokens?
          0x0,
          // Affiliate
          '0x0000000000000000000000000000000000000000',
          // Transfer residual (Can save gas if set to false but unsure about math right now)
          true,
          {
            // Value for transfer should be 0 unless it's an ETH transfer
            value: fromTokenContractAddress === '0x0000000000000000000000000000000000000000' 
              ? amount 
              : 0
          }
        )
        return addTransaction(tx, { summary: `Zap ${amount?.toSignificant(6)} ${currency?.symbol}` })
      } catch (e) {
        console.log(e)
      }
    }, 
    [chainId]
  )

  return { zapIn }
}

export default useZapper
