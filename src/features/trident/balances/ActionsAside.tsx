import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Card from 'app/components/Card'
import { CurrencyLogo } from 'app/components/CurrencyLogo'
import Typography from 'app/components/Typography'
import BentoActions from 'app/features/trident/balances/BentoActions'
import { ActiveModalAtom, SelectedCurrencyAtom } from 'app/features/trident/balances/context/atoms'
import { ActiveModal } from 'app/features/trident/balances/context/types'
import React from 'react'
import { useRecoilValue } from 'recoil'

import WalletActions from './WalletActions'

const _ActionsHeader = () => {
  const currency = useRecoilValue(SelectedCurrencyAtom)

  return (
    <div className="flex justify-between bg-dark-800 p-5">
      <div className="flex gap-4 items-center">
        <CurrencyLogo currency={currency} size={42} className="rounded-full" />
        <Typography variant="h3" className="text-high-emphesis" weight={700}>
          {currency?.symbol}
        </Typography>
      </div>
    </div>
  )
}

export const ActionsAsideBento = () => {
  const activeModal = useRecoilValue(ActiveModalAtom)

  if (activeModal && [ActiveModal.MENU, ActiveModal.WITHDRAW].includes(activeModal))
    return (
      <div className="shadow-pink-glow">
        <div
          className="rounded border border-dark-800 overflow-hidden"
          style={{ boxShadow: '0 3px 6px 0 rgba(15, 15, 15)' }}
        >
          <_ActionsHeader />
          <BentoActions />
        </div>
      </div>
    )

  return <_ActionsAsideDefault />
}

export const ActionsAsideWallet = () => {
  const activeModal = useRecoilValue(ActiveModalAtom)

  if (activeModal && [ActiveModal.MENU, ActiveModal.DEPOSIT].includes(activeModal))
    return (
      <div className="shadow-pink-glow">
        <div
          className="rounded border border-dark-800 overflow-hidden"
          style={{ boxShadow: '0 3px 6px 0 rgba(15, 15, 15)' }}
        >
          <_ActionsHeader />
          <WalletActions />
        </div>
      </div>
    )

  return <_ActionsAsideDefault />
}

const _ActionsAsideDefault = () => {
  const { i18n } = useLingui()

  return (
    <div className="filter backdrop-blur-[154px]">
      <Card.Gradient className="!opacity-100 flex items-center justify-center !from-transparent-blue !to-transparent-pink border border-dark-700">
        <Typography variant="lg" className="px-10 py-[150px] text-center">
          {i18n._(t`Please select an asset to view available actions`)}
        </Typography>
      </Card.Gradient>
    </div>
  )
}
