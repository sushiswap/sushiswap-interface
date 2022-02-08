import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Currency, CurrencyAmount } from '@sushiswap/core-sdk'
import Typography from 'app/components/Typography'
import { Fraction } from 'app/entities'
import { KashiMarket } from 'app/features/kashi/types'
import AssetBalances from 'app/features/portfolio/AssetBalances/AssetBalances'
import { useCollateralPositionAmounts } from 'app/features/portfolio/AssetBalances/kashi/hooks'
import { useCollateralTableConfig } from 'app/features/portfolio/AssetBalances/kashi/useCollateralTableConfig'
import { useRouter } from 'next/router'
import React from 'react'

export interface CollateralData {
  collateral: CurrencyAmount<Currency>
  value: CurrencyAmount<Currency>
  limit: Fraction
  pair: KashiMarket
}

const useGetCollateralTableData = (): CollateralData[] =>
  useCollateralPositionAmounts().map((p) => ({
    collateral: p.amount,
    value: p.amount,
    limit: p.pair.health.string as Fraction,
    pair: p.pair,
  }))

export const KashiCollateral = () => {
  const { i18n } = useLingui()
  const router = useRouter()

  const data = useGetCollateralTableData()

  const config = useCollateralTableConfig(data)

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-2 items-center">
        <Typography weight={700} variant="lg" className="text-high-emphesis">
          {i18n._(t`Kashi`)}
        </Typography>
        <Typography weight={700} variant="sm" className="text-low-emphesis">
          {i18n._(t`(collateral on borrows)`)}
        </Typography>
      </div>
      <AssetBalances
        config={config}
        onSelect={(row: { original: CollateralData }) => router.push(`/borrow/${row.original.pair.address}`)}
      />
    </div>
  )
}
