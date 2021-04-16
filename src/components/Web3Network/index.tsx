import { ChainId } from '@sushiswap/sdk'
import React from 'react'
import Arbitrum from '../../assets/networks/arbitrum-network.jpg'
import Avalanche from '../../assets/networks/avalanche-network.jpg'
import Bsc from '../../assets/networks/bsc-network.jpg'
import Fantom from '../../assets/networks/fantom-network.jpg'
import Goerli from '../../assets/networks/goerli-network.jpg'
import Harmony from '../../assets/networks/harmonyone-network.jpg'
import Heco from '../../assets/networks/heco-network.jpg'
import Kovan from '../../assets/networks/kovan-network.jpg'
import Matic from '../../assets/networks/matic-network.jpg'
import Moonbeam from '../../assets/networks/moonbeam-network.jpg'
import Polygon from '../../assets/networks/polygon-network.jpg'
import Rinkeby from '../../assets/networks/rinkeby-network.jpg'
import Ropsten from '../../assets/networks/ropsten-network.jpg'
import Xdai from '../../assets/networks/xdai-network.jpg'
import Mainnet from '../../assets/networks/mainnet-network.jpg'
import { useActiveWeb3React } from 'hooks'
import NetworkModal from '../NetworkModal'
import { useNetworkModalToggle } from '../../state/application/hooks'

const NETWORK_ICON = {
    [ChainId.MAINNET]: Mainnet,
    [ChainId.ROPSTEN]: Ropsten,
    [ChainId.RINKEBY]: Rinkeby,
    [ChainId.GÖRLI]: Goerli,
    [ChainId.KOVAN]: Kovan,
    [ChainId.FANTOM]: Fantom,
    [ChainId.FANTOM_TESTNET]: Fantom,
    [ChainId.BSC]: Bsc,
    [ChainId.BSC_TESTNET]: Bsc,
    [ChainId.MATIC]: Matic,
    [ChainId.MATIC_TESTNET]: Matic,
    [ChainId.XDAI]: Xdai,
    [ChainId.ARBITRUM]: Arbitrum,
    [ChainId.MOONBASE]: Moonbeam,
    [ChainId.AVALANCHE]: Avalanche,
    [ChainId.FUJI]: Avalanche,
    [ChainId.HECO]: Heco,
    [ChainId.HECO_TESTNET]: Heco,
    [ChainId.HARMONY]: Harmony,
    [ChainId.HARMONY_TESTNET]: Harmony
}

const NETWORK_LABEL: { [chainId in ChainId]?: string } = {
    [ChainId.MAINNET]: 'Ethereum',
    [ChainId.RINKEBY]: 'Rinkeby',
    [ChainId.ROPSTEN]: 'Ropsten',
    [ChainId.GÖRLI]: 'Görli',
    [ChainId.KOVAN]: 'Kovan',
    [ChainId.FANTOM]: 'Fantom',
    [ChainId.FANTOM_TESTNET]: 'Fantom Testnet',
    [ChainId.MATIC]: 'Matic',
    [ChainId.MATIC_TESTNET]: 'Matic Testnet',
    [ChainId.XDAI]: 'xDai',
    [ChainId.BSC]: 'BSC',
    [ChainId.BSC_TESTNET]: 'BSC Testnet',
    [ChainId.MOONBASE]: 'Moonbase',
    [ChainId.AVALANCHE]: 'Avalanche',
    [ChainId.FUJI]: 'Fuji',
    [ChainId.HECO]: 'HECO',
    [ChainId.HECO_TESTNET]: 'HECO Testnet',
    [ChainId.HARMONY]: 'Harmony',
    [ChainId.HARMONY_TESTNET]: 'Harmony Testnet'
}

function Web3Network(): JSX.Element | null {
    const { chainId } = useActiveWeb3React()

    const toggleNetworkModal = useNetworkModalToggle()

    if (!chainId) return null

    return (
        <div className="flex" onClick={() => toggleNetworkModal()}>
            <div className="grid grid-flow-col auto-cols-max items-center rounded-lg bg-dark-1000 text-sm text-secondary py-2 px-3">
                <img
                    src={NETWORK_ICON[chainId]}
                    alt="Switch Network"
                    className="rounded-md mr-2"
                    style={{ width: 22, height: 22 }}
                />
                <div className="text-primary">{NETWORK_LABEL[chainId]}</div>
            </div>
            <div className="py-2 px-3">
                <div
                    style={{ width: 22, height: 22 }}
                    className="bg-cover bg-center bg-chain-static hover:bg-chain-animated"
                />
            </div>

            <NetworkModal />
        </div>
    )
}

export default Web3Network
