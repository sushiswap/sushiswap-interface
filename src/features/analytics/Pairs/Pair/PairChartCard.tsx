import { useBlock, useDayData, useFactory, useNativePrice, useSushiPairs, useToken } from '../../../../services/graph'
import { useMemo, useState } from 'react'
import ChartCard from '../../ChartCard'

interface PairChartCardProps {
  type: 'liquidity' | 'volume'
  pair: string
}

const types = {
  liquidity: {
    header: 'Liquidity',
    getData: (pair, pair1d, pair2d, dayData) => ({
      figure: pair?.reserveUSD,
      change: (pair?.reserveUSD / pair1d?.reserveUSD) * 100 - 100,
      chart: dayData?.sort((a, b) => a.date - b.date).map((day, i) => ({ x: i, y: Number(day.liquidityUSD) })),
    }),
  },
  volume: {
    header: 'Volume',
    getData: (pair, pair1d, pair2d, dayData) => ({
      figure: pair?.volumeUSD - pair1d?.volumeUSD,
      change: ((pair?.volumeUSD - pair1d?.volumeUSD) / (pair1d?.volumeUSD - pair2d?.volumeUSD)) * 100 - 100,
      chart: dayData?.sort((a, b) => a.date - b.date).map((day, i) => ({ x: i, y: Number(day.volumeUSD) })),
    }),
  },
}

export default function PairChartCard(props: PairChartCardProps): JSX.Element {
  const [chartTimespan, setChartTimespan] = useState('1W')
  const chartTimespans = ['1W', '1M', 'ALL']

  const type = types[props.type]

  const block1d = useBlock({ daysAgo: 1 })
  const block2d = useBlock({ daysAgo: 2 })

  const pair = useSushiPairs({ where: { id: props.pair } })?.[0]
  const pair1d = useSushiPairs({ where: { id: props.pair }, block: { number: block1d } })?.[0]
  const pair2d = useSushiPairs({ where: { id: props.pair }, block: { number: block2d } })?.[0]

  const dayData = useDayData({
    first: chartTimespan === '1W' ? 7 : chartTimespan === '1M' ? 30 : undefined,
  })

  const data = useMemo(() => type.getData(pair, pair1d, pair2d, dayData), [pair, pair1d, pair2d, dayData])

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
