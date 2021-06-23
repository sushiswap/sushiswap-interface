import { ChainId, CurrencyAmount, JSBI, Pair } from '@sushiswap/sdk'
import React, { useMemo } from 'react'
import { toV2LiquidityToken, useTrackedTokenPairs } from '../../../state/user/hooks'

import Alert from '../../../components/Alert'
import { BIG_INT_ZERO } from '../../../constants'
import Back from '../../../components/Back'
import Button from '../../../components/Button'
import Card from '../../../components/Card'
import Container from '../../../components/Container'
import { Currency } from '@sushiswap/sdk'
import Dots from '../../../components/Dots'
import Empty from '../../../components/Empty'
import ExternalLink from '../../../components/ExternalLink'
import FullPositionCard from '../../../components/PositionCard'
import Head from 'next/head'
import Link from 'next/link'
import Typography from '../../../components/Typography'
import Web3Connect from '../../../components/Web3Connect'
import { t } from '@lingui/macro'
import { useActiveWeb3React } from '../../../hooks/useActiveWeb3React'
import { useETHBalances } from '../../../state/wallet/hooks'
import { useLingui } from '@lingui/react'
import { useRouter } from 'next/router'
import { useTokenBalancesWithLoadingIndicator } from '../../../state/wallet/hooks'
import { useV2Pairs } from '../../../hooks/useV2Pairs'

const migrateFrom: { [chainId in ChainId]?: string } = {
  [ChainId.MAINNET]: 'Uniswap',
  [ChainId.BSC]: 'PancakeSwap',
  [ChainId.MATIC]: 'QuickSwap',
}

export default function Pool() {
  const { i18n } = useLingui()
  const router = useRouter()
  const { account, chainId } = useActiveWeb3React()

  const userEthBalance = useETHBalances(account ? [account] : [])?.[account ?? '']

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
    () => tokenPairsWithLiquidityTokens.map((tpwlt) => tpwlt.liquidityToken),
    [tokenPairsWithLiquidityTokens]
  )
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

  const v2Pairs = useV2Pairs(liquidityTokensWithBalances.map(({ tokens }) => tokens))
  const v2IsLoading =
    fetchingV2PairBalances || v2Pairs?.length < liquidityTokensWithBalances.length || v2Pairs?.some((V2Pair) => !V2Pair)

  const allV2PairsWithLiquidity = v2Pairs.map(([, pair]) => pair).filter((v2Pair): v2Pair is Pair => Boolean(v2Pair))

  // TODO: Replicate this!
  // show liquidity even if its deposited in rewards contract
  // const stakingInfo = useStakingInfo()
  // const stakingInfosWithBalance = stakingInfo?.filter((pool) =>
  //   JSBI.greaterThan(pool.stakedAmount.quotient, BIG_INT_ZERO)
  // )
  // const stakingPairs = useV2Pairs(stakingInfosWithBalance?.map((stakingInfo) => stakingInfo.tokens))

  // // remove any pairs that also are included in pairs with stake in mining pool
  // const v2PairsWithoutStakedAmount = allV2PairsWithLiquidity.filter((v2Pair) => {
  //   return (
  //     stakingPairs
  //       ?.map((stakingPair) => stakingPair[1])
  //       .filter((stakingPair) => stakingPair?.liquidityToken.address === v2Pair.liquidityToken.address).length === 0
  //   )
  // })

  return (
    <>
      <Head>
        <title>Pool | Sushi</title>
        <meta
          name="description"
          content="SushiSwap liquidity pools are markets for trades between the two tokens, you can provide these tokens and become a liquidity provider to earn 0.25% of fees from trades."
        />
      </Head>

      <Container maxWidth="2xl">
        <div className="p-4 mb-3 space-y-3">
          <Back />

          <Typography component="h1" variant="h2">
            {i18n._(t`Your Liquidity Positions`)}
          </Typography>
        </div>

        <div className="p-4 space-y-4 rounded bg-dark-900">
          <Alert
            title={i18n._(t`Liquidity Provider Rewards`)}
            message={i18n._(t`Liquidity providers earn a 0.25% fee on all trades proportional to their share of
                        the pool. Fees are added to the pool, accrue in real time and can be claimed by
                        withdrawing your liquidity`)}
            type="information"
          />

          <div className="grid grid-flow-row gap-3">
            <div className="flex items-center">
              <Link href="/find">
                <a
                  id="import-pool-link"
                  className="px-4 py-2 text-sm text-center cursor-pointer md:p-3 text-semibold text-secondary hover:text-high-emphesis"
                >
                  {i18n._(t`Import Pool Manually`)}
                </a>
              </Link>
              {chainId && migrateFrom[chainId] && [ChainId.MAINNET, ChainId.BSC, ChainId.MATIC].includes(chainId) && (
                <Link href="/migrate">
                  <a
                    id="migrate-pool-link"
                    className="px-4 py-2 text-sm text-center cursor-pointer md:p-3 text-semibold text-secondary hover:text-high-emphesis"
                  >
                    {i18n._(t`Migrate From ${migrateFrom[chainId]}`)}
                  </a>
                </Link>
              )}
            </div>

            {!account ? (
              <Web3Connect size="lg" color="blue" className="w-full" />
            ) : v2IsLoading ? (
              <Empty>
                <Dots>{i18n._(t`Loading`)}</Dots>
              </Empty>
            ) : allV2PairsWithLiquidity?.length > 0 ? (
              <>
                {/* <div className="flex items-center justify-center">
                  <ExternalLink
                    href={"https://analytics.sushi.com/user/" + account}
                  >
                    Account analytics and accrued fees <span> ↗</span>
                  </ExternalLink>
                </div> */}
                {allV2PairsWithLiquidity.map((v2Pair) => (
                  <FullPositionCard
                    key={v2Pair.liquidityToken.address}
                    pair={v2Pair}
                    stakedBalance={CurrencyAmount.fromRawAmount(v2Pair.liquidityToken, '0')}
                  />
                ))}
              </>
            ) : (
              <Empty className="flex space-y-2 text-center text-low-emphesis">
                <div className="px-4 py-2">{i18n._(t`No liquidity found. `)}</div>
              </Empty>
            )}

            {account && (
              <div className="grid grid-cols-2 gap-4 mt-4">
                <Button id="add-pool-button" color="gradient" onClick={() => router.push(`/add/ETH`)}>
                  {i18n._(t`Add Liquidity`)}
                </Button>
                <Button id="create-pool-button" color="gray" onClick={() => router.push(`/add/ETH`)}>
                  {i18n._(t`Create a pair`)}
                </Button>
              </div>
            )}
          </div>
        </div>
      </Container>
    </>
  )
}
