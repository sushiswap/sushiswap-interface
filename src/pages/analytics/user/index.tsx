import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { ChainId } from '@sushiswap/core-sdk'
import Typography from 'app/components/Typography'
import InfoCard from 'app/features/analytics/bar/InfoCard'
import SushiInOut from 'app/features/analytics/bar/SushiInOut'
import { formatNumber, formatPercent } from 'app/functions'
import { TridentBody, TridentHeader } from 'app/layouts/Trident'
import { useBarXsushi, useBarXsushiUser } from 'app/services/graph/hooks/bar'
import { useBlock } from 'app/services/graph/hooks/blocks'
import { useActiveWeb3React } from 'app/services/web3'
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'

// https://thegraph.com/hosted-service/subgraph/jiro-ono/xsushi
// https://api.thegraph.com/subgraphs/name/jiro-ono/xsushi/graphql

export default function User() {
  const web3 = useActiveWeb3React()
  const router = useRouter()
  const account = (router.query.address as string) || web3.account
  const chainId = router.query.chainId as string
  const { i18n } = useLingui()

  const { data: xsushi } = useBarXsushi()
  const { data: xsushiUser } = useBarXsushiUser({
    variables: { id: account?.toLowerCase() },
  })

  const { data: block } = useBlock({ chainId: Number(chainId) ?? ChainId.ETHEREUM })

  const { data: xsushiModified } = useBarXsushi({
    variables: {
      id: account?.toLowerCase(),
      block: {
        number: Number(xsushiUser?.modifiedAtBlock),
      },
    },
  })

  const { data: blockModified } = useBlock({
    chainId: Number(chainId) ?? ChainId.ETHEREUM,
    variables: {
      where: {
        number: xsushiUser?.modifiedAtBlock,
      },
    },
  })

  const sushiBalance = xsushiUser?.balance / 1e18 || 0
  const sushiStaked = xsushi?.sushiStaked
  const avgStakedTime = (sushiBalance == 0 ? 0 : block?.timestamp - blockModified?.timestamp) ?? 0

  const apr =
    (sushiBalance === 0
      ? 0
      : ((xsushi?.sushiXsushiRatio / (xsushiModified?.sushiXsushiRatio | 1) - 1) /
          (block?.timestamp - blockModified?.timestamp)) *
        (365 * 3600 * 24)) ?? 0

  const xsushiBalance = sushiBalance * xsushi?.xSushiSushiRatio ?? 0
  const sushiEarnedPercent =
    (sushiBalance === 0 ? 0 : xsushi?.sushiXsushiRatio / (xsushiModified?.sushiXsushiRatio | 1) - 1) ?? 0
  const sushiEarned = sushiEarnedPercent * sushiBalance

  return (
    <>
      <NextSeo title={`User Analytics`} />

      <TridentHeader className="sm:!flex-row justify-between items-center" pattern="bg-bubble">
        <div>
          <Typography variant="h2" className="text-high-emphesis" weight={700}>
            {i18n._(t`User Analytics.`)}
          </Typography>
          <Typography variant="sm" weight={400}>
            {i18n._(t`Find out all about user here.`)}
          </Typography>
        </div>
      </TridentHeader>

      <TridentBody>
        <div className="space-y-5">
          <Typography variant="h3">{i18n._('Overview')}</Typography>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            <InfoCard text={i18n._('User xSUSHI')} number={formatNumber(xsushiBalance, false)} />
            <InfoCard text={i18n._('Underlying SUSHI')} number={formatNumber(sushiBalance, false)} />
            <InfoCard text={i18n._('SUSHI Staked')} number={formatNumber(sushiStaked, false)} />
            <InfoCard text={i18n._('SUSHI Earned')} number={formatNumber(sushiEarned, false)} />
            <InfoCard text={i18n._('% SUSHI Earned')} number={formatPercent(sushiEarnedPercent * 100)} />
            {/* <InfoCard
              text={i18n._('Average Staked Time')}
              number={avgStakedTime === 0 ? '-' : formatNumberPeriod(avgStakedTime)}
            /> */}
            <InfoCard text={i18n._('Average APR')} number={formatPercent(apr * 100)} />
          </div>
          {(xsushiUser?.deposits?.length > 0 || xsushiUser?.withdrawals?.length > 0) && (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <SushiInOut title={i18n._('SUSHI In')} xsushi={xsushi} transactions={xsushiUser.deposits} />
              <SushiInOut title={i18n._('SUSHI Out')} xsushi={xsushi} transactions={xsushiUser.withdrawals} />
            </div>
          )}
        </div>
      </TridentBody>
    </>
  )
}
