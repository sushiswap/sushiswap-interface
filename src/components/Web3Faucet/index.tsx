import React from 'react'
import { useActiveWeb3React } from 'hooks/useActiveWeb3React'
import { useFaucetModalToggle } from '../../state/application/hooks'
import FaucetModal from '../FaucetModal'

function Web3Faucet(): JSX.Element | null {
    const { chainId } = useActiveWeb3React()

    const toggleFaucetModal = useFaucetModalToggle()

    if (!chainId) return null

    return (
        <div
            className="flex items-center rounded bg-dark-900 hover:bg-dark-800 p-0.5 whitespace-nowrap text-sm font-bold cursor-pointer select-none pointer-events-auto"
            onClick={() => toggleFaucetModal()}
        >
            <div className="grid grid-flow-col auto-cols-max items-center rounded-lg bg-dark-1000 text-sm text-secondary py-2 px-3 pointer-events-auto text-primary">
                Claim Test Tokens
            </div>
            <FaucetModal />
        </div>
    )
}

export default Web3Faucet
