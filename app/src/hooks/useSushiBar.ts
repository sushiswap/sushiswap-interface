import { useCallback, useEffect, useState } from 'react'
import { useSushiBarContract, useSushiContract } from '../hooks/useContract'

import { CurrencyAmount } from '@sushiswap/sdk'
import Fraction from '../entities/Fraction'
import { ethers } from 'ethers'
import { useActiveWeb3React } from './useActiveWeb3React'
import { useTransactionAdder } from '../state/transactions/hooks'

const { BigNumber } = ethers

const useSushiBar = () => {
    const { account } = useActiveWeb3React()
    const addTransaction = useTransactionAdder()
    const sushiContract = useSushiContract()
    const barContract = useSushiBarContract()

    const [allowance, setAllowance] = useState('0')

    const fetchAllowance = useCallback(async () => {
        if (account) {
            try {
                const allowance = await sushiContract?.allowance(account, barContract?.address)
                const formatted = Fraction.from(BigNumber.from(allowance), BigNumber.from(10).pow(18)).toString()
                setAllowance(formatted)
            } catch (error) {
                setAllowance('0')
                throw error
            }
        }
    }, [account, barContract, sushiContract])

    useEffect(() => {
        if (account && barContract && sushiContract) {
            fetchAllowance()
        }
        const refreshInterval = setInterval(fetchAllowance, 10000)
        return () => clearInterval(refreshInterval)
    }, [account, barContract, fetchAllowance, sushiContract])

    const approve = useCallback(async () => {
        try {
            const tx = await sushiContract?.approve(barContract?.address, ethers.constants.MaxUint256.toString())
            return addTransaction(tx, { summary: 'Approve' })
        } catch (e) {
            return e
        }
    }, [addTransaction, barContract, sushiContract])

    const enter = useCallback(
        async (amount: CurrencyAmount | undefined) => {
            if (amount?.raw) {
                try {
                    const tx = await barContract?.enter(amount?.raw.toString())
                    return addTransaction(tx, { summary: 'Enter SushiBar' })
                } catch (e) {
                    return e
                }
            }
        },
        [addTransaction, barContract]
    )

    const leave = useCallback(
        async (amount: CurrencyAmount | undefined) => {
            if (amount?.raw) {
                try {
                    const tx = await barContract?.leave(amount?.raw.toString())
                    return addTransaction(tx, { summary: 'Leave SushiBar' })
                } catch (e) {
                    return e
                }
            }
        },
        [addTransaction, barContract]
    )

    return { allowance, approve, enter, leave }
}

export default useSushiBar
