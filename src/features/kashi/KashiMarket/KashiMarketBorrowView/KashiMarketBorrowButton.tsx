import { Signature } from '@ethersproject/bytes'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Currency, CurrencyAmount, KASHI_ADDRESS, Percent, ZERO } from '@sushiswap/core-sdk'
import Button from 'app/components/Button'
import Typography from 'app/components/Typography'
import {
  BorrowExecutePayload,
  KashiMarketBorrowReviewModal,
  KashiMarketView,
  useKashiMarket,
} from 'app/features/kashi/KashiMarket'
import TridentApproveGate from 'app/features/trident/TridentApproveGate'
import { unwrappedToken } from 'app/functions'
import { useBentoBoxContract } from 'app/hooks'
import { useBentoOrWalletBalance } from 'app/hooks/useBentoOrWalletBalance'
import { useActiveWeb3React } from 'app/services/web3'
import React, { FC, useState } from 'react'

export interface KashiMarketBorrowButtonProps extends Omit<BorrowExecutePayload, 'permit' | 'trade'> {
  view: KashiMarketView
  maxBorrow?: CurrencyAmount<Currency>
  priceImpact?: Percent
}

export const KashiMarketBorrowButton: FC<KashiMarketBorrowButtonProps> = ({
  receiveInWallet,
  leveraged,
  borrowAmount,
  spendFromWallet,
  collateralAmount,
  maxBorrow,
  view,
  priceImpact,
}) => {
  const { account } = useActiveWeb3React()
  const { i18n } = useLingui()
  const { market } = useKashiMarket()
  const { chainId } = useActiveWeb3React()
  const balance = useBentoOrWalletBalance(
    account ?? undefined,
    unwrappedToken(market.collateral.token),
    spendFromWallet
  )
  const [permit, setPermit] = useState<Signature>()
  const [permitError, setPermitError] = useState<boolean>()
  const bentoboxContract = useBentoBoxContract()
  const masterContractAddress = chainId && KASHI_ADDRESS[chainId]
  const [open, setOpen] = useState(false)

  const totalAvailableToBorrow = borrowAmount
    ? CurrencyAmount.fromRawAmount(borrowAmount.currency, market.totalAssetAmount)
    : undefined

  const error = !account
    ? i18n._(t`Connect Wallet`)
    : !collateralAmount?.greaterThan(ZERO) && !borrowAmount?.greaterThan(ZERO)
    ? i18n._(t`Enter an amount`)
    : !balance
    ? i18n._(t`Loading balance`)
    : collateralAmount?.greaterThan(balance)
    ? i18n._(t`Insufficient balance`)
    : borrowAmount && maxBorrow && borrowAmount.greaterThan(maxBorrow)
    ? i18n._(t`Not enough collateral`)
    : totalAvailableToBorrow && borrowAmount && borrowAmount.greaterThan(totalAvailableToBorrow)
    ? i18n._(t`Not enough ${borrowAmount.currency.symbol} available`)
    : ''

  const buttonText = error
    ? error
    : borrowAmount?.greaterThan(ZERO) && collateralAmount?.greaterThan(ZERO)
    ? i18n._(t`Deposit and Borrow`)
    : borrowAmount?.greaterThan(ZERO)
    ? i18n._(t`Borrow Asset`)
    : collateralAmount?.greaterThan(ZERO)
    ? i18n._(t`Deposit Collateral`)
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
        spendFromWallet={spendFromWallet}
        inputAmounts={[collateralAmount]}
        tokenApproveOn={bentoboxContract?.address}
        masterContractAddress={masterContractAddress}
        withPermit={true}
        permit={permit}
        onPermit={setPermit}
        onPermitError={() => setPermitError(true)}
      >
        {({ approved, loading }) => {
          const disabled = !!error || !approved || loading
          return (
            <Button
              loading={loading}
              color={borrowAmount?.equalTo(ZERO) ? 'blue' : 'gradient'}
              disabled={disabled}
              onClick={() => setOpen(true)}
              className="rounded-2xl md:rounded"
            >
              {buttonText}
            </Button>
          )
        }}
      </TridentApproveGate>
      <KashiMarketBorrowReviewModal
        open={open}
        permit={permit}
        onDismiss={() => setOpen(false)}
        spendFromWallet={spendFromWallet}
        receiveInWallet={receiveInWallet}
        leveraged={leveraged}
        collateralAmount={collateralAmount}
        borrowAmount={borrowAmount}
        view={view}
        priceImpact={priceImpact}
      />
    </>
  )
}
