import React from 'react'
import { BENTOBOX_ADDRESS, KASHI_ADDRESS } from 'kashi/constants'
import { BentoApprovalState, useKashiApproveCallback } from 'kashi/hooks'
import { Alert, Button } from 'components'
import { useActiveWeb3React } from 'hooks/useActiveWeb3React'
import { ApprovalState, useApproveCallback } from 'hooks/useApproveCallback'
import { tryParseAmount } from 'state/swap/hooks'
import { WETH } from '@sushiswap/sdk'
import Dots from './Dots'
import { t } from '@lingui/macro'

export function KashiApproveButton({ content, color }: any): any {
    const { chainId } = useActiveWeb3React()
    const [kashiApprovalState, approveKashiFallback, kashiPermit, onApprove, onCook] = useKashiApproveCallback()
    const showApprove =
        (kashiApprovalState === BentoApprovalState.NOT_APPROVED || kashiApprovalState === BentoApprovalState.PENDING) &&
        !kashiPermit
    const showChildren = kashiApprovalState === BentoApprovalState.APPROVED || kashiPermit

    return (
        <>
            {approveKashiFallback && (
                <Alert
                    message={t`Something went wrong during signing of the approval. This is expected for hardware wallets, such as Trezor and Ledger. Click again and the fallback method will be used`}
                    className="mb-4"
                />
            )}

            {showApprove && (
                <Button color={color} onClick={onApprove} className="mb-4">
                    {t`Approve Kashi`}
                </Button>
            )}

            {showChildren && React.cloneElement(content(onCook), { color })}
        </>
    )
}

export function TokenApproveButton({ children, value, token, needed, color }: any): any {
    const { chainId } = useActiveWeb3React()
    const [approvalState, approve] = useApproveCallback(
        tryParseAmount(value, token),
        chainId && BENTOBOX_ADDRESS[chainId]
    )

    const showApprove =
        chainId &&
        token &&
        token.address !== WETH[chainId].address &&
        needed &&
        value &&
        (approvalState === ApprovalState.NOT_APPROVED || approvalState === ApprovalState.PENDING)

    return showApprove ? (
        <Button color={color} onClick={approve} className="mb-4">
            <Dots pending={approvalState === ApprovalState.PENDING} pendingTitle={`Approving ${token.symbol}`}>
                {t`Approve`} {token.symbol}
            </Dots>
        </Button>
    ) : (
        React.cloneElement(children, { color })
    )
}
