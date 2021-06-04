import { ethers } from 'ethers'
import { useActiveWeb3React } from '../../../../hooks/useActiveWeb3React'
import { useCallback } from 'react'
import { useMasterChefV2Contract } from '../../../../hooks/useContract'
import { useTransactionAdder } from '../../../../state/transactions/hooks'

const useMasterChefV2 = () => {
    const addTransaction = useTransactionAdder()
    const masterChefV2Contract = useMasterChefV2Contract() // withSigner
    const { account } = useActiveWeb3React()

    // Deposit
    const deposit = useCallback(
        async (pid: number, amount: string, name: string, decimals = 18) => {
            // KMP decimals depend on asset, SLP is always 18
            console.log(
                'depositing...',
                pid,
                amount,
                ethers.utils.parseUnits(amount, decimals),
                name,
                masterChefV2Contract?.address,
                masterChefV2Contract,
                account
            )
            try {
                const tx = await masterChefV2Contract?.deposit(pid, ethers.utils.parseUnits(amount, decimals), account)
                return addTransaction(tx, { summary: `Deposit ${name}` })
            } catch (e) {
                console.error(e)
                return e
            }
        },
        [account, addTransaction, masterChefV2Contract]
    )

    // Withdraw
    const withdraw = useCallback(
        async (pid: number, amount: string, name: string, decimals = 18) => {
            try {
                const tx = await masterChefV2Contract?.withdraw(pid, ethers.utils.parseUnits(amount, decimals), account)
                return addTransaction(tx, { summary: `Withdraw ${name}` })
            } catch (e) {
                console.error(e)
                return e
            }
        },
        [account, addTransaction, masterChefV2Contract]
    )

    const harvest = useCallback(
        async (pid: number, name: string) => {
            try {
                console.log('harvest:', pid, account)
                console.log({ masterChefV2Contract })
                const tx = await masterChefV2Contract?.batch(
                    [
                        masterChefV2Contract.interface.encodeFunctionData('harvestFromMasterChef'),
                        masterChefV2Contract.interface.encodeFunctionData('harvest', [pid, account])
                    ],
                    true
                )
                return addTransaction(tx, { summary: `Harvest ${name}` })
            } catch (e) {
                console.error(e)
                return e
            }
        },
        [account, addTransaction, masterChefV2Contract]
    )

    return { deposit, withdraw, harvest }
}

export default useMasterChefV2
