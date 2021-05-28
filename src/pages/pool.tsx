import { ChainId, JSBI, Pair } from '@sushiswap/sdk'
import { ExternalLink as ExternalLinkIcon, User } from 'react-feather'
import React, { useContext, useMemo } from 'react'
import styled, { ThemeContext } from 'styled-components'
import { toV2LiquidityToken, useTrackedTokenPairs } from '../state/user/hooks'
import useSWR, { SWRResponse } from 'swr'

import Alert from '../components/Alert'
import { ArrowRightIcon } from '@heroicons/react/outline'
import { BIG_INT_ZERO } from '../constants'
import Back from '../components/Back'
import Button from '../components/Button'
import Card from '../components/Card'
import { Currency } from '@sushiswap/sdk'
import Dots from '../components/Dots'
import Empty from '../components/Empty'
import ExternalLink from '../components/ExternalLink'
import FullPositionCard from '../components/PositionCard'
import Head from 'next/head'
import Layout from '../layouts/DefaultLayout'
import Link from 'next/link'
import TransactionList from '../components/TransactionList'
import { getExplorerLink } from '../functions/explorer'
import { shortenAddress } from '../functions/format'
import { t } from '@lingui/macro'
import { useActiveWeb3React } from '../hooks/useActiveWeb3React'
import { useETHBalances } from '../state/wallet/hooks'
import { useLingui } from '@lingui/react'
import { usePairs } from '../hooks/usePairs'
import { useRouter } from 'next/router'
import { useStakingInfo } from '../state/stake/hooks'
import { useTokenBalancesWithLoadingIndicator } from '../state/wallet/hooks'

const migrateFrom: { [chainId in ChainId]?: string } = {
    [ChainId.MAINNET]: 'Uniswap',
    [ChainId.BSC]: 'PancakeSwap',
    [ChainId.MATIC]: 'QuickSwap',
}

