import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import QuestionHelper from 'app/components/QuestionHelper'
import ToggleButtonGroup from 'app/components/ToggleButton'
import Typography from 'app/components/Typography'
import { KashiMarketBorrowView, KashiMarketDepositView, KashiMarketRepayView } from 'app/features/kashi/KashiMarket'
import { SwapLayoutCard } from 'app/layouts/SwapLayout'
import React, { FC, useState } from 'react'

interface KashiMarketProps {}

export enum KashiMarketView {
  DEPOSIT,
  WITHDRAW,
  BORROW,
  REPAY,
}

export const KashiMarket: FC<KashiMarketProps> = () => {
  const { i18n } = useLingui()
  const [view, setView] = useState<KashiMarketView>(KashiMarketView.BORROW)

  return (
    <SwapLayoutCard>
      <div className="flex flex-col w-full gap-4">
        <ToggleButtonGroup size="sm" value={view} onChange={setView} variant="filled">
          <ToggleButtonGroup.Button value={KashiMarketView.BORROW}>
            {i18n._(t`Borrow`)}
            <QuestionHelper
              text={
                <div className="flex flex-col gap-2">
                  <Typography variant="xs">
                    {i18n._(t`Gain exposure to tokens without reducing your assets.`)}
                  </Typography>
                  <Typography variant="xs">
                    {i18n._(
                      t`Leverage will enable you to take short positions against assets and earn from downside movements.`
                    )}
                  </Typography>
                </div>
              }
            />
          </ToggleButtonGroup.Button>
          <ToggleButtonGroup.Button value={KashiMarketView.REPAY}>{i18n._(t`Repay`)}</ToggleButtonGroup.Button>
          <ToggleButtonGroup.Button value={KashiMarketView.DEPOSIT}>
            {i18n._(t`Deposit`)}
            <QuestionHelper
              text={
                <div className="flex flex-col gap-2">
                  <Typography variant="xs">
                    {i18n._(t`Have assets you want to earn additional interest on?`)}
                  </Typography>
                  <Typography variant="xs">
                    {i18n._(t`Lend them in isolated markets and earn interest from borrowers.`)}
                  </Typography>
                </div>
              }
            />
          </ToggleButtonGroup.Button>
          <ToggleButtonGroup.Button value={KashiMarketView.WITHDRAW}>{i18n._(t`Withdraw`)}</ToggleButtonGroup.Button>
        </ToggleButtonGroup>
        {view === KashiMarketView.BORROW && <KashiMarketBorrowView />}
        {view === KashiMarketView.REPAY && <KashiMarketRepayView />}
        {view === KashiMarketView.DEPOSIT && <KashiMarketDepositView />}
      </div>
    </SwapLayoutCard>
  )
}
