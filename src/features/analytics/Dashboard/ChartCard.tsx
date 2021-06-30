import LineGraph from '../../../components/LineGraph'
import { classNames, formatNumber, formatPercent } from '../../../functions'
import ColoredNumber from '../ColoredNumber'
import { useState, useMemo } from 'react'
import { useCustomDayBlock, useDayData, useExchange, useOneDayBlock } from '../../../services/graph'

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

  const block1d = useOneDayBlock().data?.blocks[0]?.number ?? undefined
  const block2d = useCustomDayBlock(2).data?.blocks[0]?.number ?? undefined

  const { data: exchange } = useExchange()
  const { data: exchange1d } = useExchange({ block: { number: Number(block1d) } })
  const { data: exchange2d } = useExchange({ block: { number: Number(block2d) } })

  const { data: dayData } = useDayData({
    first: chartTimespan === '1W' ? 7 : chartTimespan === '1M' ? 30 : undefined,
  })

  const data = useMemo(
    () => type.getData(exchange, exchange1d, exchange2d, dayData),
    [exchange, exchange1d, exchange2d, dayData]
  )

  return (
    <div className="rounded bg-dark-900 w-full font-bold">
      <div className="p-4">
        <div className="text-primary text-lg">{type.header}</div>
        <div className="text-high-emphesis text-2xl">{formatNumber(data.figure, true, false)}</div>
        <div className="flex flex-row items-center">
          <ColoredNumber number={data.change} percent={true} />
          <div className="text-secondary text-sm ml-3">Last 24 Hours</div>
        </div>
      </div>
      <div className="h-36">{data.chart && <LineGraph data={data.chart} />}</div>
      <div className="flex flex-row justify-end space-x-2 pb-4 pr-4">
        {chartTimespans.map((timespan) => (
          <button
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
