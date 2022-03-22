import { getAddress } from '@ethersproject/address'
import { AddressZero } from '@ethersproject/constants'
import { WNATIVE_ADDRESS } from '@sushiswap/core-sdk'
import { Action, DepositActionPayload, HarvestAction, WithdrawAction } from 'app/hooks/useBentoBox/types'

export const depositAction: Action<DepositActionPayload> = ({ bentobox, tokenAddress, amount, account, chainId }) => {
  const checksumAddress = getAddress(tokenAddress)
  if (checksumAddress === WNATIVE_ADDRESS[chainId]) {
    return {
      data: bentobox.interface.encodeFunctionData('deposit', [AddressZero, account, account, amount, 0]),
      value: amount,
    }
  } else {
    return { data: bentobox.interface.encodeFunctionData('deposit', [checksumAddress, account, account, amount, 0]) }
  }
}

export const withdrawAction: Action<WithdrawAction> = ({ bentobox, tokenAddress, amount, account, chainId, share }) => {
  const checksumAddress = getAddress(tokenAddress)
  return {
    data: bentobox.interface.encodeFunctionData('withdraw', [
      checksumAddress === WNATIVE_ADDRESS[chainId] ? AddressZero : checksumAddress,
      account,
      account,
      amount,
      share ? share.toString() : 0,
    ]),
  }
}

export const harvestAction: Action<HarvestAction> = ({ bentobox, tokenAddress, rebalance }) => {
  return { data: bentobox.interface.encodeFunctionData('harvest', [tokenAddress, rebalance, 0]) }
}
