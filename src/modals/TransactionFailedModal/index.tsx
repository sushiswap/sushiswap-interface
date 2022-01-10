import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import CloseIcon from 'app/components/CloseIcon'
import HeadlessUiModal from 'app/components/Modal/HeadlessUIModal'
import Image from 'next/image'
import React from 'react'

interface TransactionFailedModalProps {
  isOpen: boolean
  onDismiss: () => void
}

export default function TransactionFailedModal({ isOpen, onDismiss }: TransactionFailedModalProps) {
  const { i18n } = useLingui()

  return (
    <HeadlessUiModal.Controlled isOpen={isOpen} onDismiss={onDismiss}>
      <div className="h-60 p-[28px]">
        <div className="flex justify-end">
          <CloseIcon onClick={onDismiss} />
        </div>
        <div className="flex justify-center">
          <Image src={'/transaction-rejected.png'} width="96px" height="96px" alt="transaction rejected" />
        </div>
        <div className="flex items-baseline justify-center mt-3 text-3xl flex-nowrap">
          <p className="text-high-emphesis">Uh Oh!&nbsp;</p>
          <p className="text-pink">Transaction rejected.</p>
        </div>
        <div className="flex justify-center mt-5">
          <button
            onClick={onDismiss}
            className="flex items-center justify-center w-full h-12 text-lg font-medium rounded bg-pink hover:bg-opacity-90 text-high-emphesis"
          >
            {i18n._(t`Dismiss`)}
          </button>
        </div>
      </div>
    </HeadlessUiModal.Controlled>
  )
}
