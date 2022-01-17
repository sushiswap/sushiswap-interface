import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Card from 'app/components/Card'
import { CurrencyLogo } from 'app/components/CurrencyLogo'
import Typography from 'app/components/Typography'
import { selectTridentBalances } from 'app/features/trident/balances/balancesSlice'
import BentoActions from 'app/features/trident/balances/BentoActions'
import { useBalancesSelectedCurrency } from 'app/features/trident/balances/useBalancesDerivedState'
import { ActiveModal } from 'app/features/trident/types'
import { useAppSelector } from 'app/state/hooks'
import React from 'react'

import WalletActions from './WalletActions'

const _ActionsHeader = () => {
  const currency = useBalancesSelectedCurrency()

  return (
    <div className="flex justify-between bg-dark-800 border-b border-dark-700 p-5">
      <div className="flex gap-4 items-center">
        <CurrencyLogo currency={currency} size={42} className="!rounded-full" />
        <Typography variant="h3" className="text-high-emphesis" weight={700}>
          {currency?.symbol}
        </Typography>
      </div>
    </div>
  )
}

export const ActionsAsideBento = () => {
  const { activeModal } = useAppSelector(selectTridentBalances)

  if (activeModal && [ActiveModal.MENU, ActiveModal.WITHDRAW].includes(activeModal))
    return (
      <div className="shadow-xl shadow-pink/5 rounded overflow-hidden">
        <_ActionsHeader />
        <BentoActions />
      </div>
    )

  return <_ActionsAsideDefault />
}

export const ActionsAsideWallet = () => {
  const { activeModal } = useAppSelector(selectTridentBalances)

  if (activeModal && [ActiveModal.MENU, ActiveModal.DEPOSIT].includes(activeModal))
    return (
      <div className="shadow-xl shadow-pink/5 rounded overflow-hidden">
        <_ActionsHeader />
        <WalletActions />
      </div>
    )

  return <_ActionsAsideDefault />
}

const _ActionsAsideDefault = () => {
  const { i18n } = useLingui()

  return (
    <div className="filter backdrop-blur-[154px]">
      <Card.Gradient className="!opacity-100 flex items-center justify-center !from-pink/10 !to-blue/10 border border-dark-800">
        <Typography variant="sm" className="px-10 py-[150px] text-center text-low-emphesis">
          {i18n._(t`Please select an asset to view available actions`)}
        </Typography>
      </Card.Gradient>
    </div>
  )
}
