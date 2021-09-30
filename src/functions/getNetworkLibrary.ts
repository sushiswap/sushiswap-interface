import { NetworkConnector } from '../entities/NetworkConnector'
import { Web3Provider } from '@ethersproject/providers'
import { network } from '../config/wallets'

let networkLibrary: Web3Provider | undefined

export function getNetworkLibrary(): Web3Provider {
  return (networkLibrary = networkLibrary ?? new Web3Provider(network.provider as any))
}
