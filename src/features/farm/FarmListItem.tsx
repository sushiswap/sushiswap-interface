import { ApprovalState, useApproveCallback } from '../../hooks/useApproveCallback'
import { ChainId, MASTERCHEF_ADDRESS, Token } from '@sushiswap/sdk'
import { Chef, PairType } from './enum'
import React, { useState } from 'react'
import { Trans, t } from '@lingui/macro'
import { currencyId, formatNumber, formatPercent } from '../../functions'
import { usePendingSushi, useUserInfo } from './hooks'

import Button from '../../components/Button'
import Dots from '../../components/Dots'
import DoubleLogo from '../../components/DoubleLogo'
import Image from 'next/image'
import Link from 'next/link'
import { Input as NumericalInput } from '../../components/NumericalInput'
import Paper from '../../components/Paper'
import { getAddress } from '@ethersproject/address'
import { tryParseAmount } from '../../state/swap/hooks'
import useActiveWeb3React from '../../hooks/useActiveWeb3React'
import { useCurrency } from '../../hooks/Tokens'
import { useLingui } from '@lingui/react'
import useMasterChef from './useMasterChef'
import { usePair } from '../../hooks/usePairs'
import usePendingReward from './usePendingReward'
import { useTokenBalance } from '../../state/wallet/hooks'
// import useTokenBalance from '../../hooks/useTokenBalance'
import { useTransactionAdder } from '../../state/transactions/hooks'

