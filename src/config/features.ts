// Note (al): #SdkChange - See ../sdk/core-sdk/enums/ChainId.ts
// import { ChainId } from '@sushiswap/core-sdk'
// TODO (amiller68): #SdkPublish Reference published sdk
import { Feature } from 'app/enums'
import { ChainId } from 'sdk'

type FeatureMap = { readonly [chainId in ChainId]?: Feature[] }

const features: FeatureMap = {
  [ChainId.WALLABY]: [Feature.AMM],

  // Note (amiller68): #WallabyOnly - We will only support Wallaby until we figure out MultiChain.
  // The following is an example of what features are available on Ethereum Mainnet.
  // [ChainId.ETHEREUM]: [
  //   Feature.AMM,
  //   Feature.LIQUIDITY_MINING,
  //   Feature.BENTOBOX,
  //   Feature.KASHI,
  //   Feature.ANALYTICS,
  //   Feature.STAKING,
  //   Feature.MISO,
  //   Feature.MEOWSHI,
  //   Feature.INARI,
  //   Feature.VESTING,
  //   Feature.LIMIT_ORDERS,
  //   Feature.SUSHIGUARD,
  //   Feature.SUBGRAPH,
  // ],
}

export default features
