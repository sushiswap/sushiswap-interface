import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Typography from 'app/components/Typography'
import { BentoBalances } from 'app/features/trident/balances/AssetBalances'
import { BentoBalancesSum } from 'app/features/trident/balances/BalancesSum'
import HeaderDropdown from 'app/features/trident/balances/HeaderDropdown'
import { BREADCRUMBS } from 'app/features/trident/Breadcrumb'
import TridentLayout, { TridentBody, TridentHeader } from 'app/layouts/Trident'
import React from 'react'

const BentoBox = () => {
  const { i18n } = useLingui()

  return (
    <>
      <TridentHeader pattern="bg-binary-pattern" condensed className="!pt-5 z-[2]">
        <HeaderDropdown label={i18n._(t`My BentoBox`)} />
        <div className="mb-[-52px]">
          <BentoBalancesSum />
        </div>
      </TridentHeader>
      <TridentBody className="!pt-14">
        <div className="relative">
          <div className="rounded overflow-hidden z-[-1] top-0 pointer-events-none absolute w-full h-full border border-gradient-r-blue-pink-dark-1000 border-transparent opacity-30">
            <div className="w-full h-full bg-gradient-to-r from-opaque-blue to-opaque-pink" />
          </div>
          <div className="p-5 z-[1]">
            <Typography variant="sm" className="text-high-emphesis text-center">
              {i18n._(t`Tap any asset row to view available actions.`)}
            </Typography>
          </div>
        </div>
        <div className="px-2">
          <BentoBalances />
        </div>
      </TridentBody>
    </>
  )
}

BentoBox.Layout = (props) => (
  <TridentLayout {...props} breadcrumbs={[BREADCRUMBS['my_portfolio'], BREADCRUMBS['bentobox']]} />
)
export default BentoBox
