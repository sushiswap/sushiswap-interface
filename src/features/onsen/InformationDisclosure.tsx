import React, { Fragment } from 'react'
import { Disclosure, Transition } from '@headlessui/react'
import { QuestionMarkCircleIcon } from '@heroicons/react/solid'
import { XCircle } from 'react-feather'
import { useLingui } from '@lingui/react'
import { t } from '@lingui/macro'
import Typography from '../../components/Typography'
import { PairType } from './enum'
import NavLink from '../../components/NavLink'

const InformationDisclosure = ({ farm }) => {
  const { i18n } = useLingui()

  return (
    <Disclosure>
      {({ open }) => (
        <>
          {!open && (
            <Disclosure.Button className="self-start p-2 mt-5 rounded-r-lg sm:mt-3 sm:p-4 sm:pl-6 bg-dark-700">
              <QuestionMarkCircleIcon width={20} height={20} />
            </Disclosure.Button>
          )}
          <Transition
            show={open}
            as={Fragment}
            enter="transition ease-in duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
          >
            <Disclosure.Panel
              static
              className="flex flex-col w-1/2 min-w-full p-6 space-y-8 rounded rounded-t-none rounded-r-none sm:min-w-min bg-dark-700"
            >
              <div className="flex items-center justify-between">
                <Typography className="text-xl cursor-pointer">{i18n._(t`How to Participate`)}</Typography>
                <Disclosure.Button>
                  <XCircle width={20} height={30} />
                </Disclosure.Button>
              </div>
              <div className="w-full h-0 font-bold bg-transparent border border-b-0 border-transparent rounded text-high-emphesis border-gradient-r-blue-pink-dark-900 opacity-20" />
              <div className="flex flex-col space-y-2 md:pr-6">
                <Typography variant="sm" weight={700}>
                  {i18n._(t`Step One`)}
                </Typography>
                {farm.pair.type === PairType.SWAP && (
                  <>
                    <Typography variant="sm">
                      {i18n._(t`Provide liquidity to the`)}
                      {` `}
                      <NavLink href={`/add/${farm.pair.token0.id}/${farm.pair.token1.id}`}>
                        <a className="text-sm text-blue">
                          {farm.pair.token0.symbol}/{farm.pair.token1.symbol}
                        </a>
                      </NavLink>
                      {` `}
                      {i18n._(t`pool (or`)}
                      {` `}
                      <NavLink href={`/migrate`}>
                        <a className="text-sm text-blue">migrate liquidity</a>
                      </NavLink>
                      {i18n._(t`) to receive SLP tokens.`)}
                    </Typography>
                  </>
                )}
                {farm.pair.type === PairType.KASHI && (
                  <Typography variant="sm">
                    {i18n._(t`Lend`)}
                    {` `}
                    {farm.pair.token0.symbol}
                    {` `}
                    {i18n._(t`to the`)}
                    {` `}
                    <NavLink href={`/lend/${farm.pair.id}`}>
                      <a className="text-sm text-blue">
                        {farm.pair.token0.symbol}/{farm.pair.token1.symbol}
                      </a>
                    </NavLink>
                    {` `}
                    {i18n._(t`Kashi market to get KMP (Kashi Medium-risk Pair) tokens.`)}
                  </Typography>
                )}
              </div>
              <div className="flex flex-col space-y-2 md:pr-6">
                <Typography variant="sm" weight={700}>
                  {i18n._(t`Step Two`)}
                </Typography>
                <Typography variant="sm">
                  {i18n._(t`Approve and then deposit your`)}
                  {` `}
                  {farm.pair.type === PairType.KASHI ? `KMP` : `SLP`}
                  {` `}
                  {i18n._(t`tokens into the farm to start earning rewards.`)}
                </Typography>
              </div>
              <div className="flex flex-col space-y-2 md:pr-6">
                <Typography variant="sm" weight={700}>
                  {i18n._(t`Step Three`)}
                </Typography>
                {farm.pair.type === PairType.SWAP && (
                  <Typography variant="sm">
                    {i18n._(
                      t`Harvest rewards and unstake your SLP tokens at any time. You can then remove your liquidity to receive your base investment tokens back in your wallet.`
                    )}
                  </Typography>
                )}
                {farm.pair.type === PairType.KASHI && (
                  <Typography variant="sm">
                    {i18n._(
                      t`Harvest rewards and unstake your KMP tokens at any time. You can then withdraw your lent`
                    )}
                    {` `}
                    {farm.pair.token0.symbol}
                    {` `}
                    {i18n._(t`into your wallet or BentoBox.`)}
                  </Typography>
                )}
              </div>
            </Disclosure.Panel>
          </Transition>
        </>
      )}
    </Disclosure>
  )
}

export default InformationDisclosure
