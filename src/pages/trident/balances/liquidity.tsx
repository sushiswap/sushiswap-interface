import { LiquidityPositionsBalances } from 'app/features/trident/balances/AssetBalances'
import { LiquidityPositionsBalancesSum } from 'app/features/trident/balances/BalancesSum'
import HeaderDropdown from 'app/features/trident/balances/HeaderDropdown'
import TridentLayout, { TridentBody, TridentHeader } from 'app/layouts/Trident'
import React from 'react'

const LiquidityPosition = () => {
  return (
    <>
      <TridentHeader pattern="bg-binary">
        <HeaderDropdown />
        <LiquidityPositionsBalancesSum />
      </TridentHeader>
      <TridentBody>
        <div className="flex flex-col justify-between gap-8">
          <LiquidityPositionsBalances />
        </div>
      </TridentBody>
    </>
  )
}

LiquidityPosition.Layout = TridentLayout

export default LiquidityPosition
