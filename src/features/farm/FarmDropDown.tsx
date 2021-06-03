import {
    ApprovalState,
    useApproveCallback,
} from '../../hooks/useApproveCallback'
import { MASTERCHEF_ADDRESS, Token } from '@sushiswap/sdk'
import React, { useState } from 'react'
import { Trans, t } from '@lingui/macro'

import { BigNumber } from '@ethersproject/bignumber'
import Button from '../../components/Button'
import Dots from '../../components/Dots'
import { Fraction } from '../../entities'
import Link from 'next/link'
import { Input as NumericalInput } from '../../components/NumericalInput'
import { formatNumber } from '../../functions/format'
import { getAddress } from '@ethersproject/address'
import { tryParseAmount } from '../../state/swap/hooks'
import useActiveWeb3React from '../../hooks/useActiveWeb3React'
import { useCurrency } from '../../hooks/Tokens'
import { useLingui } from '@lingui/react'
import useMasterChef from '../../hooks/useMasterChef'
import useMasterChefV2 from './useMasterChefV2'
import { usePair } from '../../hooks/usePair'
import usePendingReward from './usePendingReward'
import usePendingSushi from '../../hooks/usePendingSushi'
import { useRouter } from 'next/router'
import useStakedBalance from '../../hooks/useStakedBalance'
import useTokenBalance from '../../hooks/useTokenBalance'

// import { formattedNum, isAddressString, isWETH } from 'utils'

const fixedFormatting = (value: BigNumber, decimals?: number) => {
    return Fraction.from(
        value,
        BigNumber.from(10).pow(BigNumber.from(decimals))
    ).toString(decimals)
}

