import { MaxUint256 } from '@ethersproject/constants'
import { TransactionResponse } from '@ethersproject/providers'
import { useCallback, useMemo } from 'react'
import { useTokenAllowance } from './useTokenAllowance'
import { useTransactionAdder, useHasPendingApproval } from '../state/transactions/hooks'
import { calculateGasMargin } from '../utils'
import { useTokenContract } from './useContract'
import { useActiveWeb3React } from '../hooks'
import { ethers } from 'ethers'
const { BigNumber } = ethers

export enum ApprovalState {
  UNKNOWN,
  NOT_APPROVED,
  PENDING,
  APPROVED
}

// returns a variable indicating the state of the approval and a function which approves if necessary or early returns
export function useApproveCallback(tokenAddress?: string, spender?: string): [ApprovalState, () => Promise<void>] {
  const { account } = useActiveWeb3React()
  const currentAllowance = useTokenAllowance(tokenAddress, account ?? undefined, spender)
  const pendingApproval = useHasPendingApproval(tokenAddress, spender)

  // check the current approval status
  const approvalState: ApprovalState = useMemo(() => {
    //if (!amountToApprove || !spender) return ApprovalState.UNKNOWN
    // todo:
    // if (tokenAddress === ETHER) return ApprovalState.APPROVED
    // we might not have enough data to know whether or not we need to approve
    if (!currentAllowance) return ApprovalState.UNKNOWN

    // amountToApprove will be defined if currentAllowance is
    // todo: need to refactor to better comparison, this comparison is somewhat naive
    return BigNumber.from(currentAllowance).gt(BigNumber.from(0))
      ? pendingApproval
        ? ApprovalState.PENDING
        : ApprovalState.APPROVED
      : ApprovalState.NOT_APPROVED
  }, [currentAllowance, pendingApproval])

  const tokenContract = useTokenContract(tokenAddress)
  const addTransaction = useTransactionAdder()

  console.log('approval logs:', {
    account: account,
    currentAllowance: currentAllowance,
    pendingApproval: pendingApproval,
    tokenAddress: tokenAddress,
    spender: spender,
    approvalState: approvalState,
    tokenContract: tokenContract
  })

  const approve = useCallback(async (): Promise<void> => {
    console.log('approvalState:', approvalState)
    if (approvalState !== ApprovalState.NOT_APPROVED) {
      console.error('approve was called unnecessarily')
      return
    }
    if (!tokenAddress) {
      console.error('no token address')
      return
    }

    if (!tokenContract) {
      console.error('tokenContract is null')
      return
    }

    // if (!amountToApprove) {
    //   console.error('missing amount to approve')
    //   return
    // }

    if (!spender) {
      console.error('no spender')
      return
    }

    let useExact = false
    const estimatedGas = await tokenContract.estimateGas.approve(spender, MaxUint256).catch(() => {
      // general fallback for tokens who restrict approval amounts
      useExact = true
      return tokenContract.estimateGas.approve(spender, ethers.constants.MaxUint256.toString())
    })

    return tokenContract
      .approve(spender, MaxUint256, {
        // Approve Max
        gasLimit: calculateGasMargin(estimatedGas)
      })
      .then((response: TransactionResponse) => {
        addTransaction(response, {
          summary: 'Approve ',
          approval: { tokenAddress: tokenAddress, spender: spender }
        })
      })
      .catch((error: Error) => {
        console.debug('Failed to approve token', error)
        throw error
      })
  }, [approvalState, tokenAddress, tokenContract, spender, addTransaction])

  return [approvalState, approve]
}
