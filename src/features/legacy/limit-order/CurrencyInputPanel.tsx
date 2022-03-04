import { ExclamationIcon } from '@heroicons/react/solid'
import { classNames } from 'app/functions'
import React, { ReactNode } from 'react'

interface CurrencyInputPanelProps {
  id: string
  error?: string
  className?: string
  topAdornment?: ReactNode
  bottomAdornment?: ReactNode
  selectComponent?: ReactNode
  inputComponent?: ReactNode
}

export default function CurrencyInputPanel({
  id,
  error = '',
  className = '',
  topAdornment = undefined,
  bottomAdornment = undefined,
  selectComponent = undefined,
  inputComponent = undefined,
}: CurrencyInputPanelProps) {
  return (
    <div id={id}>
      {topAdornment && topAdornment}
      <div
        className={classNames(
          'p-5 bg-dark-800 flex flex-col justify-between space-y-3 sm:space-y-0 sm:flex-row',
          className
        )}
      >
        <div className={classNames('w-full', inputComponent ? 'sm:w-2/5' : '')}>{selectComponent}</div>
        {inputComponent && inputComponent}
      </div>
      {bottomAdornment && bottomAdornment}

      {error && (
        <div className="flex items-center justify-center gap-2 p-3">
          <span className="flex items-center text-red">
            <ExclamationIcon width={20} height={20} />
          </span>
          <span className="text-sm font-bold text-high-emphesis">{error}</span>
        </div>
      )}
    </div>
  )
}
