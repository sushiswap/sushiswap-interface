import { ChainId } from '@figswap/core-sdk'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Typography from 'app/components/Typography'
import InfoCard from 'app/features/analytics/bar/InfoCard'
import SushiInOut from 'app/features/analytics/bar/SushiInOut'
import { formatNumber, formatPercent } from 'app/functions'
import { TridentBody, TridentHeader } from 'app/layouts/Trident'
import { useOneYearBlock, useSixMonthBlock, useThreeMonthBlock } from 'app/services/graph/hooks'
import { useBarXsushi, useBarXsushiUser } from 'app/services/graph/hooks/bar'
import { useBar } from 'app/services/graph/hooks/bar'
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'

export default function User() {
  const router = useRouter()
  const account = router.query.account as string
  const { i18n } = useLingui()

  const { data: xsushi } = useBarXsushi()
  const { data: xsushiUser } = useBarXsushiUser({
    variables: { id: account?.toLowerCase() },
  })

  const { data: block3m } = useThreeMonthBlock({ chainId: ChainId.ETHEREUM })
  const { data: block6m } = useSixMonthBlock({ chainId: ChainId.ETHEREUM })
  const { data: block1y } = useOneYearBlock({ chainId: ChainId.ETHEREUM })

  const { data: bar3m } = useBar({
    variables: {
      block: block3m,
    },
    shouldFetch: !!block3m,
  })
  const { data: bar6m } = useBar({
    variables: {
      block: block6m,
    },
    shouldFetch: !!block6m,
  })
  const { data: bar1y } = useBar({
    variables: {
      block: block1y,
    },
    shouldFetch: !!block1y,
  })

  const apy3m = (xsushi?.sushiXsushiRatio / bar3m?.ratio - 1) * 4 * 100
  const apy6m = (xsushi?.sushiXsushiRatio / bar6m?.ratio - 1) * 2 * 100
  const apy1y = (xsushi?.sushiXsushiRatio / bar1y?.ratio - 1) * 100
  const averageAPY = (apy3m + apy6m + apy1y) / 3

  const xsushiBalance = xsushiUser?.balance / 1e18 || 0
  const sushiBalance = xsushiBalance * xsushi?.sushiXsushiRatio ?? 0

  // @ts-ignore TYPE NEEDS FIXING
  const sushiDeposited = xsushiUser?.deposits?.reduce((previousValue, currentValue) => {
    return previousValue + (currentValue.amount || 0) * (currentValue.sushiXsushiRatio || 0)
  }, 0)
  // @ts-ignore TYPE NEEDS FIXING
  const sushiWithdrawn = xsushiUser?.withdrawals?.reduce((previousValue, currentValue) => {
    return previousValue + (currentValue.amount || 0) * (currentValue.sushiXsushiRatio || 0)
  }, 0)

  const userStakedSushi = sushiDeposited - sushiWithdrawn
  const sushiEarned = sushiBalance - userStakedSushi
  const sushiEarnedPercent = (sushiEarned / userStakedSushi) * 100

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
            <InfoCard text={i18n._('SUSHI Staked')} number={formatNumber(userStakedSushi, false)} />
            <InfoCard text={i18n._('SUSHI Earned')} number={formatNumber(sushiEarned, false)} />
            <InfoCard text={i18n._('% SUSHI Earned')} number={formatPercent(sushiEarnedPercent)} />
            <InfoCard text={i18n._('Average APY')} number={formatPercent(averageAPY)} />
          </div>
          {(xsushiUser?.deposits?.length > 0 || xsushiUser?.withdrawals?.length > 0) && (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <SushiInOut
                title={i18n._('SUSHI In')}
                xsushi={xsushi}
                transactions={xsushiUser.deposits}
                sushiIn={true}
              />
              <SushiInOut
                title={i18n._('SUSHI Out')}
                xsushi={xsushi}
                transactions={xsushiUser.withdrawals}
                sushiIn={false}
              />
            </div>
          )}
        </div>
      </TridentBody>
    </>
  )
}
