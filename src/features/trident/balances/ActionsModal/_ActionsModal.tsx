import { XIcon } from '@heroicons/react/solid'
import CurrencyLogo from 'app/components/CurrencyLogo'
import BottomSlideIn from 'app/components/Dialog/BottomSlideIn'
import Typography from 'app/components/Typography'
import { ActionsModalProps } from 'app/features/trident/balances/ActionsModal/types'
import React, { FC } from 'react'

const _ActionsModal: FC<ActionsModalProps> = ({ currency, onClose, children }) => {
  return (
    <BottomSlideIn open={!!currency} onClose={onClose}>
      <div className="flex justify-between bg-dark-800 p-5">
        <div className="flex gap-4 items-center">
          <CurrencyLogo currency={currency} size={42} className="rounded-full" />
          <Typography variant="h3" className="text-high-emphesis" weight={700}>
            {currency?.symbol}
          </Typography>
        </div>
        <div className="w-8 h-8 flex justify-end items-start cursor-pointer" onClick={onClose}>
          <XIcon width={20} />
        </div>
      </div>
      {children}
    </BottomSlideIn>
  )
}

export default _ActionsModal
