import { Token, TokenAmount, WETH } from '@sushiswap/sdk'
import { ApprovalState, useApproveCallback } from 'hooks/useApproveCallback'
import { BENTOBOX_ADDRESS } from 'kashi'
import { Button } from 'components'
import React, { useState } from 'react'
import useBentoBox from 'hooks/useBentoBox'
import useTokenBalance from 'hooks/useTokenBalance'
import { Input as NumericalInput } from 'components/NumericalInput'
import { useActiveWeb3React } from 'hooks/useActiveWeb3React'
import { formattedNum } from 'utils'
import { Dots } from '../../Pool/styleds'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'

export default function Deposit({
    tokenAddress,
    tokenSymbol
}: {
    tokenAddress: string
    tokenSymbol: string
}): JSX.Element {
    const { i18n } = useLingui()
    const { account, chainId } = useActiveWeb3React()

    const { deposit } = useBentoBox()

    const balance = useTokenBalance(tokenAddress)

    const [value, setValue] = useState('')

    const [pendingTx, setPendingTx] = useState(false)

    const [approvalState, approve] = useApproveCallback(
        new TokenAmount(
            new Token(chainId || 1, tokenAddress, balance.decimals, tokenSymbol, ''),
            value.toBigNumber(balance.decimals).toString()
        ),
        chainId && BENTOBOX_ADDRESS[chainId]
    )

    const showApprove =
        chainId &&
        tokenAddress !== WETH[chainId].address &&
        (approvalState === ApprovalState.NOT_APPROVED || approvalState === ApprovalState.PENDING)

    return (
        <>
            {account && (
                <div className="text-sm text-secondary cursor-pointer text-right mb-2 pr-4">
                    {i18n._(t`Wallet Balance`)}: {formattedNum(balance.value.toFixed(balance.decimals))}
                </div>
            )}
            <div className="flex items-center relative w-full mb-4">
                <NumericalInput
                    className="w-full p-3 bg-input rounded focus:ring focus:ring-blue"
                    value={value}
                    onUserInput={value => {
                        setValue(value)
                    }}
                />
                {account && (
                    <Button
                        variant="outlined"
                        color="blue"
                        size="small"
                        onClick={() => {
                            setValue(balance.value.toFixed(balance.decimals))
                        }}
                        className="absolute right-4 focus:ring focus:ring-blue"
                    >
                        {i18n._(t`MAX`)}
                    </Button>
                )}
            </div>

            {showApprove && (
                <Button color="blue" disabled={approvalState === ApprovalState.PENDING} onClick={approve}>
                    {approvalState === ApprovalState.PENDING ? (
                        <Dots>{i18n._(t`Approving`)} </Dots>
                    ) : (
                        i18n._(t`Approve`)
                    )}
                </Button>
            )}
            {!showApprove && (
                <Button
                    color="blue"
                    disabled={pendingTx || !balance || value.toBigNumber(balance.decimals).lte(0)}
                    onClick={async () => {
                        setPendingTx(true)
                        await deposit(tokenAddress, value.toBigNumber(balance.decimals))
                        setPendingTx(false)
                    }}
                >
                    {i18n._(t`Deposit`)}
                </Button>
            )}
        </>
    )
}
