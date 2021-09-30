import React, { ReactNode } from 'react'

import { ExclamationIcon } from '@heroicons/react/solid'
import { classNames } from '../../../functions'

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
  topAdornment = null,
  bottomAdornment = null,
  selectComponent = null,
  inputComponent = null,
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
        <div className="p-3 flex justify-center items-center gap-2">
          <span className="text-red flex items-center">
            <ExclamationIcon width={20} height={20} />
          </span>
          <span className="text-high-emphesis font-bold text-sm">{error}</span>
        </div>
      )}
    </div>
  )
}
