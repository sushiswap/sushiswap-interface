import { useCallback, useEffect, useState } from 'react'
import { Contract } from 'ethers'
import { BigNumber } from '@ethersproject/bignumber'
import { useActiveWeb3React } from '../hooks'
import { isAddress } from '../utils'
import ERC20_ABI from '../constants/abis/erc20.json'
import { useContract, useMasterChefContract } from './useContract'

const useAllowance = (lpAddress: string) => {
  const [allowance, setAllowance] = useState(BigNumber.from(0))
  const { account } = useActiveWeb3React()
  const masterChefContract = useMasterChefContract()
  const lpAddressChecksum = isAddress(lpAddress)
  const lpContract = useContract(lpAddressChecksum, ERC20_ABI, false)

  console.log('lpContract:', lpContract)

  const getAllowance = async (
    contract: Contract | null,
    owner: string | null | undefined,
    spender: string | undefined
  ): Promise<string> => {
    try {
      const allowance: string = await contract?.allowance(owner, spender)
      return allowance
    } catch (e) {
      return '0'
    }
  }

  const fetchAllowance = useCallback(async () => {
    console.log('allowance:', lpContract, account, masterChefContract?.address)
    const allowance = await getAllowance(lpContract, account, masterChefContract?.address)
    setAllowance(BigNumber.from(allowance))
  }, [account, lpContract, masterChefContract?.address])

  useEffect(() => {
    if (account && masterChefContract && lpContract) {
      fetchAllowance()
    }
    const refreshInterval = setInterval(fetchAllowance, 10000)
    return () => clearInterval(refreshInterval)
  }, [account, masterChefContract, lpContract, fetchAllowance])

  return allowance
}

export default useAllowance
