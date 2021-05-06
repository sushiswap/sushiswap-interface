import React, { useMemo } from 'react'
import { JSBI, Pair } from '@sushiswap/sdk'
import { Button, Dots } from 'components'
import { LinkStyledButton } from '../../theme'
import { useActiveWeb3React } from '../../hooks/useActiveWeb3React'
import { useTokenBalancesWithLoadingIndicator } from 'state/wallet/hooks'
import { toV2LiquidityToken, useTrackedTokenPairs } from 'state/user/hooks'
import { usePairs } from 'data/Reserves'
import { useStakingInfo } from 'state/stake/hooks'
import { BIG_INT_ZERO } from '../../constants'
import Position from './Position'
import { t } from '@lingui/macro'

type Position = {
    pairs: string
    pair1: {
        name: string
        amount: string
    }
    pair2: {
        name: string
        amount: string
    }
}

export default function LiquidityPositions() {
    const { account } = useActiveWeb3React()

    // fetch the user's balances of all tracked V2 LP tokens
    const trackedTokenPairs = useTrackedTokenPairs()
    const tokenPairsWithLiquidityTokens = useMemo(
        () => trackedTokenPairs.map(tokens => ({ liquidityToken: toV2LiquidityToken(tokens), tokens })),
        [trackedTokenPairs]
    )

    const liquidityTokens = useMemo(() => tokenPairsWithLiquidityTokens.map(tpwlt => tpwlt.liquidityToken), [
        tokenPairsWithLiquidityTokens
    ])
    const [v2PairsBalances, fetchingV2PairBalances] = useTokenBalancesWithLoadingIndicator(
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

    const v2Pairs = usePairs(liquidityTokensWithBalances.map(({ tokens }) => tokens))
    const v2IsLoading =
        fetchingV2PairBalances ||
        v2Pairs?.length < liquidityTokensWithBalances.length ||
        v2Pairs?.some(V2Pair => !V2Pair)

    const allV2PairsWithLiquidity = v2Pairs.map(([, pair]) => pair).filter((v2Pair): v2Pair is Pair => Boolean(v2Pair))

    // show liquidity even if its deposited in rewards contract
    const stakingInfo = useStakingInfo()
    const stakingInfosWithBalance = stakingInfo?.filter(pool => JSBI.greaterThan(pool.stakedAmount.raw, BIG_INT_ZERO))
    const stakingPairs = usePairs(stakingInfosWithBalance?.map(stakingInfo => stakingInfo.tokens))

    // remove any pairs that also are included in pairs with stake in mining pool
    const v2PairsWithoutStakedAmount = allV2PairsWithLiquidity.filter(v2Pair => {
        return (
            stakingPairs
                ?.map(stakingPair => stakingPair[1])
                .filter(stakingPair => stakingPair?.liquidityToken.address === v2Pair.liquidityToken.address).length ===
            0
        )
    })

    console.log('v2PairsWithoutStakedAmount:', v2PairsWithoutStakedAmount)

    return (
        <>
            <div className="flex flex-col md:flex-row justify-start md:justify-between mb-6">
                <div className="text-xl font-medium text-white">{t`Your Liquidity Positions`}</div>
                <div className="flex items-center text-sm pr-2">
                    <span className="mr-1 text-gray-500">{t`Dont see a pool you joined?`}</span>
                    <LinkStyledButton>{t`import it`}</LinkStyledButton>
                </div>
            </div>
            <div>
                {!account ? (
                    <div className="text-gray-500 text-center px-4 py-14 border border-gray-800 rounded">
                        {t`Connect to a wallet to view your liquidity`}
                    </div>
                ) : v2IsLoading ? (
                    <div className="text-gray-500 text-center px-4 py-14 border border-gray-800 rounded">
                        <Dots>{t`Loading`}</Dots>
                    </div>
                ) : allV2PairsWithLiquidity?.length > 0 || stakingPairs?.length > 0 ? (
                    <>
                        {v2PairsWithoutStakedAmount.map(v2Pair => (
                            <Position key={v2Pair.liquidityToken.address} pair={v2Pair} />
                        ))}
                    </>
                ) : (
                    <div className="text-gray-500 text-center px-4 py-14 border border-gray-800 rounded">
                        {t`No liquidity positions found`}
                    </div>
                )}
                <div className="flex gap-4 mt-5 mb-1">
                    <Button size="large" color="gradient">
                        {t`Add Liquidity`}
                    </Button>
                    <Button size="large" className="w-full bg-dark-800 text-secondary">
                        {t`Create a Pair`}
                    </Button>
                </div>
            </div>
        </>
    )
}