export default function InputGroup({
    pairAddress,
    pid,
    pairSymbol,
    token0Address,
    token1Address,
    type,
    assetSymbol,
    assetDecimals = 18,
    v2 = false,
}: {
    pairAddress: string
    pid: number
    pairSymbol: string
    token0Address: string
    token1Address: string
    type?: string
    assetSymbol?: string
    assetDecimals?: number
    v2: boolean
}): JSX.Element {
    const { i18n } = useLingui()
    const router = useRouter()
    const { account, chainId } = useActiveWeb3React()
    const [pendingTx, setPendingTx] = useState(false)
    const [depositValue, setDepositValue] = useState('')
    const [withdrawValue, setWithdrawValue] = useState('')

    const address = getAddress(pairAddress)
    const token0 = useCurrency(token0Address)
    const token1 = useCurrency(token1Address)

    const balance = useTokenBalance(address)
    const staked = useStakedBalance(pid, assetDecimals) // kMP depends on decimals of asset, SLP is always 18
    const pending = usePendingSushi(pid)
    const reward = usePendingReward(pid)

    //console.log('pending:', pending, pid)

    const [approvalState, approve] = useApproveCallback(
        tryParseAmount(
            depositValue,
            new Token(chainId || 1, address, balance.decimals, pairSymbol, '')
        ),
        v2
            ? MASTERCHEF_ADDRESS[1]
            : '0xEF0881eC094552b2e128Cf945EF17a6752B4Ec5d' // v2
    )

    const masterChef = useMasterChef()
    const masterChefV2 = useMasterChefV2()

    return (
        <>
            <div className="flex flex-col py-6 space-y-4">
                {pending && Number(pending) > 0 && (
                    <div className="px-4 ">
                        <Button
                            color="default"
                            onClick={async () => {
                                setPendingTx(true)
                                await (!v2
                                    ? masterChef.harvest(pid, pairSymbol)
                                    : masterChefV2.harvest(pid, pairSymbol))
                                setPendingTx(false)
                            }}
                        >
                            <Trans>
                                Harvest {formatNumber(pending)} SUSHI &{' '}
                                {formatNumber(reward)} ALCX
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
                                        <b>Tip:</b> In order to start earning
                                        rewards, you will need to first acquire
                                        some SLP by adding liquidity to the
                                        specified pair or{' '}
                                        <Link href="/migrate">
                                            <a className="underline text-blue">
                                                migrating existing liquidity.
                                            </a>
                                        </Link>{' '}
                                        Once you have SLP you can stake it into
                                        this yield farm to start earning
                                        rewards. Unstake anytime and then you
                                        can convert your SLP back to base tokens
                                        by clicking Remove Liquidity. Click
                                        Harvest to receive your rewards at any
                                        time.
                                    </Trans>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* <div className="grid grid-cols-1 gap-4 px-4 sm:grid-cols-2">
                    {type === 'LP' && (
                        <>
                            <Button
                                color="gray"
                                // onClick={() =>
                                //     // router.push(
                                //     //     `/add/${isWETH(token0Address)}/${isWETH(
                                //     //         token1Address
                                //     //     )}`
                                //     // )
                                // }
                            >
                                {i18n._(t`Add Liquidity`)}
                            </Button>
                            <Button
                                color="gray"
                                // onClick={() =>
                                //     // router.push(
                                //     //     `/remove/${isWETH(
                                //     //         token0Address
                                //     //     )}/${isWETH(token1Address)}`
                                //     // )
                                // }
                            >
                                {i18n._(t`Remove Liquidity`)}
                            </Button>
                        </>
                    )}
                    {type === 'KMP' && assetSymbol && (
                        <>
                            <Link href={`/lend/${address}`}>
                                {i18n._(t`Lend ${assetSymbol}`)}
                            </Link>
                            <Link href={`/lend/${address}`}>
                                {i18n._(t`Collect ${assetSymbol}`)}
                            </Link>
                        </>
                    )}
                </div> */}

                <div className="grid grid-cols-2 gap-4 px-4">
                    {/* Deposit */}
                    <div className="col-span-2 text-center md:col-span-1">
                        {account && (
                            <div className="pr-4 mb-2 text-sm text-right cursor-pointer text-secondary">
                                {i18n._(t`Wallet Balance`)}:{' '}
                                {formatNumber(
                                    fixedFormatting(
                                        balance.value,
                                        balance.decimals
                                    )
                                )}{' '}
                                {type}
                            </div>
                        )}
                        <div className="relative flex items-center w-full mb-4">
                            <NumericalInput
                                className="w-full p-3 rounded bg-dark-700 focus:ring focus:ring-blue"
                                value={depositValue}
                                onUserInput={(value) => {
                                    setDepositValue(value)
                                }}
                            />
                            {account && (
                                <Button
                                    variant="outlined"
                                    color="blue"
                                    size="small"
                                    onClick={() => {
                                        setDepositValue(
                                            fixedFormatting(
                                                balance.value,
                                                balance.decimals
                                            )
                                        )
                                    }}
                                    className="absolute border-0 right-4 focus:ring focus:ring-blue"
                                >
                                    {i18n._(t`MAX`)}
                                </Button>
                            )}
                        </div>
                        {approvalState === ApprovalState.NOT_APPROVED ||
                        approvalState === ApprovalState.PENDING ? (
                            <Button
                                color="blue"
                                disabled={
                                    approvalState === ApprovalState.PENDING
                                }
                                onClick={approve}
                            >
                                {approvalState === ApprovalState.PENDING ? (
                                    <Dots>Approving </Dots>
                                ) : (
                                    'Approve'
                                )}
                            </Button>
                        ) : (
                            <Button
                                color="blue"
                                disabled={
                                    pendingTx ||
                                    !balance ||
                                    Number(depositValue) === 0 ||
                                    Number(depositValue) >
                                        Number(
                                            fixedFormatting(
                                                balance.value,
                                                balance.decimals
                                            )
                                        )
                                }
                                onClick={async () => {
                                    setPendingTx(true)
                                    await (!v2
                                        ? masterChef.deposit(
                                              pid,
                                              depositValue,
                                              pairSymbol,
                                              balance.decimals
                                          )
                                        : masterChefV2.deposit(
                                              pid,
                                              depositValue,
                                              pairSymbol,
                                              balance.decimals
                                          ))
                                    setPendingTx(false)
                                }}
                            >
                                {i18n._(t`Deposit`)}
                            </Button>
                        )}
                    </div>
                    {/* Withdraw */}
                    <div className="col-span-2 text-center md:col-span-1">
                        {account && (
                            <div className="pr-4 mb-2 text-sm text-right cursor-pointer text-secondary">
                                {i18n._(t`Deposited`)}:{' '}
                                {formatNumber(
                                    fixedFormatting(
                                        staked.value,
                                        staked.decimals
                                    )
                                )}{' '}
                                {type}
                            </div>
                        )}
                        <div className="relative flex items-center w-full mb-4">
                            <NumericalInput
                                className="w-full p-3 rounded bg-dark-700 focus:ring focus:ring-pink"
                                value={withdrawValue}
                                onUserInput={(value) => {
                                    setWithdrawValue(value)
                                }}
                            />
                            {account && (
                                <Button
                                    variant="outlined"
                                    color="pink"
                                    size="small"
                                    onClick={() => {
                                        setWithdrawValue(
                                            fixedFormatting(
                                                staked.value,
                                                staked.decimals
                                            )
                                        )
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
                                Number(withdrawValue) >
                                    Number(
                                        fixedFormatting(
                                            staked.value,
                                            staked.decimals
                                        )
                                    )
                            }
                            onClick={async () => {
                                setPendingTx(true)
                                await (!v2
                                    ? masterChef.withdraw(
                                          pid,
                                          withdrawValue,
                                          pairSymbol,
                                          balance.decimals
                                      )
                                    : masterChefV2.withdraw(
                                          pid,
                                          withdrawValue,
                                          pairSymbol,
                                          balance.decimals
                                      ))

                                setPendingTx(false)
                            }}
                        >
                            {i18n._(t`Withdraw`)}
                        </Button>
                    </div>
                </div>
                {/* {pending && Number(pending) > 0 && (
                    <div className="px-4 ">
                        <Button
                            color="gray"
                            onClick={async () => {
                                setPendingTx(true)
                                await harvest(pid, pairSymbol)
                                setPendingTx(false)
                            }}
                        >
                            {i18n._(t`Harvest ${formatNumber(pending)} SUSHI`)}
                        </Button>
                    </div>
                )} */}

                {/* <Link href={`/lend/${address}`}>
                    <a className="text-center">
                        {i18n._(
                            t`View ${token0.symbol}/${token1.symbol} ${type} Pair`
                        )}
                    </a>
                </Link> */}
            </div>
        </>
    )
}
