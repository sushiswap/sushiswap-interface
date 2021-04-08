import { useCallback } from 'react'
import { useMasterChefContract } from './useContract'
import { useTransactionAdder } from '../state/transactions/hooks'

const useMasterChef = () => {
    const addTransaction = useTransactionAdder()
    const masterChefContract = useMasterChefContract()

    // Deposit
    const deposit = useCallback(
        async (pid: number, amount: string) => {
            try {
                const tx = await masterChefContract?.methods.deposit(pid, amount)
                return addTransaction(tx, { summary: 'Deposit' })
            } catch (e) {
                return e
            }
        },
        [addTransaction, masterChefContract]
    )

    // Withdraw
    const withdraw = useCallback(
        async (pid: number, amount: string) => {
            try {
                const tx = await masterChefContract?.methods.withdraw(pid, amount)
                return addTransaction(tx, { summary: 'Withdraw' })
            } catch (e) {
                return e
            }
        },
        [addTransaction, masterChefContract]
    )

    const harvest = useCallback(
        async (pid: number) => {
            try {
                const tx = await deposit(pid, '0')
                return addTransaction(tx, { summary: 'Harvest' })
            } catch (e) {
                return e
            }
        },
        [addTransaction, deposit]
    )

    return { deposit, withdraw, harvest }
}

export default useMasterChef
