import { useCallback, useState, useEffect } from 'react'
import { useBentoBoxContract, useBentoHelperContract, useKashiPairContract, useSushiSwapSwapper, useKashiPairHelperContract } from './useContract'
import { useTransactionAdder } from '../state/transactions/hooks'
import { useActiveWeb3React } from '../hooks'

import ERC20_ABI from '../constants/abis/erc20.json'
import KASHIPAIR_ABI from '../constants/sushiAbis/kashipair.json'
import { isAddressString, getContract } from '../utils'

import { ethers } from 'ethers'
import { BalanceProps } from './queries/useTokenBalance'
import { BigNumber } from '@ethersproject/bignumber'

import { BASE_SWAPPER } from '../constants'
import BASE_SWAPPER_ABI from '../constants/sushiAbis/swapper.json'

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

const useKashi = () => {
  const { account, library, chainId } = useActiveWeb3React()
  const addTransaction = useTransactionAdder()

  const bentoHelperContract = useBentoHelperContract()
  const bentoBoxContract = useBentoBoxContract(true) // withSigner
  const kashiPairContract = useKashiPairContract(true) // withSigner
  const kashiPairHelperContract = useKashiPairHelperContract()

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
  }, [account, fetchKashiApproval, bentoBoxContract, kashiPairContract, kashiPairHelperContract, chainId])

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
  // TODO -> amount may need to be recalculated to fraction or parts or share or whatever I dkd
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

      console.log('!!!amount: ', amount?.value)

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
    async (pairAddress: string, address: string, amount: BalanceProps, max: boolean) => {
      const tokenAddress = isAddressString(address)
      const pairAddressCheckSum = isAddressString(pairAddress)
      const kashiPairCloneContract = getContract(pairAddressCheckSum, KASHIPAIR_ABI, library!, account!)

      const bentoTotalAsset = await bentoBoxContract?.totals(address)
      const totalAsset = await kashiPairCloneContract?.totalAsset()
      const totalBorrow = await kashiPairCloneContract?.totalBorrow()

      let share = await bentoBoxContract?.toShare(tokenAddress, amount?.value, false)
      let borrowShares = await bentoBoxContract?.toShare(tokenAddress, totalBorrow.elastic, true)
      let allShare = totalAsset.elastic.add(borrowShares)

      let fraction = share.mul(totalAsset.base).div(allShare)

      console.log('!!!decimals: ', amount.decimals)
      console.log('!!!amount: ', amount.value)
      console.log('!!!share: ', share)
      console.log('borrowShares: ', borrowShares)
      console.log('allShare: ', allShare)
      console.log('fraction: ', fraction)

      /*if (max) {
        const pairUserDetails = await kashiPairHelperContract?.pollPairs(account, [pairAddressCheckSum])

        fraction = pairUserDetails[1][0].userAssetAmount.gt(BigNumber.from(0))
          ? pairUserDetails[1][0].userAssetAmount
              .mul(totalAsset.base)
              .div(totalAsset.elastic)
          : BigNumber.from(0)
      }*/

      let removedPart = fraction.eq(BigNumber.from(0)) ? amount?.value : fraction

      try {
        const tx = await kashiPairCloneContract?.cook(
          [ACTION_REMOVE_ASSET],
          [0],
          [ethers.utils.defaultAbiCoder.encode(['int256', 'address'], [removedPart, account])]
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
    async (pairAddress: string, address: string, amount: BalanceProps, max: boolean) => {
      const tokenAddress = isAddressString(address)
      const pairAddressCheckSum = isAddressString(pairAddress)
      const kashiPairCloneContract = getContract(pairAddressCheckSum, KASHIPAIR_ABI, library!, account!)

      const bentoTotalAsset = await bentoBoxContract?.totals(address)
      const totalAsset = await kashiPairCloneContract?.totalAsset()
      const totalBorrow = await kashiPairCloneContract?.totalBorrow()


      let share = await bentoBoxContract?.toShare(tokenAddress, amount?.value, false)
      let borrowShares = await bentoBoxContract?.toShare(tokenAddress, totalBorrow.elastic, true)
      let allShare = totalAsset.elastic.add(borrowShares)

      let fraction = share.mul(totalAsset.base).div(allShare)

      let removedPart = fraction.eq(BigNumber.from(0)) ? amount?.value : fraction

      /*if (max) {
        const pairUserDetails = await kashiPairHelperContract?.pollPairs(account, [pairAddressCheckSum])

        part = pairUserDetails[1][0].userAssetAmount.gt(BigNumber.from(0))
          ? pairUserDetails[1][0].userAssetAmount
              .mul(totalAsset.base)
              .div(totalAsset.elastic)
          : BigNumber.from(0)
      }*/

      try {
        const tx = await kashiPairCloneContract?.cook(
          [ACTION_REMOVE_ASSET, ACTION_BENTO_WITHDRAW],
          [0],
          [
            ethers.utils.defaultAbiCoder.encode(['int256', 'address'], [removedPart, account]),
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
      const tokenAddress = isAddressString(address)
      const pairAddressCheckSum = isAddressString(pairAddress)
      const kashiPairCloneContract = getContract(pairAddressCheckSum, KASHIPAIR_ABI, library!, account!)

      const share = await bentoBoxContract?.toShare(tokenAddress, amount.value, false)

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
      const tokenAddress = isAddressString(address)

      const pairAddressCheckSum = isAddressString(pairAddress)
      const kashiPairCloneContract = getContract(pairAddressCheckSum, KASHIPAIR_ABI, library!, account!)

      try {
        const tx = await kashiPairCloneContract?.cook(
          [ACTION_BENTO_DEPOSIT, ACTION_ADD_COLLATERAL],
          [0, 0],
          [
            ethers.utils.defaultAbiCoder.encode(
              ['address', 'address', 'int256', 'int256'],
              [tokenAddress, account, amount?.value, 0]
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
    async (pairAddress: string, address: string, amount: BalanceProps, max: boolean) => {
      const tokenAddress = isAddressString(address)

      const pairAddressCheckSum = isAddressString(pairAddress)
      const kashiPairCloneContract = getContract(pairAddressCheckSum, KASHIPAIR_ABI, library!, account!)

      let amountToWithdraw = amount.value
      if (max) {
        const pairUserDetails = await kashiPairHelperContract?.pollPairs(account, [pairAddressCheckSum])
        amountToWithdraw = pairUserDetails[1][0].userCollateralAmount
      }

      let share = await bentoBoxContract?.toShare(tokenAddress, amountToWithdraw, false)

      try {
        const tx = await kashiPairCloneContract?.cook(
          [ACTION_REMOVE_COLLATERAL, ACTION_BENTO_WITHDRAW],
          [0, 0],
          [
            ethers.utils.defaultAbiCoder.encode(['int256', 'address'], [share, account]),
            ethers.utils.defaultAbiCoder.encode(
              ['address', 'address', 'int256', 'int256'],
              [tokenAddress, account, 0, share]
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
    async (pairAddress: string, address: string, amount: BalanceProps, max: boolean) => {
      const tokenAddress = isAddressString(address)

      const pairAddressCheckSum = isAddressString(pairAddress)
      const kashiPairCloneContract = getContract(pairAddressCheckSum, KASHIPAIR_ABI, library!, account!)

      let amountToWithdraw = amount.value
      if (max) {
        const pairUserDetails = await kashiPairHelperContract?.pollPairs(account, [pairAddressCheckSum])
        amountToWithdraw = pairUserDetails[1][0].userCollateralAmount
      }

      let share = await bentoBoxContract?.toShare(tokenAddress, amountToWithdraw, false)

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
    async (pairAddress: string, address: string, amount: BalanceProps, max: boolean) => {
      const pairAddressCheckSum = isAddressString(pairAddress)
      const kashiPairCloneContract = getContract(pairAddressCheckSum, KASHIPAIR_ABI, library!, account!)

      let borrowAmount = amount?.value

      if (max) {
        const pairUserDetails = await kashiPairHelperContract?.pollPairs(account, [pairAddressCheckSum])

        const maxBorrowableOracle = pairUserDetails[1][0].oracleExchangeRate.gt(BigNumber.from(0))
          ? pairUserDetails[1][0].userCollateralAmount
              .mul(BigNumber.from('1000000000000000000'))
              .div(BigNumber.from(100))
              .mul(BigNumber.from(75))
              .div(pairUserDetails[1][0].oracleExchangeRate)
          : BigNumber.from(0)

        const maxBorrowableStored = pairUserDetails[1][0].currentExchangeRate.gt(BigNumber.from(0))
          ? pairUserDetails[1][0].userCollateralAmount
              .mul(BigNumber.from('1000000000000000000'))
              .div(BigNumber.from(100))
              .mul(BigNumber.from(75))
              .div(pairUserDetails[1][0].currentExchangeRate)
          : BigNumber.from(0)

        const maxBorrowable = maxBorrowableStored.lte(maxBorrowableOracle)
          ? maxBorrowableStored : maxBorrowableOracle

        const safeMaxBorrow = maxBorrowable
          .div(BigNumber.from(100))
          .mul(BigNumber.from(95))

        const userBorrowAmount = pairUserDetails[1][0].userBorrowAmount
        borrowAmount = userBorrowAmount.gte(safeMaxBorrow)
          ? BigNumber.from(0) : safeMaxBorrow.sub(userBorrowAmount)

        console.log('!!! ', borrowAmount)
      }

      try {
        const tx = await kashiPairCloneContract?.cook(
          [ACTION_BORROW],
          [0],
          [ethers.utils.defaultAbiCoder.encode(['uint256', 'address'], [borrowAmount, account])]
        )

        return addTransaction(tx, { summary: 'Borrow' })
      } catch (e) {
        console.log(e)
        return e
      }
    },
    [account, addTransaction, library]
  )

  // borrow into wallet
  const borrowWithdraw = useCallback(
    async (pairAddress: string, address: string, amount: BalanceProps, max: boolean) => {
      const tokenAddress = isAddressString(address)

      const pairAddressCheckSum = isAddressString(pairAddress)
      const kashiPairCloneContract = getContract(pairAddressCheckSum, KASHIPAIR_ABI, library!, account!)

      let borrowAmount = amount?.value

      if (max) {
        const pairUserDetails = await kashiPairHelperContract?.pollPairs(account, [pairAddressCheckSum])

        const maxBorrowableOracle = pairUserDetails[1][0].oracleExchangeRate.gt(BigNumber.from(0))
          ? pairUserDetails[1][0].userCollateralAmount
              .mul(BigNumber.from('1000000000000000000'))
              .div(BigNumber.from(100))
              .mul(BigNumber.from(75))
              .div(pairUserDetails[1][0].oracleExchangeRate)
          : BigNumber.from(0)

        const maxBorrowableStored = pairUserDetails[1][0].currentExchangeRate.gt(BigNumber.from(0))
          ? pairUserDetails[1][0].userCollateralAmount
              .mul(BigNumber.from('1000000000000000000'))
              .div(BigNumber.from(100))
              .mul(BigNumber.from(75))
              .div(pairUserDetails[1][0].currentExchangeRate)
          : BigNumber.from(0)

        const maxBorrowable = maxBorrowableStored.lte(maxBorrowableOracle)
          ? maxBorrowableStored : maxBorrowableOracle

        const safeMaxBorrow = maxBorrowable
          .div(BigNumber.from(100))
          .mul(BigNumber.from(95))

        const userBorrowAmount = pairUserDetails[1][0].userBorrowAmount
        borrowAmount = userBorrowAmount.gte(safeMaxBorrow)
          ? BigNumber.from(0) : safeMaxBorrow.sub(userBorrowAmount)

        console.log('!!! ', borrowAmount)
      }

      try {
        const tx = await kashiPairCloneContract?.cook(
          [ACTION_BORROW, ACTION_BENTO_WITHDRAW],
          [0, 0],
          [
            ethers.utils.defaultAbiCoder.encode(['uint256', 'address'], [borrowAmount, account]),
            ethers.utils.defaultAbiCoder.encode(['address', 'address', 'int256', 'int256'], [tokenAddress, account, 0, -2])
          ]
        )

        return addTransaction(tx, { summary: 'Borrow -> Withdraw' })
      } catch (e) {
        console.log(e)
        return e
      }
    },
    [account, addTransaction, library]
  )

  // repay borrowed amount
  const repayFromBento = useCallback(
    async (pairAddress: string, address: string, amount: BalanceProps, max: boolean) => {
      // TODO: if amount ends up being 0, we need to prevent the tx from happening and display message

      const tokenAddress = isAddressString(pairAddress)

      const pairAddressCheckSum = isAddressString(pairAddress)
      const kashiPairCloneContract = getContract(pairAddressCheckSum, KASHIPAIR_ABI, library!, account!)

      const totalBorrow = await kashiPairCloneContract?.totalBorrow()

      let part = amount?.value.mul(totalBorrow.base).div(totalBorrow.elastic)

      if (max) {
        const pairUserDetails = await kashiPairHelperContract?.pollPairs(account, [pairAddressCheckSum])

        part = pairUserDetails[1][0].userBorrowAmount.gt(BigNumber.from(0))
          ? pairUserDetails[1][0].userBorrowAmount
              .mul(totalBorrow.base)
              .div(totalBorrow.elastic)
          : BigNumber.from(0)
      }

      // if part = 0 then use amount as long as amount isn't 0, check for amount being 0 above
      let repayPart = part.eq(BigNumber.from(0)) ? amount?.value : part

      console.log('!!!part: ', repayPart)

      try {
        const tx = await kashiPairCloneContract?.cook(
          [ACTION_REPAY],
          [0],
          [ethers.utils.defaultAbiCoder.encode(['uint256', 'address', 'bool'], [repayPart, account, false])]
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
    async(pairAddress: string, address: string, amount: BalanceProps, max: boolean) => {
      const tokenAddress = isAddressString(pairAddress)

      const pairAddressCheckSum = isAddressString(pairAddress)
      const kashiPairCloneContract = getContract(pairAddressCheckSum, KASHIPAIR_ABI, library!, account!)

      const totalBorrow = await kashiPairCloneContract?.totalBorrow()
      let part = amount?.value.mul(totalBorrow.base).div(totalBorrow.elastic)

      if (max) {
        const pairUserDetails = await kashiPairHelperContract?.pollPairs(account, [pairAddressCheckSum])

        part = pairUserDetails[1][0].userBorrowAmount.gt(BigNumber.from(0))
          ? pairUserDetails[1][0].userBorrowAmount
              .mul(totalBorrow.base)
              .div(totalBorrow.elastic)
          : BigNumber.from(0)
      }

      // if part == 0 then use amount as long as amount isn't 0, check for amount being 0 above
      let repayPart = part.eq(BigNumber.from(0)) ? amount?.value : part

      console.log('!!!part: ', repayPart)

      try {
        const tx = await kashiPairCloneContract?.cook(
          [ACTION_GET_REPAY_SHARE, ACTION_BENTO_DEPOSIT, ACTION_REPAY],
          [0, 0, 0],
          [
            ethers.utils.defaultAbiCoder.encode(['int256'], [repayPart]),
            ethers.utils.defaultAbiCoder.encode(
              ['address', 'address', 'int256', 'int256'],
              [tokenAddress, account, 0, -1]
            ),
            ethers.utils.defaultAbiCoder.encode(
              ['int256', 'address', 'bool'],
              [repayPart, account, false]
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

  const short = useCallback(
    async(pairAddress: string, address: string, amount: BalanceProps) => {
      const tokenAddress = isAddressString(pairAddress)
      const pairAddressCheckSum = isAddressString(pairAddress)
      const swapperAddress = isAddressString(BASE_SWAPPER[chainId!])

      const kashiPairCloneContract = getContract(pairAddressCheckSum, KASHIPAIR_ABI, library!, account!)
      const swapperContract = getContract(swapperAddress, BASE_SWAPPER_ABI, library!, account!)
      const pairUserDetails = await kashiPairHelperContract?.pollPairs(account, [pairAddressCheckSum])

      const exchangeRate = await kashiPairCloneContract?.exchangeRate()
      const slippage = BigNumber.from('20') // 0.05%
      const minReturnedShare = amount.value.mul(exchangeRate.sub(exchangeRate.div(slippage))).div(ethers.utils.parseEther('1')) // the divide should be the token's decimals

      // should pass these in from somewhere else instead of calling the contract
      let assetAddress = await kashiPairCloneContract?.asset()
      let collateralAddress = await kashiPairCloneContract?.collateral()

      let data = swapperContract.interface.encodeFunctionData("swap", [
        assetAddress,
        collateralAddress,
        account,
        "0",
        minReturnedShare
      ])

      try {
        const tx = await kashiPairCloneContract?.cook(
            [ACTION_BORROW, ACTION_BENTO_TRANSFER, ACTION_CALL, ACTION_ADD_COLLATERAL],
            [0, 0, 0, 0],
            [
              // Remove collateral for user to Swapper contract (maxShare)
              ethers.utils.defaultAbiCoder.encode(['int256', 'address'], [amount.value, account]),
              ethers.utils.defaultAbiCoder.encode(['address', 'address', 'int256'], [assetAddress, swapperAddress, -2]),
              ethers.utils.defaultAbiCoder.encode(['address', 'bytes', 'bool', 'bool', 'uint8'], [swapperAddress, data.slice(0, -64), false, true, 2]),
              ethers.utils.defaultAbiCoder.encode(['int256', 'address', 'bool'], [-2, account, false])
            ]
        )

        return addTransaction(tx, { summary: 'Short'})
      } catch (e) {
        console.log(e)
        return e
      }
    },
    [account, addTransaction, library]
  )

  const unwind = useCallback(
    async(pairAddress: string, address: string, amount: BalanceProps) => {
      const tokenAddress = isAddressString(pairAddress)
      const pairAddressCheckSum = isAddressString(pairAddress)
      const swapperAddress = isAddressString(BASE_SWAPPER[chainId!])

      const kashiPairCloneContract = getContract(pairAddressCheckSum, KASHIPAIR_ABI, library!, account!)
      const swapperContract = getContract(swapperAddress, BASE_SWAPPER_ABI, library!, account!)
      const pairUserDetails = await kashiPairHelperContract?.pollPairs(account, [pairAddressCheckSum])

      const exchangeRate = await kashiPairCloneContract?.exchangeRate()
      const slippage = BigNumber.from('20') // 0.05%
      //const minReturnedShare = amount.value.mul(exchangeRate.sub(exchangeRate.div(slippage))).div(ethers.utils.parseEther('1')) // the divide should be the token's decimals

      const maxShare = amount.value.mul(BigNumber.from('1000000000000000000')).div(exchangeRate)
      const maxShareAfterSlippage = maxShare.add(maxShare.mul(BigNumber.from('5')).div(BigNumber.from(100)))

      console.log('ex: ', exchangeRate)
      console.log('!!!maxShare: ', maxShareAfterSlippage)

      const totalBorrow = await kashiPairCloneContract?.totalBorrow()
      const part = maxShare.mul(totalBorrow.base).div(totalBorrow.elastic)

      console.log('part: ', part)

      let assetAddress = await kashiPairCloneContract?.asset()
      let collateralAddress = await kashiPairCloneContract?.collateral()

      let data = swapperContract.interface.encodeFunctionData("swap", [
        collateralAddress,
        assetAddress,
        account,
        "0",
        maxShareAfterSlippage,
      ])

      try {
        const tx = await kashiPairCloneContract?.cook(
          [ACTION_REMOVE_COLLATERAL, ACTION_GET_REPAY_SHARE, ACTION_CALL, ACTION_REPAY, ACTION_ADD_COLLATERAL],
          [0, 0, 0, 0],
          [
            ethers.utils.defaultAbiCoder.encode(['int256', 'address'], [maxShareAfterSlippage, swapperAddress]),
            ethers.utils.defaultAbiCoder.encode(['int256'], [part]),
            ethers.utils.defaultAbiCoder.encode(['address', 'bytes', 'bool', 'bool', 'uint8'], [swapperAddress, data.slice(0, -64), true, false, 2]),
            ethers.utils.defaultAbiCoder.encode(['int256', 'address', 'bool'], [part, account, false]),
            ethers.utils.defaultAbiCoder.encode(['int256', 'address', 'bool'], [-2, account, false])
          ]
        )
        return addTransaction(tx, { summary: 'Unwind'})
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
    borrowWithdraw,
    repayFromBento,
    repay,
    short,
    unwind
  }
}

export default useKashi
