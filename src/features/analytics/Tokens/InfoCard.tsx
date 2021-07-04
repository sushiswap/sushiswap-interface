import { formatNumber } from '../../../functions'
import ColoredNumber from '../ColoredNumber'

interface InfoCardProps {
  text: string
  number: number
  percent: number
}

export default function InfoCard({ text, number, percent }: InfoCardProps): JSX.Element {
  return (
    <div className="rounded bg-dark-900 w-full p-6">
      <div className="text-secondary text-sm">{text}</div>
      <div className="text-high-emphesis font-bold text-2xl">{formatNumber(number, true)}</div>
      <div>
        <ColoredNumber number={percent} percent={true} />
      </div>
    </div>
  )
}
