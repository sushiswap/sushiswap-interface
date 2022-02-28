import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { CurrencyAmount } from '@sushiswap/core-sdk'
import Typography from 'app/components/Typography'
import {
  KashiMarketCurrentLentPosition,
  KashiMarketView,
  KashiMarketWithdrawButton,
  useKashiMarket,
} from 'app/features/kashi/KashiMarket'
import SwapAssetPanel from 'app/features/trident/swap/SwapAssetPanel'
import { tryParseAmount, unwrappedToken } from 'app/functions'
import React, { FC, useState } from 'react'

import { KashiMarketLentDetailsView } from '../KashiMarketLentDetailsView'

export const KashiMarketWithdrawView: FC = () => {
  const { i18n } = useLingui()
  const { market } = useKashiMarket()
  const [withdrawAmount, setWithdrawAmount] = useState<string>()
  const [receiveToWallet, setReceiveToWallet] = useState(true)
  const [removeMax, setRemoveMax] = useState(false)

  const assetToken = unwrappedToken(market.asset.token)
  const withdrawAmountCurrencyAmount = tryParseAmount(withdrawAmount, assetToken)
  const currentLent = CurrencyAmount.fromRawAmount(market.asset.token, market.currentUserAssetAmount)

  return (
    <div className="flex flex-col gap-3">
      <KashiMarketCurrentLentPosition setLentAmount={setWithdrawAmount} />
      <SwapAssetPanel
        error={false}
        header={(props) => <SwapAssetPanel.Header {...props} label={i18n._(t`Withdraw`)} />}
        walletToggle={(props) => (
          <SwapAssetPanel.Switch
            id={`switch-classic-withdraw-from-0}`}
            {...props}
            label={i18n._(t`Receive to`)}
            onChange={() => setReceiveToWallet((prev) => !prev)}
          />
        )}
        spendFromWallet={receiveToWallet}
        currency={assetToken}
        value={withdrawAmount}
        onChange={(val) => {
          setWithdrawAmount(val)
          setRemoveMax(false)
        }}
        currencies={[]}
        balancePanel={({ onChange }) => (
          <Typography
            variant="sm"
            className="text-secondary text-right"
            onClick={() => {
              onChange(currentLent?.toExact())
              setRemoveMax(true)
            }}
          >
            Max: {currentLent?.toSignificant(6)}
          </Typography>
        )}
      />
      <KashiMarketLentDetailsView view={KashiMarketView.WITHDRAW} lentAmount={withdrawAmountCurrencyAmount} />
      <KashiMarketWithdrawButton
        withdrawAmount={withdrawAmountCurrencyAmount}
        receiveToWallet={receiveToWallet}
        removeMax={removeMax}
      />
    </div>
  )
}
