import { useBlock, useDayData, useNativePrice, useTokens } from '../../../../services/graph'
import { useMemo, useState } from 'react'
import ChartCard from '../../ChartCard'
import { useActiveWeb3React } from '../../../../hooks'

interface DashboardChartCardProps {
  type: 'liquidity' | 'volume'
  name: string
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
  const [chartTimespan, setChartTimespan] = useState('1M')
  const chartTimespans = ['1W', '1M', 'ALL']

  const { chainId } = useActiveWeb3React()

  const type = types[props.type]

  const block1d = useBlock({ daysAgo: 1, chainId })
  const block2d = useBlock({ daysAgo: 2, chainId })

  const token = useTokens({ subset: [props.token], chainId })?.[0]
  const token1d = useTokens({ subset: [props.token], block: block1d, shouldFetch: !!block1d, chainId })?.[0]
  const token2d = useTokens({ subset: [props.token], block: block2d, shouldFetch: !!block2d, chainId })?.[0]

  const nativePrice = useNativePrice({ chainId })
  const nativePrice1d = useNativePrice({ block: block1d, chainId })

  const dayData = useDayData({
    first: chartTimespan === '1W' ? 7 : chartTimespan === '1M' ? 30 : undefined,
    chainId,
  })

  const data = useMemo(
    () => type.getData(token, token1d, token2d, dayData, nativePrice, nativePrice1d),
    [token, token1d, token2d, dayData, nativePrice, nativePrice1d]
  )

  return (
    <ChartCard
      header={type.header}
      subheader={props.name}
      figure={data.figure}
      change={data.change}
      chart={data.chart}
      currentTimespan={chartTimespan}
      timespans={chartTimespans}
      setTimespan={setChartTimespan}
    />
  )
}
