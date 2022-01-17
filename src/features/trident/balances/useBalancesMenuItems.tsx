import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { BentoboxIcon, WalletIcon } from 'app/components/Icon'
import React from 'react'

const useBalancesMenuItems = () => {
  const { i18n } = useLingui()
  return [
    {
      key: 'wallet',
      label: i18n._(t`Wallet`),
      icon: <WalletIcon width={20} height={20} />,
      link: '/trident/balances/wallet',
    },
    {
      key: 'bentobox',
      label: i18n._(t`BentoBox`),
      icon: <BentoboxIcon width={20} height={20} />,
      link: '/trident/balances/bentobox',
    },
    {
      key: 'liquidity',
      label: i18n._(t`Liquidity Pools`),
      link: '/trident/balances/liquidity',
    },
  ]
}

export default useBalancesMenuItems
