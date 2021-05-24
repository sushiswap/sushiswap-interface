import { Pair, PancakeV1Pair, PancakeV2Pair, QuickSwapPair, SteakPair, Token, TokenAmount } from '@sushiswap/sdk'
import React, { useMemo } from 'react'
import { keccak256, pack } from '@ethersproject/solidity'
import {
    toPancakeV1LiquidityToken,
    toPancakeV2LiquidityToken,
    toQuickSwapLiquidityToken,
    toSteakHouseLiquidityToken,
    useTrackedTokenPairs
} from '../state/user/hooks'
import { useMigrationPairs, usePairs } from '../hooks/usePairs'
import { useTokenBalance, useTokenBalancesWithLoadingIndicator } from '../state/wallet/hooks'

import { ChainId } from '@sushiswap/sdk'
import Dots from '../components/Dots'
import Head from 'next/head'
import Layout from '../components/Layout'
import Link from 'next/link'
import { getCreate2Address } from '@ethersproject/address'
import { t } from '@lingui/macro'
import { useActiveWeb3React } from '../hooks/useActiveWeb3React'
import { useLingui } from '@lingui/react'

// TODO: A simple proof, this will be expanded to allow for the easy plugin of other compatible exchanges.
// WIP, please do not remove

function Position({ pair }: { pair: Pair }) {
    const { account, chainId } = useActiveWeb3React()

    const userDefaultPoolBalance = useTokenBalance(account ?? undefined, pair.liquidityToken)

    console.log('Position...', { userDefaultPoolBalance })

    return userDefaultPoolBalance ? (
        <div>
            Pair({pair.liquidityToken.name}): {pair.liquidityToken.address}
            <br />
            Balance: {userDefaultPoolBalance.toFixed(18)}
        </div>
    ) : null
}

const SOURCES = {
    [ChainId.MATIC]: []
}

