import { Fraction } from '../entities'
import { ethers } from 'ethers'
import { useCallback, useEffect, useState } from 'react'
import useActiveWeb3React from '../hooks/useActiveWeb3React'
import { useMeowshiContract, useSushiContract } from '../hooks/useContract'
import { useTransactionAdder } from '../state/transactions/hooks'
import { BalanceProps } from './useTokenBalance'

const { BigNumber } = ethers

const useMaker = () => {
    const { account } = useActiveWeb3React()

    const addTransaction = useTransactionAdder()
    const sushiContract = useSushiContract(true) // withSigner
    const meowshiContract = useMeowshiContract(true) // withSigner

    // Allowance
    const [allowance, setAllowance] = useState('0')
    const fetchAllowance = useCallback(async () => {
        if (account) {
            try {
                const allowance = await sushiContract?.allowance(account, meowshiContract?.address)
                console.log('allowance', allowance)
                const formatted = Fraction.from(BigNumber.from(allowance), BigNumber.from(10).pow(18)).toString()
                setAllowance(formatted)
            } catch (error) {
                setAllowance('0')
                throw error
            }
        }
    }, [account, meowshiContract?.address, sushiContract])
    useEffect(() => {
        if (account && meowshiContract && sushiContract) {
            fetchAllowance()
        }
        const refreshInterval = setInterval(fetchAllowance, 10000)
        return () => clearInterval(refreshInterval)
    }, [account, fetchAllowance, meowshiContract, sushiContract])

    // Approve
    const approve = useCallback(async () => {
        try {
            const tx = await sushiContract?.approve(meowshiContract?.address, ethers.constants.MaxUint256.toString())
            return addTransaction(tx, { summary: 'Approve' })
        } catch (e) {
            return e
        }
    }, [addTransaction, meowshiContract?.address, sushiContract])

    // Meowshi Sushi - xSUSHI - NYAN
    const nyanSushi = useCallback(
        async (amount: BalanceProps | undefined) => {
            if (amount?.value) {
                try {
                    const tx = await meowshiContract?.nyanSushi(account, amount?.value)
                    return addTransaction(tx, { summary: 'SUSHI -> xSUSHI -> NYAN' })
                } catch (e) {
                    return e
                }
            }
        },
        [addTransaction, meowshiContract]
    )

    return { allowance, approve, nyanSushi }
}

export default useMaker
