import { useLingui } from '@lingui/react'
import { BentoApprovalState } from '../../hooks/useKashiApproveCallback'
import Alert from '../../components/Alert'
import { t } from '@lingui/macro'
import Button, { ButtonProps } from '../../components/Button'
import React, { FC } from 'react'
import useLimitOrderApproveCallback from '../../hooks/useLimitOrderApproveCallback'

interface KashiApproveButtonProps extends ButtonProps {
    content: any
}

export const LimitOrderApproveButton: FC<KashiApproveButtonProps> = ({
    content,
    color,
    ...rest
}) => {
    const { i18n } = useLingui()
    const [approvalState, fallback, permit, approve, createLimitOrder] =
        useLimitOrderApproveCallback()

    const showApprove =
        (approvalState === BentoApprovalState.NOT_APPROVED ||
            approvalState === BentoApprovalState.PENDING) &&
        !permit
    const showChildren = approvalState === BentoApprovalState.APPROVED || permit

    return (
        <>
            {fallback && (
                <Alert
                    message={i18n._(
                        t`Something went wrong during signing of the approval. This is expected for hardware wallets, such as Trezor and Ledger. Click again and the fallback method will be used`
                    )}
                    className="mb-4"
                />
            )}

            {showApprove && (
                <Button color={color} onClick={approve} {...rest}>
                    {i18n._(t`Approve Limit Order`)}
                </Button>
            )}

            {showChildren &&
                React.cloneElement(content(createLimitOrder), { color })}
        </>
    )
}

export default LimitOrderApproveButton
