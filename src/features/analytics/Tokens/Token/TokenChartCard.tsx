import { useBlock, useDayData, useFactory, useNativePrice, useToken } from '../../../../services/graph'
import { useMemo, useState } from 'react'
import ChartCard from '../../ChartCard'

interface DashboardChartCardProps {
  type: 'liquidity' | 'volume'
  token: string
}

const types = {
  liquidity: {
    header: 'Liquidity',
    getData: (token, token1d, token2d, dayData, nativePrice, nativePrice1d) => ({
      figure: token?.liquidity * token?.derivedETH * nativePrice,
      change:
        ((token?.liquidity * token?.derivedETH * nativePrice) /
          (token1d?.liquidity * token1d?.derivedETH * nativePrice1d)) *
          100 -
        100,
      chart: dayData?.sort((a, b) => a.date - b.date).map((day, i) => ({ x: i, y: Number(day.liquidityUSD) })),
    }),
  },
  volume: {
    header: 'Volume',
    getData: (token, token1d, token2d, dayData) => ({
      figure: token?.volumeUSD - token1d?.volumeUSD,
      change: ((token?.volumeUSD - token1d?.volumeUSD) / (token1d?.volumeUSD - token2d?.volumeUSD)) * 100 - 100,
      chart: dayData?.sort((a, b) => a.date - b.date).map((day, i) => ({ x: i, y: Number(day.volumeUSD) })),
    }),
  },
}

export default function TokenChartCard(props: DashboardChartCardProps): JSX.Element {
  const [chartTimespan, setChartTimespan] = useState('1W')
  const chartTimespans = ['1W', '1M', 'ALL']

  const type = types[props.type]

  const block1d = useBlock({ daysAgo: 1 })
  const block2d = useBlock({ daysAgo: 2 })

  const token = useToken({ id: props.token })
  const token1d = useToken({ id: props.token, block: { number: block1d } })
  const token2d = useToken({ id: props.token, block: { number: block2d } })

  const nativePrice = useNativePrice()
  const nativePrice1d = useNativePrice({ block: { number: block1d } })

  const dayData = useDayData({
    first: chartTimespan === '1W' ? 7 : chartTimespan === '1M' ? 30 : undefined,
  })

  const data = useMemo(
    () => type.getData(token, token1d, token2d, dayData, nativePrice, nativePrice1d),
    [token, token1d, token2d, dayData, nativePrice, nativePrice1d]
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
