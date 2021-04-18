import React from 'react'
import { useHistory } from 'react-router-dom'
import { ChevronLeft } from 'react-feather'
import { BENTOBOX_ADDRESS, KASHI_ADDRESS } from 'kashi/constants'
import { BentoApprovalState, useKashiApproveCallback } from 'kashi/hooks'
import { Alert, Dots } from '.'
import { useActiveWeb3React } from 'hooks'
import { ApprovalState, useApproveCallback } from 'hooks/useApproveCallback'
import { tryParseAmount } from 'state/swap/hooks'
import { WETH } from '@sushiswap/sdk'

const FILLED = {
    default: '',
    blue: 'bg-blue bg-opacity-80 w-full rounded text-base text-high-emphesis px-4 py-3 hover:bg-opacity-100',
    pink: 'bg-pink bg-opacity-80 w-full rounded text-base text-high-emphesis px-4 py-3 hover:bg-opacity-100',
    gradient: 'bg-gradient-to-r from-blue to-pink'
}

const OUTLINED = {
    default: '',
    blue: 'bg-blue bg-opacity-20 outline-blue rounded text-xs text-blue px-2 py-1 hover:bg-opacity-40',
    pink: 'bg-pink bg-opacity-20 outline-pink rounded text-xs text-pink px-2 py-1 hover:bg-opacity-40',
    gradient: 'bg-gradient-to-r from-blue to-pink'
}

const VARIANT = {
    outlined: OUTLINED,
    filled: FILLED
    // gradient: 'bg-gradient-to-r from-blue to-pink'
}

export type ButtonColor = 'blue' | 'pink' | 'gradient' | 'default'

export type ButtonVariant = 'outlined' | 'filled'

export interface ButtonProps {
    children?: React.ReactChild | React.ReactChild[]
    color?: ButtonColor
    variant?: ButtonVariant
}

function Button({
    children,
    className,
    color = 'default',
    variant = 'filled',
    ...rest
}: ButtonProps & React.ButtonHTMLAttributes<HTMLButtonElement>): JSX.Element {
    return (
        <button
            className={`${VARIANT[variant][color]} focus:outline-none focus:ring disabled:opacity-50 ${className}`}
            {...rest}
        >
            {children}
        </button>
    )
}

export default Button

export function BackButton({ defaultRoute, className }: { defaultRoute: string; className?: string }): JSX.Element {
    const history = useHistory()
    return (
        <Button
            onClick={() => {
                if (history.length < 3) {
                    history.push(defaultRoute)
                } else {
                    history.goBack()
                }
            }}
            className={`p-2 mr-4 rounded-full bg-dark-900 w-10 h-10 ${className || ''}`}
        >
            <ChevronLeft className={'w-6 h-6'} />
        </Button>
    )
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
