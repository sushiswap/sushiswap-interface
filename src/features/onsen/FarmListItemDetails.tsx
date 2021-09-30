import React, { useState } from 'react'
import { PairType } from './enum'
import { Disclosure, Tab, Transition } from '@headlessui/react'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { useActiveWeb3React } from '../../hooks'
import { Token, ZERO } from '@sushiswap/sdk'
import { getAddress } from '@ethersproject/address'
import { useUserInfo } from './hooks'
import ManageSwapPair from './ManageSwapPair'
import ManageKashiPair from './ManageKashiPair'
import InformationDisclosure from './InformationDisclosure'
import InvestmentDetails from './InvestmentDetails'
import ManageBar from './ManageBar'

const FarmListItemDetails = ({ farm }) => {
  const { i18n } = useLingui()

  const { chainId } = useActiveWeb3React()

  const liquidityToken = new Token(
    chainId,
    getAddress(farm.pair.id),
    farm.pair.type === PairType.KASHI ? Number(farm.pair.asset.decimals) : 18,
    farm.pair.type === PairType.KASHI ? 'KMP' : 'SLP'
  )

  const stakedAmount = useUserInfo(farm, liquidityToken)

  const [toggleView, setToggleView] = useState(stakedAmount?.greaterThan(ZERO))

  return (
    <Transition
      show={true}
      enter="transition-opacity duration-75"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="transition-opacity duration-150"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <Disclosure.Panel className="flex w-full border-t-0 rounded rounded-t-none bg-dark-800" static>
        <InformationDisclosure farm={farm} />
        <div className="flex flex-col w-full p-6 pl-2 space-y-8 sm:pl-6">
          <div className="flex items-center justify-between">
            <div className="text-xl font-bold cursor-pointer">
              {toggleView ? i18n._(t`Investment Details`) : i18n._(t`Manage Position`)}
            </div>
            <button
              className="py-0.5 px-4 font-bold bg-transparent border border-transparent rounded cursor-pointer border-gradient-r-blue-pink-dark-800 whitespace-nowrap"
              onClick={() => setToggleView(!toggleView)}
            >
              {toggleView ? i18n._(t`Manage Position`) : i18n._(t`Investment Details`)}
            </button>
          </div>
          <div className="w-full h-0 font-bold bg-transparent border border-b-0 border-transparent rounded text-high-emphesis border-gradient-r-blue-pink-dark-800 opacity-20" />
          {toggleView ? (
            <InvestmentDetails farm={farm} />
          ) : (
            <Tab.Group>
              <Tab.List className="flex rounded bg-dark-900">
                <Tab
                  className={({ selected }) =>
                    `${
                      selected
                        ? 'text-high-emphesis bg-gradient-to-r from-opaque-blue to-opaque-pink hover:from-blue hover:to-pink'
                        : 'text-secondary'
                    } flex items-center justify-center flex-1 px-2 py-2 text-lg rounded cursor-pointer select-none`
                  }
                >
                  {farm.pair.type === PairType.KASHI ? i18n._(t`Lending`) : i18n._(t`Liquidity`)}
                </Tab>
                <Tab
                  className={({ selected }) =>
                    `${
                      selected
                        ? 'text-high-emphesis bg-gradient-to-r from-opaque-blue to-opaque-pink hover:from-blue hover:to-pink'
                        : 'text-secondary'
                    } flex items-center justify-center flex-1 px-2 py-2 text-lg rounded cursor-pointer select-none`
                  }
                >
                  {i18n._(t`Staking`)}
                </Tab>
              </Tab.List>
              <Tab.Panel>
                {farm.pair.type === PairType.KASHI ? <ManageKashiPair farm={farm} /> : <ManageSwapPair farm={farm} />}
              </Tab.Panel>
              <Tab.Panel>
                <ManageBar farm={farm} />
              </Tab.Panel>
            </Tab.Group>
          )}
        </div>
      </Disclosure.Panel>
    </Transition>
  )
}

export default FarmListItemDetails
