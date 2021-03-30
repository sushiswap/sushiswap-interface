import { useActiveWeb3React } from 'hooks'
import React, { useCallback, useState } from 'react'
import { KashiPair } from 'kashi'
import { ethers } from 'ethers'
import { BigNumber } from '@ethersproject/bignumber'
import { useKashiPairContract, useBentoBoxContract } from 'sushi-hooks/useContract'
import { ChainId } from '@sushiswap/sdk'
import { getSigner } from '../../utils'
import { BalanceProps } from '../../sushi-hooks/useTokenBalance'
import { useKashiPair } from 'kashi/context'

import { 
  ACTION_ADD_ASSET,
  ACTION_REPAY,
  ACTION_REMOVE_ASSET,
  ACTION_REMOVE_COLLATERAL,
  ACTION_BORROW,
  ACTION_GET_REPAY_SHARE,
  ACTION_GET_REPAY_PART,
  ACTION_ADD_COLLATERAL,
  ACTION_BENTO_DEPOSIT,
  ACTION_BENTO_WITHDRAW,
  ACTION_BENTO_TRANSFER,
  ACTION_BENTO_TRANSFER_MULTIPLE,
  ACTION_BENTO_SETAPPROVAL,
  ACTION_CALL
 } from '../constants'

const signMasterContractApproval = async (
  bentoBoxContract: ethers.Contract | null,
  masterContract: string | undefined,
  user: string,
  library: ethers.providers.Web3Provider,
  approved: boolean,
  chainId: ChainId | undefined,
  nonce: any
) => {
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
  // console.log('typedData:', typedData)
  const signer = getSigner(library, user)
  let signature = await signer._signTypedData(typedData.domain, typedData.types, typedData.message)
  return ethers.utils.splitSignature(signature)
}

function useKashiCooker(pair: KashiPair) {
  const { account, chainId, library } = useActiveWeb3React()

  const kashiPairContract = useKashiPairContract()
  const bentoBoxContract = useBentoBoxContract()
  
  const [actions, setActions] = useState<number[]>([])
  const [values, setValues] = useState<number[]>([])
  const [data, setData] = useState<string[]>([])

  const approve = useCallback(async (approval) => {
    const permit = await signMasterContractApproval(bentoBoxContract, pair.address, account!, library!, approval, chainId, undefined)
    setActions([...actions, ACTION_BENTO_SETAPPROVAL])
    setValues([...values, 0])

    let abiData = ethers.utils.defaultAbiCoder.encode(["address", "address", "bool", "uint8", "bytes32", "bytes32"], [bentoBoxContract?.address, pair.address, true, permit.v, permit.r, permit.s])
    setData([...data, abiData])
  }, [])

  const addCollateral = useCallback(async (amount: BalanceProps) => {
    const share = await bentoBoxContract?.toShare(pair.collateral, amount?.value, true)
    setActions([...actions, ACTION_ADD_COLLATERAL])
    setValues([...values, 0])

    let abiData = ethers.utils.defaultAbiCoder.encode(["int256", "address", "bool"], [share, pair.address, true])
    setData([...data, abiData])
  }, [])

  const depositCollateral = useCallback(async (amount: BalanceProps) => {
    setActions([...actions, ACTION_BENTO_DEPOSIT, ACTION_ADD_COLLATERAL])
    setValues([...values, 0, 0])

    let depositData = ethers.utils.defaultAbiCoder.encode(["address", "address", "int256", "int256"], [pair.collateral, pair.address, amount.value, 0])
    let addCollateralData = ethers.utils.defaultAbiCoder.encode(["int256", "address", "bool"], [-2, pair.address, false])
    setData([...data, depositData, addCollateralData])
  }, [])

  const addAsset = useCallback(async (amount: BalanceProps) => {
    setActions([...actions, ACTION_BENTO_DEPOSIT, ACTION_ADD_ASSET])
    setValues([...values, 0, 0])

    let depositData = ethers.utils.defaultAbiCoder.encode(["address", "address", "int256", "int256"], [pair.asset, pair.address, amount.value, 0])
    let addAssetData = ethers.utils.defaultAbiCoder.encode(["int256", "address", "bool"], [-2, pair.address, false])
    setData([...data, depositData, addAssetData])
  }, [])

  const borrow = useCallback(async (amount: BalanceProps) => {
    const share = await bentoBoxContract?.toShare(pair.collateral, amount?.value, true)
    setActions([...actions, ACTION_BORROW])
    setValues([...values, 0])

    let abiData = ethers.utils.defaultAbiCoder.encode(["int256", "address"], [amount.value, pair.address])
    setData([...data, abiData])
  }, [])

  const cook = useCallback(() => {
    if (kashiPairContract) {
      return kashiPairContract.cook(actions, values, data)
    }
  }, [kashiPairContract, actions, values, data])

  return { approve, addCollateral, depositCollateral, addAsset, borrow, cook }
}

export default useKashiCooker
