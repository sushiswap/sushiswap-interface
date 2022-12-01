import { BigNumber } from '@ethersproject/bignumber'
import { Contract } from '@ethersproject/contracts'
import { ChainId, JSBI } from '@figswap/core-sdk'
import { Signature } from 'ethers'

export type Action<T, P = { data: string; value?: BigNumber }> = (x: T) => P

export interface DepositActionPayload {
  chainId: ChainId
  bentobox: Contract
  tokenAddress: string
  amount: BigNumber
  share: BigNumber
  account: string
}

export interface WithdrawAction {
  bentobox: Contract
  chainId: ChainId
  tokenAddress: string
  amount: BigNumber
  account: string
  share?: JSBI
}

export interface HarvestAction {
  bentobox: Contract
  tokenAddress: string
  rebalance: boolean
}

export interface BatchAction {
  bentobox: Contract
  actions: string[]
  revertOnFail: boolean
}

export interface TransferAssetAction {
  bentobox: Contract
  tokenAddress: string
  fromAddress: string
  toAddress: string
  share: BigNumber
}

export interface MasterContractApprovalAction {
  bentobox: Contract
  account: string
  masterContract: string
  permit: Signature
}
