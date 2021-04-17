import { BentoApprovalState, useKashiApproveCallback } from 'kashi/hooks'
import React from 'react'
import styled from 'styled-components'
import Button from './Button'
import Alert from './Alert'
import { BENTOBOX_ADDRESS, KASHI_ADDRESS } from 'kashi/constants'
import { ApprovalState, useApproveCallback } from 'hooks/useApproveCallback'
import { tryParseAmount } from 'state/swap/hooks'
import { useActiveWeb3React } from 'hooks'
import { WETH } from '@sushiswap/sdk'

export const MovingDots = styled.span`
    &::after {
        display: inline-block;
        animation: ellipsis 1.25s infinite;
        content: '.';
        width: 1em;
        text-align: left;
    }
    @keyframes ellipsis {
        0% {
            content: '.';
        }
        33% {
            content: '..';
        }
        66% {
            content: '...';
        }
    }
`

type Props = {
    children: any
    pending: boolean,
    pendingTitle: string
}

export default function Dots({children, pending, pendingTitle}: Props): any {
    return pending ? (<MovingDots>{pendingTitle}</MovingDots>) : children
}

export function KashiApproveButton({content, color}: any): any {
    const [kashiApprovalState, approveKashiFallback, kashiPermit, onApprove, onCook] = useKashiApproveCallback(
        KASHI_ADDRESS
    )
    const showApprove = (kashiApprovalState === BentoApprovalState.NOT_APPROVED || kashiApprovalState === BentoApprovalState.PENDING) && !kashiPermit
    const showChildren = kashiApprovalState === BentoApprovalState.APPROVED || kashiPermit

    return <>
        {approveKashiFallback && (
            <Alert
                message="Something went wrong during signing of the approval. This is expected for hardware wallets, such as Trezor and Ledger. Click again and the fallback method will be used."
                className="mb-4"
            />
        )}
        
        {showApprove && (
            <Button color={color} onClick={onApprove} className="mb-4">
                Approve Kashi
            </Button>
        )}
        
        {showChildren && (
            React.cloneElement(content(onCook), {color})
        )}        
    </>
}

export function TokenApproveButton({children, value, token, needed, color}: any): any {
    const { chainId } = useActiveWeb3React()
    const [approvalState, approve] = useApproveCallback(tryParseAmount(value, token), BENTOBOX_ADDRESS)

    const showApprove =
        chainId && token &&
        token.address !== WETH[chainId].address &&
        needed &&
        value &&
        (approvalState === ApprovalState.NOT_APPROVED || approvalState === ApprovalState.PENDING)

    return showApprove ? (
            <Button color={color} onClick={approve} className="mb-4">
                <Dots pending={approvalState === ApprovalState.PENDING} pendingTitle={`Approving ${token.symbol}`}>
                    Approve {token.symbol}
                </Dots>
            </Button>
        ) : React.cloneElement(children, {color})
}
