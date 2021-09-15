import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import React from 'react'

import Typography from '../../components/Typography'
import { classNames } from '../../functions/styling'
import Radio from './Radio'

export default function PaymentOption({ className, title, description, selected, onSelected }: any) {
  const { i18n } = useLingui()

  return (
    <div
      className={classNames(
        'cursor-pointer border border-dark-800 h-14 rounded flex items-center space-x-2 px-2',
        selected ? 'bg-dark-800' : null,
        className
      )}
      onClick={() => onSelected()}
    >
      <div className="border-2 border-secondary rounded-full w-[18px] h-[18px] mr-2">
        {selected && <div className="bg-gradient-to-r from-blue to-pink rounded-full w-[12px] h-[12px] m-[1px]" />}
      </div>
      <Typography variant="lg" className={classNames(selected ? 'text-primary' : 'text-secondary')}>
        {i18n._(t`${title}`)}
      </Typography>
      <div className="flex-1"></div>
      <Typography variant="lg" className="text-secondary">
        {i18n._(t`${description}`)}
      </Typography>
    </div>
  )
}
