import { classNames, formatDateAgo, formatNumber } from '../../functions'

import ColoredNumber from './ColoredNumber'
import LineGraph from '../../components/LineGraph'
import { useMemo, useState } from 'react'

interface ChartCardProps {
  header: string
  subheader: string
  figure: number
  change: number
  chart: {
    x: Date
    y: number
  }[]
  defaultTimespan?: string
  timespans: {
    text: string
    length: number
  }[]
}

const formatDate = (date: Date) =>
  `${date.toLocaleDateString('default', { month: 'short' })} ${date.getDate()}, '${String(date.getFullYear()).replace(
    '20',
    ''
  )}`

export default function ChartCard({
  header,
  subheader,
  figure,
  change,
  chart,
  defaultTimespan,
  timespans,
}: ChartCardProps): JSX.Element {
  const [timespan, setTimespan] = useState(timespans?.find((t) => t.text === defaultTimespan))
  const [overrideFigure, setOverrideFigure] = useState(undefined)
  const [overrideDate, setOverrideDate] = useState(undefined)

  const chartFiltered = useMemo(() => {
    const currentDate = Math.round(Date.now() / 1000)
    return chart?.filter((e) => Math.round(e.x.getTime() / 1000) >= currentDate - timespan?.length)
  }, [chart, timespan?.length])

  return (
    <div className="w-full p-5 space-y-4 font-bold border rounded bg-dark-900 border-dark-700">
      <div className="flex justify-between">
        <div>
          <div className="text-xs text-secondary">{subheader}</div>
          <div className="text-high-emphesis">{header}</div>
        </div>
        <div>
          <div className="flex justify-end text-2xl text-high-emphesis">
            {formatNumber(overrideFigure ?? figure, true, false)}
          </div>
          <div className="flex flex-row items-center justify-end">
            {!overrideFigure && <ColoredNumber number={change} percent={true} />}
            <div className="ml-3 font-normal">{overrideDate ? formatDate(overrideDate) : 'Past 24 Hours'}</div>
          </div>
        </div>
      </div>
      <div className="py-4 h-36">
        {chartFiltered && (
          <LineGraph
            data={chartFiltered}
            stroke={{ gradient: { from: '#27B0E6', to: '#FA52A0' } }}
            overrideFigure={setOverrideFigure}
            overrideDate={setOverrideDate}
          />
        )}
      </div>
      <div className="flex flex-row justify-end space-x-4">
        {timespans.map((t, i) => (
          <button
            key={i}
            className={classNames(
              t === timespan
                ? 'text-blue bg-blue bg-opacity-30 rounded-xl font-bold border border-blue border-opacity-50'
                : 'text-secondary',
              'text-sm px-3 py-0.5'
            )}
            onClick={() => setTimespan(t)}
          >
            {t.text}
          </button>
        ))}
      </div>
    </div>
  )
}
