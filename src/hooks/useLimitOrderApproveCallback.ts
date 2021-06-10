import { useActiveWeb3React } from './useActiveWeb3React'
import { LIMIT_ORDER_ADDRESS } from '../constants/limit-order'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useBentoBoxContract } from './useContract'
import {
    BentoApprovalState,
    BentoApproveOutcome,
    BentoApproveResult,
    KashiPermit,
} from './useKashiApproveCallback'
import { useBentoMasterContractAllowed } from '../state/bentobox/hooks'
import { ethers } from 'ethers'
import { signMasterContractApproval } from '../entities/KashiCooker'
import { useLimitOrderApprovalPending } from '../state/limit-order/hooks'
import { useDispatch } from 'react-redux'
import { setLimitOrderApprovalPending } from '../state/limit-order/actions'
import { LimitOrder } from 'limitorderv2-sdk'
import { TokenAmount } from '@sushiswap/sdk'
import { e10 } from '../functions'

const useLimitOrderApproveCallback = () => {
    const { account, library, chainId } = useActiveWeb3React()
    const dispatch = useDispatch()

    const [approveLimitOrderFallback, setApproveLimitOrderFallback] =
        useState<boolean>(false)
    const [limitOrderPermit, setLimitOrderPermit] = useState<
        KashiPermit | undefined
    >(undefined)

    useEffect(() => {
        setLimitOrderPermit(undefined)
    }, [account, chainId])

    const masterContract = chainId && LIMIT_ORDER_ADDRESS[chainId]

    const pendingApproval = useLimitOrderApprovalPending()
    const currentAllowed = useBentoMasterContractAllowed(
        masterContract,
        account || ethers.constants.AddressZero
    )

    // check the current approval status
    const approvalState: BentoApprovalState = useMemo(() => {
        if (!masterContract) return BentoApprovalState.UNKNOWN
        if (!currentAllowed && pendingApproval)
            return BentoApprovalState.PENDING

        return currentAllowed
            ? BentoApprovalState.APPROVED
            : BentoApprovalState.NOT_APPROVED
    }, [masterContract, currentAllowed, pendingApproval])

    const bentoBoxContract = useBentoBoxContract()

    const approve = useCallback(async (): Promise<BentoApproveResult> => {
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
            const signature = await signMasterContractApproval(
                bentoBoxContract,
                masterContract,
                account,
                library,
                true,
                chainId
            )
            const { v, r, s } = ethers.utils.splitSignature(signature)
            const tx = await bentoBoxContract?.setMasterContractApproval(
                account,
                masterContract,
                true,
                v,
                r,
                s
            )
            dispatch(setLimitOrderApprovalPending('Approve Limit Order'))
            await tx.wait()
            dispatch(setLimitOrderApprovalPending(''))
        } catch (e) {
            dispatch(setLimitOrderApprovalPending(''))
        }
    }, [
        approvalState,
        account,
        library,
        chainId,
        bentoBoxContract,
        masterContract,
    ])

    const placeLimitOrder = async function () {}

    return [
        approvalState,
        approveLimitOrderFallback,
        limitOrderPermit,
        approve,
        placeLimitOrder,
    ]
}

export default useLimitOrderApproveCallback
