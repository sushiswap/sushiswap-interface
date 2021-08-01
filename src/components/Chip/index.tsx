import { FC } from 'react'
import { classNames } from '../../functions'

const FILLED = {
  default: 'bg-gray-700',
  purple: 'bg-purple bg-opacity-40',
  yellow: 'bg-yellow bg-opacity-[0.35]',
  blue: 'bg-blue bg-opacity-[0.35]',
  green: 'bg-green bg-opacity-50',
}

const VARIANT = {
  filled: FILLED,
}

export type ChipColor = 'purple' | 'yellow' | 'blue' | 'green'
export type ChipVariant = 'filled'

interface ChipProps {
  label: string
  color?: ChipColor
  variant?: ChipVariant
  className?: string
}

const Chip: FC<ChipProps> = ({ label, color = 'default', variant = 'filled', className = '' }) => {
  return (
    <div
      className={classNames(
        VARIANT[variant][color],
        'inline-flex h-[24px] rounded-[12px] py-0.5 px-3 text-high-emphesis font-medium text-xs leading-5',
        className
      )}
    >
      {label}
    </div>
  )
}

export default Chip
