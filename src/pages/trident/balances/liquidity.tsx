import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { BentoActionsModal } from 'app/features/trident/balances/ActionsModal'
import { LiquidityPositionsBalances } from 'app/features/trident/balances/AssetBalances'
import BalancesSideBar from 'app/features/trident/balances/BalancesSideBar'
import { LiquidityPositionsBalancesSum } from 'app/features/trident/balances/BalancesSum'
import HeaderDropdown from 'app/features/trident/balances/HeaderDropdown'
import { BREADCRUMBS } from 'app/features/trident/Breadcrumb'
import TridentLayout, { TridentBody, TridentHeader } from 'app/layouts/Trident'
import React from 'react'

const LiquidityPosition = () => {
  const { i18n } = useLingui()

  return (
    <div className="flex justify-center flex-grow">
      <div className="flex w-full">
        <BalancesSideBar />
        <div className="w-full">
          <TridentHeader pattern="bg-binary-pattern" condensed className="!pt-5 lg:!pt-10 z-[2]">
            <div className="flex flex-col lg:flex-row justify-between">
              <HeaderDropdown label={i18n._(t`My Liquidity Positions`)} hideAccount={true} />
              <div className="mb-[-52px] lg:mb-0 shadow-lg lg:max-w-[460px] w-full">
                <LiquidityPositionsBalancesSum />
              </div>
            </div>
          </TridentHeader>
          <TridentBody className="!pt-14">
            <div className="px-2 lg:px-0">
              <LiquidityPositionsBalances />
              <BentoActionsModal />
            </div>
          </TridentBody>
        </div>
      </div>
    </div>
  )
}

LiquidityPosition.Layout = (props) => (
  <TridentLayout {...props} breadcrumbs={[BREADCRUMBS['my_portfolio'], BREADCRUMBS['liquidity']]} />
)
export default LiquidityPosition
