import { useCallback, useState, useEffect } from 'react'

import {
  useBentoBoxContract,
  useBentoHelperContract,
  useKashiPairContract,
  useSushiSwapSwapper,
  useKashiPairHelperContract
} from './useContract'
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
import { ChainId } from '@sushiswap/sdk'
import { getSigner } from '../utils'
import { useKashiPairs } from 'contexts/kashi'

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

async function signMasterContractApproval(
  bentoBoxContract: ethers.Contract | null,
  masterContract: ethers.Contract | null,
  user: string,
  library: ethers.providers.Web3Provider,
  approved: boolean,
  chainId: ChainId | undefined,
  nonce: undefined
) {
  const warning = approved ? 'Give FULL access to funds in (and approved to) BentoBox?' : 'Revoke access to BentoBox?'
  if (!nonce) {
    console.log('Fetching nonce...')
    nonce = await bentoBoxContract?.nonces(user)
    console.log(nonce)
  }
  const message = {
    warning,
    user,
    masterContract,
    approved,
    nonce
  }

  // EIP712Domain(string name,uint256 chainId,address verifyingContract)
  // SetMasterContractApproval(string warning,address user,address masterContract,bool approved,uint256 nonce)
  const typedData = {
    types: {
      // EIP712Domain: [
      //   { name: 'name', type: 'string' },
      //   { name: 'chainId', type: 'uint256' },
      //   { name: 'verifyingContract', type: 'address' }
      // ],
      SetMasterContractApproval: [
        { name: 'warning', type: 'string' },
        { name: 'user', type: 'address' },
        { name: 'masterContract', type: 'address' },
        { name: 'approved', type: 'bool' },
        { name: 'nonce', type: 'uint256' }
      ]
    },
    primaryType: 'SetMasterContractApproval',
    domain: {
      name: 'BentoBox V1',
      chainId: chainId,
      verifyingContract: bentoBoxContract?.address
    },
    message: message
  }
  console.log('typedData:', typedData)

  const signer = getSigner(library, user)
  return signer._signTypedData(typedData.domain, typedData.types, typedData.message)
}

