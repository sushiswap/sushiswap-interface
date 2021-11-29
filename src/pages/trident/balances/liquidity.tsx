import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Card from 'app/components/Card'
import Typography from 'app/components/Typography'
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
            <HeaderDropdown label={i18n._(t`My Liquidity Positions`)} />
            <div className="mb-[-52px] lg:mb-[-68px]">
              <LiquidityPositionsBalancesSum />
            </div>
          </TridentHeader>
          <TridentBody className="!pt-14">
            <Card.Gradient>
              <div className="flex flex-col p-4 border border-dark-900 rounded">
                <Typography variant="sm" className="text-high-emphesis text-center">
                  {i18n._(
                    t`Tap on any position’s row to visit that pool’s page to make any adjustments to your position.`
                  )}
                </Typography>
              </div>
            </Card.Gradient>
            <div className="px-2 lg:px-0">
              <LiquidityPositionsBalances />
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
