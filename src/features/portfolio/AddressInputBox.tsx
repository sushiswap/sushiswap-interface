import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Button from 'app/components/Button'
import { isAddress } from 'app/functions'
import React, { FC, useState } from 'react'

interface AddressInputBoxProps {
  onSubmit: (account: string) => void
}

export const AddressInputBox: FC<AddressInputBoxProps> = ({ onSubmit }) => {
  const { i18n } = useLingui()

  const [input, setInput] = useState('')
  return (
    <div className="flex gap-4">
      <div className={'border-2 h-[36px] flex items-center px-2 rounded bg-dark-1000/40 relative border-low-emphesis'}>
        <input
          className="bg-transparent placeholder-low-emphesis min-w-0 font-bold w-96"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      </div>
      <Button size="sm" disabled={!isAddress(input)} onClick={() => onSubmit(input)}>
        {i18n._(t`Submit`)}
      </Button>
    </div>
  )
}