export default function Pool() {
    const { i18n } = useLingui()
    const router = useRouter()
    const { account, chainId } = useActiveWeb3React()

    const userEthBalance = useETHBalances(account ? [account] : [])?.[
        account ?? ''
    ]

    // fetch the user's balances of all tracked V2 LP tokens
    const trackedTokenPairs = useTrackedTokenPairs()
    const tokenPairsWithLiquidityTokens = useMemo(
        () =>
            trackedTokenPairs.map((tokens) => ({
                liquidityToken: toV2LiquidityToken(tokens),
                tokens,
            })),
        [trackedTokenPairs]
    )

    const liquidityTokens = useMemo(
        () =>
            tokenPairsWithLiquidityTokens.map((tpwlt) => tpwlt.liquidityToken),
        [tokenPairsWithLiquidityTokens]
    )
    const [v2PairsBalances, fetchingV2PairBalances] =
        useTokenBalancesWithLoadingIndicator(
            account ?? undefined,
            liquidityTokens
        )

    // fetch the reserves for all V2 pools in which the user has a balance
    const liquidityTokensWithBalances = useMemo(
        () =>
            tokenPairsWithLiquidityTokens.filter(({ liquidityToken }) =>
                v2PairsBalances[liquidityToken.address]?.greaterThan('0')
            ),
        [tokenPairsWithLiquidityTokens, v2PairsBalances]
    )

    const v2Pairs = usePairs(
        liquidityTokensWithBalances.map(({ tokens }) => tokens)
    )
    const v2IsLoading =
        fetchingV2PairBalances ||
        v2Pairs?.length < liquidityTokensWithBalances.length ||
        v2Pairs?.some((V2Pair) => !V2Pair)

    const allV2PairsWithLiquidity = v2Pairs
        .map(([, pair]) => pair)
        .filter((v2Pair): v2Pair is Pair => Boolean(v2Pair))

    // show liquidity even if its deposited in rewards contract
    const stakingInfo = useStakingInfo()
    const stakingInfosWithBalance = stakingInfo?.filter((pool) =>
        JSBI.greaterThan(pool.stakedAmount.raw, BIG_INT_ZERO)
    )
    const stakingPairs = usePairs(
        stakingInfosWithBalance?.map((stakingInfo) => stakingInfo.tokens)
    )

    // remove any pairs that also are included in pairs with stake in mining pool
    const v2PairsWithoutStakedAmount = allV2PairsWithLiquidity.filter(
        (v2Pair) => {
            return (
                stakingPairs
                    ?.map((stakingPair) => stakingPair[1])
                    .filter(
                        (stakingPair) =>
                            stakingPair?.liquidityToken.address ===
                            v2Pair.liquidityToken.address
                    ).length === 0
            )
        }
    )
    return (
        <Layout>
            <Head>
                <title>Pool | Sushi</title>
                <meta
                    name="description"
                    content="SushiSwap liquidity pools are markets for trades between the two tokens, you can provide these tokens and become a liquidity provider to earn 0.25% of fees from trades."
                />
            </Head>
            <Back />
            <div className="w-full max-w-2xl px-4 mb-12">
                <div className="text-h5 text-semibold">Your Positions</div>
            </div>

            <div className="w-full max-w-2xl p-4 mb-3 rounded bg-dark-900">
                <div className="flex justify-between">
                    <div className="flex">
                        <div className="p-1.5 bg-dark-800 rounded">
                            <User
                                strokeWidth={1}
                                size={34}
                                className="text-primary"
                            />
                        </div>
                        <div className="ml-3">
                            <div className="font-bold text-high-emphesis">
                                {account && shortenAddress(account)}
                            </div>
                            <div className="text-sm text-primary">
                                {account && chainId && (
                                    <>
                                        {userEthBalance ? (
                                            <div>
                                                {userEthBalance?.toSignificant(
                                                    4
                                                )}{' '}
                                                {Currency.getNativeCurrencySymbol(
                                                    chainId
                                                )}
                                            </div>
                                        ) : (
                                            <Dots>{i18n._(t`Loading`)}</Dots>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="text-sm font-semibold text-primary">
                        {/* <div className="flex items-center">
                            <Copy strokeWidth={0.5} size={14} className="text-white"/>
                            <div className="ml-1">Copy Address</div>
                        </div> */}
                        <div className="flex items-center">
                            <ExternalLinkIcon
                                strokeWidth={0.5}
                                size={14}
                                className="text-white"
                            />
                            {/* <div className="ml-1">View on Explorer</div> */}
                            {chainId && account && (
                                <ExternalLink
                                    href={getExplorerLink(
                                        chainId,
                                        account,
                                        'address'
                                    )}
                                >
                                    <span>{i18n._(t`View on explorer`)}</span>
                                </ExternalLink>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-full max-w-2xl p-4 rounded bg-dark-900">
                <Alert
                    title={i18n._(t`Liquidity Provider Rewards`)}
                    message={t`Liquidity providers earn a 0.25% fee on all trades proportional to their share of
                        the pool. Fees are added to the pool, accrue in real time and can be claimed by
                        withdrawing your liquidity`}
                    type="information"
                />
                <div className="flex items-center justify-between mt-6 mb-6">
                    <div className="font-medium text-h5 text-high-emphesis">
                        {i18n._(t`Your Liquidity Positions`)}
                    </div>
                    <div className="flex space-x-2 text-sm font-bold">
                        <div>{i18n._(t`Don't see a pool you joined?`)}</div>
                        <Link href="/find">
                            <a
                                id="import-pool-link"
                                className="text-blue text-opacity-80 hover:text-opacity-100"
                            >
                                {i18n._(t`Import it.`)}
                            </a>
                        </Link>
                    </div>
                </div>
                <div className="grid grid-flow-row gap-3">
                    {!account ? (
                        <Card>
                            <div>
                                {i18n._(
                                    t`Connect to a wallet to view your liquidity`
                                )}
                            </div>
                        </Card>
                    ) : v2IsLoading ? (
                        <Empty>
                            <Dots>{i18n._(t`Loading`)}</Dots>
                        </Empty>
                    ) : allV2PairsWithLiquidity?.length > 0 ||
                      stakingPairs?.length > 0 ? (
                        <>
                            {/* <div className="flex items-center justify-center">
                                <ExternalLink href={'https://analytics.sushi.com/user/' + account}>
                                    Account analytics and accrued fees <span> ↗</span>
                                </ExternalLink>
                            </div> */}
                            {v2PairsWithoutStakedAmount.map((v2Pair) => (
                                <FullPositionCard
                                    key={v2Pair.liquidityToken.address}
                                    pair={v2Pair}
                                />
                            ))}
                            {stakingPairs.map(
                                (stakingPair, i) =>
                                    stakingPair[1] && ( // skip pairs that arent loaded
                                        <FullPositionCard
                                            key={
                                                stakingInfosWithBalance[i]
                                                    .stakingRewardAddress
                                            }
                                            pair={stakingPair[1]}
                                            stakedBalance={
                                                stakingInfosWithBalance[i]
                                                    .stakedAmount
                                            }
                                        />
                                    )
                            )}
                        </>
                    ) : (
                        <Empty className="text-center">
                            {i18n._(t`No liquidity found`)}
                        </Empty>
                    )}
                </div>
                {chainId &&
                    migrateFrom[chainId] &&
                    [ChainId.MAINNET, ChainId.BSC, ChainId.MATIC].includes(
                        chainId
                    ) && (
                        <div className="flex justify-center mt-4 space-x-2 text-sm font-bold">
                            <div>
                                {i18n._(
                                    t`Have ${migrateFrom[chainId]} Liquidity?`
                                )}
                            </div>
                            <Link href="/migrate">
                                <a
                                    id="migrate-pool-link"
                                    className="text-blue text-opacity-80 hover:text-opacity-100"
                                >
                                    {i18n._(t`Migrate!`)}
                                </a>
                            </Link>
                        </div>
                    )}
                <div className="grid grid-cols-2 gap-4 mt-4">
                    <Button
                        id="add-pool-button"
                        color="gradient"
                        size="large"
                        onClick={() => router.push('/add/ETH')}
                    >
                        {i18n._(t`Add Liquidity`)}
                    </Button>
                    <Button
                        id="create-pool-button"
                        color="gray"
                        size="large"
                        onClick={() => router.push('/create/ETH')}
                    >
                        {i18n._(t`Create a pair`)}
                    </Button>
                </div>
            </div>
        </Layout>
    )
}
