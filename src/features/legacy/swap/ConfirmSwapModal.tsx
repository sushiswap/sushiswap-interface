import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Percent } from '@sushiswap/core-sdk'
import TransactionConfirmationModal, {
  ConfirmationModalContent,
  TransactionErrorContent,
} from 'app/modals/TransactionConfirmationModal'
import { TradeUnion } from 'app/types'
import React, { FC, useMemo } from 'react'

import SwapModalFooter from './SwapModalFooter'
import SwapModalHeader from './SwapModalHeader'

/**
 * Returns true if the trade requires a confirmation of details before we can submit it
 * @param args either a pair of V2 trades or a pair of V3 trades
 */
function tradeMeaningfullyDiffers(...args: [TradeUnion, TradeUnion]): boolean {
  const [tradeA, tradeB] = args
  return (
    tradeA.tradeType !== tradeB.tradeType ||
    !tradeA.inputAmount.currency.equals(tradeB.inputAmount.currency) ||
    !tradeA.inputAmount.equalTo(tradeB.inputAmount) ||
    !tradeA.outputAmount.currency.equals(tradeB.outputAmount.currency) ||
    !tradeA.outputAmount.equalTo(tradeB.outputAmount)
  )
}

interface ConfirmSwapModal {
  isOpen: boolean
  trade?: TradeUnion
  originalTrade?: TradeUnion
  attemptingTxn: boolean
  allowedSlippage: Percent
  onAcceptChanges(): void
  onConfirm(): void
  onDismiss(): void
  txHash?: string
  recipient?: string
  swapErrorMessage?: string
}

const ConfirmSwapModal: FC<ConfirmSwapModal> = ({
  trade,
  originalTrade,
  onAcceptChanges,
  allowedSlippage,
  onConfirm,
  onDismiss,
  recipient,
  swapErrorMessage,
  isOpen,
  attemptingTxn,
  txHash,
}) => {
  const { i18n } = useLingui()
  const showAcceptChanges = useMemo(
    () => Boolean(trade && originalTrade && tradeMeaningfullyDiffers(trade, originalTrade)),
    [originalTrade, trade]
  )

  const pendingText = `Swapping ${trade?.inputAmount?.toSignificant(6)} ${
    trade?.inputAmount?.currency?.symbol
  } for ${trade?.outputAmount?.toSignificant(6)} ${trade?.outputAmount?.currency?.symbol}`

  return (
    <TransactionConfirmationModal
      isOpen={isOpen}
      onDismiss={onDismiss}
      attemptingTxn={attemptingTxn}
      hash={txHash}
      content={
        swapErrorMessage ? (
          <TransactionErrorContent onDismiss={onDismiss} message={swapErrorMessage} />
        ) : (
          <ConfirmationModalContent
            title={i18n._(t`Confirm Swap`)}
            onDismiss={onDismiss}
            topContent={
              <SwapModalHeader
                trade={trade}
                allowedSlippage={allowedSlippage}
                recipient={recipient}
                showAcceptChanges={showAcceptChanges}
                onAcceptChanges={onAcceptChanges}
              />
            }
            bottomContent={
              <SwapModalFooter
                onConfirm={onConfirm}
                disabledConfirm={showAcceptChanges}
                swapErrorMessage={swapErrorMessage}
              />
            }
          />
        )
      }
      pendingText={pendingText}
      currencyToAdd={trade?.outputAmount.currency}
    />
  )
}

export default ConfirmSwapModal
