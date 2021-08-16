import { formatNumber } from '../../../../functions'
import ColoredNumber from '../../ColoredNumber'

interface InfoCardProps {
  text: string
  number: number
  percent: number
}

export default function InfoCard({ text, number, percent }: InfoCardProps): JSX.Element {
  return (
    <div className="w-full p-6 rounded bg-dark-900">
      <div className="text-sm text-secondary whitespace-nowrap">{text}</div>
      <div className="text-2xl font-bold text-high-emphesis">{formatNumber(number, true)}</div>
      <div>
        <ColoredNumber number={percent} percent={true} />
      </div>
    </div>
  )
}
