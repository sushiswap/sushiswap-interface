import { Popover, Switch } from '@headlessui/react'
import { MinusIcon, PlusIcon } from '@heroicons/react/solid'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import React, { useState } from 'react'
import { useKashiPair } from '../lending/context'
import KashiDeposit from './KashiDeposit'
import { ChevronDownIcon } from '@heroicons/react/solid'
import KashiWithdraw from './KashiWithdraw'

const ManageKashiPair = ({ farm }) => {
  const { i18n } = useLingui()

  const kashiPair = useKashiPair(farm.pair.id)

  const [toggle, setToggle] = useState(true)
  const [useBento, setUseBento] = useState(false)

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex items-center justify-between pb-2">
        <Switch.Group>
          <div className="flex items-center space-x-4">
            <Switch
              checked={toggle}
              onChange={() => setToggle(!toggle)}
              className={`${
                toggle ? 'bg-blue border-blue' : 'bg-pink border-pink'
              } bg-opacity-60 border border-opacity-80 relative inline-flex items-center h-[32px] rounded-full w-[54px] transition-colors focus:outline-none`}
            >
              <span
                className={`${
                  toggle ? 'translate-x-[1px] text-blue' : 'translate-x-[23px] text-pink'
                } inline-block w-7 h-7 transform bg-white rounded-full transition-transform`}
              >
                {toggle ? <PlusIcon /> : <MinusIcon />}
              </span>
            </Switch>
            <Switch.Label>{toggle ? i18n._(t`Deposit`) : i18n._(t`Withdraw`)}</Switch.Label>
            <div className="flex space-x-1">
              <div className="whitespace-nowrap">{toggle ? i18n._(t`From:`) : i18n._(t`To:`)}</div>
              <Popover>
                <Popover.Button>
                  <div className="flex">
                    <div>{useBento ? 'BentoBox' : i18n._(t`Wallet`)}</div>
                    <ChevronDownIcon className="w-3" />
                  </div>
                </Popover.Button>
                <Popover.Panel className="absolute">
                  <Popover.Button>
                    <div onClick={() => setUseBento(!useBento)}>{useBento ? i18n._(t`Wallet`) : 'BentoBox'}</div>
                  </Popover.Button>
                </Popover.Panel>
              </Popover>
            </div>
          </div>
        </Switch.Group>
        <div className="whitespace-nowrap">{toggle ? i18n._(t`Balance`) : i18n._(t`Available to Withdraw`)}</div>
      </div>
      {toggle ? (
        <KashiDeposit pair={kashiPair} useBento={useBento} />
      ) : (
        <KashiWithdraw pair={kashiPair} useBento={useBento} />
      )}
    </div>
  )
}

export default ManageKashiPair
