import { classNames, formatNumber, formatPercent } from '../../../functions'
import {
  useCustomDayBlock,
  useDayData,
  useExchange,
  useFactory,
  useFarms,
  useOneDayBlock,
} from '../../../services/graph'
import { useMemo, useState } from 'react'

import ColoredNumber from '../ColoredNumber'
import LineGraph from '../../../components/LineGraph'

interface ChartCardProps {
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
        exchange1d && exchange2d
          ? ((exchange.volumeUSD - exchange1d.volumeUSD) / (exchange1d.volumeUSD - exchange2d.volumeUSD)) * 100 - 100
          : 0,
      chart: dayData
        ? dayData.sort((a, b) => a.date - b.date).map((day, i) => ({ x: i, y: Number(day.volumeUSD) }))
        : undefined,
    }),
  },
}

export default function ChartCard(props: ChartCardProps): JSX.Element {
  const [chartTimespan, setChartTimespan] = useState('1W')
  const chartTimespans = ['1W', '1M', 'ALL']

  const type = types[props.type]

  const block1d = useOneDayBlock()
  const block2d = useCustomDayBlock(2)

  const exchange = useFactory()
  const exchange1d = useFactory({ block: { number: Number(block1d) } })
  const exchange2d = useFactory({ block: { number: Number(block2d) } })

  const dayData = useDayData({
    first: chartTimespan === '1W' ? 7 : chartTimespan === '1M' ? 30 : undefined,
  })

  const data = useMemo(
    () => type.getData(exchange, exchange1d, exchange2d, dayData),
    [exchange, exchange1d, exchange2d, dayData]
  )

  return (
    <div className="w-full font-bold rounded bg-dark-900">
      <div className="p-4">
        <div className="text-lg text-primary">{type.header}</div>
        <div className="text-2xl text-high-emphesis">{formatNumber(data.figure, true, false)}</div>
        <div className="flex flex-row items-center">
          <ColoredNumber number={data.change} percent={true} />
          <div className="ml-3 text-sm text-secondary">Last 24 Hours</div>
        </div>
      </div>
      <div className="h-36">{data.chart && <LineGraph data={data.chart} />}</div>
      <div className="flex flex-row justify-end pb-4 pr-4 space-x-2">
        {chartTimespans.map((timespan, i) => (
          <button
            key={i}
            className={classNames(timespan === chartTimespan ? 'text-high-emphesis' : 'text-secondary', 'font-bold')}
            onClick={() => setChartTimespan(timespan)}
          >
            {timespan}
          </button>
        ))}
      </div>
    </div>
  )
}
