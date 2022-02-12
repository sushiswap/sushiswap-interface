import { Signature } from '@ethersproject/bytes'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Currency, CurrencyAmount, KASHI_ADDRESS, TradeType, ZERO } from '@sushiswap/core-sdk'
import { Trade as LegacyTrade } from '@sushiswap/core-sdk/dist/entities/Trade'
import Button from 'app/components/Button'
import Typography from 'app/components/Typography'
import { KashiMarketRepayReviewModal, KashiMarketView, useKashiMarket } from 'app/features/kashi/KashiMarket'
import TridentApproveGate from 'app/features/trident/TridentApproveGate'
import { useBentoBoxContract } from 'app/hooks'
import { useBentoOrWalletBalance } from 'app/hooks/useBentoOrWalletBalance'
import { useActiveWeb3React } from 'app/services/web3'
import React, { FC, useState } from 'react'

export interface KashiMarketRepayButtonProps {
  view: KashiMarketView
  closePosition: boolean
  repayFromWallet: boolean
  removeToWallet: boolean
  repayAmount?: CurrencyAmount<Currency>
  removeAmount?: CurrencyAmount<Currency>
  trade?: LegacyTrade<Currency, Currency, TradeType.EXACT_OUTPUT>
}

export const KashiMarketRepayButton: FC<KashiMarketRepayButtonProps> = ({
  closePosition,
  repayFromWallet,
  removeToWallet,
  repayAmount,
  removeAmount,
  trade,
  view,
}) => {
  const { account } = useActiveWeb3React()
  const { i18n } = useLingui()
  const { market } = useKashiMarket()
  const { chainId } = useActiveWeb3React()
  const balance = useBentoOrWalletBalance(account ?? undefined, market.collateral.token, repayFromWallet)
  const [permit, setPermit] = useState<Signature>()
  const [permitError, setPermitError] = useState<boolean>()
  const bentoboxContract = useBentoBoxContract()
  const masterContractAddress = chainId && KASHI_ADDRESS[chainId]
  const [open, setOpen] = useState(false)
  const attemptingTxn = false

  const totalAvailableToRemove = removeAmount
    ? CurrencyAmount.fromRawAmount(removeAmount.currency, market.totalCollateralAmount)
    : undefined

  const error = !account
    ? i18n._(t`Connect Wallet`)
    : !closePosition && !repayAmount?.greaterThan(ZERO) && !removeAmount?.greaterThan(ZERO)
    ? i18n._(t`Enter an amount`)
    : !balance
    ? i18n._(t`Loading balance`)
    : repayAmount?.greaterThan(balance)
    ? i18n._(t`Insufficient balance`)
    : totalAvailableToRemove && removeAmount && removeAmount.greaterThan(totalAvailableToRemove)
    ? i18n._(t`Not enough ${removeAmount.currency.symbol} available`)
    : removeAmount?.greaterThan(market.userCollateralAmount)
    ? i18n._(t`Withdraw too large`)
    : repayAmount?.greaterThan(market.currentUserBorrowAmount)
    ? 'Repay larger than debt'
    : ''

  const buttonText = error
    ? error
    : removeAmount?.greaterThan(ZERO) && repayAmount?.greaterThan(ZERO)
    ? i18n._(t`Repay and Remove`)
    : removeAmount?.greaterThan(ZERO)
    ? i18n._(t`Remove Collateral`)
    : repayAmount?.greaterThan(ZERO)
    ? i18n._(t`Repay Debt`)
    : ''

  return (
    <>
      {permitError && (
        <Typography variant="sm" className="p-4 text-center border rounded border-yellow/40 text-yellow">
          {i18n._(
            t`Something went wrong during signing of the approval. This is expected for hardware wallets, such as Trezor and Ledger. Click 'Approve BentoBox' again for approving using the fallback method`
          )}
        </Typography>
      )}
      <TridentApproveGate
        spendFromWallet={repayFromWallet}
        inputAmounts={closePosition ? [] : [repayAmount]}
        tokenApproveOn={bentoboxContract?.address}
        masterContractAddress={masterContractAddress}
        withPermit={true}
        permit={permit}
        onPermit={setPermit}
        onPermitError={() => setPermitError(true)}
      >
        {({ approved, loading }) => {
          const disabled = !!error || !approved || loading || attemptingTxn
          return (
            <Button
              loading={loading || attemptingTxn}
              color="gradient"
              disabled={disabled}
              onClick={() => setOpen(true)}
              className="rounded-2xl md:rounded"
            >
              {buttonText}
            </Button>
          )
        }}
      </TridentApproveGate>
      <KashiMarketRepayReviewModal
        open={open}
        onDismiss={() => setOpen(false)}
        repayFromWallet={repayFromWallet}
        repayAmount={repayAmount}
        removeToWallet={removeToWallet}
        removeAmount={removeAmount}
        closePosition={closePosition}
        trade={trade}
        view={view}
      />
    </>
  )
}
