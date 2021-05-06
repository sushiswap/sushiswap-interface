import { BigNumber } from '@ethersproject/bignumber'
import { MASTERCHEF_ADDRESS, Token, TokenAmount } from '@sushiswap/sdk'
import { Input as NumericalInput } from '../../../components/NumericalInput'
import { Fraction } from '../../../entities'
import { ethers } from 'ethers'
import { useActiveWeb3React } from '../../../hooks/useActiveWeb3React'
import { ApprovalState, useApproveCallback } from '../../../hooks/useApproveCallback'
import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import useMasterChef from '../../../hooks/useMasterChef'
import usePendingSushi from '../../../hooks/usePendingSushi'
import useStakedBalance from '../../../hooks/useStakedBalance'
import useTokenBalance from '../../../hooks/useTokenBalance'
import { formattedNum, isAddressString, isWETH } from 'utils'
import { Dots } from '../../Pool/styleds'
import { Button } from '../components'
import { t } from '@lingui/macro'

import { tryParseAmount } from '../../../state/swap/hooks'

const fixedFormatting = (value: BigNumber, decimals?: number) => {
    return Fraction.from(value, BigNumber.from(10).pow(BigNumber.from(decimals))).toString(decimals)
}

export default function InputGroup({
    pairAddress,
    pid,
    pairSymbol,
    token0Address,
    token1Address,
    type,
    assetSymbol,
    assetDecimals = 18
}: {
    pairAddress: string
    pid: number
    pairSymbol: string
    token0Address: string
    token1Address: string
    type?: string
    assetSymbol?: string
    assetDecimals?: number
}): JSX.Element {
    const history = useHistory()
    const { account, chainId } = useActiveWeb3React()
    const [pendingTx, setPendingTx] = useState(false)
    const [depositValue, setDepositValue] = useState('')
    const [withdrawValue, setWithdrawValue] = useState('')

    const pairAddressChecksum = isAddressString(pairAddress)

    //const { deposit } = useBentoBox()
    const balance = useTokenBalance(pairAddressChecksum)
    const staked = useStakedBalance(pid, assetDecimals) // kMP depends on decimals of asset, SLP is always 18
    const pending = usePendingSushi(pid)

    //console.log('pending:', pending, pid)

    const [approvalState, approve] = useApproveCallback(
        tryParseAmount(depositValue, new Token(chainId || 1, pairAddressChecksum, balance.decimals, pairSymbol, '')),
        MASTERCHEF_ADDRESS[1]
    )

    const { deposit, withdraw, harvest } = useMasterChef()

    //console.log('depositValue:', depositValue)

    return (
        <>
            <div className="flex flex-col space-y-4 py-6">
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 px-4">
                    {type === 'LP' && (
                        <>
                            <Button
                                color="default"
                                onClick={() => history.push(`/add/${isWETH(token0Address)}/${isWETH(token1Address)}`)}
                            >
                                {t`Add Liquidity`}
                            </Button>
                            <Button
                                color="default"
                                onClick={() =>
                                    history.push(`/remove/${isWETH(token0Address)}/${isWETH(token1Address)}`)
                                }
                            >
                                {t`Remove Liquidity`}
                            </Button>
                        </>
                    )}
                    {type === 'KMP' && assetSymbol && (
                        <>
                            <Button
                                color="default"
                                onClick={() => history.push(`/bento/kashi/lend/${isWETH(pairAddress)}`)}
                            >
                                {t`Lend ${assetSymbol}`}
                            </Button>
                            <Button
                                color="default"
                                onClick={() => history.push(`/bento/kashi/lend/${isWETH(pairAddress)}`)}
                            >
                                {t`Withdraw ${assetSymbol}`}
                            </Button>
                        </>
                    )}
                </div>

                <div className="grid gap-4 grid-cols-2 px-4">
                    {/* Deposit */}
                    <div className="text-center col-span-2 md:col-span-1">
                        {account && (
                            <div className="text-sm text-secondary cursor-pointer text-right mb-2 pr-4">
                                {t`Wallet Balance`}: {formattedNum(fixedFormatting(balance.value, balance.decimals))}{' '}
                                {type}
                            </div>
                        )}
                        <div className="flex items-center relative w-full mb-4">
                            <NumericalInput
                                className="w-full p-3 bg-input rounded focus:ring focus:ring-blue pr-20"
                                value={depositValue}
                                onUserInput={value => {
                                    setDepositValue(value)
                                }}
                            />
                            {account && (
                                <Button
                                    variant="outlined"
                                    color="blue"
                                    onClick={() => {
                                        setDepositValue(fixedFormatting(balance.value, balance.decimals))
                                    }}
                                    className="absolute right-4 focus:ring focus:ring-blue border-0"
                                >
                                    {t`MAX`}
                                </Button>
                            )}
                        </div>
                        {approvalState === ApprovalState.NOT_APPROVED || approvalState === ApprovalState.PENDING ? (
                            <Button color="blue" disabled={approvalState === ApprovalState.PENDING} onClick={approve}>
                                {approvalState === ApprovalState.PENDING ? <Dots>Approving </Dots> : 'Approve'}
                            </Button>
                        ) : (
                            <Button
                                color="blue"
                                disabled={
                                    pendingTx ||
                                    !balance ||
                                    Number(depositValue) === 0 ||
                                    Number(depositValue) > Number(fixedFormatting(balance.value, balance.decimals))
                                }
                                onClick={async () => {
                                    setPendingTx(true)
                                    await deposit(pid, depositValue, pairSymbol, balance.decimals)
                                    setPendingTx(false)
                                }}
                            >
                                {t`Deposit`}
                            </Button>
                        )}
                    </div>
                    {/* Withdraw */}
                    <div className="text-center col-span-2 md:col-span-1">
                        {account && (
                            <div className="text-sm text-secondary cursor-pointer text-right mb-2 pr-4">
                                {t`Deposited`}: {formattedNum(fixedFormatting(staked.value, staked.decimals))} {type}
                            </div>
                        )}
                        <div className="flex items-center relative w-full mb-4">
                            <NumericalInput
                                className="w-full p-3 bg-input rounded focus:ring focus:ring-pink pr-20"
                                value={withdrawValue}
                                onUserInput={value => {
                                    setWithdrawValue(value)
                                }}
                            />
                            {account && (
                                <Button
                                    variant="outlined"
                                    color="pink"
                                    onClick={() => {
                                        setWithdrawValue(fixedFormatting(staked.value, staked.decimals))
                                    }}
                                    className="absolute right-4 focus:ring focus:ring-pink border-0"
                                >
                                    {t`MAX`}
                                </Button>
                            )}
                        </div>
                        <Button
                            color="pink"
                            className="border-0"
                            disabled={
                                pendingTx ||
                                Number(withdrawValue) === 0 ||
                                Number(withdrawValue) > Number(fixedFormatting(staked.value, staked.decimals))
                            }
                            onClick={async () => {
                                setPendingTx(true)
                                await withdraw(pid, withdrawValue, pairSymbol, balance.decimals)
                                setPendingTx(false)
                            }}
                        >
                            {t`Withdraw`}
                        </Button>
                    </div>
                </div>
                {pending && Number(pending) > 0 && (
                    <div className=" px-4">
                        <Button
                            color="default"
                            onClick={async () => {
                                setPendingTx(true)
                                await harvest(pid, pairSymbol)
                                setPendingTx(false)
                            }}
                        >
                            {t`Harvest ${formattedNum(pending)} SUSHI`}
                        </Button>
                    </div>
                )}
            </div>
        </>
    )
}
