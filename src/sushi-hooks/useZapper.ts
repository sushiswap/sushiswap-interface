import { Token, TokenAmount } from '@sushiswap/sdk'
import { useCallback, useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { useZapperContract } from './useContract'
import { useTransactionAdder } from '../state/transactions/hooks'

import { useActiveWeb3React } from '../hooks'
import { BalanceProps } from './queries/useTokenBalance'
import Fraction from '../constants/Fraction'
const { BigNumber } = ethers

const useZapper = () => {
  const { account } = useActiveWeb3React()
  const zapperContract = useZapperContract(true)
  console.log({zapperContract})

  const addTransaction = useTransactionAdder()
  const [allowance, setAllowance] = useState('0')

  const zapIn = useCallback(
    async () => {
      try {
        const tx = await zapperContract?.ZapIn(
          '0x0000000000000000000000000000000000000000',
          '0x37f4d05b879c364187caa02678ba041f7b5f5c71',
          100000000000000,
          0,
          '0xc778417E063141139Fce010982780140Aa0cD5Ab',
          0x0,
          '0x0000000000000000000000000000000000000000',
          false,
          {
            value: 100000000000000
          }
        )
        console.log(tx, 'HERE IS THE SWEET SWEET ZAP TX')
      } catch (e) {
        console.log(e)
      }
    }, 
    []
  )

  return { zapIn }
}

export default useZapper
