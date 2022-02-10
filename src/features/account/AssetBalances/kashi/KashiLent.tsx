import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Typography from 'app/components/Typography'
import AssetBalances from 'app/features/account/AssetBalances/AssetBalances'
import { useLendPositionAmounts } from 'app/features/account/AssetBalances/kashi/hooks'
import { useBasicTableConfig } from 'app/features/account/AssetBalances/useBasicTableConfig'
import { useRouter } from 'next/router'
import React from 'react'

export const KashiLent = () => {
  const { i18n } = useLingui()
  const router = useRouter()

  const lentPositions = useLendPositionAmounts()
  const { config } = useBasicTableConfig(
    lentPositions.map((p) => ({ asset: p.amount, pair: p.pair })),
    false
  )

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Typography weight={700} variant="lg" className="text-high-emphesis">
          {i18n._(t`Kashi`)}
        </Typography>
        <Typography weight={700} variant="sm" className="text-low-emphesis">
          {i18n._(t`(lent assets)`)}
        </Typography>
      </div>
      <AssetBalances config={config} onSelect={(row) => router.push(`/lend/${row.original.pair.address}`)} />
    </div>
  )
}
