import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { useKashiPositions } from 'app/features/portfolio/AssetBalances/kashi/hooks'
import { CategorySum } from 'app/features/portfolio/CategorySum'
import React from 'react'

interface KashiLentProps {
  account: string
}

export const KashiLent = ({ account }: KashiLentProps) => {
  const { i18n } = useLingui()
  const { lent } = useKashiPositions(account)

  return (
    <CategorySum
      title="Kashi"
      subtitle={i18n._(t`(lent assets)`)}
      assetAmounts={lent}
      route={`/lend`}
      // TODO: Change to new lend page when ready
      // route={`/portfolio/${account}/lend`}
    />
  )
}
