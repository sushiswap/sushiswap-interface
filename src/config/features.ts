import { ChainId } from '@figswap/core-sdk'
import { Feature } from 'app/enums'

type FeatureMap = { readonly [chainId in ChainId]?: Feature[] }

const features: FeatureMap = {
  [ChainId.WALLABY]: [Feature.AMM],
}

export default features
