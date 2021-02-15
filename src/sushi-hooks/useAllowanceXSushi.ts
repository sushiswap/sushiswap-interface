import { useCallback, useEffect, useState } from 'react'
import { Contract } from 'ethers'
import { BigNumber } from '@ethersproject/bignumber'
import { useActiveWeb3React } from '../hooks'
import { useSushiContract, useSushiBarContract } from './useContract'

const useXSushiAllowanceStaking = () => {
  const [allowance, setAllowance] = useState(BigNumber.from(0))
  const { account } = useActiveWeb3React()

  const sushiContract = useSushiContract()
  const barContract = useSushiBarContract()

  const getAllowance = async (
    contract: Contract | null,
    owner: string | null | undefined,
    spender: string | undefined
  ): Promise<string> => {
    try {
      return await contract?.allowance(owner, spender)
    } catch (e) {
      return '0'
    }
  }

  const fetchAllowance = useCallback(async () => {
    if (account) {
      const allowance = await getAllowance(sushiContract, account, barContract?.address)
      setAllowance(BigNumber.from(allowance))
    }
  }, [account, barContract, sushiContract])

  useEffect(() => {
    if (account && barContract && sushiContract) {
      fetchAllowance()
    }
    const refreshInterval = setInterval(fetchAllowance, 10000)
    return () => clearInterval(refreshInterval)
  }, [account, barContract, fetchAllowance, sushiContract])

  return allowance
}

export default useXSushiAllowanceStaking
