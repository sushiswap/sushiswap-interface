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
import { tryParseAmount, unwrappedToken } from 'app/functions'
import { useV2TradeExactOut } from 'app/hooks/useV2Trades'
import React, { FC, useCallback, useState } from 'react'

export const KashiMarketRepayView: FC = () => {
  const { i18n } = useLingui()
  const { market } = useKashiMarket()

  const [closePosition, setClosePosition] = useState<boolean>(false)
  const [repayFromWallet, setRepayFromWallet] = useState<boolean>(true)
  const [removeToWallet, setRemoveToWallet] = useState<boolean>(true)
  const [repayAmount, setRepayAmount] = useState<string>()
  const [removeAmount, setRemoveAmount] = useState<string>()
  const [removeMax, setRemoveMax] = useState<boolean>(false)
  const [repayMax, setRepayMax] = useState<boolean>(false)

  const repayToken = unwrappedToken(market.asset.token)
  const removeToken = unwrappedToken(market.collateral.token)
  const repayAmountCurrencyAmount = repayAmount ? tryParseAmount(repayAmount, repayToken) : undefined
  const removeAmountCurrencyAmount = removeAmount ? tryParseAmount(removeAmount, removeToken) : undefined
  const currentCollateral = CurrencyAmount.fromRawAmount(
    unwrappedToken(market.collateral.token),
    market.userCollateralAmount
  )
  const currentBorrowed = CurrencyAmount.fromRawAmount(
    unwrappedToken(market.asset.token),
    market.currentUserBorrowAmount
  )

  const trade =
    useV2TradeExactOut(
      unwrappedToken(market.collateral.token),
      CurrencyAmount.fromRawAmount(unwrappedToken(market.asset.token), market.currentUserBorrowAmount),
      { maxHops: 3 }
    ) ?? undefined

  const removeHandler = useCallback((val: string | undefined, max: boolean) => {
    setRemoveAmount(val)
    setRemoveMax(max)
  }, [])

  const repayHandler = useCallback((val: string | undefined, max: boolean) => {
    setRepayAmount(val)
    setRepayMax(max)
  }, [])

  return (
    <div className="flex flex-col gap-3">
      <KashiMarketCurrentPosition setBorrowAmount={setRemoveAmount} setCollateralAmount={setRemoveAmount} />
      <SwapAssetPanel
        disabled={closePosition}
        error={removeAmountCurrencyAmount?.greaterThan(market.userCollateralAmount)}
        header={(props) => <SwapAssetPanel.Header {...props} label={i18n._(t`Remove`)} />}
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
        onChange={(val) => removeHandler(val, false)}
        currencies={[]}
        balancePanel={() => (
          <Typography
            variant="sm"
            className="text-right text-secondary"
            onClick={() => removeHandler(currentCollateral.toExact(), true)}
          >
            Max Withdraw: {currentCollateral.toSignificant(6)}
          </Typography>
        )}
      />
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
          balancePanel={() => (
            <Typography
              variant="sm"
              className="text-right text-secondary"
              onClick={() => repayHandler(currentBorrowed.toExact(), true)}
            >
              Max Repay: {currentBorrowed.toSignificant(6)}
            </Typography>
          )}
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
        repayMax={repayMax}
        removeMax={removeMax}
      />
    </div>
  )
}
