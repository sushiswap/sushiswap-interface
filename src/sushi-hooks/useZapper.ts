import { Token, TokenAmount } from '@sushiswap/sdk'
import { useCallback, useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { useSaaveContract, useSushiContract } from './useContract'
import { useTransactionAdder } from '../state/transactions/hooks'

import { useActiveWeb3React } from '../hooks'
import { BalanceProps } from './queries/useTokenBalance'
import Fraction from '../constants/Fraction'
const { BigNumber } = ethers

const useZapper = () => {
  const { account } = useActiveWeb3React()

  const addTransaction = useTransactionAdder()
  const [allowance, setAllowance] = useState({})

  const zapIn = useCallback(
    async (amout, ) => {

    }, 
    []
  )

  return {  }
}

export default useZapper
