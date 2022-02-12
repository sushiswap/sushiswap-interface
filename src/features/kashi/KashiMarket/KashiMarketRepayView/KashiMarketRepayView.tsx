import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { CurrencyAmount } from '@sushiswap/core-sdk'
import Typography from 'app/components/Typography'
import {
  KashiMarketDetailsView,
  KashiMarketRepayButton,
  KashiMarketRepayClosePositionView,
  KashiMarketView,
  useKashiMarket,
} from 'app/features/kashi/KashiMarket'
import { KashiMarketCurrentPosition } from 'app/features/kashi/KashiMarket/KashiMarketCurrentPosition'
import SwapAssetPanel from 'app/features/trident/swap/SwapAssetPanel'
import { tryParseAmount } from 'app/functions'
import { useV2TradeExactOut } from 'app/hooks/useV2Trades'
import React, { FC, useState } from 'react'

const KashiMarketRepayView: FC = () => {
  const { i18n } = useLingui()
  const { market } = useKashiMarket()

  const [closePosition, setClosePosition] = useState<boolean>(false)
  const [repayFromWallet, setRepayFromWallet] = useState<boolean>(true)
  const [removeToWallet, setRemoveToWallet] = useState<boolean>(true)
  const [repayAmount, setRepayAmount] = useState<string>()
  const [removeAmount, setRemoveAmount] = useState<string>()
  const repayToken = market.asset.token
  const removeToken = market.collateral.token
  const repayAmountCurrencyAmount = repayAmount ? tryParseAmount(repayAmount, repayToken) : undefined
  const removeAmountCurrencyAmount = removeAmount ? tryParseAmount(removeAmount, removeToken) : undefined
  const currentCollateral = CurrencyAmount.fromRawAmount(market.collateral.token, market.userCollateralAmount)
  const trade =
    useV2TradeExactOut(
      market.collateral.token,
      CurrencyAmount.fromRawAmount(market.asset.token, market.currentUserBorrowAmount),
      { maxHops: 3 }
    ) ?? undefined

  return (
    <div className="flex flex-col gap-3">
      <KashiMarketCurrentPosition setBorrowAmount={setRemoveAmount} setCollateralAmount={setRemoveAmount} />
      <div className="flex flex-col gap-2">
        <SwapAssetPanel
          disabled={closePosition}
          error={removeAmountCurrencyAmount?.greaterThan(market.userCollateralAmount)}
          header={(props) => <SwapAssetPanel.Header {...props} label={i18n._(t`Withdraw`)} />}
          walletToggle={(props) => (
            <SwapAssetPanel.Switch
              {...props}
              id={`switch-classic-withdraw-from-0}`}
              label={i18n._(t`Receive in`)}
              onChange={() => setRemoveToWallet((prev) => !prev)}
            />
          )}
          spendFromWallet={removeToWallet}
          currency={removeToken}
          value={removeAmount}
          onChange={setRemoveAmount}
          currencies={[]}
          balancePanel={({ onChange }) => (
            <Typography
              variant="sm"
              className="text-secondary"
              onClick={() => onChange(currentCollateral.toSignificant(6))}
            >
              Max Withdraw: {currentCollateral.toSignificant(6)}
            </Typography>
          )}
        />
      </div>
      <div className="flex flex-col gap-2 -mt-1.5">
        <SwapAssetPanel
          disabled={closePosition}
          error={repayAmountCurrencyAmount?.greaterThan(market.currentUserBorrowAmount)}
          header={(props) => <SwapAssetPanel.Header {...props} label={i18n._(t`Repay`)} />}
          walletToggle={(props) => (
            <SwapAssetPanel.Switch
              id={`switch-classic-withdraw-from-0}`}
              {...props}
              label={i18n._(t`Repay from`)}
              onChange={() => setRepayFromWallet((prev) => !prev)}
            />
          )}
          spendFromWallet={repayFromWallet}
          currency={repayToken}
          value={repayAmount}
          onChange={setRepayAmount}
          currencies={[]}
        />
      </div>
      <KashiMarketRepayClosePositionView
        setRepayAmount={setRepayAmount}
        setRemoveAmount={setRemoveAmount}
        enabled={closePosition}
        onSwitch={() => setClosePosition((prev) => !prev)}
      />
      {!closePosition && (
        <KashiMarketDetailsView
          priceImpact={closePosition ? trade?.priceImpact : undefined}
          borrowAmount={repayAmountCurrencyAmount}
          collateralAmount={removeAmountCurrencyAmount}
          view={KashiMarketView.REPAY}
        />
      )}
      <KashiMarketRepayButton
        trade={trade}
        closePosition={closePosition}
        removeAmount={removeAmountCurrencyAmount}
        repayAmount={repayAmountCurrencyAmount}
        repayFromWallet={repayFromWallet}
        removeToWallet={removeToWallet}
        view={KashiMarketView.REPAY}
      />
    </div>
  )
}

export default KashiMarketRepayView
