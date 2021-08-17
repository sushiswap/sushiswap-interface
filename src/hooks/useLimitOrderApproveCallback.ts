import { ZERO, calculateGasMargin } from '../functions'
import { getSignatureWithProviderBentobox, getVerifyingContract } from 'limitorderv2-sdk'
import { setFromBentoBalance, setLimitOrderApprovalPending } from '../state/limit-order/actions'
import { useBentoBoxContract, useLimitOrderHelperContract } from './useContract'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useDerivedLimitOrderInfo, useLimitOrderApprovalPending, useLimitOrderState } from '../state/limit-order/hooks'

import { Field } from '../state/swap/actions'
import { AddressZero, HashZero } from '@ethersproject/constants'
import { getAddress } from '@ethersproject/address'
import { Token } from '@sushiswap/sdk'
import { useActiveWeb3React } from './useActiveWeb3React'
import { useBentoMasterContractAllowed } from '../state/bentobox/hooks'
import { useDispatch } from 'react-redux'
import { useTransactionAdder } from '../state/transactions/hooks'

export enum BentoApprovalState {
  UNKNOWN,
  NOT_APPROVED,
  PENDING,
  FAILED,
  APPROVED,
}

export enum BentoApproveOutcome {
  SUCCESS,
  REJECTED,
  FAILED,
  NOT_READY,
}

const useLimitOrderApproveCallback = () => {
  const { account, library, chainId } = useActiveWeb3React()
  const dispatch = useDispatch()

  const { fromBentoBalance } = useLimitOrderState()
  const { parsedAmounts } = useDerivedLimitOrderInfo()
  const [fallback, setFallback] = useState(false)
  const [limitOrderPermit, setLimitOrderPermit] = useState(undefined)

  useEffect(() => {
    setLimitOrderPermit(undefined)
  }, [account, chainId])

  const masterContract = chainId && getVerifyingContract(chainId)

  const pendingApproval = useLimitOrderApprovalPending()
  const currentAllowed = useBentoMasterContractAllowed(masterContract, account || AddressZero)
  const addTransaction = useTransactionAdder()

  // check the current approval status
  const approvalState: BentoApprovalState = useMemo(() => {
    if (!masterContract) return BentoApprovalState.UNKNOWN
    if (!currentAllowed && pendingApproval) return BentoApprovalState.PENDING

    return currentAllowed ? BentoApprovalState.APPROVED : BentoApprovalState.NOT_APPROVED
  }, [masterContract, currentAllowed, pendingApproval])

  const bentoBoxContract = useBentoBoxContract()
  const limitOrderHelperContract = useLimitOrderHelperContract()

  const approve = useCallback(async () => {
    if (approvalState !== BentoApprovalState.NOT_APPROVED) {
      console.error('approve was called unnecessarily')
      return { outcome: BentoApproveOutcome.NOT_READY }
    }

    if (!masterContract) {
      console.error('no token')
      return { outcome: BentoApproveOutcome.NOT_READY }
    }

    if (!bentoBoxContract) {
      console.error('no bentobox contract')
      return { outcome: BentoApproveOutcome.NOT_READY }
    }

    if (!account) {
      console.error('no account')
      return { outcome: BentoApproveOutcome.NOT_READY }
    }

    if (!library) {
      console.error('no library')
      return { outcome: BentoApproveOutcome.NOT_READY }
    }

    try {
      const nonce = await bentoBoxContract?.nonces(account)
      const { v, r, s } = await getSignatureWithProviderBentobox(
        {
          warning: 'Give FULL access to funds in (and approved to) BentoBox?',
          user: account,
          masterContract,
          approved: true,
          nonce: nonce.toString(),
        },
        chainId,
        library
      )

      return {
        outcome: BentoApproveOutcome.SUCCESS,
        signature: { v, r, s },
        data: bentoBoxContract?.interface?.encodeFunctionData('setMasterContractApproval', [
          account,
          masterContract,
          true,
          v,
          r,
          s,
        ]),
      }
    } catch (e) {
      console.log(e)
      return {
        outcome: e.code === 4001 ? BentoApproveOutcome.REJECTED : BentoApproveOutcome.FAILED,
      }
    }
  }, [approvalState, account, library, chainId, bentoBoxContract, masterContract])

  const onApprove = async function () {
    if (fallback) {
      const tx = await bentoBoxContract?.setMasterContractApproval(account, masterContract, true, 0, HashZero, HashZero)
      dispatch(setLimitOrderApprovalPending('Approve Limit Order'))
      await tx.wait()
      dispatch(setLimitOrderApprovalPending(''))
    } else {
      const { outcome, signature, data } = await approve()

      if (outcome === BentoApproveOutcome.SUCCESS) setLimitOrderPermit({ signature, data })
      else setFallback(true)
    }
  }

  const execute = async function (token: Token) {
    const summary = []
    const batch = []
    const amount = parsedAmounts[Field.INPUT].quotient.toString()

    // Since the setMasterContractApproval is not payable, we can't batch native deposit and approve
    // For this case, we setup a helper contract
    if (token.isNative && approvalState === BentoApprovalState.NOT_APPROVED && limitOrderPermit && !fromBentoBalance) {
      summary.push(`Approve Limit Order and Deposit ${token.symbol} into BentoBox`)
      const {
        signature: { v, r, s },
      } = limitOrderPermit

      const estimatedGas = await limitOrderHelperContract?.estimateGas.depositAndApprove(
        account,
        masterContract,
        true,
        v,
        r,
        s,
        {
          value: amount,
        }
      )

      const tx = await limitOrderHelperContract?.depositAndApprove(account, masterContract, true, v, r, s, {
        value: amount,
        gasLimit: calculateGasMargin(estimatedGas),
      })

      addTransaction(tx, { summary: summary.join('') })
      setLimitOrderPermit(undefined)
      return tx
    }

    // If bento is not yet approved but we do have the permit, add the permit to the batch
    if (approvalState === BentoApprovalState.NOT_APPROVED && limitOrderPermit) {
      batch.push(limitOrderPermit.data)
      summary.push('Approve Limit Order')
    }

    if (!fromBentoBalance) {
      summary.push(`Deposit ${token.symbol} into BentoBox`)
      if (token.isNative) {
        batch.push(
          bentoBoxContract?.interface?.encodeFunctionData('deposit', [AddressZero, account, account, amount, 0])
        )
      } else {
        batch.push(
          bentoBoxContract?.interface?.encodeFunctionData('deposit', [
            getAddress(token.wrapped.address),
            account,
            account,
            amount,
            0,
          ])
        )
      }
    }

    const tx = await bentoBoxContract?.batch(batch, true, {
      value: token.isNative ? amount : ZERO,
    })
    addTransaction(tx, { summary: summary.join(', ') })
    setLimitOrderPermit(undefined)
    return tx
  }

  return [approvalState, fallback, limitOrderPermit, onApprove, execute]
}

export default useLimitOrderApproveCallback
