import { useBlock, useDayData, useFactory } from '../../../services/graph'
import { useEffect, useMemo, useState } from 'react'

import ChartCard from '../ChartCard'

interface DashboardChartCardProps {
  type: 'liquidity' | 'volume'
}

const types = {
  liquidity: {
    header: 'TVL',
    getData: (exchange, exchange1d, exchange2d) => ({
      figure: exchange?.liquidityUSD,
      change: (exchange1d?.liquidityUSD / exchange2d?.liquidityUSD) * 100 - 100,
    }),
    getChart: (dayData) =>
      dayData?.sort((a, b) => a.date - b.date).map((day, i) => ({ x: i, y: Number(day.liquidityUSD) })),
  },
  volume: {
    header: 'Volume',
    getData: (exchange, exchange1d, exchange2d) => ({
      figure: exchange && exchange1d ? exchange.volumeUSD - exchange1d.volumeUSD : 0,
      change:
        ((exchange?.volumeUSD - exchange1d?.volumeUSD) / (exchange1d?.volumeUSD - exchange2d?.volumeUSD)) * 100 - 100,
    }),
    getChart: (dayData) =>
      dayData?.sort((a, b) => a.date - b.date).map((day, i) => ({ x: i, y: Number(day.volumeUSD) })),
  },
}

export default function DashboardChartCard(props: DashboardChartCardProps): JSX.Element {
  const [chartTimespan, setChartTimespan] = useState('1M')
  const chartTimespans = ['1W', '1M', '1Y', 'ALL']

  const [chart, setChart] = useState(undefined)

  const type = types[props.type]

  const block1d = useBlock({ daysAgo: 1 })
  const block2d = useBlock({ daysAgo: 2 })

  const exchange = useFactory()
  const exchange1d = useFactory({ block: block1d })
  const exchange2d = useFactory({ block: block2d })

  const dayData = useDayData({
    first: chartTimespan === '1W' ? 7 : chartTimespan === '1M' ? 30 : chartTimespan === '1Y' ? 365 : undefined,
  })

  // To prevent the chart from dissapearing while fetching new data
  useEffect(() => {
    if (dayData) {
      setChart(type.getChart(dayData))
    }
  }, [dayData])

  const data = useMemo(() => type.getData(exchange, exchange1d, exchange2d), [type, exchange, exchange1d, exchange2d])

  return (
    <ChartCard
      header={type.header}
      subheader={'SUSHI AMM'}
      figure={data.figure}
      change={data.change}
      chart={chart}
      currentTimespan={chartTimespan}
      timespans={chartTimespans}
      setTimespan={setChartTimespan}
    />
  )
}
