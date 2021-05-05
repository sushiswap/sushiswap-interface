import { Fraction } from '../entities'
import { ethers } from 'ethers'
import { useCallback, useEffect, useState } from 'react'
import useActiveWeb3React from '../hooks/useActiveWeb3React'
import { useInariContract, useSushiContract } from '../hooks/useContract'
import { useTransactionAdder } from '../state/transactions/hooks'
import { BalanceProps } from './useTokenBalance'

const { BigNumber } = ethers

const useInari = () => {
    const { account } = useActiveWeb3React()

    const addTransaction = useTransactionAdder()
    const sushiContract = useSushiContract(true) // withSigner
    const inariContract = useInariContract(true)

    // Allowance
    const [allowance, setAllowance] = useState('0')
    const fetchAllowance = useCallback(async () => {
        if (account) {
            try {
                const allowance = await sushiContract?.allowance(account, inariContract?.address)
                console.log('allowance', allowance)
                const formatted = Fraction.from(BigNumber.from(allowance), BigNumber.from(10).pow(18)).toString()
                setAllowance(formatted)
            } catch (error) {
                setAllowance('0')
                throw error
            }
        }
    }, [account, inariContract?.address, sushiContract])
    useEffect(() => {
        if (account && inariContract && sushiContract) {
            fetchAllowance()
        }
        const refreshInterval = setInterval(fetchAllowance, 10000)
        return () => clearInterval(refreshInterval)
    }, [account, fetchAllowance, inariContract, sushiContract])  

    // Approve
    const approve = useCallback(async () => {
        try {
            const tx = await sushiContract?.approve(inariContract?.address, ethers.constants.MaxUint256.toString())
            return addTransaction(tx, { summary: 'Approve' })
        } catch (e) {
            return e
        }
    }, [addTransaction, inariContract?.address, sushiContract])

    // Stake SUSHI → xSUSHI → AAVE
    const stakeSushiToAave = useCallback(
        async (amount: BalanceProps | undefined) => {
            if (amount?.value) {
                try {
                    const tx = await inariContract?.stakeSushiToAave(account, amount?.value)
                    return addTransaction(tx, { summary: 'SUSHI → xSUSHI → AAVE' })
                } catch (e) {
                    return e
                }
            }
        },
        [account, addTransaction]
    )

    // Unstake AAVE -> xSUSHI -> SUSHI
    const unstakeSushiFromAave = useCallback(
        async (amount: BalanceProps | undefined) => {
            if (amount?.value) {
                try {
                    const tx = await inariContract?.unstakeSushiFromAave(account, amount?.value)
                    return addTransaction(tx, { summary: 'AAVE -> xSUSHI -> SUSHI' })
                } catch (e) {
                    return e
                }
            }
        },
        [account, addTransaction]
    )

    // Stake SUSHI → xSUSHI → BENTO
    const stakeSushiToBento = useCallback(
        async (amount: BalanceProps | undefined) => {
            if (amount?.value) {
                try {
                    const tx = await inariContract?.stakeSushiToBento(account, amount?.value)
                    return addTransaction(tx, { summary: 'SUSHI → xSUSHI → BENTO' })
                } catch (e) {
                    return e
                }
            }
        },
        [account, addTransaction]
    )

    // Unstake BENTO -> xSUSHI -> SUSHI
    const unstakeSushiFromBento = useCallback(
        async (amount: BalanceProps | undefined) => {
            if (amount?.value) {
                try {
                    const tx = await inariContract?.unstakeSushiFromBento(account, amount?.value)
                    return addTransaction(tx, { summary: 'BENTO -> xSUSHI -> SUSHI' })
                } catch (e) {
                    return e
                }
            }
        },
        [account, addTransaction]
    )

    // Stake SUSHI → xSUSHI → CREAM -> BENTO
    const stakeSushiToCreamToBento = useCallback(
        async (amount: BalanceProps | undefined) => {
            if (amount?.value) {
                try {
                    const tx = await inariContract?.stakeSushiToCreamToBento(account, amount?.value)
                    return addTransaction(tx, { summary: 'SUSHI -> xSUSHI -> CREAM -> BENTO' })
                } catch (e) {
                    return e
                }
            }
        },
        [account, addTransaction]
    )

    // Unstake BENTO -> CREAM -> xSUSHI -> SUSHI
    const unstakeSushiFromCreamFromBento = useCallback(
        async (amount: BalanceProps | undefined) => {
            if (amount?.value) {
                try {
                    const tx = await inariContract?.unstakeSushiFromCreamFromBento(account, amount?.value)
                    return addTransaction(tx, { summary: 'BENTO -> CREAM -> xSUSHI -> SUSHI' })
                } catch (e) {
                    return e
                }
            }
        },
        [account, addTransaction]
    )

    // Stake SUSHI → xSUSHI → CREAM
    const stakeSushiToCream = useCallback(
        async (amount: BalanceProps | undefined) => {
            if (amount?.value) {
                try {
                    const tx = await inariContract?.stakeSushiToCreamToBento(account, amount?.value)
                    return addTransaction(tx, { summary: 'SUSHI -> xSUSHI -> CREAM' })
                } catch (e) {
                    return e
                }
            }
        },
        [account, addTransaction]
    )

    // Unstake CREAM → xSUSHI → SUSHI
    const unstakeSushiFromCream = useCallback(
        async (amount: BalanceProps | undefined) => {
            if (amount?.value) {
                try {
                    const tx = await inariContract?.unstakeSushiFromCream(account, amount?.value)
                    return addTransaction(tx, { summary: 'CREAM → xSUSHI → SUSHI' })
                } catch (e) {
                    return e
                }
            }
        },
        [account, addTransaction]
    )

    return { allowance, approve, stakeSushiToAave, unstakeSushiFromAave, stakeSushiToBento, unstakeSushiFromBento,
        stakeSushiToCreamToBento, unstakeSushiFromCreamFromBento, stakeSushiToCream, unstakeSushiFromCream }
}

export default useInari