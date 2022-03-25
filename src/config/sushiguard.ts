import { ChainId } from '@sushiswap/core-sdk'

export const OPENMEV_ENABLED = true

export const OPENMEV_SUPPORTED_NETWORKS = [ChainId.ETHEREUM]

export const SUSHIGUARD_RELAY: { [chainId in ChainId]?: string } = {
  [ChainId.ETHEREUM]: 'https://api.sushirelay.com/v1',
}
