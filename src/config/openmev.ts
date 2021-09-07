import { ChainId, JSBI } from '@sushiswap/sdk'

import { BigNumber } from '@ethersproject/bignumber'

export const OPENMEV_SUPPORTED_NETWORKS = [ChainId.MAINNET]

export const OPENMEV_URI: { [chainId in ChainId]?: string } = {
  [ChainId.MAINNET]: 'https://api.sushirelay.com/v1',
}

export const OPENMEV_RELAY_URI: { [chainId in ChainId]?: string } = {
    [ChainId.MAINNET]: 'https://api.sushirelay.com/v1',
  }
  
  // @TODO change to our endpoint 
  export const OPENMEV_GAS_URI: { [chainId in ChainId]?: string } = {
    [ChainId.MAINNET]: 'https://api.archerdao.io/v1/gas',
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
