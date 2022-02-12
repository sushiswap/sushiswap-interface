import { ChainId, SUSHI_ADDRESS } from '@sushiswap/core-sdk'
import TimespanGraph from 'app/components/TimespanGraph'
import { XSUSHI } from 'app/config/tokens'
import AnalyticsContainer from 'app/features/analytics/AnalyticsContainer'
import Background from 'app/features/analytics/Background'
import InfoCard from 'app/features/analytics/Bar/InfoCard'
import ColoredNumber from 'app/features/analytics/ColoredNumber'
import { classNames, formatNumber, formatPercent } from 'app/functions'
import { aprToApy } from 'app/functions/convert/apyApr'
import { useDayData, useFactory, useNativePrice, useOneDayBlock, useTokenDayData, useTokens } from 'app/services/graph'
import { useBar, useBarHistory } from 'app/services/graph/hooks/bar'
import React, { useMemo } from 'react'

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

export default function XSushi() {
  const block1d = useOneDayBlock({ chainId: ChainId.ETHEREUM })

  const exchange = useFactory({ chainId: ChainId.ETHEREUM })

  const exchange1d = useFactory({
    chainId: ChainId.ETHEREUM,
    variables: {
      block: block1d,
    },
  })

  const dayData = useDayData({ chainId: ChainId.ETHEREUM })

  const ethPrice = useNativePrice({ chainId: ChainId.ETHEREUM })

  const ethPrice1d = useNativePrice({
    chainId: ChainId.ETHEREUM,
    variables: { block: block1d },
    shouldFetch: !!block1d,
  })

  const xSushi = useTokens({
    chainId: ChainId.ETHEREUM,
    variables: { where: { id: XSUSHI.address.toLowerCase() } },
  })?.[0]

  const xSushi1d = useTokens({
    chainId: ChainId.ETHEREUM,
    variables: { block: block1d, where: { id: XSUSHI.address.toLowerCase() } },
  })?.[0]

  const sushiDayData = useTokenDayData({
    chainId: ChainId.ETHEREUM,
    variables: { where: { token: SUSHI_ADDRESS[ChainId.ETHEREUM].toLowerCase() } },
  })

  const bar = useBar()

  const bar1d = useBar({ variables: { block: block1d }, shouldFetch: !!block1d })

  const barHistory = useBarHistory()

  const [xSushiPrice, xSushiMarketcap] = [
    xSushi?.derivedETH * ethPrice,
    xSushi?.derivedETH * ethPrice * bar?.totalSupply,
  ]

  const [xSushiPrice1d, xSushiMarketcap1d] = [
    xSushi1d?.derivedETH * ethPrice1d,
    xSushi1d?.derivedETH * ethPrice1d * bar1d?.totalSupply,
  ]

  const data = useMemo(
    () =>
      barHistory && dayData && sushiDayData && bar
        ? // @ts-ignore TYPE NEEDS FIXING
          barHistory.map((barDay) => {
            // @ts-ignore TYPE NEEDS FIXING
            const exchangeDay = dayData.find((day) => day.date === barDay.date)
            //@ts-ignore TYPE NEEDS FIXING
            const sushiDay = sushiDayData.find((day) => day.date === barDay.date)

            const totalSushiStakedUSD = barDay.xSushiSupply * barDay.ratio * sushiDay.priceUSD

            const APR =
              totalSushiStakedUSD !== 0 ? ((exchangeDay.volumeUSD * 0.0005 * 365) / totalSushiStakedUSD) * 100 : 0

            return {
              APR: APR,
              APY: aprToApy(APR, 365),
              xSushiSupply: barDay.xSushiSupply,
              date: barDay.date,
              feesReceived: exchangeDay.volumeUSD * 0.0005,
              sushiStaked: barDay.sushiStaked,
              sushiHarvested: barDay.sushiHarvested,
            }
          })
        : [],
    [barHistory, dayData, sushiDayData, bar]
  )

  const APY1d = aprToApy(
    (((exchange?.volumeUSD - exchange1d?.volumeUSD) * 0.0005 * 365.25) / (bar?.totalSupply * xSushiPrice)) * 100 ?? 0
  )
  // @ts-ignore TYPE NEEDS FIXING
  const APY1w = aprToApy(data.slice(-7).reduce((acc, day) => (acc += day.APY), 0) / 7)

  const graphs = useMemo(
    () => [
      {
        title: 'xSushi Performance',
        labels: ['Daily APY', 'Daily APR'],
        data: [
          // @ts-ignore TYPE NEEDS FIXING
          data.map((d) => ({
            date: d.date * 1000,
            value: d.APY,
          })),
          // @ts-ignore TYPE NEEDS FIXING
          data.map((d) => ({
            date: d.date * 1000,
            value: d.APR,
          })),
        ],
      },
      {
        title: 'Daily Fees Received',
        labels: ['Fees (USD)'],
        data: [
          // @ts-ignore TYPE NEEDS FIXING
          data.map((d) => ({
            date: d.date * 1000,
            value: d.feesReceived,
          })),
        ],
      },
      {
        title: 'xSushi Supply Movements',
        labels: ['Daily Minted', 'Daily Burned'],
        data: [
          // @ts-ignore TYPE NEEDS FIXING
          data.map((d) => ({
            date: d.date * 1000,
            value: d.sushiStaked,
          })),
          // @ts-ignore TYPE NEEDS FIXING
          data.map((d) => ({
            date: d.date * 1000,
            value: d.sushiHarvested,
          })),
        ],
      },
      {
        title: 'xSushi Total Supply',
        labels: ['Supply'],
        data: [
          // @ts-ignore TYPE NEEDS FIXING
          data.map((d) => ({
            date: d.date * 1000,
            value: d.xSushiSupply,
          })),
        ],
      },
    ],
    [data]
  )

  return (
    <AnalyticsContainer>
      <Background background="bar">
        <div className="grid items-center justify-between grid-cols-1 gap-x-4 gap-y-2 md:grid-cols-2">
          <div className="space-y-5">
            <div className="text-3xl font-bold text-high-emphesis">xSushi</div>
            <div>Find out all about xSushi here.</div>
          </div>
          <div className="flex space-x-12">
            <div className="flex flex-col">
              <div>Price</div>
              <div className="flex items-center space-x-2">
                <div className="text-lg font-medium text-high-emphesis">{formatNumber(xSushiPrice ?? 0, true)}</div>
                <ColoredNumber number={(xSushiPrice / xSushiPrice1d) * 100 - 100} percent={true} />
              </div>
            </div>
            <div className="flex flex-col">
              <div>Market Cap</div>
              <div className="flex items-center space-x-2">
                <div className="text-lg font-medium text-high-emphesis">
                  {formatNumber(xSushiMarketcap ?? 0, true, false)}
                </div>
                <ColoredNumber number={(xSushiMarketcap / xSushiMarketcap1d) * 100 - 100} percent={true} />
              </div>
            </div>
          </div>
        </div>
      </Background>
      <div className="px-4 pt-4 space-y-5 lg:px-14">
        <div className="flex flex-row space-x-4 overflow-auto">
          <InfoCard text="APY (Last 24 Hours)" number={formatPercent(APY1d)} />
          <InfoCard text="APY (Last 7 Days)" number={formatPercent(APY1w)} />
          <InfoCard text="xSUSHI Supply" number={formatNumber(bar?.totalSupply)} />
          <InfoCard text="xSUSHI : SUSHI" number={Number(bar?.ratio ?? 0)?.toFixed(4)} />
        </div>
        <div className="space-y-4">
          {graphs.map((graph, i) => (
            <div
              className={classNames(
                graph.data[0].length === 0 && 'hidden',
                'p-1 rounded bg-dark-900 border border-dark-700'
              )}
              key={i}
            >
              <div className="w-full h-96">
                <TimespanGraph
                  labels={graph.labels}
                  title={graph.title}
                  timespans={chartTimespans}
                  defaultTimespan="1M"
                  data={graph.data}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </AnalyticsContainer>
  )
}
