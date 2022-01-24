import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { ActionsAsideBento } from 'app/features/trident/balances/ActionsAside'
import { BentoActionsModal } from 'app/features/trident/balances/ActionsModal'
import { BentoBalances } from 'app/features/trident/balances/AssetBalances'
import BalancesSideBar from 'app/features/trident/balances/BalancesSideBar'
import { BentoBalancesSum } from 'app/features/trident/balances/BalancesSum'
import HeaderDropdown from 'app/features/trident/balances/HeaderDropdown'
import TridentLayout, { TridentBody, TridentHeader } from 'app/layouts/Trident'
import React from 'react'

const BentoBox = () => {
  const { i18n } = useLingui()

  return (
    <>
      <TridentHeader pattern="bg-chevron">
        <HeaderDropdown label={i18n._(t`My BentoBox`)} />
        <BentoBalancesSum />
      </TridentHeader>
      <TridentBody>
        <div className="flex flex-row justify-between gap-10">
          <div className="flex flex-col gap-8 w-full">
            <BalancesSideBar />
            <div className="flex flex-col gap-4">
              <BentoBalances />
            </div>
            <BentoActionsModal />
          </div>
          <div className="flex flex-col hidden mt-[-188px] lg:block lg:min-w-[304px]">
            <ActionsAsideBento />
          </div>
        </div>
      </TridentBody>
    </>
  )
}

BentoBox.Layout = TridentLayout

export default BentoBox
