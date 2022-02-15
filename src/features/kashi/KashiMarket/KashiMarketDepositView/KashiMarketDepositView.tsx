import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { useKashiMarket } from 'app/features/kashi/KashiMarket'
import { KashiMarketCurrentPosition } from 'app/features/kashi/KashiMarket/KashiMarketCurrentPosition'
import SwapAssetPanel from 'app/features/trident/swap/SwapAssetPanel'
import { unwrappedToken } from 'app/functions'
import React, { FC, useState } from 'react'

export const KashiMarketDepositView: FC = () => {
  const { i18n } = useLingui()
  const { market } = useKashiMarket()
  const [collateralAmount, setCollateralAmount] = useState<string>()
  const [borrowAmount, setBorrowAmount] = useState<string>()
  const [spendFromWallet, setSpendFromWallet] = useState<boolean>(true)

  const asset = unwrappedToken(market.asset.token)

  return (
    <div className="flex flex-col gap-3">
      <KashiMarketCurrentPosition setBorrowAmount={setBorrowAmount} setCollateralAmount={setCollateralAmount} />
      <SwapAssetPanel
        error={false}
        header={(props) => <SwapAssetPanel.Header {...props} label={i18n._(t`Deposit`)} />}
        walletToggle={(props) => (
          <SwapAssetPanel.Switch
            id={`switch-classic-withdraw-from-0}`}
            {...props}
            label={i18n._(t`Deposit from`)}
            onChange={() => setSpendFromWallet((prev) => !prev)}
          />
        )}
        spendFromWallet={spendFromWallet}
        currency={asset}
        value={collateralAmount}
        onChange={setCollateralAmount}
        currencies={[]}
      />
    </div>
  )
}