const FarmListItem = ({ farm }) => {
    const { i18n } = useLingui()
    const [expand, setExpand] = useState<boolean>(false)
    const { account, chainId } = useActiveWeb3React()
    const [pendingTx, setPendingTx] = useState(false)
    const [depositValue, setDepositValue] = useState('')
    const [withdrawValue, setWithdrawValue] = useState('')
    const addTransaction = useTransactionAdder()
    const token0 = useCurrency(farm.pair.token0.id)
    const token1 = useCurrency(farm.pair.token1.id)

    const address = getAddress(farm.pair.id)

    // TODO: Replace these
    const amount = useUserInfo(farm)
    const pending = usePendingSushi(farm)
    const reward = usePendingReward(farm)

    const APPROVAL_ADDRESSES = {
        [Chef.MASTERCHEF]: MASTERCHEF_ADDRESS[ChainId.MAINNET],
        [Chef.MASTERCHEF_V2]: '0xEF0881eC094552b2e128Cf945EF17a6752B4Ec5d',
        [Chef.MINICHEF]: '0x0769fd68dFb93167989C6f7254cd0D766Fb2841F',
    }

    const liquidityToken = new Token(chainId, address, 18, farm.pair.symbol, farm.pair.name)

    const balance = useTokenBalance(account, liquidityToken)

    const [approvalState, approve] = useApproveCallback(
        tryParseAmount(depositValue, liquidityToken),
        APPROVAL_ADDRESSES[farm.chef]
    )

    const { deposit, withdraw, harvest } = useMasterChef(farm.chef)

    const decimals = farm.pair.type === PairType.LENDING ? farm.pair.token0.decimals : 18

    return (
        <div key={`${farm.chef}:${farm.id}`} className="rounded bg-dark-800">
            <div
                className="grid grid-cols-3 px-4 py-2 rounded rounded-b-none cursor-pointer select-none md:grid-cols-4 bg-dark-850"
                onClick={() => setExpand(!expand)}
            >
                <div className="text-sm sm:text-base">
                    {farm?.pair?.type === PairType.LENDING && (
                        <div className="flex items-center space-x-2 text-primary">
                            <div className="text-gray-500">KM</div>
                            <div className="font-semibold">{farm?.pair?.token0?.symbol}</div>
                            <div className="text-gray-500">{farm?.pair?.token1?.symbol}</div>
                        </div>
                    )}
                    {farm?.pair?.type === PairType.SWAP && (
                        <div className="flex items-center space-x-2 text-primary">
                            <div className="font-semibold">
                                {farm?.pair?.token0?.symbol}/{farm?.pair?.token1?.symbol}
                            </div>
                            <div className="text-gray-500">SLP</div>
                        </div>
                    )}
                </div>
                <div className="hidden ml-4 text-sm text-gray-500 md:block sm:text-base">
                    {farm?.rewards?.map((reward) => reward.token).join(' & ')}
                </div>
                <div className="text-sm text-right text-gray-500 sm:text-base">{formatNumber(farm?.tvl, true)}</div>
                <div className="text-sm font-semibold text-right sm:text-base">
                    {farm?.roiPerYear > 100 ? '10000%+' : formatPercent(farm?.roiPerYear * 100)}
                </div>
            </div>
            <div
                className="grid grid-cols-3 px-4 py-4 text-sm rounded cursor-pointer select-none md:grid-cols-4"
                onClick={() => setExpand(!expand)}
            >
                <div className="flex items-center col-span-1">
                    <div>
                        <DoubleLogo currency0={token0} currency1={token1} size={40} margin={true} />
                    </div>
                </div>
                <div className="flex-row items-center justify-start hidden ml-4 space-x-2 md:col-span-1 md:flex">
                    <div className="flex flex-col space-y-2 md:col-span-3">
                        <div className="flex flex-row items-center mr-4 space-x-2">
                            {farm?.rewards?.map((reward, i) => (
                                <div key={i} className="flex items-center">
                                    <Image
                                        src={reward.icon}
                                        width="40px"
                                        height="40px"
                                        className="w-10 h-10 rounded"
                                        alt={reward.token}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col pl-2 space-y-1">
                        {farm?.rewards?.map((reward, i) => (
                            <div key={i} className="text-xs text-gray-500">
                                {formatNumber(reward.rewardPerDay)} {reward.token} / day
                            </div>
                        ))}
                    </div>
                </div>
                <div className="flex items-center justify-end md:col-span-1">
                    <div>
                        {/* <div className="text-right">{formattedNum(farm.tvl, true)} </div> */}
                        <div className="text-sm font-semibold text-right text-gray-500 sm:text-sm">
                            {formatNumber(farm.balance, false)} {farm.type}
                        </div>
                        <div className="text-xs text-right text-gray-500">Market Staked</div>
                    </div>
                </div>
                <div className="flex items-center justify-end md:col-span-1">
                    <div>
                        <div className="text-base font-semibold text-right text-gray-500 sm:text-lg">
                            {farm?.roiPerYear > 100 ? '10000%+' : formatPercent(farm?.roiPerYear * 100)}
                            {/* {formattedPercent(farm.roiPerMonth * 100)}{' '} */}
                        </div>
                        <div className="text-xs text-right text-gray-500">annualized</div>
                        {/* <div className="text-xs text-right text-gray-500">per month</div> */}
                    </div>
                </div>
            </div>
            {/* <pre>{JSON.stringify(farm, null, 2)}</pre> */}
            {expand && (
                <>
                    <div className="flex flex-col py-6 space-y-4">
                        <div className="grid grid-cols-2 gap-4 px-4">
                            <div className="col-span-2 text-center md:col-span-1">
                                {account && (
                                    <div className="pr-4 mb-2 text-sm text-right cursor-pointer text-secondary">
                                        {i18n._(t`Wallet Balance`)}: {formatNumber(balance?.toSignificant(6) ?? 0)}{' '}
                                        {farm.type}
                                    </div>
                                )}
                                <div className="relative flex items-center w-full mb-4">
                                    <NumericalInput
                                        className="w-full p-3 pr-20 rounded bg-dark-700 bg-input focus:ring focus:ring-blue"
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
                                                setDepositValue(balance.toFixed(decimals))
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
                                        disabled={approvalState === ApprovalState.PENDING}
                                        onClick={approve}
                                    >
                                        {approvalState === ApprovalState.PENDING ? <Dots>Approving </Dots> : 'Approve'}
                                    </Button>
                                ) : (
                                    <Button
                                        color="blue"
                                        disabled={
                                            pendingTx ||
                                            !balance ||
                                            Number(depositValue) === 0 ||
                                            Number(depositValue) > Number(balance.toFixed(decimals))
                                        }
                                        onClick={async () => {
                                            setPendingTx(true)
                                            try {
                                                // KMP decimals depend on asset, SLP is always 18
                                                const tx = await deposit(farm.id, depositValue.toBigNumber(decimals))

                                                addTransaction(tx, {
                                                    summary: `Deposit ${farm.pair.name}`,
                                                })
                                            } catch (error) {
                                                console.error(error)
                                            }
                                            setPendingTx(false)
                                        }}
                                    >
                                        {i18n._(t`Stake`)}
                                    </Button>
                                )}
                            </div>
                            <div className="col-span-2 text-center md:col-span-1">
                                {account && (
                                    <div className="pr-4 mb-2 text-sm text-right cursor-pointer text-secondary">
                                        {i18n._(t`Your Staked`)}: {formatNumber(amount)} {farm.type}
                                    </div>
                                )}
                                <div className="relative flex items-center w-full mb-4">
                                    <NumericalInput
                                        className="w-full p-3 pr-20 rounded bg-dark-700 bg-input focus:ring focus:ring-pink"
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
                                                setWithdrawValue(amount)
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
                                        Number(withdrawValue) > Number(amount)
                                    }
                                    onClick={async () => {
                                        setPendingTx(true)
                                        try {
                                            // KMP decimals depend on asset, SLP is always 18
                                            const tx = await withdraw(farm.id, withdrawValue.toBigNumber(decimals))
                                            addTransaction(tx, {
                                                summary: `Withdraw ${farm.pair.name}`,
                                            })
                                        } catch (error) {
                                            console.error(error)
                                        }

                                        setPendingTx(false)
                                    }}
                                >
                                    {i18n._(t`Unstake`)}
                                </Button>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 gap-4 px-4 sm:grid-cols-2">
                            {farm.pair.type === PairType.SWAP && (
                                <>
                                    <div className="text-caption2">
                                        Before depositing liquidity into this reward pool you'll need to{' '}
                                        <Link href={`/add/${currencyId(token0)}/${currencyId(token1)}`}>
                                            <a className="underline text-blue">add liquidity</a>
                                        </Link>{' '}
                                        of {token0.symbol} & {token1.symbol} to gain liquidity tokens.
                                    </div>

                                    <div className="text-caption2">
                                        After withdrawing liquidity from this reward pool you can{' '}
                                        <Link href={`/remove/${currencyId(token0)}/${currencyId(token1)}`}>
                                            <a className="underline text-blue">remove liquidity</a>
                                        </Link>{' '}
                                        to regain your underlying {token0.symbol} & {token1.symbol}.
                                    </div>
                                </>
                            )}
                            {farm.pair.type === PairType.LENDING && token1.symbol && (
                                <>
                                    <div className="text-caption2">
                                        Before depositing into this reward pool you'll need to{' '}
                                        <Link href={`/lend/${farm.pair.id}`}>
                                            <a className="underline text-blue">lend</a>
                                        </Link>{' '}
                                        to gain liquidity tokens to deposit.
                                    </div>

                                    <div className="text-caption2">
                                        After withdrawing liquidity tokens from this reward pool you can{' '}
                                        <Link href={`/lend/${farm.pair.id}`}>
                                            <a className="underline text-blue">collect</a>
                                        </Link>{' '}
                                        to regain your underlying {token1.symbol}.
                                    </div>
                                </>
                            )}
                        </div>
                        {pending && Number(pending) > 0 && (
                            <div className="px-4 ">
                                <Button
                                    color="gradient"
                                    onClick={async () => {
                                        setPendingTx(true)
                                        try {
                                            const tx = await harvest(farm.id)
                                            addTransaction(tx, {
                                                summary: `Harvest ${farm.pair.name}`,
                                            })
                                        } catch (error) {
                                            console.error(error)
                                        }
                                        setPendingTx(false)
                                    }}
                                >
                                    {i18n._(t`Harvest ${formatNumber(pending)} SUSHI
                                        ${
                                            farm.rewards.length > 1
                                                ? `& ${formatNumber(reward)} ${farm.rewards[1].token}`
                                                : null
                                        }
                                    `)}
                                </Button>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    )
}

export default FarmListItem
