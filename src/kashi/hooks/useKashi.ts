import { useCallback, useState, useEffect } from 'react'

import {
  useBentoBoxContract,
  useKashiPairContract,
  useKashiPairHelperContract,
  useChainlinkOracle
} from '../../sushi-hooks/useContract'
import { useTransactionAdder } from '../../state/transactions/hooks'
import { useActiveWeb3React } from '../../hooks'

import ERC20_ABI from '../../constants/abis/erc20.json'
import KASHIPAIR_ABI from '../../constants/sushiAbis/kashipair.json'
import { isAddressString, getContract } from '../../utils'

import { ethers } from 'ethers'

import { BalanceProps } from '../../sushi-hooks/useTokenBalance'
import { BigNumber } from '@ethersproject/bignumber'

import { BASE_SWAPPER } from '../../constants'
import BASE_SWAPPER_ABI from '../../constants/sushiAbis/swapper.json'
import { ChainId } from '@sushiswap/sdk'
import { getSigner } from '../../utils'
import { useKashiPairs } from 'kashi/context'
import { WETH } from '@sushiswap/sdk'

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
  masterContract: string | undefined,
  user: string,
  library: ethers.providers.Web3Provider,
  approved: boolean,
  chainId: ChainId | undefined,
  nonce: any
) {
  const warning = approved ? 'Give FULL access to funds in (and approved to) BentoBox?' : 'Revoke access to BentoBox?'
  if (!nonce) {
    nonce = await bentoBoxContract?.nonces(user)
  }
  const message = {
    warning,
    user,
    masterContract,
    approved,
    nonce
  }

  const typedData = {
    types: {
      // // ethers _signTypedData assumes EIP712
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

  const bentoBoxContract = useBentoBoxContract(true) // withSigner
  const kashiPairContract = useKashiPairContract(true) // withSigner
  const kashiPairHelperContract = useKashiPairHelperContract()

  const chainLinkOracleContract = useChainlinkOracle()

  const pairs = useKashiPairs()

  // Fetch Pair Addresses for logging
  const getPairsAddresses = useCallback(async () => {
    const filter = bentoBoxContract?.filters.LogDeploy(kashiPairContract?.address, null)
    //console.log('filter:', filter)
    const events = await bentoBoxContract?.queryFilter(filter!)
    //console.log('events:', events)
    const addresses = events?.map(event => event.args?.[2])
    console.log('pairs:', addresses)
  }, [bentoBoxContract, kashiPairContract?.address])

  // Check if Kashi is approved
  const [kashiApproved, setKashiApproved] = useState(false)
  const fetchKashiApproval = useCallback(async () => {
    if (account) {
      try {
        const isApproved = await bentoBoxContract?.masterContractApproved(kashiPairContract?.address, account)

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

  // Description: Approve MasterContract for BentoBox  - eip712
  const approveMaster = useCallback(async () => {
    const signature = await signMasterContractApproval(
      bentoBoxContract,
      kashiPairContract?.address,
      account!,
      library!,
      true,
      chainId,
      undefined
    )
    const permit = ethers.utils.splitSignature(signature)
    console.log('permit:', permit)
    console.log('comparison:', 0, ethers.constants.HashZero, ethers.constants.HashZero)

    try {
      const tx = await kashiPairContract?.cook(
        [ACTION_BENTO_SETAPPROVAL],
        [0],
        [
          ethers.utils.defaultAbiCoder.encode(
            ['address', 'address', 'bool', 'uint8', 'bytes32', 'bytes32'],
            [account, kashiPairContract?.address, true, permit.v, permit.r, permit.s]
          )
        ]
      )
      return addTransaction(tx, { summary: 'Enable Kashi' })
    } catch (e) {
      console.log(e)
      return e
    }
  }, [account, addTransaction, bentoBoxContract, chainId, kashiPairContract, library])

  // const create = useCallback(
  //   async (collateralDetails: any, assetDetails: any) => {
  //     let asset = assetDetails.address.toLowerCase() // from
  //     let collateral = collateralDetails.address.toLowerCase() // to
  //     let multiply = '0x0000000000000000000000000000000000000000'
  //     let divide = '0x0000000000000000000000000000000000000000'
  //     let multiplyMatches = Object.values(chainLinkMappings).filter(m => m.from == asset && m.to == collateral)
  //     let oracleData = ''
  //     let decimals
  //     let match
  //     if (multiplyMatches.length) {
  //       match = multiplyMatches[0]
  //       multiply = match.address
  //       decimals = BigNumber.from(18)
  //         .add(BigNumber.from(match.decimals))
  //         .sub(BigNumber.from(collateralDetails.decimals))
  //         .add(BigNumber.from(assetDetails.decimals))
  //     } else {
  //       let divideMatches = Object.values(chainLinkMappings).filter(m => m.from == collateral && m.to == asset)
  //       if (divideMatches.length) {
  //         match = divideMatches[0]
  //         divide = match.address
  //         decimals = BigNumber.from(36)
  //           .sub(BigNumber.from(match.decimals))
  //           .add(BigNumber.from(asset.decimals))
  //         oracleData = await chainLinkOracleContract?.getDataParameter(
  //           multiply,
  //           divide,
  //           BigNumber.from(10).pow(decimals)
  //         )
  //       } else {
  //         let mapFrom = Object.values(chainLinkMappings).filter(m => m.from == asset)
  //         let mapTo = Object.values(chainLinkMappings).filter(m => m.from == collateral)
  //         const match = mapFrom
  //           .map((mfrom: any) => ({ mfrom: mfrom, mto: mapTo.filter(mto => mfrom.to == mto.to) }))
  //           .filter((path: any) => path.mto.length)
  //         if (match.length) {
  //           console.log('FOUND', match[0].mfrom, match[0].mto[0])
  //           multiply = match[0].mfrom.address
  //           divide = match[0].mto[0].address
  //           decimals = BigNumber.from(18)
  //             .add(BigNumber.from(match[0].mfrom.decimals))
  //             .sub(BigNumber.from(match[0].mto[0].decimals))
  //             .sub(BigNumber.from(collateralDetails.decimals))
  //             .add(BigNumber.from(assetDetails.decimals))
  //         } else {
  //           console.log('No path')
  //           return
  //         }
  //       }
  //     }
  //     oracleData = await chainLinkOracleContract?.getDataParameter(multiply, divide, BigNumber.from(10).pow(decimals))
  //     console.log(collateral, asset, chainLinkOracleContract?.address, oracleData)

  //     const kashiData = ethers.utils.defaultAbiCoder.encode(
  //       ['address', 'address', 'address', 'bytes'],
  //       [collateral, asset, chainLinkOracleContract?.address, oracleData]
  //     )
  //     await bentoBoxContract?.deploy(kashiPairContract?.address, kashiData, true) // withSigner
  //   },
  //   [account, addTransaction, bentoBoxContract, library]
  // )

  // Description: Update Exchange Rate
  const updateExchangeRate = useCallback(
    async (pairAddress: string) => {
      const pairCheckSum = isAddressString(pairAddress)
      const kashiPairCloneContract = getContract(pairCheckSum, KASHIPAIR_ABI, library!, account!)

      try {
        const tx = await kashiPairCloneContract?.updateExchangeRate()

        return addTransaction(tx, { summary: 'Update Exchange Rate' })
      } catch (e) {
        console.log(e)
        return e
      }
    },
    [account, addTransaction, library]
  )

  // Description: Add Asset from BentoBox
  // Type: Asset
  // Actions: Add
  const addAsset = useCallback(
    async (pairAddress: string, address: string, value: BigNumber) => {
      console.log('Add asset', pairAddress, address, value, value.toString())

      const tokenAddress = isAddressString(address)
      const pairCheckSum = isAddressString(pairAddress)
      const kashiPairCloneContract = getContract(pairCheckSum, KASHIPAIR_ABI, library!, account!)

      const share = await bentoBoxContract?.toShare(tokenAddress, value, false)

      try {
        const tx = await kashiPairCloneContract?.cook(
          [ACTION_ADD_ASSET],
          [0],
          [ethers.utils.defaultAbiCoder.encode(['int256', 'address', 'bool'], [share, account, false])]
        )

        return addTransaction(tx, { summary: 'Add Asset' })
      } catch (e) {
        console.error(e)
        return e
      }
    },
    [account, addTransaction, bentoBoxContract, library]
  )

  // Deposit into Bento from wallet and add asset
  // Type: Asset
  // Actions: Deposit, Add
  const depositAddAsset = useCallback(
    async (pairAddress: string, address: string, value: BigNumber) => {
      console.log('Deposit add asset', pairAddress, address, value, value.toString())

      let tokenAddress = isAddressString(address)

      const pairCheckSum = isAddressString(pairAddress)
      const kashiPairCloneContract = getContract(pairCheckSum, KASHIPAIR_ABI, library!, account!)

      let ethAmt = BigNumber.from(0)

      if (chainId && tokenAddress === WETH[chainId].address) {
        ethAmt = value
        tokenAddress = ethers.constants.AddressZero
      }

      try {
        const tx = await kashiPairCloneContract?.cook(
          [ACTION_BENTO_DEPOSIT, ACTION_ADD_ASSET],
          [ethAmt, 0],
          [
            ethers.utils.defaultAbiCoder.encode(
              ['address', 'address', 'int256', 'int256'],
              [tokenAddress, account, value, 0]
            ),
            ethers.utils.defaultAbiCoder.encode(['int256', 'address', 'bool'], [-2, account, false])
          ],
          { value: ethAmt }
        )

        return addTransaction(tx, { summary: 'Deposit -> Add Asset' })
      } catch (error) {
        console.error(error)
        return error
      }
    },
    [account, addTransaction, chainId, library]
  )

  // Description: Remove asset to BentoBox
  // Type: Asset
  // Action: Remove
  const removeAsset = useCallback(
    async (pairAddress: string, address: string, value: BigNumber, max = false) => {
      const tokenAddress = isAddressString(address)
      const pairAddressCheckSum = isAddressString(pairAddress)
      const kashiPairCloneContract = getContract(pairAddressCheckSum, KASHIPAIR_ABI, library!, account!)

      const bentoTotalAsset = await bentoBoxContract?.totals(address)
      const totalAsset = await kashiPairCloneContract?.totalAsset()
      const totalBorrow = await kashiPairCloneContract?.totalBorrow()

      let share = await bentoBoxContract?.toShare(tokenAddress, value, false)
      if (max) {
        const pairUserDetails = await kashiPairHelperContract?.pollPairs(account, [pairAddressCheckSum])
        const userSupplyAmount = pairUserDetails[1][0].totalAssetAmount.gt(BigNumber.from(0))
          ? pairUserDetails[1][0].userAssetAmount.add(
              pairUserDetails[1][0].userAssetAmount
                .mul(pairUserDetails[1][0].totalBorrowAmount)
                .div(pairUserDetails[1][0].totalAssetAmount)
            )
          : BigNumber.from(0)
        share = await bentoBoxContract?.toShare(tokenAddress, userSupplyAmount, true)
      }
      const borrowShares = await bentoBoxContract?.toShare(tokenAddress, totalBorrow.elastic, true)
      const allShare = totalAsset.elastic.add(borrowShares)
      const fraction = share.mul(totalAsset.base).div(allShare)
      const removedPart = fraction.eq(BigNumber.from(0)) ? value : fraction

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
    async (pairAddress: string, address: string, value: BigNumber, max = false) => {
      let tokenAddress = isAddressString(address)
      const pairAddressCheckSum = isAddressString(pairAddress)
      const kashiPairCloneContract = getContract(pairAddressCheckSum, KASHIPAIR_ABI, library!, account!)

      const bentoTotalAsset = await bentoBoxContract?.totals(address)
      const totalAsset = await kashiPairCloneContract?.totalAsset()
      const totalBorrow = await kashiPairCloneContract?.totalBorrow()

      let share = await bentoBoxContract?.toShare(tokenAddress, value, false)
      if (max) {
        const pairUserDetails = await kashiPairHelperContract?.pollPairs(account, [pairAddressCheckSum])
        const userSupplyAmount = pairUserDetails[1][0].totalAssetAmount.gt(BigNumber.from(0))
          ? pairUserDetails[1][0].userAssetAmount.add(
              pairUserDetails[1][0].userAssetAmount
                .mul(pairUserDetails[1][0].totalBorrowAmount)
                .div(pairUserDetails[1][0].totalAssetAmount)
            )
          : BigNumber.from(0)
        share = await bentoBoxContract?.toShare(tokenAddress, userSupplyAmount, true)
        //share = pairUserDetails[1][0].userAssetAmount.mul(totalAsset.base).div(totalAsset.elastic)
      }

      const borrowShares = await bentoBoxContract?.toShare(tokenAddress, totalBorrow.elastic, true)
      const allShare = totalAsset.elastic.add(borrowShares)
      const fraction = share.mul(totalAsset.base).div(allShare)

      const removedPart = fraction.eq(BigNumber.from(0)) ? value : fraction

      if (chainId && tokenAddress === WETH[chainId].address) {
        tokenAddress = ethers.constants.AddressZero
      }

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
    [account, addTransaction, bentoBoxContract, chainId, kashiPairHelperContract, library]
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
      let tokenAddress = isAddressString(address)

      const pairAddressCheckSum = isAddressString(pairAddress)
      const kashiPairCloneContract = getContract(pairAddressCheckSum, KASHIPAIR_ABI, library!, account!)

      let ethAmt = BigNumber.from(0)
      if (chainId && tokenAddress === WETH[chainId].address) {
        ethAmt = amount?.value
        tokenAddress = ethers.constants.AddressZero
      }

      try {
        const tx = await kashiPairCloneContract?.cook(
          [ACTION_BENTO_DEPOSIT, ACTION_ADD_COLLATERAL],
          [ethAmt, 0],
          [
            ethers.utils.defaultAbiCoder.encode(
              ['address', 'address', 'int256', 'int256'],
              [tokenAddress, account, amount?.value, 0]
            ),
            ethers.utils.defaultAbiCoder.encode(['int256', 'address', 'bool'], [-2, account, false])
          ],
          { value: ethAmt }
        )

        return addTransaction(tx, { summary: 'Deposit → Add Collateral' })
      } catch (e) {
        console.log(e)
        return e
      }
    },
    [account, addTransaction, chainId, library]
  )

  // Description: remove into bentbox, withdraw into wallet
  // Token needs to approve bentobox first
  // Type: Collateral
  // Action: Remove, Withdraw
  const removeWithdrawCollateral = useCallback(
    async (pairAddress: string, address: string, amount: BalanceProps, max = false) => {
      let tokenAddress = isAddressString(address)

      const pairAddressCheckSum = isAddressString(pairAddress)
      const kashiPairCloneContract = getContract(pairAddressCheckSum, KASHIPAIR_ABI, library!, account!)

      // TODO: based on granularity, this might not be the most updated max
      const pair = pairs.find(pair => pair.address === pairAddress)
      let amountToWithdraw = amount.value
      if (max) {
        if (pair) {
          amountToWithdraw = pair.user.collateral.max.value
        }
      }
      const share = await bentoBoxContract?.toShare(tokenAddress, amountToWithdraw, false)

      if (chainId && tokenAddress === WETH[chainId].address) {
        tokenAddress = ethers.constants.AddressZero
      }

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
    [account, addTransaction, bentoBoxContract, chainId, library, pairs]
  )

  // Description: remove collateral into bentobox
  // Type: Collateral
  // Action: Remove
  const removeCollateral = useCallback(
    async (pairAddress: string, address: string, amount: BalanceProps, max = false) => {
      const tokenAddress = isAddressString(address)

      const pairAddressCheckSum = isAddressString(pairAddress)
      const kashiPairCloneContract = getContract(pairAddressCheckSum, KASHIPAIR_ABI, library!, account!)

      const pair = pairs.find(pair => pair.address === pairAddress)

      let amountToWithdraw = amount.value

      if (max) {
        if (pair) {
          amountToWithdraw = pair.user.collateral.max.value
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
    [account, addTransaction, bentoBoxContract, library, pairs]
  )

  // Description: borrow into bentobox
  // Type: Asset
  // Action: Borrow
  const borrow = useCallback(
    async (pairAddress: string, address: string, amount: BalanceProps, max = false) => {
      const pairAddressCheckSum = isAddressString(pairAddress)
      const kashiPairCloneContract = getContract(pairAddressCheckSum, KASHIPAIR_ABI, library!, account!)

      let borrowAmount = amount?.value
      const pair = pairs.find(pair => pair.address === pairAddress)
      if (max) {
        if (pair) {
          borrowAmount = pair.user.borrow.max.value
        }
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
    [account, addTransaction, library, pairs]
  )

  // Description: borrow into wallet
  // Type: Asset
  // Actions: Borrow, Withdraw
  const borrowWithdraw = useCallback(
    async (pairAddress: string, address: string, amount: BalanceProps, max = false) => {
      let tokenAddress = isAddressString(address)
      const pairAddressCheckSum = isAddressString(pairAddress)
      const kashiPairCloneContract = getContract(pairAddressCheckSum, KASHIPAIR_ABI, library!, account!)
      const borrowAmount = amount?.value
      const pair = pairs.find(pair => pair.address === pairAddress)

      /*if (max) {
        if (pair) {
          borrowAmount = pair.user.borrow.max.value
        }
      }*/

      if (chainId && tokenAddress === WETH[chainId].address) {
        tokenAddress = ethers.constants.AddressZero
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
    [account, addTransaction, chainId, library, pairs]
  )

  // repay borrowed amount
  // Type: Asset
  // Actions: Repay
  const repayFromBento = useCallback(
    async (pairAddress: string, address: string, amount: BalanceProps, max = false) => {
      // TODO: if amount ends up being 0, we need to prevent the tx from happening and display message
      const pairAddressCheckSum = isAddressString(pairAddress)
      const kashiPairCloneContract = getContract(pairAddressCheckSum, KASHIPAIR_ABI, library!, account!)
      const totalBorrow = await kashiPairCloneContract?.totalBorrow()

      console.log({ value: amount.value.toString() })

      let part = amount?.value.mul(totalBorrow.base).div(totalBorrow.elastic)

      if (max) {
        const pairUserDetails = await kashiPairHelperContract?.pollPairs(account, [pairAddressCheckSum])
        part = pairUserDetails[1][0].userBorrowAmount.gt(BigNumber.from(0))
          ? pairUserDetails[1][0].userBorrowAmount.mul(totalBorrow.base).div(totalBorrow.elastic)
          : BigNumber.from(0)
      }
      const repayPart = part.eq(BigNumber.from(0)) ? amount?.value : part
      console.log('repayPart_bento:', repayPart.toString())
      try {
        const tx = await kashiPairCloneContract?.cook(
          [ACTION_GET_REPAY_PART, ACTION_REPAY],
          [0, 0],
          [
            ethers.utils.defaultAbiCoder.encode(['uint256'], [amount.value]),
            ethers.utils.defaultAbiCoder.encode(['int256', 'address', 'bool'], [-1, account, false])
          ]
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
    async (pairAddress: string, address: string, amount: BalanceProps, max = false) => {
      let tokenAddress = isAddressString(address)
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

      console.log('repayPart_wallet:', repayPart.toString())

      let ethAmt = BigNumber.from(0)
      if (chainId && tokenAddress === WETH[chainId].address) {
        ethAmt = amount?.value
        tokenAddress = ethers.constants.AddressZero
      }

      //onsole.log("ethAmt:", ethAmt);

      try {
        const tx = await kashiPairCloneContract?.cook(
          [ACTION_GET_REPAY_SHARE, ACTION_BENTO_DEPOSIT, ACTION_REPAY],
          [0, ethAmt, 0],
          [
            ethers.utils.defaultAbiCoder.encode(['int256'], [repayPart]),
            ethers.utils.defaultAbiCoder.encode(
              ['address', 'address', 'int256', 'int256'],
              [tokenAddress, account, 0, -1]
            ),
            ethers.utils.defaultAbiCoder.encode(['int256', 'address', 'bool'], [repayPart, account, false])
          ],
          { value: ethAmt }
        )

        return addTransaction(tx, { summary: 'Repay' })
      } catch (e) {
        console.log(e)
        return e
      }
    },
    [account, addTransaction, chainId, kashiPairHelperContract, library]
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
    getPairsAddresses,
    kashiApproved,
    approve,
    approveMaster,
    updateExchangeRate,
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
