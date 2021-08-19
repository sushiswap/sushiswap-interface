import { classNames, formatNumber } from '../../functions'
import ColoredNumber from './ColoredNumber'
import LineGraph from '../../components/LineGraph'

interface ChartCardProps {
  header: string
  figure: number
  change: number
  chart: any
  currentTimespan: string
  timespans: string[]
  setTimespan: Function
}

export default function ChartCard({
  header,
  figure,
  change,
  chart,
  currentTimespan,
  timespans,
  setTimespan,
}: ChartCardProps): JSX.Element {
  return (
    <div className="w-full font-bold rounded bg-dark-900">
      <div className="p-4">
        <div className="text-lg text-primary">{header}</div>
        <div className="text-2xl text-high-emphesis">{formatNumber(figure, true, false)}</div>
        <div className="flex flex-row items-center">
          <ColoredNumber number={change} percent={true} />
          <div className="ml-3 text-sm text-secondary">Last 24 Hours</div>
        </div>
      </div>
      <div className="h-36">{chart && <LineGraph data={chart} />}</div>
      <div className="flex flex-row justify-end pb-4 pr-4 space-x-2">
        {timespans.map((timespan, i) => (
          <button
            key={i}
            className={classNames(timespan === currentTimespan ? 'text-high-emphesis' : 'text-secondary', 'font-bold')}
            onClick={() => setTimespan(timespan)}
          >
            {timespan}
          </button>
        ))}
      </div>
    </div>
  )
}