const useKashi = () => {
  const { account, library, chainId } = useActiveWeb3React()
  const addTransaction = useTransactionAdder()

  const bentoHelperContract = useBentoHelperContract()
  const bentoBoxContract = useBentoBoxContract(true) // withSigner
  const kashiPairContract = useKashiPairContract(true) // withSigner
  const kashiPairHelperContract = useKashiPairHelperContract()

  const pairs = useKashiPairs()

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

  // Description: Approve Kashi for BentoBox
  // Type: Master Contract
  // Action: Approve
  const approve = useCallback(async () => {
    try {
      const tx = await bentoBoxContract?.setMasterContractApproval(
        account,
        kashiPairContract?.address,
        false,
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

  // Description: Approve MasterContract for BentoBox  - eip217
  const approveMaster = useCallback(async () => {
    try {
      const tx = await signMasterContractApproval(
        bentoBoxContract,
        kashiPairContract,
        account!,
        library!,
        false,
        chainId,
        undefined
      )
      console.log(tx)
      //preturn addTransaction(tx, { summary: 'Enable Kashi' })
    } catch (e) {
      console.log(e)
      return e
    }
  }, [account, bentoBoxContract, chainId, kashiPairContract, library])

  // Description: Add Asset from BentoBox
  // Type: Asset
  // Actions: Add
  const addAsset = useCallback(
    async (pairAddress: string, address: string, amount: BalanceProps) => {
      const tokenAddress = isAddressString(address)
      const pairCheckSum = isAddressString(pairAddress)
      const kashiPairCloneContract = getContract(pairCheckSum, KASHIPAIR_ABI, library!, account!)

      try {
        const tx = await kashiPairCloneContract?.cook(
          [ACTION_ADD_ASSET],
          [0],
          [ethers.utils.defaultAbiCoder.encode(['int256', 'address', 'bool'], [amount.value, account, false])]
        )

        return addTransaction(tx, { summary: 'Add Asset' })
      } catch (e) {
        console.log(e)
        return e
      }
    },
    [account, addTransaction, library]
  )

  // Deposit into Bento from wallet and add asset
  // Type: Asset
  // Actions: Deposit, Add
  const depositAddAsset = useCallback(
    async (pairAddress: string, address: string, amount: BalanceProps) => {
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
              [tokenAddress, account, amount?.value, 0]
            ),
            ethers.utils.defaultAbiCoder.encode(['int256', 'address', 'bool'], [-2, account, false])
          ]
        )

        return addTransaction(tx, { summary: 'Deposit -> Add Asset' })
      } catch (e) {
        console.log(e)
        return e
      }
    },
    [account, addTransaction, library]
  )

  // Description: Remove asset to BentoBox
  // Type: Asset
  // Action: Remove
  const removeAsset = useCallback(
    async (pairAddress: string, address: string, amount: BalanceProps, max: boolean) => {
      const tokenAddress = isAddressString(address)
      const pairAddressCheckSum = isAddressString(pairAddress)
      const kashiPairCloneContract = getContract(pairAddressCheckSum, KASHIPAIR_ABI, library!, account!)

      const bentoTotalAsset = await bentoBoxContract?.totals(address)
      const totalAsset = await kashiPairCloneContract?.totalAsset()
      const totalBorrow = await kashiPairCloneContract?.totalBorrow()

      let share = await bentoBoxContract?.toShare(tokenAddress, amount?.value, false)
      if (max) {
        const pairUserDetails = await kashiPairHelperContract?.pollPairs(account, [pairAddressCheckSum])

        share = pairUserDetails[1][0].userAssetAmount.mul(totalAsset.base).div(totalAsset.elastic)
      }

      const borrowShares = await bentoBoxContract?.toShare(tokenAddress, totalBorrow.elastic, true)
      const allShare = totalAsset.elastic.add(borrowShares)
      const fraction = share.mul(totalAsset.base).div(allShare)

      const removedPart = fraction.eq(BigNumber.from(0)) ? amount?.value : fraction

      try {
        const tx = await kashiPairCloneContract?.cook(
          [ACTION_REMOVE_ASSET],
          [0],
          [ethers.utils.defaultAbiCoder.encode(['int256', 'address'], [removedPart, account])]
        )

        return addTransaction(tx, { summary: 'Remove Asset' })
      } catch (e) {
        console.log(e)
        return e
      }
    },
    [account, addTransaction, bentoBoxContract, kashiPairHelperContract, library]
  )

  // Description: Remove Asset and withdraw to wallet
  // Type: Asset
  // Action: Remove, Withdraw
  const removeWithdrawAsset = useCallback(
    async (pairAddress: string, address: string, amount: BalanceProps, max: boolean) => {
      const tokenAddress = isAddressString(address)
      const pairAddressCheckSum = isAddressString(pairAddress)
      const kashiPairCloneContract = getContract(pairAddressCheckSum, KASHIPAIR_ABI, library!, account!)

      const bentoTotalAsset = await bentoBoxContract?.totals(address)
      const totalAsset = await kashiPairCloneContract?.totalAsset()
      const totalBorrow = await kashiPairCloneContract?.totalBorrow()

      let share = await bentoBoxContract?.toShare(tokenAddress, amount?.value, false)
      if (max) {
        const pairUserDetails = await kashiPairHelperContract?.pollPairs(account, [pairAddressCheckSum])

        share = pairUserDetails[1][0].userAssetAmount.mul(totalAsset.base).div(totalAsset.elastic)
      }

      const borrowShares = await bentoBoxContract?.toShare(tokenAddress, totalBorrow.elastic, true)
      const allShare = totalAsset.elastic.add(borrowShares)
      const fraction = share.mul(totalAsset.base).div(allShare)

      const removedPart = fraction.eq(BigNumber.from(0)) ? amount?.value : fraction

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

        return addTransaction(tx, { summary: 'Remove -> Withdraw Asset' })
      } catch (e) {
        console.log(e)
        return e
      }
    },
    [account, addTransaction, bentoBoxContract, kashiPairHelperContract, library]
  )

  // Description: Add collateral from bentobox
  // Type: Collateral
  // Action: Add
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
    [account, addTransaction, bentoBoxContract, library]
  )

  // Description: Deposit into bentbox from wallet, add as collateral
  // Token needs to approve bentobox first
  // Type: Collateral
  // Action: Deposit, Add
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

  // Description: remove into bentbox, withdraw into wallet
  // Token needs to approve bentobox first
  // Type: Collateral
  // Action: Remove, Withdraw
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

      const share = await bentoBoxContract?.toShare(tokenAddress, amountToWithdraw, false)

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
    [account, addTransaction, bentoBoxContract, kashiPairHelperContract, library]
  )

  // Description: remove collateral into bentobox
  // Type: Collateral
  // Action: Remove
  const removeCollateral = useCallback(
    async (pairAddress: string, address: string, amount: BalanceProps, max: boolean) => {
      const tokenAddress = isAddressString(address)

      const pairAddressCheckSum = isAddressString(pairAddress)
      const kashiPairCloneContract = getContract(pairAddressCheckSum, KASHIPAIR_ABI, library!, account!)

      const pair = pairs.find(pair => pair.address === pairAddress)

      let amountToWithdraw = amount.value
      if (max) {
        if (pair) {
          amountToWithdraw = pair.user.collateral.max
        }
      }

      const share = await bentoBoxContract?.toShare(tokenAddress, amountToWithdraw, false)

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
    [account, addTransaction, bentoBoxContract, kashiPairHelperContract, library]
  )

  // Description: borrow into bentobox
  // Type: Asset
  // Action: Borrow
  const borrow = useCallback(
    async (pairAddress: string, address: string, amount: BalanceProps, max: boolean) => {
      const pairAddressCheckSum = isAddressString(pairAddress)
      const kashiPairCloneContract = getContract(pairAddressCheckSum, KASHIPAIR_ABI, library!, account!)

      let borrowAmount = amount?.value

      if (max) {
        const pairUserDetails = await kashiPairHelperContract?.pollPairs(account, [pairAddressCheckSum])
        borrowAmount = pairUserDetails.user.borrow.max
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
    [account, addTransaction, kashiPairHelperContract, library]
  )

  // Description: borrow into wallet
  // Type: Asset
  // Actions: Borrow, Withdraw
  const borrowWithdraw = useCallback(
    async (pairAddress: string, address: string, amount: BalanceProps, max: boolean) => {
      const tokenAddress = isAddressString(address)

      const pairAddressCheckSum = isAddressString(pairAddress)
      const kashiPairCloneContract = getContract(pairAddressCheckSum, KASHIPAIR_ABI, library!, account!)

      let borrowAmount = amount?.value

      if (max) {
        const pairUserDetails = await kashiPairHelperContract?.pollPairs(account, [pairAddressCheckSum])
        borrowAmount = pairUserDetails.user.borrow.max
      }

      try {
        const tx = await kashiPairCloneContract?.cook(
          [ACTION_BORROW, ACTION_BENTO_WITHDRAW],
          [0, 0],
          [
            ethers.utils.defaultAbiCoder.encode(['uint256', 'address'], [borrowAmount, account]),
            ethers.utils.defaultAbiCoder.encode(
              ['address', 'address', 'int256', 'int256'],
              [tokenAddress, account, 0, -2]
            )
          ]
        )

        return addTransaction(tx, { summary: 'Borrow -> Withdraw' })
      } catch (e) {
        console.log(e)
        return e
      }
    },
    [account, addTransaction, kashiPairHelperContract, library]
  )

  // repay borrowed amount
  // Type: Asset
  // Actions: Repay
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
          ? pairUserDetails[1][0].userBorrowAmount.mul(totalBorrow.base).div(totalBorrow.elastic)
          : BigNumber.from(0)
      }

      // if part = 0 then use amount as long as amount isn't 0, check for amount being 0 above
      const repayPart = part.eq(BigNumber.from(0)) ? amount?.value : part

      try {
        const tx = await kashiPairCloneContract?.cook(
          [ACTION_REPAY],
          [0],
          [ethers.utils.defaultAbiCoder.encode(['uint256', 'address', 'bool'], [repayPart, account, false])]
        )

        return addTransaction(tx, { summary: 'Repay From Bento' })
      } catch (e) {
        console.log(e)
        return e
      }
    },
    [account, addTransaction, kashiPairHelperContract, library]
  )

  // repay borrowed amount from wallet
  // Type: Asset
  // Actions: Deposit, Repay
  const repay = useCallback(
    async (pairAddress: string, address: string, amount: BalanceProps, max: boolean) => {
      const tokenAddress = isAddressString(pairAddress)

      const pairAddressCheckSum = isAddressString(pairAddress)
      const kashiPairCloneContract = getContract(pairAddressCheckSum, KASHIPAIR_ABI, library!, account!)

      const totalBorrow = await kashiPairCloneContract?.totalBorrow()
      let part = amount?.value.mul(totalBorrow.base).div(totalBorrow.elastic)

      if (max) {
        const pairUserDetails = await kashiPairHelperContract?.pollPairs(account, [pairAddressCheckSum])

        part = pairUserDetails[1][0].userBorrowAmount.gt(BigNumber.from(0))
          ? pairUserDetails[1][0].userBorrowAmount.mul(totalBorrow.base).div(totalBorrow.elastic)
          : BigNumber.from(0)
      }

      // if part == 0 then use amount as long as amount isn't 0, check for amount being 0 above
      const repayPart = part.eq(BigNumber.from(0)) ? amount?.value : part

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
            ethers.utils.defaultAbiCoder.encode(['int256', 'address', 'bool'], [repayPart, account, false])
          ]
        )

        return addTransaction(tx, { summary: 'Repay' })
      } catch (e) {
        console.log(e)
        return e
      }
    },
    [account, addTransaction, kashiPairHelperContract, library]
  )

  // Type: Collateral, Asset
  // Action: Short
  const short = useCallback(
    async (pairAddress: string, address: string, amount: BalanceProps) => {
      const tokenAddress = isAddressString(pairAddress)
      const pairAddressCheckSum = isAddressString(pairAddress)
      const swapperAddress = isAddressString(BASE_SWAPPER[chainId!])

      const kashiPairCloneContract = getContract(pairAddressCheckSum, KASHIPAIR_ABI, library!, account!)
      const swapperContract = getContract(swapperAddress, BASE_SWAPPER_ABI, library!, account!)
      const pairUserDetails = await kashiPairHelperContract?.pollPairs(account, [pairAddressCheckSum])

      const exchangeRate = await kashiPairCloneContract?.exchangeRate()
      const slippage = BigNumber.from('20') // 0.05%
      const minReturnedShare = amount.value
        .mul(exchangeRate.sub(exchangeRate.div(slippage)))
        .div(ethers.utils.parseEther('1')) // the divide should be the token's decimals

      // should pass these in from somewhere else instead of calling the contract
      const assetAddress = await kashiPairCloneContract?.asset()
      const collateralAddress = await kashiPairCloneContract?.collateral()

      const data = swapperContract.interface.encodeFunctionData('swap', [
        assetAddress,
        collateralAddress,
        account,
        '0',
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
            ethers.utils.defaultAbiCoder.encode(
              ['address', 'bytes', 'bool', 'bool', 'uint8'],
              [swapperAddress, data.slice(0, -64), false, true, 2]
            ),
            ethers.utils.defaultAbiCoder.encode(['int256', 'address', 'bool'], [-2, account, false])
          ]
        )

        return addTransaction(tx, { summary: 'Short' })
      } catch (e) {
        console.log(e)
        return e
      }
    },
    [account, addTransaction, chainId, kashiPairHelperContract, library]
  )

  const unwind = useCallback(
    async (pairAddress: string, address: string, amount: BalanceProps) => {
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
      const maxShareAfterSlippage = maxShare.add(maxShare.mul(BigNumber.from(5)).div(BigNumber.from(100)))

      console.log('ex: ', exchangeRate)
      console.log('!!!maxShare: ', maxShareAfterSlippage)

      const totalBorrow = await kashiPairCloneContract?.totalBorrow()
      const part = maxShare.mul(totalBorrow.base).div(totalBorrow.elastic)

      console.log('part: ', part)

      const assetAddress = await kashiPairCloneContract?.asset()
      const collateralAddress = await kashiPairCloneContract?.collateral()

      const data = swapperContract.interface.encodeFunctionData('swap', [
        collateralAddress,
        assetAddress,
        account,
        '0',
        maxShareAfterSlippage
      ])

      try {
        const tx = await kashiPairCloneContract?.cook(
          [ACTION_REMOVE_COLLATERAL, ACTION_GET_REPAY_SHARE, ACTION_CALL, ACTION_REPAY, ACTION_ADD_COLLATERAL],
          [0, 0, 0, 0],
          [
            ethers.utils.defaultAbiCoder.encode(['int256', 'address'], [maxShareAfterSlippage, swapperAddress]),
            ethers.utils.defaultAbiCoder.encode(['int256'], [part]),
            ethers.utils.defaultAbiCoder.encode(
              ['address', 'bytes', 'bool', 'bool', 'uint8'],
              [swapperAddress, data.slice(0, -64), true, false, 2]
            ),
            ethers.utils.defaultAbiCoder.encode(['int256', 'address', 'bool'], [part, account, false]),
            ethers.utils.defaultAbiCoder.encode(['int256', 'address', 'bool'], [-2, account, false])
          ]
        )
        return addTransaction(tx, { summary: 'Unwind' })
      } catch (e) {
        console.log(e)
        return e
      }
    },
    [account, addTransaction, chainId, kashiPairHelperContract, library]
  )

  return {
    kashiApproved,
    approve,
    approveMaster,
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
