import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { HeadlessUiModal } from 'app/components/Modal'
import React, { FC } from 'react'

interface WithdrawSubmittedModalContent {
  txHash: string
  onDismiss(): void
}

const WithdrawSubmittedModalContent: FC<WithdrawSubmittedModalContent> = ({ txHash, onDismiss }) => {
  const { i18n } = useLingui()

  return (
    <HeadlessUiModal.SubmittedModalContent
      txHash={txHash}
      header={i18n._(t`Success!`)}
      subheader={i18n._(t`Success! Withdraw Submitted`)}
      onDismiss={onDismiss}
    />
  )
}

export default WithdrawSubmittedModalContent
