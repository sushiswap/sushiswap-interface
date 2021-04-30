import { ethers } from 'ethers'
import { useMiniChefV2Contract } from 'hooks/useContract'
import { useCallback } from 'react'
import { useTransactionAdder } from '../state/transactions/hooks'

const useMasterChef = () => {
    const addTransaction = useTransactionAdder()
    const miniChefV2Contract = useMiniChefV2Contract() // withSigner

    // Deposit
    const deposit = useCallback(
        async (pid: number, amount: string, name: string, decimals = 18) => {
            // KMP decimals depend on asset, SLP is always 18
            // console.log('depositing...', pid, amount)
            try {
                const tx = await miniChefV2Contract?.deposit(pid, ethers.utils.parseUnits(amount, decimals))
                return addTransaction(tx, { summary: `Deposit ${name}` })
            } catch (e) {
                console.error(e)
                return e
            }
        },
        [addTransaction, miniChefV2Contract]
    )

    // Withdraw
    const withdraw = useCallback(
        async (pid: number, amount: string, name: string, decimals = 18) => {
            try {
                const tx = await miniChefV2Contract?.withdraw(pid, ethers.utils.parseUnits(amount, decimals))
                return addTransaction(tx, { summary: `Withdraw ${name}` })
            } catch (e) {
                console.error(e)
                return e
            }
        },
        [addTransaction, miniChefV2Contract]
    )

    const harvest = useCallback(
        async (pid: number, name: string) => {
            try {
                const tx = await miniChefV2Contract?.deposit(pid, '0')
                return addTransaction(tx, { summary: `Harvest ${name}` })
            } catch (e) {
                console.error(e)
                return e
            }
        },
        [addTransaction, miniChefV2Contract]
    )

    return { deposit, withdraw, harvest }
}

export default useMasterChef
