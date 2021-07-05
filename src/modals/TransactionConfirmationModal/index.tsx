import { AlertTriangle, ArrowUpCircle, CheckCircle } from 'react-feather'
import React, { FC } from 'react'

import Button from '../../components/Button'
import { ChainId, Currency } from '@sushiswap/sdk'
import CloseIcon from '../../components/CloseIcon'
import ExternalLink from '../../components/ExternalLink'
import Lottie from 'lottie-react'
import Modal from '../../components/Modal'
import ModalHeader from '../../components/ModalHeader'
import { getExplorerLink } from '../../functions/explorer'
import loadingRollingCircle from '../../animation/loading-rolling-circle.json'
import { t, Trans } from '@lingui/macro'
import { useActiveWeb3React } from '../../hooks/useActiveWeb3React'
import { useLingui } from '@lingui/react'
import useAddTokenToMetaMask from '../../hooks/useAddTokenToMetaMask'
import { RowFixed } from '../../components/Row'
import Image from '../../components/Image'

interface ConfirmationPendingContentProps {
  onDismiss: () => void
  pendingText: string
  pendingText2: string
}

export const ConfirmationPendingContent: FC<ConfirmationPendingContentProps> = ({
  onDismiss,
  pendingText,
  pendingText2,
}) => {
  const { i18n } = useLingui()
  return (
    <div>
      <div className="flex justify-end">
        <CloseIcon onClick={onDismiss} />
      </div>
      <div className="w-24 pb-4 m-auto">
        <Lottie animationData={loadingRollingCircle} autoplay loop />
      </div>
      <div className="flex flex-col items-center justify-center gap-3">
        <div className="text-xl font-bold text-high-emphesis">{i18n._(t`Waiting for Confirmation`)}</div>
        <div className="font-bold">{pendingText}</div>
        <div className="font-bold">{pendingText2}</div>
        <div className="text-sm font-bold text-secondary">{i18n._(t`Confirm this transaction in your wallet`)}</div>
      </div>
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
    <div>
      <div className="flex justify-end">
        <CloseIcon onClick={onDismiss} />
      </div>
      <div className="w-24 pb-4 m-auto">
        <ArrowUpCircle strokeWidth={0.5} size={90} className="text-blue" />
      </div>
      <div className="flex flex-col items-center justify-center gap-1">
        <div className="text-xl font-bold">{i18n._(t`Transaction Submitted`)}</div>
        {chainId && hash && (
          <ExternalLink href={getExplorerLink(chainId, hash, 'transaction')}>
            <div className="font-bold text-blue">View on explorer</div>
          </ExternalLink>
        )}
        {currencyToAdd && library?.provider?.isMetaMask && (
          <Button color="gradient" onClick={addToken} className="w-auto mt-4">
            {!success ? (
              <RowFixed className="mx-auto space-x-2">
                <Trans>
                  <span>Add {currencyToAdd.symbol} to MetaMask </span>
                  <Image
                    src="/images/wallets/metamask.png"
                    alt="Add to MetaMask"
                    width={24}
                    height={24}
                    className="ml-1"
                  />
                </Trans>
              </RowFixed>
            ) : (
              <RowFixed>
                <Trans>Added {currencyToAdd.symbol} </Trans>
                <CheckCircle className="ml-1.5 text-2xl text-green" size="16px" />
              </RowFixed>
            )}
          </Button>
        )}
        {/* <Button color="gradient" onClick={onDismiss} style={{ margin: '20px 0 0 0' }}>
          Close
        </Button> */}
      </div>
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
    <div className="grid gap-4">
      <ModalHeader title={title} onClose={onDismiss} />
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
    <div className="grid gap-6">
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
  pendingText2?: string
  currencyToAdd?: Currency | undefined
}

const TransactionConfirmationModal: FC<ConfirmationModalProps> = ({
  isOpen,
  onDismiss,
  attemptingTxn,
  hash,
  pendingText,
  pendingText2,
  content,
  currencyToAdd,
}) => {
  const { chainId } = useActiveWeb3React()

  if (!chainId) return null

  // confirmation screen
  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss} maxHeight={90}>
      {attemptingTxn ? (
        <ConfirmationPendingContent onDismiss={onDismiss} pendingText={pendingText} pendingText2={pendingText2} />
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
    </Modal>
  )
}

export default TransactionConfirmationModal
