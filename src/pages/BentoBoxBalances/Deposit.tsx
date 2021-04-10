import React, { useState } from 'react'
import { Input as NumericalInput } from '../../components/NumericalInput'
import { Dots } from '../Pool/styleds'
import { useActiveWeb3React } from '../../hooks'
import useBentoBox from 'sushi-hooks/useBentoBox'
import useTokenBalance from 'sushi-hooks/useTokenBalance'
import { formattedNum } from '../../utils'
import { ApprovalState, useApproveCallback } from 'hooks/useApproveCallback'
import { Token, TokenAmount } from '@sushiswap/sdk'
import { BENTOBOX_ADDRESS } from 'kashi'
import { Button } from 'kashi/components'

export default function Deposit({
    tokenAddress,
    tokenSymbol
}: {
    tokenAddress: string
    tokenSymbol: string
}): JSX.Element {
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
        BENTOBOX_ADDRESS
    )

    return (
        <>
            {account && (
                <div className="text-sm text-secondary cursor-pointer text-right mb-2 pr-4">
                    Wallet Balance: {formattedNum(balance.value.toFixed(balance.decimals))}
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
                        onClick={() => {
                            setValue(balance.value.toFixed(balance.decimals))
                        }}
                        className="absolute right-4 focus:ring focus:ring-blue"
                    >
                        MAX
                    </Button>
                )}
            </div>

            {(approvalState === ApprovalState.NOT_APPROVED || approvalState === ApprovalState.PENDING) && (
                <Button color="blue" disabled={approvalState === ApprovalState.PENDING} onClick={approve}>
                    {approvalState === ApprovalState.PENDING ? <Dots>Approving </Dots> : 'Approve'}
                </Button>
            )}
            {approvalState === ApprovalState.APPROVED && (
                <Button
                    color="blue"
                    disabled={
                        pendingTx ||
                        !balance ||
                        value.toBigNumber(balance.decimals).lte(0)
                    }
                    onClick={async () => {
                        setPendingTx(true)
                        await deposit(tokenAddress, value.toBigNumber(balance.decimals))
                        setPendingTx(false)
                    }}
                >
                    Deposit
                </Button>
            )}
        </>
    )
}
