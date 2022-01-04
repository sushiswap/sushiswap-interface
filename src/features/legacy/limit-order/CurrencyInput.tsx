import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Button from 'app/components/Button'
import Input from 'app/components/Input'
import { classNames } from 'app/functions'
import React, { FC, ReactNode } from 'react'

interface CurrencyInputProps {
  id: string
  error?: string
  showMaxButton: boolean
  onMax?: () => void
  onUserInput: (x: string) => void
  value: string
  endAdornment?: ReactNode
}

const CurrencyInput: FC<CurrencyInputProps> = ({
  id,
  error,
  showMaxButton,
  onUserInput,
  onMax,
  value,
  endAdornment,
}) => {
  const { i18n } = useLingui()

  return (
    <div
      className={classNames(
        error ? 'border-red border-opacity-40 hover:border-opacity-100' : 'border-transparent',
        'border flex items-center w-full space-x-3 rounded bg-dark-900 focus:bg-dark-700 p-3 sm:w-3/5'
      )}
    >
      <>
        {showMaxButton && (
          <Button
            onClick={onMax}
            size="xs"
            className="text-xs font-medium bg-transparent border rounded-full hover:bg-primary border-low-emphesis text-secondary whitespace-nowrap"
          >
            {i18n._(t`Max`)}
          </Button>
        )}
        <Input.Numeric
          id={id}
          value={value}
          onUserInput={(val) => {
            onUserInput(val)
          }}
        />
        {endAdornment && endAdornment}
      </>
    </div>
  )
}

export default CurrencyInput
