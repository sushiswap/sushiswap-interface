import { useCallback, useEffect, useState } from 'react'
import { Contract } from 'ethers'
import { BigNumber } from '@ethersproject/bignumber'
import { useActiveWeb3React } from '../hooks'
import { useSushiContract, useSaaveContract } from './useContract'

import Fraction from '../constants/Fraction'

const useAllowance = () => {
  const [allowance, setAllowance] = useState('0')
  const { account } = useActiveWeb3React()
  const saaveContract = useSaaveContract()
  const sushiContract = useSushiContract()

  const getAllowance = async (
    contract: Contract | null,
    owner: string | null | undefined,
    spender: string | undefined
  ): Promise<string> => {
    try {
      const allowance = await contract?.allowance(owner, spender)
      //console.log('getAllowance:', allowance)
      return Fraction.from(BigNumber.from(allowance), BigNumber.from(10).pow(18)).toString()
    } catch (e) {
      return '0'
    }
  }

  const fetchAllowance = useCallback(async () => {
    const allowance = await getAllowance(sushiContract, account, saaveContract?.address)
    setAllowance(allowance)
  }, [account, saaveContract?.address, sushiContract])

  useEffect(() => {
    if (account && sushiContract && saaveContract) {
      fetchAllowance()
    }
    const refreshInterval = setInterval(fetchAllowance, 10000)
    return () => clearInterval(refreshInterval)
  }, [account, fetchAllowance, sushiContract, saaveContract])

  return allowance
}

export default useAllowance
