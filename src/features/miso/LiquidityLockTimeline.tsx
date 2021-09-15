import { ExclamationCircleIcon } from '@heroicons/react/solid'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import React, { useState } from 'react'

import Typography from '../../components/Typography'
import { classNames } from '../../functions/styling'
import PaymentCustomOption from './PaymentCustomOption'
import PaymentOption from './PaymentOption'
import { useOnClickOutside } from '../../hooks/useOnClickOutside'

export default function ({ className, lockDays, onChange }: any) {
  const { i18n } = useLingui()
  const [_alertVisible, showAlert] = React.useState(false)

  const node = React.useRef<HTMLDivElement>()
  useOnClickOutside(node, () => showAlert(false))

  return (
    <div
      className={classNames('mb-3 mt-8', className)}
      onClick={() => {
        showAlert(true)
      }}
      ref={node}
    >
      <Typography className="text-primary text-xl">{i18n._(t`Liquidity Lockup Timeline`)}*</Typography>

      <div className="flex-1 grid grid-cols-3 gap-3 my-3 mr-[200px] pr-3">
        <PaymentOption
          className=""
          title="180 DAYS"
          description=""
          onSelected={() => onChange('180')}
          selected={lockDays == '180'}
        />
        <PaymentOption
          className=""
          title="90 DAYS"
          description=""
          onSelected={() => onChange('90')}
          selected={lockDays == '90'}
        />
        <div></div>
        <PaymentCustomOption
          className="col-span-2"
          onSelected={() => onChange('CUSTOM')}
          selected={lockDays == 'CUSTOM'}
        />
      </div>

      <div className="mr-[200px] pr-3">
        {_alertVisible && (
          <div className="flex flex-row bg-purple bg-opacity-20 space-x-3 mt-2 px-4 py-3 rounded">
            <ExclamationCircleIcon className="w-[24px] h-[24px] text-purple" />
            <Typography className="flex-1 text-sm text-primary">
              {i18n._(
                t`Select the currency you want to accept as payment during the auction.  ETH is the most common, but some also prefer to use stablecoins like DAI or USDC.  However, you can also accept any ERC-20 you like by providing it’s address in the custom field.`
              )}
            </Typography>
          </div>
        )}
      </div>
    </div>
  )
}
