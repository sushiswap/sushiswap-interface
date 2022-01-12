import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { ChainId, Currency } from '@sushiswap/core-sdk'
import loadingRollingCircle from 'app/animation/loading-rolling-circle.json'
import receiptPrinting from 'app/animation/receipt-printing.json'
import Button from 'app/components/Button'
import CloseIcon from 'app/components/CloseIcon'
import ExternalLink from 'app/components/ExternalLink'
import HeadlessUiModal from 'app/components/Modal/HeadlessUIModal'
import Typography from 'app/components/Typography'
import { getExplorerLink } from 'app/functions'
import useAddTokenToMetaMask from 'app/hooks/useAddTokenToMetaMask'
import { useActiveWeb3React } from 'app/services/web3'
import Lottie from 'lottie-react'
import React, { FC } from 'react'
import { AlertTriangle } from 'react-feather'

interface ConfirmationPendingContentProps {
  onDismiss: () => void
  pendingText: string
}

export const ConfirmationPendingContent: FC<ConfirmationPendingContentProps> = ({ onDismiss, pendingText }) => {
  const { i18n } = useLingui()
  return (
    <div className="flex flex-col gap-4">
      <HeadlessUiModal.Header header={i18n._(t`Confirm transaction`)} onClose={onDismiss} />
      <HeadlessUiModal.BorderedContent className="flex flex-col gap-1 justify-center items-center">
        <div className="w-24 pb-4 m-auto">
          <Lottie animationData={loadingRollingCircle} autoplay loop />
        </div>
        <Typography variant="lg" weight={700} className="text-white">
          {pendingText}
        </Typography>
        <Typography variant="sm">{i18n._(t`Confirm this transaction in your wallet`)}</Typography>
      </HeadlessUiModal.BorderedContent>
    </div>
  )
}

interface TransactionSubmittedContentProps {
  onDismiss: () => void
  hash: string | undefined
  chainId: ChainId
  currencyToAdd?: Currency | undefined
  inline?: boolean // not in modal
}

export const TransactionSubmittedContent: FC<TransactionSubmittedContentProps> = ({
  onDismiss,
  chainId,
  hash,
  currencyToAdd,
}) => {
  const { i18n } = useLingui()
  const { library } = useActiveWeb3React()
  const { addToken, success } = useAddTokenToMetaMask(currencyToAdd)
  return (
    <div className="flex flex-col gap-4">
      <HeadlessUiModal.Header header={i18n._(t`Transaction submitted`)} onClose={onDismiss} />
      <HeadlessUiModal.BorderedContent className="flex flex-col gap-1 justify-center items-center">
        <div className="w-[102px] h-[102px] bg-dark-900 rounded-full">
          <Lottie animationData={receiptPrinting} autoplay loop={false} />
        </div>
        <Typography variant="sm" weight={700} className="text-white">
          {i18n._(t`Transaction Submitted`)}
        </Typography>
        {chainId && hash && (
          <ExternalLink href={getExplorerLink(chainId, hash, 'transaction')}>
            <Typography variant="xs" weight={700} className="text-blue outline-none">
              {i18n._(t`View on explorer`)}
            </Typography>
          </ExternalLink>
        )}
      </HeadlessUiModal.BorderedContent>

      {currencyToAdd && library?.provider?.isMetaMask && (
        <Button color="blue" onClick={addToken}>
          <Typography variant="sm" weight={700}>
            {!success ? (
              i18n._(t`Add ${currencyToAdd.symbol} to MetaMask`)
            ) : (
              <>
                {i18n._(t`Added`)} {currencyToAdd.symbol}
              </>
            )}
          </Typography>
        </Button>
      )}
    </div>
  )
}

interface ConfirmationModelContentProps {
  title: string
  onDismiss: () => void
  topContent: () => React.ReactNode
  bottomContent: () => React.ReactNode
}

export const ConfirmationModalContent: FC<ConfirmationModelContentProps> = ({
  title,
  bottomContent,
  onDismiss,
  topContent,
}) => {
  return (
    <div className="flex flex-col gap-4">
      <HeadlessUiModal.Header header={title} onClose={onDismiss} />
      {topContent()}
      {bottomContent()}
    </div>
  )
}

interface TransactionErrorContentProps {
  message: string
  onDismiss: () => void
}

export const TransactionErrorContent: FC<TransactionErrorContentProps> = ({ message, onDismiss }) => {
  const { i18n } = useLingui()

  return (
    <div className="grid gap-6 p-6">
      <div>
        <div className="flex justify-between">
          <div className="text-lg font-medium text-high-emphesis">{i18n._(t`Error`)}</div>
          <CloseIcon onClick={onDismiss} />
        </div>
        <div className="flex flex-col items-center justify-center gap-3">
          <AlertTriangle className="text-red" style={{ strokeWidth: 1.5 }} size={64} />
          <div className="font-bold text-red">{message}</div>
        </div>
      </div>
      <div>
        <Button color="gradient" size="lg" onClick={onDismiss}>
          Dismiss
        </Button>
      </div>
    </div>
  )
}

interface ConfirmationModalProps {
  isOpen: boolean
  onDismiss: () => void
  hash: string | undefined
  content: () => React.ReactNode
  attemptingTxn: boolean
  pendingText: string
  currencyToAdd?: Currency | undefined
}

const TransactionConfirmationModal: FC<ConfirmationModalProps> = ({
  isOpen,
  onDismiss,
  attemptingTxn,
  hash,
  pendingText,
  content,
  currencyToAdd,
}) => {
  const { chainId } = useActiveWeb3React()

  if (!chainId) return null

  // confirmation screen
  return (
    <HeadlessUiModal.Controlled isOpen={isOpen} onDismiss={onDismiss}>
      {attemptingTxn ? (
        <ConfirmationPendingContent onDismiss={onDismiss} pendingText={pendingText} />
      ) : hash ? (
        <TransactionSubmittedContent
          chainId={chainId}
          hash={hash}
          onDismiss={onDismiss}
          currencyToAdd={currencyToAdd}
        />
      ) : (
        content()
      )}
    </HeadlessUiModal.Controlled>
  )
}

export default TransactionConfirmationModal
