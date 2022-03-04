import { Switch } from '@headlessui/react'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Typography from 'app/components/Typography'
import { useAppDispatch } from 'app/state/hooks'
import { setFromBentoBalance } from 'app/state/limit-order/actions'
import { useLimitOrderState } from 'app/state/limit-order/hooks'
import React, { FC } from 'react'

const PayFromToggle: FC = () => {
  const { i18n } = useLingui()
  const { fromBentoBalance } = useLimitOrderState()
  const dispatch = useAppDispatch()

  return (
    <div className="flex gap-2 px-5 py-2 pt-0">
      <Typography variant="sm" weight={700}>
        {i18n._(t`Pay from:`)}
      </Typography>
      <Switch.Group>
        <div className="flex items-center">
          <Switch.Label className="mr-2">
            <Typography variant="sm" className={!fromBentoBalance ? 'text-primary' : 'text-secondary'}>
              {i18n._(t`Wallet`)}
            </Typography>
          </Switch.Label>
          <Switch
            checked={!fromBentoBalance}
            onChange={() => dispatch(setFromBentoBalance(!fromBentoBalance))}
            className="relative inline-flex items-center h-3 transition-colors bg-gray-600 rounded-full w-9"
          >
            <span
              className={`${
                fromBentoBalance ? 'translate-x-5' : ''
              } inline-block w-4 h-4 transform bg-white rounded-full transition-transform`}
            />
          </Switch>
          <Switch.Label className="ml-2">
            <Typography variant="sm" className={fromBentoBalance ? 'text-primary' : 'text-low-emphesis'}>
              BentoBox
            </Typography>
          </Switch.Label>
        </div>
      </Switch.Group>
    </div>
  )
}

export default PayFromToggle
