import React, { useMemo } from 'react'
import { useActiveWeb3React } from '../../hooks'
import { toPancakeV1LiquidityToken, toPancakeV2LiquidityToken, useTrackedTokenPairs } from '../../state/user/hooks'
import { useTokenBalancesWithLoadingIndicator } from '../../state/wallet/hooks'
import { Helmet } from 'react-helmet'
import { usePairs } from 'data/Reserves'
import { PancakeV1Pair, PancakeV2Pair } from '@sushiswap/sdk'
import Position from './Position'
import { Dots } from 'kashi'
import { NavLink } from 'components'

export default function Test() {
    const { account, chainId } = useActiveWeb3React()
    // const account = '0x1f3fBdC014ED7c36fBB3044AFeA003eC3E54280f'

    // fetch the user's balances of all tracked LP tokens
    const trackedTokenPairs = useTrackedTokenPairs()

    const tokenPairsWithLiquidityTokensV1 = useMemo(
        () => trackedTokenPairs.map(tokens => ({ liquidityToken: toPancakeV1LiquidityToken(tokens), tokens })),
        [trackedTokenPairs]
    )

    const liquidityTokensV1 = useMemo(() => tokenPairsWithLiquidityTokensV1.map(tpwlt => tpwlt.liquidityToken), [
        tokenPairsWithLiquidityTokensV1
    ])

    const [pairBalancesV1, fetchingPairBalancesV1] = useTokenBalancesWithLoadingIndicator(
        account ?? undefined,
        liquidityTokensV1
    )

    // fetch the reserves for all pancake v1 pools in which the user has a balance
    const liquidityTokensWithBalancesV1 = useMemo(
        () =>
            tokenPairsWithLiquidityTokensV1.filter(({ liquidityToken }) =>
                pairBalancesV1[liquidityToken.address]?.greaterThan('0')
            ),
        [tokenPairsWithLiquidityTokensV1, pairBalancesV1]
    )

    const pairsV1 = usePairs(liquidityTokensWithBalancesV1.map(({ tokens }) => tokens))

    const isLoadingV1 =
        fetchingPairBalancesV1 ||
        pairsV1?.length < liquidityTokensWithBalancesV1.length ||
        pairsV1?.some(pairV1 => !pairV1)

    const allV1PairsWithLiquidity = pairsV1
        .map(([, pair]) => pair)
        .filter((pairV1): pairV1 is PancakeV1Pair => Boolean(pairV1))

    // V2...

    const tokenPairsWithLiquidityTokensV2 = useMemo(
        () => trackedTokenPairs.map(tokens => ({ liquidityToken: toPancakeV2LiquidityToken(tokens), tokens })),
        [trackedTokenPairs]
    )

    const liquidityTokensV2 = useMemo(() => tokenPairsWithLiquidityTokensV2.map(tpwlt => tpwlt.liquidityToken), [
        tokenPairsWithLiquidityTokensV2
    ])

    const [pairBalancesV2, fetchingPairBalancesV2] = useTokenBalancesWithLoadingIndicator(
        account ?? undefined,
        liquidityTokensV2
    )

    // fetch the reserves for all pancake v2 pools in which the user has a balance
    const liquidityTokensWithBalancesV2 = useMemo(
        () =>
            tokenPairsWithLiquidityTokensV2.filter(({ liquidityToken }) =>
                pairBalancesV2[liquidityToken.address]?.greaterThan('0')
            ),
        [tokenPairsWithLiquidityTokensV2, pairBalancesV2]
    )

    const pairsV2 = usePairs(liquidityTokensWithBalancesV2.map(({ tokens }) => tokens))

    const isLoadingV2 =
        fetchingPairBalancesV2 ||
        pairsV2?.length < liquidityTokensWithBalancesV2.length ||
        pairsV2?.some(pairV2 => !pairV2)

    const allV2PairsWithLiquidity = pairsV2
        .map(([, pair]) => pair)
        .filter((pairV2): pairV2 is PancakeV2Pair => Boolean(pairV2))

    return (
        <>
            <Helmet>
                <title>Migrate | Sushi</title>
            </Helmet>
            <div>
                <div>
                    <div className="text-2xl">Pancake V1 pairs</div>
                    {allV1PairsWithLiquidity.map((pair, i) => (
                        <Position key={i} pair={pair} />
                    ))}
                    {isLoadingV1 && <Dots />}
                </div>

                <div>
                    <div className="text-2xl">Pancake V2 pairs</div>
                    {allV2PairsWithLiquidity.map((pair, i) => (
                        <Position key={i} pair={pair} />
                    ))}
                    {isLoadingV2 && <Dots />}
                </div>
            </div>
        </>
    )
}
