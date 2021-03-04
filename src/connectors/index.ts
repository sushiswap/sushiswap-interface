import { Web3Provider } from '@ethersproject/providers'
import { InjectedConnector } from '@web3-react/injected-connector'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import { WalletLinkConnector } from '@web3-react/walletlink-connector'
import { PortisConnector } from '@web3-react/portis-connector'
import { LatticeConnector } from '@web3-react/lattice-connector'

import { FortmaticConnector } from './Fortmatic'
import { NetworkConnector } from './NetworkConnector'
import { ChainId } from '@sushiswap/sdk'

// TODO: Need to create a map for these & not read single items from ENV...
const NETWORK_URL = process.env.REACT_APP_NETWORK_URL
const FORMATIC_KEY = process.env.REACT_APP_FORTMATIC_KEY
const PORTIS_ID = process.env.REACT_APP_PORTIS_ID

// TODO: ...
// const RPC: {[chainId in ChainId]: string} = {
//   [ChainId.MAINNET]: 'https://mainnet.infura.io/v3/ed2f09b2bafe468ebe3ac5a357539135',
// }

// export const NETWORK_CHAIN_ID: number = parseInt(process.env.REACT_APP_CHAIN_ID ?? '1')

// if (typeof NETWORK_URL === 'undefined') {
//   throw new Error(`REACT_APP_NETWORK_URL must be a defined environment variable`)
// }

const INFURA_API_KEY = process.env.INFURA_API_KEY

if (!INFURA_API_KEY) {
  throw new Error(`INFURA_API_KEY must be a defined environment variable`)
}

const rpcs = {
  [ChainId.MAINNET]: `https://mainnet.infura.io/v3/${INFURA_API_KEY}`,
  [ChainId.ROPSTEN]: `https://ropsten.infura.io/v3/${INFURA_API_KEY}`,
  [ChainId.RINKEBY]: `https://rinkeby.infura.io/v3/${INFURA_API_KEY}`,
  [ChainId.GÖRLI]: `https://goerli.infura.io/v3/${INFURA_API_KEY}`,
  [ChainId.KOVAN]: `https://kovan.infura.io/v3/${INFURA_API_KEY}`
}

export const network = new NetworkConnector({
  urls: rpcs
})

let networkLibrary: Web3Provider | undefined
export function getNetworkLibrary(): Web3Provider {
  return (networkLibrary = networkLibrary ?? new Web3Provider(network.provider as any))
}

export const injected = new InjectedConnector({
  supportedChainIds: [
    1, // mainnet
    3, // ropsten
    4, // rinkeby
    5, // goreli
    42, // kovan
    250, // fantom
    4002, // fantom testnet
    137, // matic
    80001, // matic testnet
    100, // xdai
    56, // binance smart chain
    97, // binance smart chain testnet
    1287 // moonbase
  ]
})

// mainnet only
export const walletconnect = new WalletConnectConnector({
  rpc: rpcs,
  bridge: 'https://bridge.walletconnect.org',
  qrcode: true,
  pollingInterval: 15000
})

// mainnet only
export const lattice = new LatticeConnector({
  chainId: 1,
  url: rpcs[ChainId.MAINNET],
  appName: 'SushiSwap'
})

// mainnet only
export const fortmatic = new FortmaticConnector({
  apiKey: FORMATIC_KEY ?? '',
  chainId: 1
})

// mainnet only
export const portis = new PortisConnector({
  dAppId: PORTIS_ID ?? '',
  networks: [1]
})

// mainnet only
export const walletlink = new WalletLinkConnector({
  url: rpcs[ChainId.MAINNET],
  appName: 'SushiSwap',
  appLogoUrl: 'https://raw.githubusercontent.com/sushiswap/art/master/sushi/logo-256x256.png'
})
