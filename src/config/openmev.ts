import { ChainId } from '@sushiswap/core-sdk'

export const OPENMEV_URI: { [chainId in ChainId]?: string } = {
  [ChainId.ETHEREUM]: 'https://api.sushirelay.com/v1',
}
