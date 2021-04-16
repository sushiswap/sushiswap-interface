import React from 'react'
import { ApplicationModal } from '../../state/application/actions'
import { useModalOpen, useNetworkModalToggle } from '../../state/application/hooks'
import Modal from '../Modal'

export default function NetworkModal(): JSX.Element {
    const networkModalOpen = useModalOpen(ApplicationModal.NETWORK)
    const toggleNetworkModal = useNetworkModalToggle()
    return (
        <div className="max-w-sm">
            <Modal isOpen={networkModalOpen} onDismiss={toggleNetworkModal} minHeight={false} maxHeight={90}>
                <div className="bg-gradient-to-r from-blue to-pink w-full rounded p-px">
                    <div className="flex flex-col h-full w-full bg-dark-900 rounded p-6">
                        <div className="text-2xl font-bold mb-3 text-high-emphesis">Select a Network</div>

                        <div className="text-lg text-primary">
                            You are currently browsing SUSHI
                            <br /> on the Ethereum network
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    )
}
