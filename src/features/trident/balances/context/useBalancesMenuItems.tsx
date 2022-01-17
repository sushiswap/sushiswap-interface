import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { BentoboxIcon, WalletIcon } from 'app/components/Icon'
import { BREADCRUMBS, BreadcrumbTuple } from 'app/features/trident/Breadcrumb'
import React from 'react'

const useBalancesMenuItems = () => {
  const { i18n } = useLingui()
  return [
    {
      label: i18n._(t`Wallet`),
      icon: <WalletIcon width={20} height={20} />,
      link: (BREADCRUMBS['wallet'] as BreadcrumbTuple).link,
    },
    {
      label: i18n._(t`BentoBox`),
      icon: <BentoboxIcon width={20} height={20} />,
      link: (BREADCRUMBS['bentobox'] as BreadcrumbTuple).link,
    },
    {
      label: i18n._(t`Liquidity Pools`),
      link: (BREADCRUMBS['liquidity'] as BreadcrumbTuple).link,
    },
  ]
}

export default useBalancesMenuItems
