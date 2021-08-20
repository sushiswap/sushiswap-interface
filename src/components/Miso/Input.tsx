import React from 'react'
import { ExclamationCircleIcon } from '@heroicons/react/solid'

import { escapeRegExp } from '../../functions'
import { classNames } from '../../functions/styling'

const digitRegex = RegExp(`^\\d*$`)

export const Input = React.memo(
  ({
    label,
    value,
    type = 'text',
    onUserInput,
    placeholder,
    alert,
    hint,
    trailing,
    className,
    error,
    ...rest
  }: {
    label?: string
    value?: string | number
    type?: string
    onUserInput?: (input: string) => void
    alert?: string
    hint?: any
    trailing?: any
    error?: boolean
  } & Omit<React.HTMLProps<HTMLInputElement>, 'ref' | 'onChange' | 'as'>) => {
    const enforcer = (nextUserInput: string) => {
      if (type === 'digit' && !digitRegex.test(escapeRegExp(nextUserInput))) return
      onUserInput(nextUserInput)
    }

    const [alertVisible, showAlert] = React.useState(false)

    return (
      <div className="mb-3">
        <div className="text-white text-xl">{label}</div>
        <div className="mt-2 py-2 px-5 rounded bg-dark-800 w-full relative">
          <input
            className={classNames(error ? 'text-red' : '', 'bg-transparent placeholder-low-emphesis w-full')}
            placeholder={placeholder}
            value={value}
            onChange={(e) => enforcer(e.target.value)}
            color={error ? 'red' : ''}
            onBlur={() => showAlert(false)}
            onFocus={() => showAlert(true)}
            {...rest}
          />

          {trailing && <div className="absolute top-2 right-5">{trailing}</div>}
        </div>
        {hint && <div className="mt-2 flex flex-row items-center">{hint}</div>}

        {alertVisible && (
          <div className="flex flex-row bg-[#A755DD2B] mt-2 p-3 rounded">
            <ExclamationCircleIcon className="w-5 h-5 mr-2 text-[#A755DD]" aria-hidden="true" />
            <div>{alert}</div>
          </div>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input
