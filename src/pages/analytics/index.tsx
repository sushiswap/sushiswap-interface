import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Typography from 'app/components/Typography'
import getAnalyticsBentobox from 'app/features/analytics/bentobox/getAnalyticsBentobox'
import TokenTable from 'app/features/analytics/bentobox/TokenTable'
import ChartCard from 'app/features/analytics/ChartCard'
import getAnalyticsDashboard, { AnalyticsDashboard } from 'app/features/analytics/dashboard/getAnalyticsDashboard'
import getAnalyticsPairs from 'app/features/analytics/pools/getAnalyticsPairs'
import PoolTable from 'app/features/analytics/pools/PoolTable'
import { TridentBody, TridentHeader } from 'app/layouts/Trident'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'
import useSWR, { SWRConfig } from 'swr'

const chartTimespans = [
  {
    text: '1W',
    length: 604800,
  },
  {
    text: '1M',
    length: 2629746,
  },
  {
    text: '1Y',
    length: 31556952,
  },
  {
    text: 'ALL',
    length: Infinity,
  },
]

export default function Analytics({ fallback }: { fallback: any }) {
  return (
    <SWRConfig value={{ fallback }}>
      <_Analytics />
    </SWRConfig>
  )
}

function _Analytics(): JSX.Element {
  const { i18n } = useLingui()
  const router = useRouter()
  const chainId = Number(router.query.chainId)

  const { data } = useSWR<AnalyticsDashboard>(chainId ? `/api/analytics/dashboard/${chainId}` : null, (url: string) =>
    fetch(url).then((response) => response.json())
  )

  const chartDataWithDates = {
    liquidity: data?.liquidity.chart.map((day: any) => ({ ...day, x: new Date(day.x * 1000) })),
    volume: data?.volume.chart.map((day: any) => ({ ...day, x: new Date(day.x * 1000) })),
  }

  return (
    <>
      <NextSeo title={`Sushi Analytics`} />
      <TridentHeader className="sm:!flex-row justify-between items-center" pattern="bg-bubble">
        <div>
          <Typography variant="h2" className="text-high-emphesis" weight={700}>
            {i18n._(t`Sushi Analytics.`)}
          </Typography>
          <Typography variant="sm" weight={400}>
            {i18n._(t`Dive deeper in the analytics of Sushi Bar, BentoBox, Pools, Farms and Tokens.`)}
          </Typography>
        </div>
      </TridentHeader>

      <TridentBody>
        <div className="flex flex-col w-full gap-10">
          <div className="text-2xl font-bold text-high-emphesis">Overview</div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <ChartCard
              header="TVL"
              subheader="SUSHI AMM"
              figure={data?.liquidity.value ?? 0}
              change={data?.liquidity.change ?? 0}
              chart={chartDataWithDates.liquidity}
              defaultTimespan="1M"
              timespans={chartTimespans}
            />
            <ChartCard
              header="Volume"
              subheader="SUSHI AMM"
              figure={data?.volume.value ?? 0}
              change={data?.volume.change ?? 0}
              chart={chartDataWithDates.volume}
              defaultTimespan="1M"
              timespans={chartTimespans}
            />
          </div>
          <div className="pt-4">
            <PoolTable chainId={chainId} />
            <TokenTable chainId={chainId} />
          </div>
        </div>
      </TridentBody>
    </>
  )
}

export const getServerSideProps: GetServerSideProps<any> = async ({ query, res }) => {
  if (typeof query.chainId !== 'string') return { props: { fallback: {} } }

  res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300')

  return {
    props: {
      fallback: {
        [`/api/analytics/dashboard/${query.chainId}`]: await getAnalyticsDashboard({
          chainId: Number(query.chainId),
        }),
        [`/api/analytics/bentobox/${query.chainId}`]: await getAnalyticsBentobox({
          chainId: Number(query.chainId),
        }),
        [`/api/analytics/pairs/${query.chainId}`]: await getAnalyticsPairs({
          chainId: Number(query.chainId),
          first: 10,
        }),
      },
    },
  }
}
