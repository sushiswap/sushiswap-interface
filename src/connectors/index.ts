import { ChainId } from '@sushiswap/sdk'
import { InjectedConnector } from '@web3-react/injected-connector'
import { NetworkConnector } from './NetworkConnector'
import { Web3Provider } from '@ethersproject/providers'
import { RPC } from '../constants'

export const network = new NetworkConnector({
  defaultChainId: 1,
  urls: RPC,
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
    1287, // moonbase
    43114, // avalanche
    43113, // fuji
    128, // heco
    256, // heco testnet
    1666600000, // harmony
    1666700000, // harmony testnet
    66, // okex testnet
    65, // okex testnet
    42161, // arbitrum
    42220, // celo
    11297108109, // palm
  ],
})
