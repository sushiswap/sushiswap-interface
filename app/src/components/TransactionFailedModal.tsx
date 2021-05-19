import CloseIcon from './CloseIcon'
import Modal from './Modal'
import React from 'react'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'

interface TransactionFailedModalProps {
    isOpen: boolean
    onDismiss: () => void
}

export default function TransactionFailedModal({ isOpen, onDismiss }: TransactionFailedModalProps) {
    const { i18n } = useLingui()

    return (
        <Modal isOpen={isOpen} onDismiss={onDismiss} padding={28}>
            <div className=" h-60">
                <div className="flex justify-end">
                    <CloseIcon onClick={onDismiss} />
                </div>
                <div className="flex justify-center">
                    <img className="w-24" src={'/transaction-rejected.png'} alt="transaction rejected" />
                </div>
                <div className="flex items-baseline justify-center flex-nowrap text-h4 mt-3">
                    <p className="text-high-emphesis">Uh Oh!&nbsp;</p>
                    <p className="text-pink">Transaction rejected.</p>
                </div>
                <div className="flex justify-center mt-5">
                    <button
                        onClick={onDismiss}
                        className="flex justify-center items-center w-full h-12 rounded bg-pink hover:bg-opacity-90 text-lg font-medium text-high-emphesis"
                    >
                        {i18n._(t`Dismiss`)}
                    </button>
                </div>
            </div>
        </Modal>
    )
}
