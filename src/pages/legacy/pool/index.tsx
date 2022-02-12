import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { CurrencyAmount } from '@sushiswap/core-sdk'
import Alert from 'app/components/Alert'
import Back from 'app/components/Back'
import Container from 'app/components/Container'
import Dots from 'app/components/Dots'
import Empty from 'app/components/Empty'
import FullPositionCard from 'app/components/PositionCard'
import Typography from 'app/components/Typography'
import Web3Connect from 'app/components/Web3Connect'
import { MigrationSupported } from 'app/features/migration'
import { useV2PairsWithLiquidity } from 'app/features/trident/migrate/context/useV2PairsWithLiquidity'
import { useActiveWeb3React } from 'app/services/web3'
import Head from 'next/head'
import { useRouter } from 'next/router'
import React from 'react'

export default function Pool() {
  const { i18n } = useLingui()
  const router = useRouter()
  const { account, chainId } = useActiveWeb3React()
  const { loading, pairs } = useV2PairsWithLiquidity()

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
  // @ts-ignore TYPE NEEDS FIXING
  const migrationSupported = chainId in MigrationSupported
  return (
    <Container id="pool-page" className="py-4 space-y-6 md:py-8 lg:py-12" maxWidth="2xl">
      <Head>
        <title>Pool | Sushi</title>
        <meta
          key="description"
          name="description"
          content="SushiSwap liquidity pools are markets for trades between the two tokens, you can provide these tokens and become a liquidity provider to earn 0.25% of fees from trades."
        />
        <meta
          key="twitter:description"
          name="twitter:description"
          content="SushiSwap liquidity pools are markets for trades between the two tokens, you can provide these tokens and become a liquidity provider to earn 0.25% of fees from trades."
        />
        <meta
          key="og:description"
          property="og:description"
          content="SushiSwap liquidity pools are markets for trades between the two tokens, you can provide these tokens and become a liquidity provider to earn 0.25% of fees from trades."
        />
      </Head>

      <div className="p-4 mb-3 space-y-3">
        <Back />

        <Typography component="h1" variant="h2">
          {i18n._(t`My Liquidity Positions`)}
        </Typography>
      </div>

      <Alert
        title={i18n._(t`Liquidity Provider Rewards`)}
        message={i18n._(t`Liquidity providers earn a 0.25% fee on all trades proportional to their share of
                        the pool. Fees are added to the pool, accrue in real time and can be claimed by
                        withdrawing your liquidity`)}
        type="information"
      />

      {!account ? (
        <Web3Connect className="w-full !bg-dark-900 bg-gradient-to-r from-pink/80 hover:from-pink to-purple/80 hover:to-purple text-white h-[38px]" />
      ) : (
        <div className="p-4 space-y-4 rounded bg-dark-900">
          <div className="grid grid-flow-row gap-3">
            {loading ? (
              <Empty>
                <Dots>{i18n._(t`Loading`)}</Dots>
              </Empty>
            ) : pairs?.length > 0 ? (
              <>
                {/* <div className="flex items-center justify-center">
                  <ExternalLink
                    href={"https://analytics.sushi.com/user/" + account}
                  >
                    Account analytics and accrued fees <span> ↗</span>
                  </ExternalLink>
                </div> */}
                {pairs.map((v2Pair) => (
                  <FullPositionCard
                    key={v2Pair.liquidityToken.address}
                    pair={v2Pair}
                    stakedBalance={CurrencyAmount.fromRawAmount(v2Pair.liquidityToken, '0')}
                  />
                ))}
              </>
            ) : (
              <Empty className="flex text-lg text-center text-low-emphesis">
                <div className="px-4 py-2">{i18n._(t`No liquidity was found. `)}</div>
              </Empty>
            )}
          </div>
        </div>
      )}
    </Container>
  )
}
