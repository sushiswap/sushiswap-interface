import { ChainId, JSBI, Pair } from '@sushiswap/sdk'
import { transparentize } from 'polished'
import React, { useContext, useMemo } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { Text } from 'rebass'
import styled, { ThemeContext } from 'styled-components'
import { ButtonPrimaryNormal, ButtonSecondary } from '../../components/ButtonLegacy'
import Card from '../../components/Card'
import { AutoColumn } from '../../components/Column'
import { SwapPoolTabs } from '../../components/NavigationTabs'
import FullPositionCard from '../../components/PositionCard'
import { RowBetween, RowFixed } from '../../components/Row'
import { Dots } from '../../components/swap/styleds'
import { BIG_INT_ZERO } from '../../constants'
import { usePairs } from '../../data/Reserves'
import { useActiveWeb3React } from '../../hooks/useActiveWeb3React'
import { useStakingInfo } from '../../state/stake/hooks'
import { toV2LiquidityToken, useTrackedTokenPairs } from '../../state/user/hooks'
import { useTokenBalancesWithLoadingIndicator } from '../../state/wallet/hooks'
import { StyledInternalLink, TYPE } from '../../theme'
import Alert from '../../components/Alert'
import { Helmet } from 'react-helmet'
import ExchangeHeader from '../../components/ExchangeHeader'
import Button from '../../components/Button'
import { t, Trans } from '@lingui/macro'
import { useLingui } from '@lingui/react'

const DataCard = styled(AutoColumn)<{ disabled?: boolean }>`
    background: radial-gradient(76.02% 75.41% at 1.84% 0%, #ff007a 0%, #0094ec 100%);
    border-radius: ${({ theme }) => theme.borderRadius};
    width: 100%;
    position: relative;
    overflow: hidden;
`

const CardSection = styled(AutoColumn)<{ disabled?: boolean }>`
    padding: 1rem;
    z-index: 1;
    opacity: ${({ disabled }) => disabled && '0.4'};
`

const PageWrapper = styled(AutoColumn)`
    max-width: 640px;
    width: 100%;
    padding: 16px;
`

const VoteCard = styled(DataCard)`
  background: ${({ theme }) => transparentize(0.5, theme.bg1)};
  /* border: 1px solid ${({ theme }) => theme.text4}; */
  overflow: hidden;
`

const TitleRow = styled(RowBetween)`
    ${({ theme }) => theme.mediaWidth.upToSmall`
    flex-wrap: wrap;
    gap: 12px;
    width: 100%;
    flex-direction: column-reverse;
  `};
`

const ButtonRow = styled(RowFixed)`
    gap: 8px;
    ${({ theme }) => theme.mediaWidth.upToSmall`
    width: 100%;
    flex-direction: row-reverse;
    justify-content: space-between;
  `};
`

const ResponsiveButtonPrimary = styled(ButtonPrimaryNormal)`
    width: fit-content;
    ${({ theme }) => theme.mediaWidth.upToSmall`
    width: 48%;
  `};
`

const ResponsiveButtonSecondary = styled(ButtonSecondary)`
    width: fit-content;
    ${({ theme }) => theme.mediaWidth.upToSmall`
    width: 48%;
  `};
`

const EmptyProposals = styled.div`
    border: 1px solid ${({ theme }) => theme.text4};
    padding: 16px 12px;
    border-radius: ${({ theme }) => theme.borderRadius};
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`

const migrateFrom: { [chainId in ChainId]?: string } = {
    [ChainId.MAINNET]: 'Uniswap',
    [ChainId.BSC]: 'PancakeSwap',
    [ChainId.MATIC]: 'QuickSwap'
}

