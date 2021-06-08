import { useCallback, useEffect, useState } from 'react'
import { useContract, useMasterChefContract } from '../hooks/useContract'

import { BigNumber } from '@ethersproject/bignumber'
import { Contract } from 'ethers'
import ERC20_ABI from '../constants/abis/erc20.json'
import { getAddress } from '@ethersproject/address'
import { useActiveWeb3React } from '../hooks/useActiveWeb3React'

const useAllowance = (lpAddress: string) => {
    const [allowance, setAllowance] = useState(BigNumber.from(0))
    const { account } = useActiveWeb3React()
    const masterChefContract = useMasterChefContract()
    const lpAddressChecksum = getAddress(lpAddress)
    const lpContract = useContract(
        lpAddressChecksum ? lpAddressChecksum : undefined,
        ERC20_ABI,
        false
    )

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
        const allowance = await getAllowance(
            lpContract,
            account,
            masterChefContract?.address
        )
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
