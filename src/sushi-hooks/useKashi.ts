import { useCallback, useState, useEffect } from 'react'
import { useBentoBoxContract, useBentoHelperContract, useKashiPairContract } from './useContract'
import { useTransactionAdder } from '../state/transactions/hooks'
import { useActiveWeb3React } from '../hooks'

import ERC20_ABI from '../constants/abis/erc20.json'
import KASHIPAIR_ABI from '../constants/sushiAbis/kashipair.json'
import { isAddressString, getContract } from '../utils'

import { ethers } from 'ethers'
import { BalanceProps } from './queries/useTokenBalance'
import { BigNumber } from '@ethersproject/bignumber'

// Functions that need accrue to be called
const ACTION_ADD_ASSET = 1
const ACTION_REPAY = 2
const ACTION_REMOVE_ASSET = 3
const ACTION_REMOVE_COLLATERAL = 4
const ACTION_BORROW = 5
const ACTION_GET_REPAY_SHARE = 6
const ACTION_GET_REPAY_PART = 7

// Functions that don't need accrue to be called
const ACTION_ADD_COLLATERAL = 10

// Function on BentoBox
const ACTION_BENTO_DEPOSIT = 20
const ACTION_BENTO_WITHDRAW = 21
const ACTION_BENTO_TRANSFER = 22
const ACTION_BENTO_TRANSFER_MULTIPLE = 23
const ACTION_BENTO_SETAPPROVAL = 24

// Any external call (except to BentoBox)
const ACTION_CALL = 30

export const convertToShares = (value: BigNumber, bentoShare: BigNumber, bentoAmount: BigNumber) => {
  console.log('share_inputs:', value, bentoAmount, bentoShare)
  if (bentoAmount.eq(BigNumber.from(0))) {
    return value
  }
  return value.mul(bentoShare).div(bentoAmount)
}

