import { ethers } from 'ethers'
import { useCallback, useEffect, useState } from 'react'
import Fraction from '../entities/Fraction'
import { useActiveWeb3React } from './useActiveWeb3React'
import { useMeowshiContract, useSushiBarContract, useSushiContract } from '../hooks/useContract'
import { useTransactionAdder } from '../state/transactions/hooks'
import { BalanceProps } from './useTokenBalance'

const { BigNumber } = ethers

const useMeowshi = () => {
    const { account } = useActiveWeb3React()
    const addTransaction = useTransactionAdder()
    const sushiContract = useSushiContract(true) // withSigner
    const barContract = useSushiBarContract(true) // withSigner
    const meowshiContract = useMeowshiContract(true) // withSigner

    const [allowance, setAllowance] = useState('0')

    const fetchAllowance = useCallback(async () => {
        if (account) {
            try {
                const allowance = await barContract?.allowance(account, meowshiContract?.address)
                const formatted = Fraction.from(BigNumber.from(allowance), BigNumber.from(10).pow(18)).toString()
                setAllowance(formatted)
            } catch (error) {
                setAllowance('0')
                throw error
            }
        }
    }, [account, meowshiContract, barContract])

    useEffect(() => {
        if (account && meowshiContract && barContract) {
            fetchAllowance()
        }
        const refreshInterval = setInterval(fetchAllowance, 10000)
        return () => clearInterval(refreshInterval)
    }, [account, meowshiContract, fetchAllowance, barContract])

    const approve = useCallback(async () => {
        try {
            const tx = await barContract?.approve(meowshiContract?.address, ethers.constants.MaxUint256.toString())
            return addTransaction(tx, { summary: 'Approve' })
        } catch (e) {
            return e
        }
    }, [addTransaction, meowshiContract, barContract])

    const nyan = useCallback(
        // todo: this should be updated with BigNumber as opposed to string
        async (amount: BalanceProps | undefined) => {
            if (amount?.value) {
                try {
                    const tx = await meowshiContract?.nyan(account, amount?.value)
                    return addTransaction(tx, { summary: 'Enter Meowshi' })
                } catch (e) {
                    return e
                }
            }
        },
        [addTransaction, meowshiContract]
    )

    const unyan = useCallback(
        // todo: this should be updated with BigNumber as opposed to string
        async (amount: BalanceProps | undefined) => {
            if (amount?.value) {
                try {
                    const tx = await meowshiContract?.unyan(account, amount?.value)
                    return addTransaction(tx, { summary: 'Leave Meowshi' })
                } catch (e) {
                    return e
                }
            }
        },
        [addTransaction, meowshiContract]
    )

    return { allowance, approve, nyan, unyan }
}

export default useMeowshi
