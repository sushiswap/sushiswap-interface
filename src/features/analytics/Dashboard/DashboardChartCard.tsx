import { useBlock, useDayData, useFactory } from '../../../services/graph'
import { useMemo, useState } from 'react'
import ChartCard from '../ChartCard'
import { useActiveWeb3React } from '../../../services/web3'

interface DashboardChartCardProps {
  type: 'liquidity' | 'volume'
}

const types = {
  liquidity: {
    header: 'TVL',
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
  const [chartTimespan, setChartTimespan] = useState('1M')
  const chartTimespans = ['1W', '1M', '1Y', 'ALL']

  const { chainId } = useActiveWeb3React()

  const type = types[props.type]

  const block1d = useBlock({ daysAgo: 1, chainId })
  const block2d = useBlock({ daysAgo: 2, chainId })

  const exchange = useFactory({ chainId })
  const exchange1d = useFactory({ chainId, variables: { block: block1d } })
  const exchange2d = useFactory({ chainId, variables: { block: block2d } })

  console.log({ exchange1d, exchange2d })

  const dayData = useDayData({
    first: chartTimespan === '1W' ? 7 : chartTimespan === '1M' ? 30 : chartTimespan === '1Y' ? 365 : undefined,
    chainId,
  })

  const data = useMemo(
    () => type.getData(exchange, exchange1d, exchange2d, dayData),
    [type, exchange, exchange1d, exchange2d, dayData]
  )

  return (
    <ChartCard
      header={type.header}
      subheader={'SUSHI AMM'}
      figure={data.figure}
      change={data.change}
      chart={data.chart}
      currentTimespan={chartTimespan}
      timespans={chartTimespans}
      setTimespan={setChartTimespan}
    />
  )
}
