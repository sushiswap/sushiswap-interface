import { Signature } from '@ethersproject/bytes'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Currency, CurrencyAmount, KASHI_ADDRESS } from '@sushiswap/core-sdk'
import Button from 'app/components/Button'
import Typography from 'app/components/Typography'
import { useKashiMarket } from 'app/features/kashi/KashiMarket'
import TridentApproveGate from 'app/features/trident/TridentApproveGate'
import { useBentoBoxContract } from 'app/hooks'
import { useActiveWeb3React } from 'app/services/web3'
import React, { FC, useState } from 'react'

interface KashiMarketRepayButton {
  closePosition: boolean
  repayFromWallet: boolean
  repayAmount?: CurrencyAmount<Currency>
  removeAmount?: CurrencyAmount<Currency>
}

const KashiMarketRepayButton: FC<KashiMarketRepayButton> = ({
  closePosition,
  repayFromWallet,
  repayAmount,
  removeAmount,
}) => {
  const { i18n } = useLingui()
  const { market } = useKashiMarket()
  const { chainId } = useActiveWeb3React()
  const [permit, setPermit] = useState<Signature>()
  const [permitError, setPermitError] = useState<boolean>()
  const bentoboxContract = useBentoBoxContract()
  const masterContractAddress = chainId && KASHI_ADDRESS[chainId]
  const [open, setOpen] = useState(false)
  const attemptingTxn = false

  const totalAvailableToRemove = removeAmount
    ? CurrencyAmount.fromRawAmount(removeAmount.currency, market.totalCollateralAmount)
    : undefined

  let error: string | undefined = undefined
  if (totalAvailableToRemove && removeAmount && removeAmount.greaterThan(totalAvailableToRemove))
    error = i18n._(t`Not enough ${removeAmount.currency.symbol} available`)

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
              {error ? error : closePosition ? i18n._(t`Close Position`) : i18n._(t`Repay`)}
            </Button>
          )
        }}
      </TridentApproveGate>
      {/*<KashiMarketBorrowReviewModal*/}
      {/*  open={open}*/}
      {/*  permit={permit}*/}
      {/*  onDismiss={() => setOpen(false)}*/}
      {/*  spendFromWallet={repayFromWallet}*/}
      {/*  receiveInWallet={removeToWallet}*/}
      {/*  leveraged={leveraged}*/}
      {/*  collateralAmount={collateralAmount}*/}
      {/*  borrowAmount={borrowAmount}*/}
      {/*/>*/}
    </>
  )
}

export default KashiMarketRepayButton
