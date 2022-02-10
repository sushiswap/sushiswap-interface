import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Currency, CurrencyAmount } from '@sushiswap/core-sdk'
import { Fraction } from 'app/entities'
import { KashiMarket } from 'app/features/kashi/types'
import { useKashiPositions } from 'app/features/portfolio/AssetBalances/kashi/hooks'
import { CategorySum } from 'app/features/portfolio/CategorySum'
import React from 'react'

export interface CollateralData {
  collateral: CurrencyAmount<Currency>
  value: CurrencyAmount<Currency>
  limit: Fraction
  pair: KashiMarket
}

export const KashiCollateral = ({ account }: { account: string }) => {
  const { i18n } = useLingui()
  const { borrowed, collateral } = useKashiPositions(account)

  return (
    <CategorySum
      title="Kashi"
      subtitle={i18n._(t`(collateral minus borrowed)`)}
      assetAmounts={collateral}
      liabilityAmounts={borrowed}
      route={`/borrow`}
      // TODO: Change to new borrow page when ready
      // route={`/portfolio/${account}/lend`}
    />
  )
}
