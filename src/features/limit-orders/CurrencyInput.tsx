import React, { FC, ReactNode } from 'react'
import { classNames } from '../../functions'
import Button from '../../components/Button'
import { t } from '@lingui/macro'
import { Input as NumericalInput } from '../../components/NumericalInput'
import { useLingui } from '@lingui/react'

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
        error ? 'border-red border-opacity-40 hover:border-opacity-100' : '',
        'border border-transparent flex items-center w-full space-x-3 rounded bg-dark-900 focus:bg-dark-700 px-3 sm:w-3/5'
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
        <NumericalInput
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
