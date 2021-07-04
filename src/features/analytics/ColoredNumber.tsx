import { classNames, formatNumberScale, formatPercent } from '../../functions'

export default function ColoredNumber({ number, percent = false }: { number: number; percent?: boolean }): JSX.Element {
  if (isNaN(number) || number === Infinity) number = 0

  return (
    <>
      <div className={classNames(number >= 0 ? 'text-green' : 'text-red', 'font-normal')}>
        {(number >= 0 ? '+' : '-') +
          (percent ? formatPercent(number).replace('-', '') : formatNumberScale(number, true).replace('-', ''))}
      </div>
    </>
  )
}
