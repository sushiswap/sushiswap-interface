import { useBlock, useDayData, useFactory } from '../../../services/graph'
import { useMemo, useState } from 'react'
import ChartCard from '../ChartCard'

interface DashboardChartCardProps {
  type: 'liquidity' | 'volume'
}

const types = {
  liquidity: {
    header: 'Liquidity',
    getData: (exchange, exchange1d, exchange2d, dayData) => ({
      figure: exchange ? exchange.liquidityUSD : 0,
      change: exchange1d && exchange2d ? (exchange1d.liquidityUSD / exchange2d.liquidityUSD) * 100 - 100 : 0,
      chart: dayData
        ? dayData.sort((a, b) => a.date - b.date).map((day, i) => ({ x: i, y: Number(day.liquidityUSD) }))
        : undefined,
    }),
  },
  volume: {
    header: 'Volume',
    getData: (exchange, exchange1d, exchange2d, dayData) => ({
      figure: exchange && exchange1d ? exchange.volumeUSD - exchange1d.volumeUSD : 0,
      change:
        exchange && exchange1d && exchange2d
          ? ((exchange.volumeUSD - exchange1d.volumeUSD) / (exchange1d.volumeUSD - exchange2d.volumeUSD)) * 100 - 100
          : 0,
      chart: dayData
        ? dayData.sort((a, b) => a.date - b.date).map((day, i) => ({ x: i, y: Number(day.volumeUSD) }))
        : undefined,
    }),
  },
}

export default function DashboardChartCard(props: DashboardChartCardProps): JSX.Element {
  const [chartTimespan, setChartTimespan] = useState('1W')
  const chartTimespans = ['1W', '1M', 'ALL']

  const type = types[props.type]

  const block1d = useBlock({ daysAgo: 1 })
  const block2d = useBlock({ daysAgo: 2 })

  const exchange = useFactory()
  const exchange1d = useFactory({ block: block1d })
  const exchange2d = useFactory({ block: block2d })

  const dayData = useDayData({
    first: chartTimespan === '1W' ? 7 : chartTimespan === '1M' ? 30 : undefined,
  })

  const data = useMemo(
    () => type.getData(exchange, exchange1d, exchange2d, dayData),
    [exchange, exchange1d, exchange2d, dayData]
  )

  return (
    <ChartCard
      header={type.header}
      figure={data.figure}
      change={data.change}
      chart={data.chart}
      currentTimespan={chartTimespan}
      timespans={chartTimespans}
      setTimespan={setChartTimespan}
    />
  )
}
