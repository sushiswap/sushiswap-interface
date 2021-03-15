import { useCallback, useState, useEffect } from 'react'
import { useBentoBoxContract, useBentoHelperContract, useKashiPairContract } from './useContract'
import useKashiPairHelper from './queries/useKashiPairHelper'
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

/*export const convertToShares = (tokenAddress: string, amount: BigNumber, roundUp: bool) => {
  const tokenCheckSum = isAddressString(tokenAddress)

  const bentoBoxContract = useBentoBoxContract(true) // withSigner
  share = await bentoBoxContract?.toShare(tokenCheckSum, amount, roundUp)

  console.log('amount: {}, share: {}', amount, share)

  return share

  if (bentoAmount.eq(BigNumber.from(0))) {
    return value
  }
  return value.mul(bentoShare).div(bentoAmount)

}*/

const useKashi = () => {
  const { account, library } = useActiveWeb3React()
  const addTransaction = useTransactionAdder()

  const bentoHelperContract = useBentoHelperContract()
  const bentoBoxContract = useBentoBoxContract(true) // withSigner
  const kashiPairContract = useKashiPairContract(true) // withSigner

  const KashiSummary = (address: string) => {
    return useKashiPairHelper(address)
  }

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


  // Add Asset from bentobox
  const addAsset = useCallback(
    async (pairAddress: string, address: string, amount: BalanceProps) => {

      const tokenAddress = isAddressString(address)
      const pairCheckSum = isAddressString(pairAddress)
      const kashiPairCloneContract = getContract(pairCheckSum, KASHIPAIR_ABI, library!, account!)

      const share = await bentoBoxContract?.toShare(tokenAddress, amount.value, false)

      try {
        const tx = await kashiPairCloneContract?.cook(
          [ACTION_ADD_ASSET],
          [0],
          [ethers.utils.defaultAbiCoder.encode(['int256', 'address', 'bool'], [share, account, false])]
        )

        return addTransaction(tx, { summary: 'Add Asset'} )
      } catch (e) {
        console.log(e)
        return e
      }
    },
    [account, addTransaction, library]
  )

  // deposit into bento from wallet and add asset to pair
  const depositAddAsset = useCallback(
    async (pairAddress: string, address:string, amount: BalanceProps) => {

      const tokenAddress = isAddressString(address)
      const pairCheckSum = isAddressString(pairAddress)
      const kashiPairCloneContract = getContract(pairCheckSum, KASHIPAIR_ABI, library!, account!)

      try {
        const tx = await kashiPairCloneContract?.cook(
          [ACTION_BENTO_DEPOSIT, ACTION_ADD_ASSET],
          [0, 0],
          [
            ethers.utils.defaultAbiCoder.encode(
              ['address', 'address', 'int256', 'int256'],
              [tokenAddress, account, amount?.value, 0]),
            ethers.utils.defaultAbiCoder.encode(
              ['int256', 'address', 'bool'],
              [-2, account, false])
          ]
        )

        return addTransaction(tx, { summary: 'Deposit -> Add Asset'} )
      } catch (e) {
        console.log(e)
        return e
      }
    },
    [account, addTransaction, library]
  )

  // Remove Asset to bentobox
  const removeAsset = useCallback(
    async (pairAddress: string, address: string, amount: BalanceProps) => {
      const tokenAddress = isAddressString(address)

      const pairAddressCheckSum = isAddressString(pairAddress)
      const kashiPairCloneContract = getContract(pairAddressCheckSum, KASHIPAIR_ABI, library!, account!)

      const share = await bentoBoxContract?.toShare(tokenAddress, amount.value, false)

      try {
        const tx = await kashiPairCloneContract?.cook(
          [ACTION_REMOVE_ASSET],
          [0],
          [ethers.utils.defaultAbiCoder.encode(['int256', 'address'], [share, account])]
        )

        return addTransaction(tx, { summary: 'Remove Asset'} )
      } catch (e) {
        console.log(e)
        return e
      }
    },
    [account, addTransaction, library]
  )

  // Remove Asset and withdraw to wallet
  const removeWithdrawAsset = useCallback(
    async (pairAddress: string, address: string, amount: BalanceProps) => {
      const tokenAddress = isAddressString(address)

      const pairAddressCheckSum = isAddressString(pairAddress)
      const kashiPairCloneContract = getContract(pairAddressCheckSum, KASHIPAIR_ABI, library!, account!)

      const share = await bentoBoxContract?.toShare(tokenAddress, amount.value, false)

      try {
        const tx = await kashiPairCloneContract?.cook(
          [ACTION_REMOVE_ASSET, ACTION_BENTO_WITHDRAW],
          [0],
          [
            ethers.utils.defaultAbiCoder.encode(['int256', 'address'], [share, account]),
            ethers.utils.defaultAbiCoder.encode(
              ['address', 'address', 'int256', 'int256'],
              [tokenAddress, account, 0, -1]
            )
          ]
        )

        return addTransaction(tx, { summary: 'Remove -> Withdraw Asset'} )
      } catch (e) {
        console.log(e)
        return e
      }
    },
    [account, addTransaction, library]
  )

  // Add as collateral from bentobox
  const addCollateral = useCallback(
    async (pairAddress: string, address: string, amount: BalanceProps) => {
      const collateralAddressCheckSum = isAddressString(address)

      const pairAddressCheckSum = isAddressString(pairAddress)
      const kashiPairCloneContract = getContract(pairAddressCheckSum, KASHIPAIR_ABI, library!, account!)

      const share = await bentoBoxContract?.toShare(collateralAddressCheckSum, amount.value, false)

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

      //const balances = await bentoHelperContract?.getBalances(account, [collateralAddressCheckSum])
      //console.log('balances:', balances)

      //console.log('share_inputs:', amount.value, balances[0].bentoShare, balances[0].bentoAmount)
      //const share = amount.value.mul(balances[0].bentoShare).div(balances[0].bentoAmount)
      //console.log('share:', share)

      const share = await bentoBoxContract?.toShare(collateralAddressCheckSum, amount.value, false)

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

      const share = await bentoBoxContract?.toShare(collateralAddressCheckSum, amount.value, false)

      //const share = convertToShares(amount.value, balances[0].bentoShare, balances[0].bentoAmount)
      console.log('!!!share:', share)

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
      const tokenCheckSum = isAddressString(address)

      const pairAddressCheckSum = isAddressString(pairAddress)
      const kashiPairCloneContract = getContract(pairAddressCheckSum, KASHIPAIR_ABI, library!, account!)

      //const balances = await bentoHelperContract?.getBalances(account, [collateralAddressCheckSum])
      //const share = amount.value.mul(balances[0].bentoShare).div(balances[0].bentoAmount)

      const share = await bentoBoxContract?.toShare(tokenCheckSum, amount.value, false)


      console.log('!!!share: {}', share)


      try {
        const tx = await kashiPairCloneContract?.cook(
          [ACTION_BORROW],
          [0],
          [ethers.utils.defaultAbiCoder.encode(['uint256', 'address'], [share, account])]
        )

        return addTransaction(tx, { summary: 'Borrow' })
      } catch (e) {
        console.log(e)
        return e
      }
    },
    [account, addTransaction, library]
  )

  // repay borrowed amount
  const repayFromBento = useCallback(
    async (pairAddress: string, address: string, amount: BalanceProps) => {
      const tokenAddress = isAddressString(pairAddress)

      const pairAddressCheckSum = isAddressString(pairAddress)
      const kashiPairCloneContract = getContract(pairAddressCheckSum, KASHIPAIR_ABI, library!, account!)

      //const kashiSummary = KashiSummary(pairAddress)//useKashiPairHelper(pairAddressCheckSum)
      //console.log('!!!kashi: ', kashiSummary)

      const totalBorrow = await kashiPairCloneContract?.totalBorrow()
      console.log('!!totalBorrow: ', totalBorrow)

      const part = amount?.value.mul(totalBorrow.base).div(totalBorrow.elastic)

      console.log('!!!part: ', part)


      console.log('amount: ', amount.value)
      const share = await bentoBoxContract?.toShare(tokenAddress, amount.value, true)
      console.log('share: ', share)

      try {
        const tx = await kashiPairCloneContract?.cook(
          [ACTION_REPAY],
          [0],
          [ethers.utils.defaultAbiCoder.encode(['uint256', 'address', 'bool'], [part, account, false])]
        )

        return addTransaction(tx, { summary: 'Repay From Bento'} )
      } catch (e) {
        console.log(e)
        return e
      }
    },
    [account, addTransaction, library]
  )

  // repay borrowed amount from wallet
  const repay = useCallback(
    async(pairAddress: string, address: string, amount: BalanceProps) => {
      const tokenAddress = isAddressString(pairAddress)

      const pairAddressCheckSum = isAddressString(pairAddress)
      const kashiPairCloneContract = getContract(pairAddressCheckSum, KASHIPAIR_ABI, library!, account!)

      const share = await bentoBoxContract?.toShare(tokenAddress, amount.value, false)

      try {
        const tx = await kashiPairContract?.cook(
          [ACTION_GET_REPAY_SHARE, ACTION_BENTO_DEPOSIT, ACTION_REPAY],
          [0, 0, 0],
          [
            ethers.utils.defaultAbiCoder.encode(['int256'], [share]),
            ethers.utils.defaultAbiCoder.encode(
              ['address', 'address', 'int256', 'int256'],
              [tokenAddress, account, 0, -1]
            ),
            ethers.utils.defaultAbiCoder.encode(
              ['int256', 'address', 'bool'],
              [share, account, false]
            )
          ]
        )

        return addTransaction(tx, { summary: 'Repay'})
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
    addAsset,
    depositAddAsset,
    removeAsset,
    removeWithdrawAsset,
    addCollateral,
    depositAddCollateral,
    removeWithdrawCollateral,
    removeCollateral,
    borrow,
    repayFromBento,
    repay
  }
}

export default useKashi
