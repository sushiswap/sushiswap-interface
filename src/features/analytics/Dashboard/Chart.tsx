import { formatNumber, formatPercent } from '../../../functions'
import ColoredNumber from '../ColoredNumber'

interface ChartProps {
  header: string
  data: {
    figure: number
    change: number
    chart: any
  }
}

export default function Chart({ header, data }: ChartProps): JSX.Element {
  return (
    <div className="rounded bg-dark-900 w-full">
      <div className="font-bold p-4">
        <div className="text-primary text-lg">{header}</div>
        <div className="text-high-emphesis text-2xl">{formatNumber(data.figure, true, false)}</div>
        <div className="flex flex-row items-center">
          <ColoredNumber number={data.change} percent={true} />
          <div className="text-secondary text-sm ml-3">Last 24 Hours</div>
        </div>
      </div>
    </div>
  )
}
