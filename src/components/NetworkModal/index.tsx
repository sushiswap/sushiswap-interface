import { ChainId } from '@sushiswap/sdk'
import { useActiveWeb3React } from 'hooks'
import React from 'react'
import { ApplicationModal } from '../../state/application/actions'
import { useModalOpen, useNetworkModalToggle } from '../../state/application/hooks'
import { NETWORK_ICON, NETWORK_LABEL } from '../../constants/networks'
import Modal from '../Modal'

export default function NetworkModal(): JSX.Element | null {
    const { chainId } = useActiveWeb3React()
    const networkModalOpen = useModalOpen(ApplicationModal.NETWORK)
    const toggleNetworkModal = useNetworkModalToggle()
    if (!chainId) return null
    return (
        <Modal isOpen={networkModalOpen} onDismiss={toggleNetworkModal}>
            <div className="text-2xl font-bold mb-3 text-high-emphesis">Select a Network</div>

            <div className="text-lg text-primary mb-6">
                You are currently browsing <span className="font-bold">SUSHI</span>
                <br /> on the <span className="font-bold">{NETWORK_LABEL[chainId]}</span> network
            </div>

            <div className="flex flex-col space-y-5 overflow-y-auto">
                {[ChainId.MAINNET, ChainId.FANTOM, ChainId.BSC, ChainId.MATIC].map((key: ChainId, i: number) => {
                    if (chainId === key) {
                        return (
                            <div className="bg-gradient-to-r from-blue to-pink w-full rounded p-px">
                                <div className="flex items-center h-full w-full bg-dark-1000 rounded p-3">
                                    <img
                                        src={NETWORK_ICON[key]}
                                        alt="Switch Network"
                                        className="rounded-md mr-3 w-8 h-8"
                                    />
                                    <div className="text-primary font-bold">{NETWORK_LABEL[key]}</div>
                                </div>
                            </div>
                        )
                    }
                    return (
                        <div
                            key={i}
                            className="flex items-center bg-dark-800 hover:bg-dark-700 w-full rounded p-3 cursor-pointer"
                        >
                            <img src={NETWORK_ICON[key]} alt="Switch Network" className="rounded-md mr-2 w-8 h-8" />
                            <div className="text-primary">{NETWORK_LABEL[key]}</div>
                        </div>
                    )
                })}
            </div>
        </Modal>
    )
}
