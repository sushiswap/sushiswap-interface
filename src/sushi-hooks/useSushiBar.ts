import { useCallback, useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { useSushiContract, useSushiBarContract } from './useContract'
import { useTransactionAdder } from '../state/transactions/hooks'
import { useActiveWeb3React } from '../hooks'
import Fraction from '../constants/Fraction'
import { BalanceProps } from './useTokenBalance'

const { BigNumber } = ethers

const useSushiBar = () => {
	const { account } = useActiveWeb3React()
	const addTransaction = useTransactionAdder()
	const sushiContract = useSushiContract(true) // withSigner
	const barContract = useSushiBarContract(true) // withSigner

	const [allowance, setAllowance] = useState('0')

	const fetchAllowance = useCallback(async () => {
		if (account) {
			try {
				const allowance = await sushiContract?.allowance(account, barContract?.address)
				const formatted = Fraction.from(BigNumber.from(allowance), BigNumber.from(10).pow(18)).toString()
				setAllowance(formatted)
			} catch {
				setAllowance('0')
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
		// todo: this should be updated with BigNumber as opposed to string
		async (amount: BalanceProps | undefined) => {
			if (amount?.value) {
				try {
					const tx = await barContract?.enter(amount?.value)
					return addTransaction(tx, { summary: 'Enter SushiBar' })
				} catch (e) {
					return e
				}
			}
		},
		[addTransaction, barContract]
	)

	const leave = useCallback(
		// todo: this should be updated with BigNumber as opposed to string
		async (amount: BalanceProps | undefined) => {
			if (amount?.value) {
				try {
					const tx = await barContract?.leave(amount?.value)
					//const tx = await barContract?.leave(ethers.utils.parseUnits(amount)) // where amount is string
					return addTransaction(tx, { summary: 'Enter SushiBar' })
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
