import { NETWORK_ICON, NETWORK_LABEL } from '../../constants/networks'
import { useModalOpen, useNetworkModalToggle } from '../../state/application/hooks'

import { ApplicationModal } from '../../state/application/actions'
import { ChainId } from '@sushiswap/sdk'
import Image from 'next/image'
import Modal from '../Modal'
import ModalHeader from '../ModalHeader'
import React from 'react'
import cookie from 'cookie-cutter'
import { useActiveWeb3React } from '../../hooks/useActiveWeb3React'

const PARAMS: {
  [chainId in ChainId]?: {
    chainId: string
    chainName: string
    nativeCurrency: {
      name: string
      symbol: string
      decimals: number
    }
    rpcUrls: string[]
    blockExplorerUrls: string[]
  }
} = {
  [ChainId.MAINNET]: {
    chainId: '0x1',
    chainName: 'Ethereum',
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: ['https://mainnet.infura.io/v3'],
    blockExplorerUrls: ['https://etherscan.com'],
  },
  [ChainId.FANTOM]: {
    chainId: '0xfa',
    chainName: 'Fantom',
    nativeCurrency: {
      name: 'Fantom',
      symbol: 'FTM',
      decimals: 18,
    },
    rpcUrls: ['https://rpcapi.fantom.network'],
    blockExplorerUrls: ['https://ftmscan.com'],
  },
  [ChainId.BSC]: {
    chainId: '0x38',
    chainName: 'Binance Smart Chain',
    nativeCurrency: {
      name: 'Binance Coin',
      symbol: 'BNB',
      decimals: 18,
    },
    rpcUrls: ['https://bsc-dataseed.binance.org'],
    blockExplorerUrls: ['https://bscscan.com'],
  },
  [ChainId.MATIC]: {
    chainId: '0x89',
    chainName: 'Matic',
    nativeCurrency: {
      name: 'Matic',
      symbol: 'MATIC',
      decimals: 18,
    },
    rpcUrls: ['https://rpc-mainnet.maticvigil.com'], // ['https://matic-mainnet.chainstacklabs.com/'],
    blockExplorerUrls: ['https://explorer-mainnet.maticvigil.com'],
  },
  [ChainId.HECO]: {
    chainId: '0x80',
    chainName: 'Heco',
    nativeCurrency: {
      name: 'Heco Token',
      symbol: 'HT',
      decimals: 18,
    },
    rpcUrls: ['https://http-mainnet.hecochain.com'],
    blockExplorerUrls: ['https://hecoinfo.com'],
  },
  [ChainId.XDAI]: {
    chainId: '0x64',
    chainName: 'xDai',
    nativeCurrency: {
      name: 'xDai Token',
      symbol: 'xDai',
      decimals: 18,
    },
    rpcUrls: ['https://rpc.xdaichain.com'],
    blockExplorerUrls: ['https://blockscout.com/poa/xdai'],
  },
  [ChainId.HARMONY]: {
    chainId: '0x63564C40',
    chainName: 'Harmony One',
    nativeCurrency: {
      name: 'One Token',
      symbol: 'ONE',
      decimals: 18,
    },
    rpcUrls: [
      'https://api.harmony.one',
      'https://s1.api.harmony.one',
      'https://s2.api.harmony.one',
      'https://s3.api.harmony.one',
    ],
    blockExplorerUrls: ['https://explorer.harmony.one/'],
  },
  [ChainId.AVALANCHE]: {
    chainId: '0xA86A',
    chainName: 'Avalanche',
    nativeCurrency: {
      name: 'Avalanche Token',
      symbol: 'AVAX',
      decimals: 18,
    },
    rpcUrls: ['https://api.avax.network/ext/bc/C/rpc'],
    blockExplorerUrls: ['https://cchain.explorer.avax.network'],
  },
  [ChainId.OKEX]: {
    chainId: '0x42',
    chainName: 'OKEx',
    nativeCurrency: {
      name: 'OKEx Token',
      symbol: 'OKT',
      decimals: 18,
    },
    rpcUrls: ['https://exchainrpc.okex.org'],
    blockExplorerUrls: ['https://www.oklink.com/okexchain'],
  },
  [ChainId.ARBITRUM]: {
    chainId: '0xA4B1',
    chainName: 'Arbitrum',
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: ['https://arb1.arbitrum.io/rpc'],
    blockExplorerUrls: ['https://mainnet-arb-explorer.netlify.app'],
  },
  [ChainId.CELO]: {
    chainId: '0xA4EC',
    chainName: 'Celo',
    nativeCurrency: {
      name: 'Celo',
      symbol: 'CELO',
      decimals: 18,
    },
    rpcUrls: ['https://forno.celo.org'],
    blockExplorerUrls: ['https://explorer.celo.org'],
  },
}

export default function NetworkModal(): JSX.Element | null {
  const { chainId, library, account } = useActiveWeb3React()
  const networkModalOpen = useModalOpen(ApplicationModal.NETWORK)
  const toggleNetworkModal = useNetworkModalToggle()

  if (!chainId) return null

  return (
    <Modal isOpen={networkModalOpen} onDismiss={toggleNetworkModal} maxWidth={768}>
      <ModalHeader onClose={toggleNetworkModal} title="Select a Network" />
      <div className="mb-6 text-lg text-primary">
        You are currently browsing <span className="font-bold text-pink">SUSHI</span>
        <br /> on the <span className="font-bold text-blue">{NETWORK_LABEL[chainId]}</span> network
      </div>

      <div className="grid grid-flow-row-dense grid-cols-1 gap-5 overflow-y-auto md:grid-cols-2">
        {[
          ChainId.MAINNET,
          ChainId.MATIC,
          ChainId.FANTOM,
          ChainId.ARBITRUM,
          ChainId.OKEX,
          ChainId.HECO,
          ChainId.BSC,
          ChainId.XDAI,
          ChainId.HARMONY,
          ChainId.AVALANCHE,
          ChainId.CELO,
        ].map((key: ChainId, i: number) => {
          if (chainId === key) {
            return (
              <button key={i} className="w-full col-span-1 p-px rounded bg-gradient-to-r from-blue to-pink">
                <div className="flex items-center w-full h-full p-3 space-x-3 rounded bg-dark-1000">
                  <Image
                    src={NETWORK_ICON[key]}
                    alt="Switch Network"
                    className="rounded-md"
                    width="32px"
                    height="32px"
                  />
                  <div className="font-bold text-primary">{NETWORK_LABEL[key]}</div>
                </div>
              </button>
            )
          }
          return (
            <button
              key={i}
              onClick={() => {
                toggleNetworkModal()
                const params = PARAMS[key]
                cookie.set('chainId', key)
                if (key === ChainId.MAINNET) {
                  library?.send('wallet_switchEthereumChain', [{ chainId: '0x1' }, account])
                } else {
                  library?.send('wallet_addEthereumChain', [params, account])
                }
              }}
              className="flex items-center w-full col-span-1 p-3 space-x-3 rounded cursor-pointer bg-dark-800 hover:bg-dark-700"
            >
              <Image src={NETWORK_ICON[key]} alt="Switch Network" className="rounded-md" width="32px" height="32px" />
              <div className="font-bold text-primary">{NETWORK_LABEL[key]}</div>
            </button>
          )
        })}
      </div>
    </Modal>
  )
}
