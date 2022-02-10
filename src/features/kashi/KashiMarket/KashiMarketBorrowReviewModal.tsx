import { Signature } from '@ethersproject/bytes'
import { ArrowDownIcon } from '@heroicons/react/outline'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Button from 'app/components/Button'
import ListPanel from 'app/components/ListPanel'
import { HeadlessUiModal } from 'app/components/Modal'
import SubmittedModalContent from 'app/components/Modal/SubmittedModalContent'
import Typography from 'app/components/Typography'
import { KashiMarketBorrowButton } from 'app/features/kashi/KashiMarket/KashiMarketBorrowButton'
import KashiMarketBorrowDetailsView from 'app/features/kashi/KashiMarket/KashiMarketBorrowDetailsView'
import useBorrowExecute from 'app/features/kashi/KashiMarket/useBorrowExecute'
import { useV2TradeExactIn } from 'app/hooks/useV2Trades'
import React, { FC, useCallback, useState } from 'react'

interface KashiMarketBorrowReviewModal extends KashiMarketBorrowButton {
  open: boolean
  onDismiss(): void
  permit?: Signature
}

const KashiMarketBorrowReviewModal: FC<KashiMarketBorrowReviewModal> = ({
  spendFromWallet,
  receiveInWallet,
  permit,
  leveraged,
  collateralAmount,
  borrowAmount,
  open,
  onDismiss,
}) => {
  const { i18n } = useLingui()
  const [txHash, setTxHash] = useState<string>()
  const [attemptingTxn, setAttemptingTxn] = useState(false)
  const execute = useBorrowExecute()
  const trade = useV2TradeExactIn(borrowAmount, collateralAmount?.currency, { maxHops: 3 }) ?? undefined

  const _execute = useCallback(async () => {
    setAttemptingTxn(true)

    try {
      const tx = await execute({
        spendFromWallet,
        receiveInWallet,
        permit,
        leveraged,
        trade,
        collateralAmount,
        borrowAmount,
      })

      if (tx?.hash) {
        setTxHash(tx.hash)
      }
    } finally {
      setAttemptingTxn(false)
    }
  }, [borrowAmount, collateralAmount, execute, leveraged, permit, receiveInWallet, spendFromWallet, trade])

  return (
    <HeadlessUiModal.Controlled isOpen={open} onDismiss={onDismiss} maxWidth="sm">
      {!txHash ? (
        <div className="flex flex-col gap-4">
          <HeadlessUiModal.Header header={i18n._(t`Confirm Borrow`)} onClose={onDismiss} />
          <HeadlessUiModal.BorderedContent className="flex flex-col gap-2 bg-dark-1000/40 !border-dark-700">
            <Typography weight={700} variant="sm" className="text-secondary">
              {i18n._(t`You'll deposit`)}
            </Typography>
            <ListPanel items={[<ListPanel.CurrencyAmountItem amount={collateralAmount} key={0} />]} />
            <div className="flex justify-center mt-2 -mb-2">
              <ArrowDownIcon width={14} className="text-secondary" />
            </div>
            <Typography weight={700} variant="sm" className="justify-end text-secondary">
              {i18n._(t`You'll borrow`)}
            </Typography>
            <ListPanel items={[<ListPanel.CurrencyAmountItem amount={borrowAmount} key={0} />]} />
          </HeadlessUiModal.BorderedContent>
          <KashiMarketBorrowDetailsView collateralAmount={collateralAmount} borrowAmount={borrowAmount} />
          <Button loading={attemptingTxn} color="gradient" disabled={attemptingTxn} onClick={_execute}>
            {i18n._(t`Confirm Borrow`)}
          </Button>
        </div>
      ) : (
        <SubmittedModalContent
          header={i18n._(t`Success!`)}
          subheader={i18n._(t`Success! Borrow Submitted`)}
          txHash={txHash}
          onDismiss={() => setTxHash(undefined)}
        />
      )}
    </HeadlessUiModal.Controlled>
  )
}

export default KashiMarketBorrowReviewModal
