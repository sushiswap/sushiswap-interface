import { ChainId, JSBI } from '@sushiswap/sdk'
import { BigNumber } from '@ethersproject/bignumber'
import RPC from '../config/rpc'

export const OPENMEV_RELAY_ENABLED = false

export const OPENMEV_SUPPORTED_NETWORKS = [ChainId.MAINNET]

export const OPENMEV_URI: { [chainId in ChainId]?: string } = {
  [ChainId.MAINNET]: RPC[ChainId.MAINNET],
}

export const OPENMEV_GAS_URI: { [chainId in ChainId]?: string } = {
  [ChainId.MAINNET]: `${RPC[ChainId.MAINNET]}/gas-price`,
}

export enum OPENMEV_METAMASK_CHAIN_ID {
  MAINNET = '0x1111100000',
}

export const OPENMEV_METAMASK_SUPPORTED_NETWORKS = [OPENMEV_METAMASK_CHAIN_ID.MAINNET]

export const OPENMEV_NETWORK_TO_METAMASK_CHAIN_ID: { [chainId in ChainId]?: OPENMEV_METAMASK_CHAIN_ID } = {
  [ChainId.MAINNET]: OPENMEV_METAMASK_CHAIN_ID.MAINNET,
}

export const OPENMEV_METAMASK_CHAIN_ID_TO_NETWORK: { [id in OPENMEV_METAMASK_CHAIN_ID]?: ChainId } = {
  [OPENMEV_METAMASK_CHAIN_ID.MAINNET]: ChainId.MAINNET,
}

export const OPENMEV_METAMASK_NETWORKS: {
  [chainId in ChainId]?: {
    chainId: string
    chainName: string
    nativeCurrency: {
      name: string
      symbol: string
      decimals: number
    }
    rpcUrls: string[]
    blockExplorerUrls?: string[]
    iconUrls?: string[]
  }
} = {
  [ChainId.MAINNET]: {
    chainName: 'OpenMEV / Ethereum Mainnet',
    chainId: OPENMEV_METAMASK_CHAIN_ID.MAINNET,
    rpcUrls: [OPENMEV_URI[ChainId.MAINNET]],
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18,
    },
    blockExplorerUrls: ['https://etherscan.io'],
  },
}

export const DEFAULT_OPENMEV_GAS_ESTIMATE: BigNumber = BigNumber.from(250000)

// default gas prices to use if all other sources unavailable
export const DEFAULT_OPENMEV_GAS_PRICES: BigNumber[] = [
  BigNumber.from(60000000000),
  BigNumber.from(70000000000),
  BigNumber.from(100000000000),
  BigNumber.from(140000000000),
  BigNumber.from(300000000000),
  BigNumber.from(800000000000),
  BigNumber.from(2000000000000),
]

// default miner tip, equal to median gas price * default gas estimate
export const DEFAULT_OPENMEV_ETH_TIP: JSBI = JSBI.BigInt(
  DEFAULT_OPENMEV_GAS_ESTIMATE.mul(DEFAULT_OPENMEV_GAS_PRICES[4]).toString()
)
