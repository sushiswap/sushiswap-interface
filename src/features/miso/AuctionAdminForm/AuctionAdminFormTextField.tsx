import Typography from 'app/components/Typography'
import { classNames } from 'app/functions'
import React, { ChangeEvent, FC, ReactNode } from 'react'

interface AuctionAdminFormTextFieldProps {
  value?: string
  label: string
  placeholder?: string
  onChange(e: ChangeEvent<HTMLInputElement>): void
  error?: string
  helperText: ReactNode
  icon?: ReactNode
}

const AuctionAdminFormTextField: FC<AuctionAdminFormTextFieldProps> = ({
  icon,
  value,
  label,
  placeholder,
  onChange,
  error,
  helperText,
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
        <input
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          type="text"
          className={classNames(
            error ? '!border-red' : '',
            icon ? 'rounded-none rounded-r-md' : 'rounded',
            'placeholder:text-low-emphesis bg-dark-1000/40 px-3 py-2 focus:ring-purple focus:border-purple block w-full min-w-0 border border-dark-800'
          )}
        />
      </div>
      {error ? <p className="mt-2 text-sm text-red">{error}</p> : helperText}
    </>
  )
}

export default AuctionAdminFormTextField
