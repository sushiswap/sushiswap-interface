import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { BentoActionsModal } from 'app/features/trident/balances/ActionsModal'
import { LiquidityPositionsBalances } from 'app/features/trident/balances/AssetBalances'
import BalancesSideBar from 'app/features/trident/balances/BalancesSideBar'
import { LiquidityPositionsBalancesSum } from 'app/features/trident/balances/BalancesSum'
import HeaderDropdown from 'app/features/trident/balances/HeaderDropdown'
import TridentLayout, { TridentBody, TridentHeader } from 'app/layouts/Trident'
import React from 'react'

const LiquidityPosition = () => {
  const { i18n } = useLingui()

  return (
    <>
      <TridentHeader pattern="bg-binary">
        <HeaderDropdown label={i18n._(t`My Liquidity Positions`)} />
        <LiquidityPositionsBalancesSum />
      </TridentHeader>
      <TridentBody>
        <div className="flex flex-col justify-between gap-8">
          <BalancesSideBar />
          <LiquidityPositionsBalances />
          <BentoActionsModal />
        </div>
      </TridentBody>
    </>
  )
}

LiquidityPosition.Layout = TridentLayout

export default LiquidityPosition
