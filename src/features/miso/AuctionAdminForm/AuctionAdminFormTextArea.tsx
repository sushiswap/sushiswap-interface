import Typography from 'app/components/Typography'
import { classNames } from 'app/functions'
import React, { ChangeEvent, FC, ReactNode } from 'react'

interface AuctionAdminFormTextAreaProps {
  value: string
  label: string
  placeholder?: string
  onChange(e: ChangeEvent<HTMLTextAreaElement>): void
  error?: string
  helperText: ReactNode
  icon?: ReactNode
  rows?: number
}

const AuctionAdminFormTextArea: FC<AuctionAdminFormTextAreaProps> = ({
  icon,
  value,
  label,
  placeholder,
  onChange,
  error,
  helperText,
  rows,
}) => {
  return (
    <>
      <Typography weight={700}>{label}</Typography>
      <div className="mt-2 flex rounded-md shadow-sm">
        {icon && (
          <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-dark-800 text-gray-500 sm:text-sm">
            {icon}
          </span>
        )}
        <textarea
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          rows={rows}
          className={classNames(
            error ? '!border-red' : '',
            icon ? 'rounded-none rounded-r-md' : 'rounded',
            'placeholder:text-low-emphesis bg-dark-1000 rounded px-3 outline-none py-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full min-w-0 border border-dark-800'
          )}
        />
      </div>
      {error ? <p className="mt-2 text-sm text-red">{error}</p> : helperText}
    </>
  )
}

export default AuctionAdminFormTextArea
