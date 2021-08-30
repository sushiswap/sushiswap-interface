import { ChainId, SUSHI_ADDRESS } from '@sushiswap/sdk'
import React, { useMemo } from 'react'
import ScrollableGraph from '../../components/ScrollableGraph'
import AnalyticsContainer from '../../features/analytics/AnalyticsContainer'
import InfoCard from '../../features/analytics/Bar/InfoCard'
import { classNames, formatNumber, formatPercent } from '../../functions'
import { aprToApy } from '../../functions/convert/apyApr'
import { useBlock, useDayData, useFactory, useSushiPrice, useTokenDayData } from '../../services/graph'
import { useBar, useBarHistory } from '../../services/graph/hooks/bar'

export default function Bar() {
  const block1d = useBlock({ daysAgo: 1, chainId: ChainId.MAINNET })

  const exchange = useFactory({ chainId: ChainId.MAINNET })
  const exchange1d = useFactory({ block: block1d, chainId: ChainId.MAINNET })

  const dayData = useDayData()

  const sushiPriceUSD = useSushiPrice()
  const sushiDayData = useTokenDayData({ token: SUSHI_ADDRESS['1'], chainId: ChainId.MAINNET })

  const bar = useBar()
  const barHistory = useBarHistory()

  const data = useMemo(
    () =>
      barHistory && dayData && sushiDayData && bar
        ? barHistory.map((barDay) => {
            const exchangeDay = dayData.find((day) => day.date === barDay.date)
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
              sushiStakedUSD: barDay.sushiStakedUSD,
              sushiHarvestedUSD: barDay.sushiHarvestedUSD,
            }
          })
        : [],
    [barHistory, dayData, sushiDayData, bar]
  )

  const APY1d = aprToApy(
    (((exchange?.volumeUSD - exchange1d?.volumeUSD) * 0.0005 * 365.25) /
      (bar?.totalSupply * bar?.ratio * sushiPriceUSD)) *
      100 ?? 0
  )
  const APY1w = aprToApy(data.slice(-7).reduce((acc, day) => (acc += day.APY), 0) / 7)

  const graphs = useMemo(
    () => [
      {
        labels: ['APY', 'APR'],
        data: [
          data.map((d) => ({
            date: d.date * 1000,
            value: d.APY,
          })),
          data.map((d) => ({
            date: d.date * 1000,
            value: d.APR,
          })),
        ],
      },
      {
        title: 'Fees received (USD)',
        data: [
          data.map((d) => ({
            date: d.date * 1000,
            value: d.feesReceived,
          })),
        ],
      },
      {
        labels: ['Sushi Staked (USD)', 'Sushi Harvested (USD)'],
        note: '/ day',
        data: [
          data.map((d) => ({
            date: d.date * 1000,
            value: d.sushiStakedUSD,
          })),
          data.map((d) => ({
            date: d.date * 1000,
            value: d.sushiHarvestedUSD,
          })),
        ],
      },
      {
        title: 'xSushi Total Supply',
        data: [
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
      <div className="text-2xl font-bold text-high-emphesis">Sushi Bar</div>
      <div className="flex flex-row space-x-4 overflow-auto">
        <InfoCard text="APY (24h)" number={formatPercent(APY1d)} />
        <InfoCard text="APY (7d)" number={formatPercent(APY1w)} />
        <InfoCard text="xSUSHI in Circulation" number={formatNumber(bar?.totalSupply)} />
        <InfoCard text="xSUSHI : SUSHI" number={Number(bar?.ratio ?? 0)?.toFixed(4)} />
      </div>
      <div className="space-y-4">
        {graphs.map((graph, i) => (
          <div className={classNames(graph.data[0].length === 0 && 'hidden', 'p-1 rounded bg-dark-900')} key={i}>
            <div className="w-full h-96">
              <ScrollableGraph
                labels={graph.labels}
                title={graph.title}
                note={graph.note}
                data={graph.data}
                margin={{ top: 64, right: 32, bottom: 16, left: 64 }}
              />
            </div>
          </div>
        ))}
      </div>
    </AnalyticsContainer>
  )
}
