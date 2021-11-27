import { SwitchHorizontalIcon } from '@heroicons/react/solid'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Divider from 'app/components/Divider'
import Typography from 'app/components/Typography'
import ActionItem from 'app/features/trident/balances/ActionsModal/ActionItem'
import React, { FC } from 'react'

import _ActionsModal from './_ActionsModal'
import { ActionsModalProps } from './types'

const BentoActionsModal: FC<ActionsModalProps> = ({ currency, onClose }) => {
  const { i18n } = useLingui()

  return (
    <_ActionsModal currency={currency} onClose={onClose}>
      <div className="flex flex-col bg-dark-900 p-5 gap-5">
        <div className="flex flex-col gap-1">
          <Typography variant="sm" weight={700} className="text-high-emphesis">
            {i18n._(t`Strategy`)}
          </Typography>
          <div className="flex justify-between">
            {/*TODO Ramin*/}
            <Typography variant="h3" className="text-green" weight={700}>
              Active
            </Typography>
            {/*TODO Ramin*/}
            <Typography variant="h3" className="text-high-emphesis" weight={700}>
              12.85% APY
            </Typography>
          </div>
        </div>
        <Divider />
        <div className="flex flex-col gap-3">
          <Typography variant="lg" weight={700} className="text-high-emphesis">
            {i18n._(t`Available Actions`)}
          </Typography>
          <ActionItem svg={<SwitchHorizontalIcon width={24} />} label={i18n._(t`Swap`)} />
          <ActionItem
            svg={
              <svg width="20" height="20" viewBox="0 0 43 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M37.6022 31.099H3.39382C1.97809 31.099 0.827545 29.9484 0.827545 28.5327V2.56627C0.827545 1.15055 1.97809 0 3.39382 0H37.6022C39.018 0 40.1685 1.15055 40.1685 2.56627V8.3575H27.8889C26.9693 8.3575 26.0711 8.54141 25.2285 8.89641C24.4159 9.23859 23.6845 9.73473 23.06 10.3592C22.4356 10.9837 21.9394 11.715 21.5973 12.5277C21.238 13.3703 21.0583 14.2685 21.0583 15.1881V15.9109C21.0583 16.8305 21.2423 17.7287 21.5973 18.5713C21.9394 19.3839 22.4356 20.1153 23.06 20.7398C23.6845 21.3642 24.4159 21.8604 25.2285 22.2025C26.0711 22.5619 26.9693 22.7415 27.8889 22.7415H40.1685V28.5327C40.1685 29.9484 39.018 31.099 37.6022 31.099ZM41.0753 10.924C42.1403 10.924 43 11.7838 43 12.8488V18.2507C43 19.3157 42.1403 20.1754 41.0753 20.1754H40.1685H27.8889C25.5322 20.1754 23.6246 18.2679 23.6246 15.9112V15.1883C23.6246 12.8316 25.5322 10.924 27.8889 10.924H40.1685H41.0753ZM26.3192 15.5476C26.3192 16.8009 27.3329 17.8145 28.5861 17.8145C29.8393 17.8145 30.853 16.8009 30.853 15.5476C30.853 14.2944 29.8393 13.2807 28.5861 13.2807C27.3329 13.2807 26.3192 14.2944 26.3192 15.5476Z"
                  fill="#currentColor"
                />
              </svg>
            }
            label={i18n._(t`Withdraw to Wallet`)}
          />
          <ActionItem
            svg={
              <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M13.0591 5L20.0591 12L13.0591 19M5.05908 5L12.0591 12L5.05908 19"
                  stroke="#E3E3E3"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            }
            label={i18n._(t`Transfer`)}
          />
        </div>
      </div>
    </_ActionsModal>
  )
}

export default BentoActionsModal
