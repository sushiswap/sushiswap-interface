import { ethers } from 'ethers'
import { useMiniChefV2Contract } from 'hooks/useContract'
import { useActiveWeb3React } from 'hooks/useActiveWeb3React'

import { useCallback } from 'react'
import { useTransactionAdder } from '../../../../state/transactions/hooks'

const useMiniChefV2 = () => {
    const addTransaction = useTransactionAdder()
    const miniChefV2Contract = useMiniChefV2Contract() // withSigner
    const { account } = useActiveWeb3React()

    // Deposit
    const deposit = useCallback(
        async (pid: number, amount: string, name: string, decimals = 18) => {
            // KMP decimals depend on asset, SLP is always 18
            console.log('depositing...', pid, amount)
            try {
                const tx = await miniChefV2Contract?.deposit(pid, ethers.utils.parseUnits(amount, decimals), account)
                return addTransaction(tx, { summary: `Deposit ${name}` })
            } catch (e) {
                console.error(e)
                return e
            }
        },
        [account, addTransaction, miniChefV2Contract]
    )

    // Withdraw
    const withdraw = useCallback(
        async (pid: number, amount: string, name: string, decimals = 18) => {
            try {
                const tx = await miniChefV2Contract?.withdraw(pid, ethers.utils.parseUnits(amount, decimals), account)
                return addTransaction(tx, { summary: `Withdraw ${name}` })
            } catch (e) {
                console.error(e)
                return e
            }
        },
        [account, addTransaction, miniChefV2Contract]
    )

    const harvest = useCallback(
        async (pid: number, name: string) => {
            try {
                console.log('help:', pid, account)
                const tx = await miniChefV2Contract?.harvest(pid, account)
                return addTransaction(tx, { summary: `Harvest ${name}` })
            } catch (e) {
                console.error(e)
                return e
            }
        },
        [account, addTransaction, miniChefV2Contract]
    )

    return { deposit, withdraw, harvest }
}

export default useMiniChefV2
