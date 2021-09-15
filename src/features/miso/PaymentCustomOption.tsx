import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import React from 'react'

import Typography from '../../components/Typography'
import { classNames } from '../../functions/styling'
import Radio from './Radio'

export default function PaymentCustomOption({ className, selected }: any) {
  const { i18n } = useLingui()

  return (
    <div
      className={classNames(
        className,
        'border border-dark-800 h-14 rounded flex items-center space-x-2 pl-2 overflow-hidden',
        selected ? 'bg-dark-800' : null
      )}
    >
      <div className="border-2 border-secondary rounded-full w-[18px] h-[18px] mr-2">
        {selected && <div className="bg-gradient-to-r from-blue to-pink rounded-full w-[12px] h-[12px] m-[1px]" />}
      </div>
      <Typography variant="lg" className="text-secondary pr-5">
        {i18n._(t`CUSTOM`)}
      </Typography>
      <div className="flex-1 bg-dark-900 h-full flex items-center px-3">
        <Typography variant="lg" className="text-secondary">
          {i18n._(t`Enter an ERC-20 token address`)}
        </Typography>
      </div>
    </div>
  )
}
