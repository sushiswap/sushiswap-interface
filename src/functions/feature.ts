import { ChainId } from '@sushiswap/core-sdk'

import { Feature } from 'enums'
import features from 'config/features'

export function featureEnabled(feature: Feature, chainId: ChainId): boolean {
  return chainId && chainId in features && features[chainId].includes(feature)
}

export function chainsWithFeature(feature: Feature): ChainId[] {
  return Object.keys(features)
    .filter((chainKey) => featureEnabled(feature, ChainId[chainKey]))
    .map((chain) => ChainId[chain])
}
