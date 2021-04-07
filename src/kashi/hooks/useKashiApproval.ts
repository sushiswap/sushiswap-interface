import { useBentoMasterContractAllowed } from 'data/Allowances'
import { ethers } from 'ethers'
import { useActiveWeb3React } from 'hooks'
import { KASHI_ADDRESS } from 'kashi/constants'
import { signMasterContractApproval } from 'kashi/entities/KashiCooker'
import { useCallback, useMemo } from 'react'
import { useTransactionAdder } from 'state/transactions/hooks'
import { useBentoBoxContract } from 'sushi-hooks/useContract'
import { TransactionResponse } from '@ethersproject/providers'

export enum ApprovalState {
  UNKNOWN,
  NOT_APPROVED,
  PENDING,
  FAILED,
  APPROVED
}

// returns a variable indicating the state of the approval and a function which approves if necessary or early returns
export function useKashiApproveCallback(masterContract: string): [ApprovalState, () => Promise<void>] {
  const { account, library, chainId } = useActiveWeb3React()
  const pendingApproval = false
  const currentAllowed = useBentoMasterContractAllowed(KASHI_ADDRESS, account || ethers.constants.AddressZero)

  // check the current approval status
  const approvalState: ApprovalState = useMemo(() => {
    if (!masterContract) return ApprovalState.UNKNOWN
    if (pendingApproval) return ApprovalState.PENDING

    return currentAllowed ? ApprovalState.APPROVED : ApprovalState.NOT_APPROVED
  }, [currentAllowed, masterContract, pendingApproval])

  const bentoBoxContract = useBentoBoxContract()
  const addTransaction = useTransactionAdder()

  const approve = useCallback(async (): Promise<void> => {
    if (approvalState !== ApprovalState.NOT_APPROVED) {
      console.error('approve was called unnecessarily')
      return
    }
    if (!masterContract) {
      console.error('no token')
      return
    }

    if (!bentoBoxContract) {
      console.error('no bentobox contract')
      return
    }

    if (!account) {
      console.error('no account')
      return
    }
    if (!library) {
      console.error('no library')
      return
    }

    const signature = await signMasterContractApproval(bentoBoxContract, KASHI_ADDRESS, account, library, true, chainId)

    const { v, r, s } = ethers.utils.splitSignature(signature)

    // const options = {
    //   gasLimit: calculateGasMargin(estimatedGas)
    // }

    return bentoBoxContract
      .setMasterContractApproval(account, masterContract, true, v, r, s)
      .then((response: TransactionResponse) => {
        addTransaction(response, {
          summary: 'Approve BentoBox'
          // summary: 'Approve ' + amountToApprove.currency.symbol,
          // approval: { tokenAddress: token.address, spender: spender }
        })
      })
      .catch((error: Error) => {
        console.debug('Failed to approve token', error)
        throw error
      })

    /*return bentoBoxContract
      .approve(spender, useExact ? amountToApprove.raw.toString() : MaxUint256, {
        gasLimit: calculateGasMargin(estimatedGas)
      })
      .then((response: TransactionResponse) => {
        addTransaction(response, {
          summary: 'Approve ' + amountToApprove.currency.symbol,
          approval: { tokenAddress: token.address, spender: spender }
        })
      })
      .catch((error: Error) => {
        console.debug('Failed to approve token', error)
        throw error
      })*/
  }, [approvalState, account, library, chainId, bentoBoxContract, masterContract, addTransaction])

  return [approvalState, approve]
}
