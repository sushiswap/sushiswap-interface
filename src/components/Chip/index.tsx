import { FC, ReactNode } from 'react'
import { classNames } from '../../functions'
import { XIcon } from '@heroicons/react/solid'

const SIZE = {
  default: 'h-[24px]',
  sm: 'h-5 text-[10px]',
}

const FILLED = {
  default: 'bg-gray-700',
  white: 'bg-high-emphesis text-dark-700',
  purple: 'bg-purple bg-opacity-40',
  yellow: 'bg-yellow bg-opacity-[0.35]',
  blue: 'bg-blue bg-opacity-[0.35]',
  green: 'bg-green bg-opacity-50',
}

const VARIANT = {
  filled: FILLED,
}

export type ChipColor = 'default' | 'purple' | 'yellow' | 'blue' | 'green' | 'white'
export type ChipSize = 'default' | 'sm'
export type ChipVariant = 'filled'

export interface ChipProps {
  label: string
  color?: ChipColor
  variant?: ChipVariant
  size?: ChipSize
  className?: string
  onDelete?: (e) => void
  deleteIcon?: ReactNode
}

const Chip: FC<ChipProps> = ({
  label,
  color = 'default',
  variant = 'filled',
  size = 'default',
  className = '',
  onDelete,
  deleteIcon = <XIcon width={12} height={12} strokeWidth={5} />,
}) => {
  return (
    <div
      className={classNames(
        VARIANT[variant][color],
        SIZE[size],
        onDelete ? 'pr-1' : 'pr-3',
        `whitespace-nowrap inline-flex rounded-[12px] py-0.5 pl-3 text-${color} font-bold text-xs leading-5 gap-2 items-center`,
        className
      )}
    >
      {label}
      {onDelete && (
        <div
          className="rounded bg-[rgba(255,255,255,0.12)] hover:bg-[rgba(255,255,255,0.24)] cursor-pointer p-0.5"
          onClick={onDelete}
        >
          {deleteIcon}
        </div>
      )}
    </div>
  )
}

export default Chip
