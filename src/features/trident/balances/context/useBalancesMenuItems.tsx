import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import BentoBoxSVG from 'app/components/SVG/BentoBoxSVG'
import WalletSVG from 'app/components/SVG/WalletSVG'
import { BREADCRUMBS, BreadcrumbTuple } from 'app/features/trident/Breadcrumb'
import React from 'react'

const useBalancesMenuItems = () => {
  const { i18n } = useLingui()
  return [
    {
      label: i18n._(t`Wallet`),
      icon: <WalletSVG />,
      link: (BREADCRUMBS['wallet'] as BreadcrumbTuple).link,
    },
    {
      label: i18n._(t`BentoBox`),
      icon: <BentoBoxSVG />,
      link: (BREADCRUMBS['bentobox'] as BreadcrumbTuple).link,
    },
    {
      label: i18n._(t`Liquidity Pools`),
      link: (BREADCRUMBS['liquidity'] as BreadcrumbTuple).link,
    },
  ]
}

export default useBalancesMenuItems