export default function Pool() {
    const { i18n } = useLingui()
    const theme = useContext(ThemeContext)
    const history = useHistory()
    const { account, chainId } = useActiveWeb3React()

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

    return (
        <>
            <Helmet>
                <title>{i18n._(t`Pool`)} | Sushi</title>
            </Helmet>
            <div className="bg-dark-900 w-full max-w-2xl rounded shadow-liquidity-purple-glow">
                <ExchangeHeader />
                <div id="pool-page" className="p-4">
                    <SwapPoolTabs active={'pool'} />
                    <Alert
                        title={i18n._(t`Liquidity Provider Rewards`)}
                        message={t`Liquidity providers earn a 0.25% fee on all trades proportional to their share of
                        the pool. Fees are added to the pool, accrue in real time and can be claimed by
                        withdrawing your liquidity`}
                        type="information"
                    />
                    <div className="flex justify-between items-center my-4">
                        <div className="text-xl text-high-emphesis font-medium">
                            {i18n._(t`Your Liquidity Positions`)}
                        </div>
                        <div className="text-sm font-bold">
                            <Trans>
                                Don&apos;t see a pool you joined?{' '}
                                <Link id="import-pool-link" to="/find" className="text-blue">
                                    Import it.
                                </Link>
                            </Trans>
                        </div>
                    </div>
                    <div className="grid grid-flow-row gap-3">
                        {!account ? (
                            <Card padding="40px">
                                <TYPE.body color={theme.text3} textAlign="center">
                                    {i18n._(t`Connect to a wallet to view your liquidity`)}
                                </TYPE.body>
                            </Card>
                        ) : v2IsLoading ? (
                            <EmptyProposals>
                                <TYPE.body color={theme.text3} textAlign="center">
                                    <Dots>{i18n._(t`Loading`)}</Dots>
                                </TYPE.body>
                            </EmptyProposals>
                        ) : allV2PairsWithLiquidity?.length > 0 || stakingPairs?.length > 0 ? (
                            <>
                                {/* <ButtonSecondary>
                  <RowBetween>
                    <ExternalLink href={'https://uniswap.info/account/' + account}>
                      Account analytics and accrued fees
                    </ExternalLink>
                    <span> ↗</span>
                  </RowBetween>
                </ButtonSecondary> */}
                                {v2PairsWithoutStakedAmount.map(v2Pair => (
                                    <FullPositionCard key={v2Pair.liquidityToken.address} pair={v2Pair} />
                                ))}
                                {stakingPairs.map(
                                    (stakingPair, i) =>
                                        stakingPair[1] && ( // skip pairs that arent loaded
                                            <FullPositionCard
                                                key={stakingInfosWithBalance[i].stakingRewardAddress}
                                                pair={stakingPair[1]}
                                                stakedBalance={stakingInfosWithBalance[i].stakedAmount}
                                            />
                                        )
                                )}
                            </>
                        ) : (
                            <EmptyProposals>
                                <TYPE.body color={theme.text3} textAlign="center">
                                    {i18n._(t`No liquidity found`)}
                                </TYPE.body>
                            </EmptyProposals>
                        )}

                        {chainId && [ChainId.MAINNET, ChainId.BSC, ChainId.MATIC].includes(chainId) && (
                            <Text textAlign="center" fontSize={14} style={{ padding: '.5rem 0 .5rem 0' }}>
                                {i18n._(t`Have Liquidity on ${(chainId && migrateFrom[chainId]) ?? ''}?`)}{' '}
                                <StyledInternalLink id="migrate-pool-link" to={'/migrate'}>
                                    {i18n._(t`Migrate Now`)}
                                </StyledInternalLink>
                            </Text>
                        )}
                        <div className="grid grid-cols-2 gap-4">
                            <Button id="join-pool-button" color="gradient" onClick={() => history.push('/add/ETH')}>
                                {i18n._(t`Add Liquidity`)}
                            </Button>
                            <Button
                                id="create-pool-button"
                                color="default"
                                className="bg-dark-800"
                                onClick={() => history.push('/create/ETH')}
                            >
                                {i18n._(t`Create a pair`)}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
