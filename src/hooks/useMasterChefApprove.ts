import { Contract, ethers } from 'ethers'
import { useContract, useMasterChefContract } from './useContract'

import ERC20_ABI from '../constants/abis/erc20.json'
import { getAddress } from '@ethersproject/address'
import { useCallback } from 'react'
import { useTransactionAdder } from '../state/transactions/hooks'

const useApprove = (lpAddress: string) => {
    const addTransaction = useTransactionAdder()
    const masterChefContract = useMasterChefContract()
    const lpAddressChecksum = getAddress(lpAddress)
    const lpContract = useContract(
        lpAddressChecksum ? lpAddressChecksum : undefined,
        ERC20_ABI,
        true
    ) // withSigner = true

    const approve = async (
        lpContract: Contract | null,
        masterChefContract: Contract | null
    ) => {
        return lpContract?.approve(
            masterChefContract?.address,
            ethers.constants.MaxUint256.toString()
        )
    }

    const handleApprove = useCallback(async () => {
        try {
            const tx = await approve(lpContract, masterChefContract)
            return addTransaction(tx, { summary: 'Approve' })
        } catch (e) {
            return e
        }
    }, [addTransaction, lpContract, masterChefContract])

    return { onApprove: handleApprove }
}

export default useApprove