const useKashi = () => {
  const { account, library } = useActiveWeb3React()
  const addTransaction = useTransactionAdder()

  const bentoHelperContract = useBentoHelperContract()
  const bentoBoxContract = useBentoBoxContract(true) // withSigner
  const kashiPairContract = useKashiPairContract(true) // withSigner

  // Check if Kashi is approved
  const [kashiApproved, setKashiApproved] = useState(false)
  const fetchKashiApproval = useCallback(async () => {
    if (account) {
      try {
        const isApproved = await bentoBoxContract?.masterContractApproved(kashiPairContract?.address, account)
        console.log(kashiPairContract?.address, isApproved)

        return setKashiApproved(isApproved)
      } catch (e) {
        console.log(e)
        return setKashiApproved(false)
      }
    }
  }, [account, bentoBoxContract, kashiPairContract?.address])
  useEffect(() => {
    if (account && bentoBoxContract && kashiPairContract) {
      fetchKashiApproval()
    }
    const refreshInterval = setInterval(fetchKashiApproval, 10000)
    return () => clearInterval(refreshInterval)
  }, [account, fetchKashiApproval, bentoBoxContract, kashiPairContract])

  // Approve Kashi in BentoBox
  const approve = useCallback(async () => {
    try {
      const tx = await bentoBoxContract?.setMasterContractApproval(
        account,
        kashiPairContract?.address,
        true,
        0,
        ethers.constants.HashZero,
        ethers.constants.HashZero
      )
      return addTransaction(tx, { summary: 'Enable Kashi' })
    } catch (e) {
      console.log(e)
      return e
    }
  }, [account, addTransaction, bentoBoxContract, kashiPairContract?.address])

  // Add as collateral from bentobox
  const addCollateral = useCallback(
    async (pairAddress: string, address: string, amount: BalanceProps) => {
      const collateralAddressCheckSum = isAddressString(address)

      const pairAddressCheckSum = isAddressString(pairAddress)
      const kashiPairCloneContract = getContract(pairAddressCheckSum, KASHIPAIR_ABI, library!, account!)

      const balances = await bentoHelperContract?.getBalances(account, [collateralAddressCheckSum])
      const share = amount.value.mul(balances[0].bentoShare).div(balances[0].bentoAmount)

      try {
        const tx = await kashiPairCloneContract?.cook(
          [ACTION_ADD_COLLATERAL],
          [0],
          [ethers.utils.defaultAbiCoder.encode(['int256', 'address', 'bool'], [share, account, false])]
        )

        return addTransaction(tx, { summary: 'Add Collateral' })
      } catch (e) {
        console.log(e)
        return e
      }
    },
    [account, addTransaction, bentoHelperContract, library]
  )

  // Deposit into bentbox from wallet, add as collateral
  // Token needs to approve bentobox first
  const depositAddCollateral = useCallback(
    async (pairAddress: string, address: string, amount: BalanceProps) => {
      const collateralAddressCheckSum = isAddressString(address)

      const pairAddressCheckSum = isAddressString(pairAddress)
      const kashiPairCloneContract = getContract(pairAddressCheckSum, KASHIPAIR_ABI, library!, account!)

      console.log('logging:', kashiPairCloneContract, collateralAddressCheckSum, pairAddressCheckSum)

      try {
        const tx = await kashiPairCloneContract?.cook(
          [ACTION_BENTO_DEPOSIT, ACTION_ADD_COLLATERAL],
          [0, 0],
          [
            ethers.utils.defaultAbiCoder.encode(
              ['address', 'address', 'int256', 'int256'],
              [collateralAddressCheckSum, account, amount?.value, 0]
            ),
            ethers.utils.defaultAbiCoder.encode(['int256', 'address', 'bool'], [-2, account, false])
          ]
        )

        return addTransaction(tx, { summary: 'Deposit → Add Collateral' })
      } catch (e) {
        console.log(e)
        return e
      }
    },
    [account, addTransaction, library]
  )

  // remove into bentbox, withdraw into wallet
  // Token needs to approve bentobox first
  const removeWithdrawCollateral = useCallback(
    async (pairAddress: string, address: string, amount: BalanceProps) => {
      const collateralAddressCheckSum = isAddressString(address)

      const pairAddressCheckSum = isAddressString(pairAddress)
      const kashiPairCloneContract = getContract(pairAddressCheckSum, KASHIPAIR_ABI, library!, account!)

      const balances = await bentoHelperContract?.getBalances(account, [collateralAddressCheckSum])
      console.log('balances:', balances)

      console.log('share_inputs:', amount.value, balances[0].bentoShare, balances[0].bentoAmount)
      const share = amount.value.mul(balances[0].bentoShare).div(balances[0].bentoAmount)
      console.log('share:', share)

      try {
        const tx = await kashiPairCloneContract?.cook(
          [ACTION_REMOVE_COLLATERAL, ACTION_BENTO_WITHDRAW],
          [0, 0],
          [
            ethers.utils.defaultAbiCoder.encode(['int256', 'address'], [share, account]),
            ethers.utils.defaultAbiCoder.encode(
              ['address', 'address', 'int256', 'int256'],
              [collateralAddressCheckSum, account, 0, share]
            )
          ]
        )

        return addTransaction(tx, { summary: 'Remove → Withdraw Collateral' })
      } catch (e) {
        console.log(e)
        return e
      }
    },
    [account, addTransaction, bentoHelperContract, library]
  )

  // remove collateral into bentobox
  const removeCollateral = useCallback(
    async (pairAddress: string, address: string, amount: BalanceProps) => {
      const collateralAddressCheckSum = isAddressString(address)

      const pairAddressCheckSum = isAddressString(pairAddress)
      const kashiPairCloneContract = getContract(pairAddressCheckSum, KASHIPAIR_ABI, library!, account!)

      const balances = await bentoHelperContract?.getBalances(account, [collateralAddressCheckSum])
      console.log('balances:', balances)

      const share = convertToShares(amount.value, balances[0].bentoShare, balances[0].bentoAmount)
      console.log('share:', share)

      try {
        const tx = await kashiPairCloneContract?.cook(
          [ACTION_REMOVE_COLLATERAL],
          [0],
          [ethers.utils.defaultAbiCoder.encode(['int256', 'address'], [share, account])]
        )

        return addTransaction(tx, { summary: 'Remove Collateral' })
      } catch (e) {
        console.log(e)
        return e
      }
    },
    [account, addTransaction, bentoHelperContract, library]
  )

  // borrow into bentobox
  const borrow = useCallback(
    async (pairAddress: string, address: string, amount: BalanceProps) => {
      const collateralAddressCheckSum = isAddressString(address)

      const pairAddressCheckSum = isAddressString(pairAddress)
      const kashiPairCloneContract = getContract(pairAddressCheckSum, KASHIPAIR_ABI, library!, account!)

      //const balances = await bentoHelperContract?.getBalances(account, [collateralAddressCheckSum])
      //const share = amount.value.mul(balances[0].bentoShare).div(balances[0].bentoAmount)

      try {
        const tx = await kashiPairCloneContract?.cook(
          [ACTION_BORROW],
          [0],
          [ethers.utils.defaultAbiCoder.encode(['uint256', 'address'], [amount, account])]
        )

        return addTransaction(tx, { summary: 'Borrow' })
      } catch (e) {
        console.log(e)
        return e
      }
    },
    [account, addTransaction, library]
  )

  return {
    kashiApproved,
    approve,
    addCollateral,
    depositAddCollateral,
    removeWithdrawCollateral,
    removeCollateral,
    borrow
  }
}

export default useKashi
