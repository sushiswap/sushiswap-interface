import React, { FC } from 'react'
import { Switch } from '@headlessui/react'
import Typography from '../../components/Typography'
import { t } from '@lingui/macro'
import { MinusIcon, PlusIcon } from '@heroicons/react/outline'
import { useLingui } from '@lingui/react'

interface SideSwitchProps {
  withdraw: boolean
  setWithdraw: (x: boolean) => void
}

const SideSwitch: FC<SideSwitchProps> = ({ withdraw, setWithdraw }) => {
  const { i18n } = useLingui()

  return (
    <Switch.Group>
      <div className="flex items-center">
        <Switch.Label className="mr-3">
          <Typography variant="xs">{i18n._(t`Deposit`)}</Typography>
        </Switch.Label>
        <Switch
          checked={withdraw}
          onChange={setWithdraw}
          className="bg-blue bg-opacity-30 border border-blue border-opacity-50 relative inline-flex items-center h-[32px] rounded-full w-[54px] transition-colors focus:outline-none"
        >
          <span
            className={`${
              withdraw ? 'translate-x-[23px]' : 'translate-x-[1px]'
            } inline-block w-7 h-7 transform bg-white rounded-full transition-transform text-blue`}
          >
            {withdraw ? <MinusIcon /> : <PlusIcon />}
          </span>
        </Switch>
        <Switch.Label className="ml-3">
          <Typography variant="xs">{i18n._(t`Withdraw`)}</Typography>
        </Switch.Label>
      </div>
    </Switch.Group>
  )
}

export default SideSwitch
