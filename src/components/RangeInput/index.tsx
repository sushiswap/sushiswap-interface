import { FC } from 'react'
import { Currency, Price } from '@sushiswap/sdk'
import Typography from '../Typography'
import { classNames } from '../../functions'
import { Input as NumericalInput } from '../NumericalInput'

type RangeInputColor = 'blue' | 'purple'

interface RangeInputProps {
  color: RangeInputColor
  label: string
  price: Price<Currency, Currency>
}

const COLOR = {
  blue: 'border-blue bg-blue/25',
  purple: 'border-purple bg-purple/25',
}

const RangeInput: FC<RangeInputProps> = ({ price, label, color = 'blue' }) => {
  return (
    <div className="flex flex-col">
      <Typography variant="sm" weight={700} className={classNames(COLOR[color], 'rounded-t border p-3')}>
        {label}
      </Typography>
      <NumericalInput
        value={price.toFixed()}
        placeholder="0.000"
        className="text-3xl trailing-7 letter-spacing-[-0.01em] font-bold"
      />
    </div>
  )
}

export default RangeInput
