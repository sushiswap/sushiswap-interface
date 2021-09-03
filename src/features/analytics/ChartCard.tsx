import { classNames, formatNumber } from '../../functions'
import ColoredNumber from './ColoredNumber'
import LineGraph from '../../components/LineGraph'

interface ChartCardProps {
  header: string
  subheader: string
  figure: number
  change: number
  chart: any
  currentTimespan: string
  timespans: string[]
  setTimespan: Function
}

export default function ChartCard({
  header,
  subheader,
  figure,
  change,
  chart,
  currentTimespan,
  timespans,
  setTimespan,
}: ChartCardProps): JSX.Element {
  return (
    <div className="w-full p-5 space-y-4 font-bold border rounded bg-dark-900 border-dark-700">
      <div className="flex justify-between">
        <div>
          <div className="text-xs text-secondary">{subheader}</div>
          <div className="text-high-emphesis">{header}</div>
        </div>
        <div>
          <div className="flex justify-end text-2xl text-high-emphesis">{formatNumber(figure, true, false)}</div>
          <div className="flex flex-row items-center justify-end">
            <ColoredNumber number={change} percent={true} />
            <div className="ml-3 font-normal">Past 24 Hours</div>
          </div>
        </div>
      </div>
      <div className="py-8 h-36">
        {chart && <LineGraph data={chart} stroke={{ gradient: { from: '#27B0E6', to: '#FA52A0' } }} strokeWidth={1} />}
      </div>
      <div className="flex flex-row justify-end space-x-4">
        {timespans.map((timespan, i) => (
          <button
            key={i}
            className={classNames(
              timespan === currentTimespan
                ? 'text-blue bg-blue bg-opacity-30 rounded-xl font-bold border border-blue border-opacity-50'
                : 'text-secondary',
              'text-sm px-3 py-0.5'
            )}
            onClick={() => setTimespan(timespan)}
          >
            {timespan}
          </button>
        ))}
      </div>
    </div>
  )
}
