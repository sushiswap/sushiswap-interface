/**
 * @package OpenMEV Integration
 * @version 2022.03.29
 * @see {@link docs.openmev.org}
 */
import { ChainId } from '@sushiswap/core-sdk'

export const OPENMEV_ENABLED = true

export const OPENMEV_SUPPORTED_NETWORKS = [ChainId.ETHEREUM]

/**
 * @const SUSHIGUARD_RELAY
 * @type {ChainId}
 */
export const SUSHIGUARD_RELAY: { [chainId in ChainId]?: string } = {
  [ChainId.ETHEREUM]: 'https://api.sushirelay.com/v1',
}

export const SUSHIGUARD: { [chainId in ChainId]?: string } = {
  [ChainId.ETHEREUM]: 'https://api.sushirelay.com/v1',
}
