import { BigNumber } from '@ethersproject/bignumber'
import { Token, WETH } from '@sushiswap/sdk'
import { Input as NumericalInput } from '../../../../components/NumericalInput'
import { Fraction } from '../../../../entities'
import { useActiveWeb3React } from '../../../../hooks/useActiveWeb3React'
import { ApprovalState, useApproveCallback } from '../../../../hooks/useApproveCallback'
import React, { useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import useMiniChefV2 from '../../hooks/minichef/useMiniChefV2'
import usePendingSushi from '../../hooks/minichef/usePendingSushi'
import usePendingReward from '../../hooks/minichef/usePendingReward'
import useStakedBalance from '../../hooks/minichef/useStakedBalance'
import useTokenBalance from '../../../../hooks/useTokenBalance'
import { formattedNum, isAddress, isAddressString, isWETH } from '../../../../utils'
import { Dots } from '../../../Pool/styleds'
import { Button } from '../../components'
import { t, Trans } from '@lingui/macro'

import { tryParseAmount } from '../../../../state/swap/hooks'
import { useLingui } from '@lingui/react'

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
    const { i18n } = useLingui()
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
    const reward = usePendingReward(pid)

    // console.log('balance:', balance)
    // console.log('staked:', staked)
    // console.log('pending:', pending, pid)

    const [approvalState, approve] = useApproveCallback(
        tryParseAmount(depositValue, new Token(chainId || 1, pairAddressChecksum, balance.decimals, pairSymbol, '')),
        '0x0769fd68dFb93167989C6f7254cd0D766Fb2841F' //miniChef on Matic
    )
    //console.log('Approval:', approvalState, ApprovalState.NOT_APPROVED)

    const { deposit, withdraw, harvest } = useMiniChefV2()

    //console.log('depositValue:', depositValue)

    return (
        <>
            <div className="flex flex-col space-y-4 py-6">
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
                            <Trans>
                                Harvest {formattedNum(pending)} SUSHI & {formattedNum(reward)} MATIC
                            </Trans>
                        </Button>
                    </div>
                )}
                <div className="px-4">
                    <div className="bg-purple bg-opacity-20 text-high-emphesis block w-full rounded text-sm p-4">
                        <div className="flex items-center">
                            <div className="ml-3">
                                <p>
                                    <Trans>
                                        <b>Tip:</b> In order to start earning rewards, you will need to first acquire
                                        some SLP by adding liquidity to the specified pair or{' '}
                                        <Link to="/migrate" className="underline text-blue">
                                            migrating existing liquidity.
                                        </Link>{' '}
                                        Once you have SLP you can stake it into this yield farm to start earning
                                        rewards. Unstake anytime and then you can convert your SLP back to base tokens
                                        by clicking Remove Liquidity. Click Harvest to receive your rewards at any time.
                                    </Trans>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="grid gap-4 grid-cols-2 px-4">
                    {/* Deposit */}
                    <div className="text-center col-span-2 md:col-span-1">
                        {account && (
                            <div className="text-sm text-secondary cursor-pointer text-right mb-2 pr-4">
                                {i18n._(t`Wallet Balance`)}:{' '}
                                {formattedNum(fixedFormatting(balance.value, balance.decimals))} {type}
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
                                    {i18n._(t`MAX`)}
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
                                {i18n._(t`Stake`)}
                            </Button>
                        )}
                    </div>
                    {/* Withdraw */}
                    <div className="text-center col-span-2 md:col-span-1">
                        {account && (
                            <div className="text-sm text-secondary cursor-pointer text-right mb-2 pr-4">
                                {i18n._(t`Your Staked`)}: {formattedNum(fixedFormatting(staked.value, staked.decimals))}{' '}
                                {type}
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
                                    {i18n._(t`MAX`)}
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
                            {i18n._(t`Unstake`)}
                        </Button>
                    </div>
                </div>
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 px-4">
                    {type === 'SLP' && (
                        <>
                            <Button
                                color="default"
                                onClick={() =>
                                    history.push(
                                        `/add/${
                                            chainId && WETH[chainId].address === isAddress(token0Address)
                                                ? 'ETH'
                                                : token0Address
                                        }/${
                                            chainId && WETH[chainId].address === isAddress(token1Address)
                                                ? 'ETH'
                                                : token1Address
                                        }`
                                    )
                                }
                            >
                                {i18n._(t`Add Liquidity`)}
                            </Button>
                            <Button
                                color="default"
                                onClick={() =>
                                    history.push(`/remove/${isWETH(token0Address)}/${isWETH(token1Address)}`)
                                }
                            >
                                {i18n._(t`Remove Liquidity`)}
                            </Button>
                        </>
                    )}
                    {type === 'KMP' && assetSymbol && (
                        <>
                            <Button
                                color="default"
                                onClick={() => history.push(`/bento/kashi/lend/${isWETH(pairAddress)}`)}
                            >
                                {i18n._(t`Lend`)} {assetSymbol}
                            </Button>
                            <Button
                                color="default"
                                onClick={() => history.push(`/bento/kashi/lend/${isWETH(pairAddress)}`)}
                            >
                                {i18n._(t`Withdraw`)} {assetSymbol}
                            </Button>
                        </>
                    )}
                </div>
            </div>
        </>
    )
}
