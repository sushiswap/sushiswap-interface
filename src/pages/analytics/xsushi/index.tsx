import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import TimespanGraph from 'app/components/TimespanGraph'
import Typography from 'app/components/Typography'
import getAnalyticsXsushi, { AnalyticsXsushi } from 'app/features/analytics/xsushi/getAnalyticsXsushi'
import InfoCard from 'app/features/analytics/xsushi/InfoCard'
import { classNames, formatNumber, formatPercent } from 'app/functions'
import { TridentBody, TridentHeader } from 'app/layouts/Trident'
import { useBarFeesDaysAgo } from 'app/services/graph/hooks/bar'
import { GetServerSideProps } from 'next'
import { NextSeo } from 'next-seo'
import React, { useMemo } from 'react'
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

export default function XSushi({ fallback }: { fallback: any }) {
  return (
    <SWRConfig value={{ fallback }}>
      <_XSushi />
    </SWRConfig>
  )
}

function _XSushi() {
  const { i18n } = useLingui()

  const { data } = useSWR<AnalyticsXsushi>('/api/analytics/xsushi', (url: string) =>
    fetch(url).then((response) => response.json())
  )

  const graphs = useMemo(
    () => [
      {
        title: 'xSushi APY',
        labels: ['APY %'],
        defaultTimespan: '1Y',
        data: [
          // @ts-ignore TYPE NEEDS FIXING
          data.chart
            // @ts-ignore TYPE NEEDS FIXING
            .map((d) => ({
              date: d.date * 1000,
              value: d.apy,
            }))
            // @ts-ignore TYPE NEEDS FIXING
            .filter((d) => d.value !== 0),
        ],
      },
      {
        title: 'xSushi Supply Movements',
        labels: ['Daily Minted', 'Daily Burned'],
        defaultTimespan: '1M',
        data: [
          // @ts-ignore TYPE NEEDS FIXING
          data.chart.map((d) => ({
            date: d.date * 1000,
            value: d.sushiStaked,
          })),
          // @ts-ignore TYPE NEEDS FIXING
          data.chart.map((d) => ({
            date: d.date * 1000,
            value: d.sushiHarvested,
          })),
        ],
      },
      {
        title: 'xSushi Total Supply',
        labels: ['Supply'],
        defaultTimespan: '1M',
        data: [
          // @ts-ignore TYPE NEEDS FIXING
          data.chart.map((d) => ({
            date: d.date * 1000,
            value: d.xSushiSupply,
          })),
        ],
      },
    ],
    [data]
  )

  const { data: fees1m } = useBarFeesDaysAgo({ days: 30 })
  const { data: fees3m } = useBarFeesDaysAgo({ days: 90 })
  const { data: fees6m } = useBarFeesDaysAgo({ days: 180 })
  //const { data: fees1y } = useBarFeesDaysAgo({ days: 365 })

  return (
    <>
      <NextSeo title={`Farm Analytics`} />

      <TridentHeader className="sm:!flex-row justify-between items-center" pattern="bg-bubble">
        <div>
          <Typography variant="h2" className="text-high-emphesis" weight={700}>
            {i18n._(t`xSUSHI Analytics.`)}
          </Typography>
          <Typography variant="sm" weight={400}>
            {i18n._(t`Find out all about xSushi here.`)}
          </Typography>
        </div>
      </TridentHeader>

      <TridentBody>
        <div className="space-y-5">
          <div className="grid grid-flow-col gap-4 overflow-auto grid-col-4">
            <InfoCard text="Price" number={formatNumber(data?.xSushiPrice ?? 0, true)} />
            <InfoCard text="Market Cap" number={formatNumber(data?.xSushiMarketcap ?? 0, true, false)} />
            <InfoCard text="Total Supply" number={formatNumber(data?.bar.totalSupply)} />
            <InfoCard text="xSUSHI : SUSHI" number={Number(data?.bar.ratio ?? 0)?.toFixed(4)} />
          </div>
          <div className="grid grid-flow-col gap-4 overflow-auto grid-col-4">
            <InfoCard text="APY 1m" number={formatPercent(data?.apy1m)} />
            <InfoCard text="APY 3m" number={formatPercent(data?.apy3m)} />
            <InfoCard text="APY 6m" number={formatPercent(data?.apy6m)} />
            <InfoCard text="APY 1y" number={formatPercent(data?.apy1y)} />
          </div>
          <div className="grid grid-flow-col gap-4 overflow-auto grid-col-4">
            <InfoCard text="Sushi Served 1m" number={formatNumber(fees1m, false)} />
            <InfoCard text="Sushi Served 3m" number={formatNumber(fees3m, false)} />
            <InfoCard text="Sushi Served 6m" number={formatNumber(fees6m, false)} />
          </div>
          <div className="space-y-4">
            {graphs.map((graph, i) => (
              <div
                className={classNames(
                  graph.data[0].length === 0 && 'hidden',
                  'p-1 border border-dark-900 rounded shadow-md bg-[rgba(0,0,0,0.12)]'
                )}
                key={i}
              >
                <div className="w-full h-96">
                  <TimespanGraph
                    labels={graph.labels}
                    title={graph.title}
                    timespans={chartTimespans}
                    defaultTimespan={graph.defaultTimespan}
                    data={graph.data}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </TridentBody>
    </>
  )
}

export const getServerSideProps: GetServerSideProps<any> = async ({ res }) => {
  res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600')

  return {
    props: {
      fallback: {
        ['/api/analytics/xsushi']: await getAnalyticsXsushi(),
      },
    },
  }
}
