import { useBlock, useDayData, useSushiPairs } from '../../../../services/graph'
import { useEffect, useMemo, useState } from 'react'
import ChartCard from '../../ChartCard'

interface PairChartCardProps {
  type: 'liquidity' | 'volume'
  name: string
  pair: string
}

const types = {
  liquidity: {
    header: 'Liquidity',
    getData: (pair, pair1d) => ({
      figure: pair?.reserveUSD,
      change: (pair?.reserveUSD / pair1d?.reserveUSD) * 100 - 100,
    }),
    getChart: (dayData) =>
      dayData?.sort((a, b) => a.date - b.date).map((day, i) => ({ x: i, y: Number(day.liquidityUSD) })),
  },
  volume: {
    header: 'Volume',
    getData: (pair, pair1d, pair2d) => ({
      figure: pair?.volumeUSD - pair1d?.volumeUSD,
      change: ((pair?.volumeUSD - pair1d?.volumeUSD) / (pair1d?.volumeUSD - pair2d?.volumeUSD)) * 100 - 100,
    }),
    getChart: (dayData) =>
      dayData?.sort((a, b) => a.date - b.date).map((day, i) => ({ x: i, y: Number(day.volumeUSD) })),
  },
}

export default function PairChartCard(props: PairChartCardProps): JSX.Element {
  const [chartTimespan, setChartTimespan] = useState('1M')
  const chartTimespans = ['1W', '1M', 'ALL']

  const [chart, setChart] = useState(undefined)

  const type = types[props.type]

  const block1d = useBlock({ daysAgo: 1 })
  const block2d = useBlock({ daysAgo: 2 })

  const pair = useSushiPairs({ subset: [props.pair], shouldFetch: !!props.pair })?.[0]
  const pair1d = useSushiPairs({ subset: [props.pair], block: block1d, shouldFetch: !!props.pair && !!block1d })?.[0]
  const pair2d = useSushiPairs({ subset: [props.pair], block: block2d, shouldFetch: !!props.pair && !!block2d })?.[0]

  const dayData = useDayData({
    first: chartTimespan === '1W' ? 7 : chartTimespan === '1M' ? 30 : undefined,
  })

  // To prevent the chart from dissapearing while fetching new data
  useEffect(() => {
    if (dayData) {
      setChart(type.getChart(dayData))
    }
  }, [dayData])

  const data = useMemo(() => type.getData(pair, pair1d, pair2d), [pair, pair1d, pair2d])

  return (
    <ChartCard
      header={type.header}
      subheader={props.name}
      figure={data.figure}
      change={data.change}
      chart={chart}
      currentTimespan={chartTimespan}
      timespans={chartTimespans}
      setTimespan={setChartTimespan}
    />
  )
}
