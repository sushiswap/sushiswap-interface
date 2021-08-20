import { formatNumber, formatPercent } from '../../functions'
import ColoredNumber from './ColoredNumber'

interface InfoCardProps {
  text: string
  number: number | string
  numberType?: 'usd' | 'text' | 'percent'
  percent: number
}

export default function InfoCard({ text, number, numberType = 'usd', percent }: InfoCardProps): JSX.Element {
  function switchNumber() {
    switch (numberType) {
      case 'usd':
        return formatNumber(number, true)
      case 'text':
        return number
      case 'percent':
        return formatPercent(number)
    }
  }

  return (
    <div className="w-full p-6 rounded bg-dark-900">
      <div className="text-sm text-secondary whitespace-nowrap">{text}</div>
      <div className="text-2xl font-bold text-high-emphesis">{switchNumber()}</div>
      <div>
        <ColoredNumber number={percent} percent={true} />
      </div>
    </div>
  )
}
