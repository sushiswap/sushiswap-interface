import { classNames, escapeRegExp } from '../../../functions'

import React from 'react'
import useENS from '../../../hooks/useENS'

const inputRegex = RegExp(`^\\d*$`) // match escaped "." characters via in a non-capturing group

export const AddressInput = React.memo(
  ({
    value,
    onUserInput,
    placeholder,
    className = 'flex w-full h-full p-3 font-bold rounded overflow-ellipsis recipient-address-input bg-dark-900 placeholder-low-emphesis',
    align,
    fontSize = '24px',
    ...rest
  }: {
    value: string
    onUserInput: (input: string) => void
    error?: boolean
    fontSize?: string
    align?: 'right' | 'left'
  } & Omit<React.HTMLProps<HTMLInputElement>, 'ref' | 'onChange' | 'as'>) => {
    const { address, loading } = useENS(value)

    const enforcer = (nextUserInput: string) => {
      if (nextUserInput === '' || inputRegex.test(escapeRegExp(nextUserInput))) {
        if (Number(nextUserInput) <= 100) {
          onUserInput(nextUserInput)
        }
      }
    }

    return (
      <>
        <input
          value={value}
          onChange={(event) => {
            enforcer(event.target.value.replace(/\s+/g, ''))
          }}
          // universal input options
          inputMode="text"
          title="Wallet Address or ENS name"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
          placeholder="Wallet Address or ENS name"
          pattern="^(0x[a-fA-F0-9]{40})$"
          // text-specific options
          type="text"
          className={classNames(
            align === 'right' && 'text-right',
            'font-medium bg-transparent whitespace-nowrap overflow-ellipsis flex-auto',
            className
          )}
          style={{ fontSize }}
          {...rest}
        />
      </>
    )
  }
)

AddressInput.displayName = 'AddressInput'

export default AddressInput

// const inputRegex = RegExp(`^\\d*(?:\\\\[.])?\\d*$`) // match escaped "." characters via in a non-capturing group
