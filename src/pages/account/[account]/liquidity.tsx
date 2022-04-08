import {
  LegacyLiquidityPositionsBalances,
  TridentLiquidityPositionsBalances,
} from 'app/features/account/AssetBalances/liquidityPositions'
import { LiquidityPositionsBalancesSum } from 'app/features/portfolio/BalancesSum'
import HeaderDropdown from 'app/features/portfolio/HeaderDropdown'
import { useAccountInUrl } from 'app/features/portfolio/useAccountInUrl'
import TridentLayout, { TridentBody, TridentHeader } from 'app/layouts/Trident'
import React from 'react'

const LiquidityPosition = () => {
  const account = useAccountInUrl('/')

  if (!account) return null

  return (
    <>
      <TridentHeader pattern="bg-binary">
        <HeaderDropdown account={account} />
        <LiquidityPositionsBalancesSum />
      </TridentHeader>
      <TridentBody>
        <div className="flex flex-col justify-between gap-8">
          <TridentLiquidityPositionsBalances />
          <LegacyLiquidityPositionsBalances />
        </div>
      </TridentBody>
    </>
  )
}

LiquidityPosition.Layout = TridentLayout

export default LiquidityPosition
