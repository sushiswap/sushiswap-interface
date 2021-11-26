import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Typography from 'app/components/Typography'
import { LiquidityPositionsBalances } from 'app/features/trident/balances/AssetBalances'
import { LiquidityPositionsBalancesSum } from 'app/features/trident/balances/BalancesSum'
import HeaderDropdown from 'app/features/trident/balances/HeaderDropdown'
import { BREADCRUMBS } from 'app/features/trident/Breadcrumb'
import TridentLayout, { TridentBody, TridentHeader } from 'app/layouts/Trident'
import React from 'react'

const LiquidityPosition = () => {
  const { i18n } = useLingui()

  return (
    <>
      <TridentHeader pattern="bg-binary-pattern" condensed className="!pt-5 z-[2]">
        <HeaderDropdown label={i18n._(t`My Liquidity Positions`)} />
        <div className="mb-[-52px]">
          <LiquidityPositionsBalancesSum />
        </div>
      </TridentHeader>
      <TridentBody className="!pt-14">
        <div className="relative">
          <div className="rounded overflow-hidden top-0 pointer-events-none absolute w-full h-full border border-gradient-r-blue-pink-dark-1000 border-transparent opacity-30">
            <div className="w-full h-full bg-gradient-to-r from-opaque-blue to-opaque-pink" />
          </div>
          <div className="p-5">
            <Typography variant="sm" className="text-high-emphesis text-center">
              {i18n._(t`Tap on any position’s row to visit that pool’s page to make any adjustments to your position.`)}
            </Typography>
          </div>
        </div>
        <div className="px-2">
          <LiquidityPositionsBalances />
        </div>
      </TridentBody>
    </>
  )
}

LiquidityPosition.Layout = (props) => (
  <TridentLayout {...props} breadcrumbs={[BREADCRUMBS['my_portfolio'], BREADCRUMBS['liquidity']]} />
)
export default LiquidityPosition
