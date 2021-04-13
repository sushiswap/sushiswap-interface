import { useCallback } from 'react'
import { useBentoBoxContract } from './useContract'
import { useTransactionAdder } from '../state/transactions/hooks'
import { useActiveWeb3React } from '../hooks'
import { isAddress } from '../utils'
import { WETH } from '@sushiswap/sdk'
import { ethers } from 'ethers'
import { BigNumber } from '@ethersproject/bignumber'

function useBentoBox() {
    const { account, chainId } = useActiveWeb3React()

    const addTransaction = useTransactionAdder()
    const bentoBoxContract = useBentoBoxContract()

    const deposit = useCallback(
        async (tokenAddress: string, value: BigNumber) => {
            const tokenAddressChecksum = isAddress(tokenAddress)
            if (value && chainId) {
                try {
                    if (tokenAddressChecksum === WETH[chainId].address) {
                        const tx = await bentoBoxContract?.deposit(
                            ethers.constants.AddressZero,
                            account,
                            account,
                            value,
                            0,
                            { value }
                        )
                        return addTransaction(tx, { summary: 'Deposit to Bentobox' })
                    } else {
                        const tx = await bentoBoxContract?.deposit(tokenAddressChecksum, account, account, value, 0)
                        return addTransaction(tx, { summary: 'Deposit to Bentobox' })
                    }
                } catch (e) {
                    console.log('bentobox deposit error:', e)
                    return e
                }
            }
        },
        [account, addTransaction, bentoBoxContract, chainId]
    )

    const withdraw = useCallback(
        // todo: this should be updated with BigNumber as opposed to string
        async (tokenAddress: string, value: BigNumber) => {
            let tokenAddressChecksum = isAddress(tokenAddress)
            if (value && chainId) {
                try {
                    tokenAddressChecksum =
                        tokenAddressChecksum === WETH[chainId].address
                            ? '0x0000000000000000000000000000000000000000'
                            : tokenAddressChecksum
                    const tx = await bentoBoxContract?.withdraw(tokenAddressChecksum, account, account, value, 0)
                    return addTransaction(tx, { summary: 'Withdraw from Bentobox' })
                } catch (e) {
                    console.log('bentobox withdraw error:', e)
                    return e
                }
            }
        },
        [account, addTransaction, bentoBoxContract, chainId]
    )

    return { deposit, withdraw }
}

export default useBentoBox
