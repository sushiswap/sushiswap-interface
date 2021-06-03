import { ApprovalState, useApproveCallback } from '../../../../hooks/useApproveCallback'
import { Link, useHistory } from 'react-router-dom'
import React, { useState } from 'react'
import { Token, WETH } from '@sushiswap/sdk'
import { Trans, t } from '@lingui/macro'
import { formattedNum, isAddress, isAddressString, isWETH } from '../../../../utils'

import { BigNumber } from '@ethersproject/bignumber'
import { Button } from '../../components'
import { Dots } from '../../../Pool/styleds'
import { Fraction } from '../../../../entities'
import { Input as NumericalInput } from '../../../../components/NumericalInput'
import { tryParseAmount } from '../../../../state/swap/hooks'
import { useActiveWeb3React } from '../../../../hooks/useActiveWeb3React'
import { useLingui } from '@lingui/react'
import useMasterChefV2 from '../../hooks/masterchefv2/useMasterChefV2'
import usePendingReward from '../../hooks/masterchefv2/usePendingReward'
import usePendingSushi from '../../hooks/masterchefv2/usePendingSushi'
import useStakedBalance from '../../hooks/masterchefv2/useStakedBalance'
import useTokenBalance from '../../../../hooks/useTokenBalance'

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
        '0xEF0881eC094552b2e128Cf945EF17a6752B4Ec5d' //masterchefv2 on mainnet
    )
    //console.log('Approval:', approvalState, ApprovalState.NOT_APPROVED)

    const { deposit, withdraw, harvest } = useMasterChefV2()

    console.log({ pending, reward })

    //console.log('depositValue:', depositValue)

    return (
        <>
            <div className="flex flex-col py-6 space-y-4">
                {pending && Number(pending) > 0 && (
                    <div className="px-4 ">
                        <Button
                            color="default"
                            onClick={async () => {
                                setPendingTx(true)
                                await harvest(pid, pairSymbol)
                                setPendingTx(false)
                            }}
                        >
                            <Trans>
                                Harvest {formattedNum(pending)} SUSHI & {formattedNum(reward)} ALCX
                            </Trans>
                        </Button>
                    </div>
                )}
                <div className="px-4">
                    <div className="block w-full p-4 text-sm rounded bg-purple bg-opacity-20 text-high-emphesis">
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
                <div className="grid grid-cols-2 gap-4 px-4">
                    {/* Deposit */}
                    <div className="col-span-2 text-center md:col-span-1">
                        {account && (
                            <div className="pr-4 mb-2 text-sm text-right cursor-pointer text-secondary">
                                {i18n._(t`Wallet Balance`)}:{' '}
                                {formattedNum(fixedFormatting(balance.value, balance.decimals))} {type}
                            </div>
                        )}
                        <div className="relative flex items-center w-full mb-4">
                            <NumericalInput
                                className="w-full p-3 pr-20 rounded bg-input focus:ring focus:ring-blue"
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
                                    className="absolute border-0 right-4 focus:ring focus:ring-blue"
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
                    <div className="col-span-2 text-center md:col-span-1">
                        {account && (
                            <div className="pr-4 mb-2 text-sm text-right cursor-pointer text-secondary">
                                {i18n._(t`Your Staked`)}: {formattedNum(fixedFormatting(staked.value, staked.decimals))}{' '}
                                {type}
                            </div>
                        )}
                        <div className="relative flex items-center w-full mb-4">
                            <NumericalInput
                                className="w-full p-3 pr-20 rounded bg-input focus:ring focus:ring-pink"
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
                                    className="absolute border-0 right-4 focus:ring focus:ring-pink"
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
                <div className="grid grid-cols-1 gap-4 px-4 sm:grid-cols-2">
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
