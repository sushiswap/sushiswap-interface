import { ChainId } from '@sushiswap/core-sdk'
import features from 'app/config/features'
import { Feature } from 'app/enums'

export function featureEnabled(feature: Feature, chainId: ChainId): boolean {
  return chainId && chainId in features && features[chainId].includes(feature)
}

export function chainsWithFeature(feature: Feature): ChainId[] {
  return Object.keys(features)
    .filter((chainKey) => featureEnabled(feature, ChainId[chainKey]))
    .map((chain) => ChainId[chain])
}