export default function Migrate() {
    const { account, chainId } = useActiveWeb3React()

    // fetch the user's balances of all tracked LP tokens
    const trackedTokenPairs = useTrackedTokenPairs()

    // const tokenPairsWithLiquidityTokensV1 = useMemo(
    //     () => trackedTokenPairs.map(tokens => ({ liquidityToken: toPancakeV1LiquidityToken(tokens), tokens })),
    //     [trackedTokenPairs]
    // )

    // const liquidityTokensV1 = useMemo(() => tokenPairsWithLiquidityTokensV1.map(tpwlt => tpwlt.liquidityToken), [
    //     tokenPairsWithLiquidityTokensV1
    // ])

    // const [pairBalancesV1, fetchingPairBalancesV1] = useTokenBalancesWithLoadingIndicator(
    //     account ?? undefined,
    //     liquidityTokensV1
    // )

    // // fetch the reserves for all pancake v1 pools in which the user has a balance
    // const liquidityTokensWithBalancesV1 = useMemo(
    //     () =>
    //         tokenPairsWithLiquidityTokensV1.filter(({ liquidityToken }) =>
    //             pairBalancesV1[liquidityToken.address]?.greaterThan('0')
    //         ),
    //     [tokenPairsWithLiquidityTokensV1, pairBalancesV1]
    // )

    // const pairsV1 = usePairs(liquidityTokensWithBalancesV1.map(({ tokens }) => tokens))

    // const isLoadingV1 =
    //     fetchingPairBalancesV1 ||
    //     pairsV1?.length < liquidityTokensWithBalancesV1.length ||
    //     pairsV1?.some(pairV1 => !pairV1)

    // const allV1PairsWithLiquidity = pairsV1
    //     .map(([, pair]) => pair)
    //     .filter((pairV1): pairV1 is PancakeV1Pair => Boolean(pairV1))

    // // V2...
    // const tokenPairsWithLiquidityTokensV2 = useMemo(
    //     () => trackedTokenPairs.map(tokens => ({ liquidityToken: toPancakeV2LiquidityToken(tokens), tokens })),
    //     [trackedTokenPairs]
    // )

    // const liquidityTokensV2 = useMemo(() => tokenPairsWithLiquidityTokensV2.map(tpwlt => tpwlt.liquidityToken), [
    //     tokenPairsWithLiquidityTokensV2
    // ])

    // const [pairBalancesV2, fetchingPairBalancesV2] = useTokenBalancesWithLoadingIndicator(
    //     account ?? undefined,
    //     liquidityTokensV2
    // )

    // // fetch the reserves for all pancake v2 pools in which the user has a balance
    // const liquidityTokensWithBalancesV2 = useMemo(
    //     () =>
    //         tokenPairsWithLiquidityTokensV2.filter(({ liquidityToken }) =>
    //             pairBalancesV2[liquidityToken.address]?.greaterThan('0')
    //         ),
    //     [tokenPairsWithLiquidityTokensV2, pairBalancesV2]
    // )

    // const pairsV2 = usePairs(liquidityTokensWithBalancesV2.map(({ tokens }) => tokens))

    // const isLoadingV2 =
    //     fetchingPairBalancesV2 ||
    //     pairsV2?.length < liquidityTokensWithBalancesV2.length ||
    //     pairsV2?.some(pairV2 => !pairV2)

    // const allV2PairsWithLiquidity = pairsV2
    //     .map(([, pair]) => pair)
    //     .filter((pairV2): pairV2 is PancakeV2Pair => Boolean(pairV2))

    // const loading = isLoadingV1 || isLoadingV2

    // const noLiquidityFound = !allV1PairsWithLiquidity.length && !allV2PairsWithLiquidity.length

    // QuickSwap

    const funcs = [toQuickSwapLiquidityToken, toSteakHouseLiquidityToken]

    const tokenPairsWithLiquidityTokens = useMemo(
        () => trackedTokenPairs.map(tokens => ({ liquidityToken: toSteakHouseLiquidityToken(tokens), tokens })),
        [trackedTokenPairs, funcs]
    )

    const liquidityTokens = useMemo(() => tokenPairsWithLiquidityTokens.map(tpwlt => tpwlt.liquidityToken), [
        tokenPairsWithLiquidityTokens
    ])

    const [pairBalances, fetchingPairBalances] = useTokenBalancesWithLoadingIndicator(
        account ?? undefined,
        liquidityTokens
    )

    const liquidityTokensWithBalances = useMemo(
        () =>
            tokenPairsWithLiquidityTokens.filter(({ liquidityToken }) =>
                pairBalances[liquidityToken.address]?.greaterThan('0')
            ),
        [tokenPairsWithLiquidityTokens, pairBalances]
    )

    const pairs = useMigrationPairs(
        liquidityTokensWithBalances.map(({ tokens }) => tokens),
        SteakPair
    )

    const isLoading =
        fetchingPairBalances || pairs?.length < liquidityTokensWithBalances.length || pairs?.some(pairV1 => !pairV1)

    const allPairsWithLiquidity = pairs.map(([, pair]) => pair).filter((pair): pair is Pair => Boolean(pair))

    console.log({ allPairsWithLiquidity })

    // const userDefaultPoolBalance = useTokenBalance(account ?? undefined, allV1PairsWithLiquidity?.[0]?.liquidityToken)

    return (
        <Layout>
            <Head>
                <title>Migrate | Sushi</title>
                <meta name="description" content="Migrate your liquidity to SushiSwap." />
            </Head>

            <div className="flex items-center h-full">
                {/* <div className="text-h5">
                    {loading && <Dots>Searching for liquidity</Dots>}
                    {!loading && noLiquidityFound && <div>No liquidity found</div>}
                </div> */}

                {allPairsWithLiquidity.length > 0 && (
                    <div>
                        <div className="w-full text-2xl">Pancake V1 pairs</div>
                        {allPairsWithLiquidity.map((pair, i) => (
                            <Position key={i} pair={pair} />
                        ))}
                        {isLoading && <Dots />}
                    </div>
                )}

                {/* {allV2PairsWithLiquidity.length > 0 && (
                    <div>
                        <div className="w-full text-2xl">Pancake V2 pairs</div>
                        {allV2PairsWithLiquidity.map((pair, i) => (
                            <Position key={i} pair={pair} />
                        ))}
                        {isLoadingV2 && <Dots />}
                    </div>
                )} */}
            </div>
        </Layout>
    )
}
