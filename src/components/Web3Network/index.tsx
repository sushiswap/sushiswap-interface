import { NETWORK_ICON, NETWORK_LABEL } from 'app/config/networks'
import NetworkModel from 'app/modals/NetworkModal'
import { useActiveWeb3React } from 'app/services/web3'
import { useNetworkModalToggle } from 'app/state/application/hooks'
import Image from 'next/image'
import React from 'react'

function Web3Network(): JSX.Element | null {
  const { chainId } = useActiveWeb3React()

  const toggleNetworkModal = useNetworkModalToggle()

  if (!chainId) return null

  return (
    <div
      className="flex items-center rounded border border-dark-800 hover:border-dark-700 bg-dark-1000 hover:bg-dark-900 whitespace-nowrap text-sm font-bold cursor-pointer select-none pointer-events-auto"
      onClick={() => toggleNetworkModal()}
    >
      <div className="grid items-center grid-flow-col pl-2 pr-3 py-2 space-x-3 text-sm rounded pointer-events-auto auto-cols-max text-secondary">
        <Image src={NETWORK_ICON[chainId]} alt="Switch Network" className="rounded-md" width="22px" height="22px" />
        <div className="text-primary">{NETWORK_LABEL[chainId]}</div>
      </div>
      <NetworkModel />
    </div>
  )
}

export default Web3Network
