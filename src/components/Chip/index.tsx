import { FC, ReactNode } from 'react'
import { classNames } from '../../functions'
import { XIcon } from '@heroicons/react/solid'

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

export type ChipColor = 'default' | 'purple' | 'yellow' | 'blue' | 'green'
export type ChipVariant = 'filled'

export interface ChipProps {
  label: string
  color?: ChipColor
  variant?: ChipVariant
  className?: string
  onDelete?: (e) => void
  deleteIcon?: ReactNode
}

export type ChipStateProps = Pick<ChipProps, 'label' | 'color' | 'variant'>

const Chip: FC<ChipProps> = ({
  label,
  color = 'default',
  variant = 'filled',
  className = '',
  onDelete,
  deleteIcon = <XIcon width={12} height={12} strokeWidth={5} />,
}) => {
  return (
    <div
      className={classNames(
        VARIANT[variant][color],
        onDelete ? 'pr-1' : 'pr-2',
        'whitespace-nowrap inline-flex h-[24px] rounded-[12px] py-0.5 pl-2 text-high-emphesis font-medium text-xs leading-5 gap-1 items-center',
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
