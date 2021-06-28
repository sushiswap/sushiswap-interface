import React, { FC, useState } from 'react'
import Typography from '../../components/Typography'
import { useLingui } from '@lingui/react'
import { t } from '@lingui/macro'
import { Switch } from '@headlessui/react'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../../state'
import { setFromBentoBalance } from '../../state/limit-order/actions'
import { useLimitOrderState } from '../../state/limit-order/hooks'

const PayFromToggle: FC = () => {
  const { i18n } = useLingui()
  const { fromBentoBalance } = useLimitOrderState()
  const dispatch = useDispatch<AppDispatch>()

  const handleChange = (checked: boolean) => {
    dispatch(setFromBentoBalance(!checked))
  }

  return (
    <div className="px-5 py-2 pt-0 flex gap-2">
      <Typography variant="sm" weight={700}>
        {i18n._(t`Pay from:`)}
      </Typography>
      <Switch.Group>
        <div className="flex items-center">
          <Switch.Label className="mr-2">
            <Typography variant="sm" className={fromBentoBalance ? 'text-primary' : 'text-secondary'}>
              BentoBox
            </Typography>
          </Switch.Label>
          <Switch
            checked={!fromBentoBalance}
            onChange={handleChange}
            className="bg-gray-600 relative inline-flex items-center h-3 rounded-full w-9 transition-colors"
          >
            <span
              className={`${
                !fromBentoBalance ? 'translate-x-5' : ''
              } inline-block w-4 h-4 transform bg-white rounded-full transition-transform`}
            />
          </Switch>
          <Switch.Label className="ml-2">
            <Typography variant="sm" className={!fromBentoBalance ? 'text-primary' : 'text-low-emphesis'}>
              {i18n._(t`Wallet`)}
            </Typography>
          </Switch.Label>
        </div>
      </Switch.Group>
    </div>
  )
}

export default PayFromToggle
