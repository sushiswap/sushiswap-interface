import { ChainId } from '@sushiswap/core-sdk'
import { GRAPH_HOST } from 'app/services/graph/constants'
import {
  factoryDaySnapshotsQuery,
  factoryQuery,
  liquidityPositionsQuery,
  nativePriceQuery,
  pairDaySnapshotsQuery,
  pairsQuery,
  tokenDaySnapshotsQuery,
  tokenPairsQuery,
  tokenPriceQuery,
  tokenQuery,
  tokensQuery,
  tokenSubsetQuery,
  transactionsQuery,
} from 'app/services/graph/queries'

import { pager } from './pager'

export const EXCHANGE = {
  [ChainId.ETHEREUM]: 'sushiswap/exchange',
  [ChainId.XDAI]: 'sushiswap/xdai-exchange',
  [ChainId.MATIC]: 'sushiswap/exchange-polygon',
  [ChainId.FANTOM]: 'sushiswap/exchange-fantom',
  [ChainId.BSC]: 'sushiswap/bsc-exchange',
  [ChainId.HARMONY]: 'sushiswap/harmony-exchange',
  [ChainId.AVALANCHE]: 'sushiswap/exchange-avalanche',
  [ChainId.CELO]: 'sushiswap/exchange-celo',
  [ChainId.ARBITRUM]: 'sushiswap/exchange-arbitrum-backup',
  [ChainId.MOONRIVER]: 'sushiswap/exchange-moonriver',
  [ChainId.OKEX]: 'okex-exchange/oec',
  [ChainId.HECO]: 'heco-exchange/heco',
  [ChainId.FUSE]: 'sushiswap/exchange-fuse',
  [ChainId.MOONBEAM]: 'sushiswap/exchange-moonbeam',
}

export const EXCHANGE_NEW = {
  [ChainId.ETHEREUM]: 'sushi-graph/sushiswap-ethereum',
  [ChainId.AVALANCHE]: 'sushiswap/sushiswap-avalanche',
  [ChainId.ARBITRUM]: 'sushiswap/sushiswap-arbitrum',
  [ChainId.BSC]: 'sushiswap/sushiswap-bsc',
  [ChainId.CELO]: 'sushiswap/sushiswap-celo',
  [ChainId.FANTOM]: 'sushiswap/sushiswap-fantom',
  [ChainId.FUSE]: 'sushiswap/sushiswap-fuse',
  [ChainId.XDAI]: 'sushiswap/sushiswap-gnosis',
  [ChainId.MOONBEAM]: 'sushiswap/sushiswap-moonbeam',
  [ChainId.MOONRIVER]: 'sushiswap/sushiswap-moonriver',
  [ChainId.HARMONY]: 'sushi-graph/sushiswap-harmony',
  [ChainId.MATIC]: 'sushiswap/exchange-polygon',
}

// @ts-ignore TYPE NEEDS FIXING
export const exchange = async (chainId = ChainId.ETHEREUM, query, variables = {}) =>
  // @ts-ignore TYPE NEEDS FIXING
  pager(`${GRAPH_HOST[chainId]}/subgraphs/name/${EXCHANGE_NEW[chainId]}`, query, variables)

export const getPairs = async (chainId = ChainId.ETHEREUM, variables: any = undefined, query = pairsQuery) => {
  const { pairs } = await exchange(chainId, query, variables)
  return pairs
}

// @ts-ignore TYPE NEEDS FIXING
export const getPairDaySnapshots = async (chainId = ChainId.ETHEREUM, variables) => {
  // console.log('getTokens')
  const { pairDaySnapshots } = await exchange(chainId, pairDaySnapshotsQuery, variables)
  return pairDaySnapshots
}

// @ts-ignore TYPE NEEDS FIXING
export const getTokenSubset = async (chainId = ChainId.ETHEREUM, variables) => {
  // console.log('getTokenSubset')
  const { tokens } = await exchange(chainId, tokenSubsetQuery, variables)
  return tokens
}

// @ts-ignore TYPE NEEDS FIXING
export const getTokens = async (chainId = ChainId.ETHEREUM, variables: any = undefined) => {
  // console.log('getTokens')
  const { tokens } = await exchange(chainId, tokensQuery, variables)
  return tokens
}

// @ts-ignore TYPE NEEDS FIXING
export const getToken = async (chainId = ChainId.ETHEREUM, query = tokenQuery, variables) => {
  // console.log('getTokens')
  const { token } = await exchange(chainId, query, variables)
  return token
}

// @ts-ignore TYPE NEEDS FIXING
export const getTokenDaySnapshots = async (chainId = ChainId.ETHEREUM, variables) => {
  // console.log('getTokens')
  const { tokenDaySnapshots } = await exchange(chainId, tokenDaySnapshotsQuery, variables)
  return tokenDaySnapshots
}

// @ts-ignore TYPE NEEDS FIXING
export const getTokenPrices = async (chainId = ChainId.ETHEREUM, variables) => {
  // console.log('getTokenPrice')
  const { tokens } = await exchange(chainId, tokensQuery, variables)
  // @ts-ignore TYPE NEEDS FIXING
  return tokens.map((token) => token?.price.derivedNative)
}

// @ts-ignore TYPE NEEDS FIXING
export const getTokenPrice = async (chainId = ChainId.ETHEREUM, query, variables) => {
  // console.log('getTokenPrice')
  const nativePrice = await getNativePrice(chainId)

  const { token } = await exchange(chainId, query, variables)
  return token?.price.derivedNative * nativePrice
}

export const getNativePrice = async (chainId = ChainId.ETHEREUM, variables: any = undefined) => {
  // console.log('getEthPrice')
  const data = await getBundle(chainId, undefined, variables)
  return data?.bundles[0]?.nativePrice
}

export const getEthPrice = async (variables = undefined) => {
  return getNativePrice(ChainId.ETHEREUM, variables)
}

export const getGlimmerPrice = async (variables = {}) => {
  return getTokenPrice(ChainId.MOONBEAM, tokenPriceQuery, {
    id: '0xacc15dc74880c9944775448304b263d191c6077f',
    ...variables,
  })
}

export const getMetisPrice = async (variables = {}) => {
  return getTokenPrice(ChainId.ETHEREUM, tokenPriceQuery, {
    id: '0x9e32b13ce7f2e80a01932b42553652e053d6ed8e',
    ...variables,
  })
}

export const getYggPrice = async (variables = {}) => {
  return getTokenPrice(ChainId.ETHEREUM, tokenPriceQuery, {
    id: '0x25f8087ead173b73d6e8b84329989a8eea16cf73',
    ...variables,
  })
}

export const getRulerPrice = async (variables = {}) => {
  return getTokenPrice(ChainId.ETHEREUM, tokenPriceQuery, {
    id: '0x2aeccb42482cc64e087b6d2e5da39f5a7a7001f8',
    ...variables,
  })
}

export const getTruPrice = async (variables = {}) => {
  return getTokenPrice(ChainId.ETHEREUM, tokenPriceQuery, {
    id: '0x4c19596f5aaff459fa38b0f7ed92f11ae6543784',
    ...variables,
  })
}

export const getCvxPrice = async (variables = {}) => {
  return getTokenPrice(ChainId.ETHEREUM, tokenPriceQuery, {
    id: '0x4e3fbd56cd56c3e72c1403e103b45db9da5b9d2b',
    ...variables,
  })
}

export const getMaticPrice = async (variables = {}) => {
  // console.log('getMaticPrice')
  return getTokenPrice(ChainId.MATIC, tokenPriceQuery, {
    id: '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270',
    ...variables,
  })
}

export const getAlcxPrice = async (variables = {}) => {
  // console.log('getAlcxPrice')
  return getTokenPrice(ChainId.ETHEREUM, tokenPriceQuery, {
    id: '0xdbdb4d16eda451d0503b854cf79d55697f90c8df',
    ...variables,
  })
}

export const getPicklePrice = async (variables = {}) => {
  return getTokenPrice(ChainId.ETHEREUM, tokenPriceQuery, {
    id: '0x429881672b9ae42b8eba0e26cd9c73711b891ca5',
    ...variables,
  })
}

export const getMphPrice = async (variables = {}) => {
  return getTokenPrice(ChainId.ETHEREUM, tokenPriceQuery, {
    id: '0x8888801af4d980682e47f1a9036e589479e835c5',
    ...variables,
  })
}

export const getSushiPrice = async (variables = {}) => {
  // console.log('getSushiPrice')
  return getTokenPrice(ChainId.ETHEREUM, tokenPriceQuery, {
    id: '0x6b3595068778dd592e39a122f4f5a5cf09c90fe2',
    ...variables,
  })
}

export const getGnoPrice = async () => {
  return getTokenPrice(ChainId.XDAI, tokenPriceQuery, {
    id: '0x9c58bacc331c9aa871afd802db6379a98e80cedb',
  })
}

export const getOnePrice = async (variables = undefined) => {
  return getNativePrice(ChainId.HARMONY, variables)
}

export const getAvaxPrice = async (variables = undefined) => {
  return getNativePrice(ChainId.AVALANCHE, variables)
}

export const getCeloPrice = async () => {
  return getTokenPrice(ChainId.CELO, tokenPriceQuery, {
    id: '0x471ece3750da237f93b8e339c536989b8978a438',
  })
}

export const getFantomPrice = async () => {
  return getTokenPrice(ChainId.FANTOM, tokenPriceQuery, {
    id: '0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83',
  })
}

// @ts-ignore TYPE NEEDS FIXING
export const getOhmPrice = async (chainId) => {
  if (chainId === ChainId.ARBITRUM) {
    return getTokenPrice(ChainId.ARBITRUM, tokenPriceQuery, {
      id: '0x8d9ba570d6cb60c7e3e0f31343efe75ab8e65fb1',
    })
  } else {
    return getTokenPrice(ChainId.MATIC, tokenPriceQuery, {
      id: '0xd8ca34fd379d9ca3c6ee3b3905678320f5b45195',
    })
  }
}

export const getMagicPrice = async () => {
  return getTokenPrice(ChainId.ARBITRUM, tokenPriceQuery, {
    id: '0x539bde0d7dbd336b79148aa742883198bbf60342',
  })
}

export const getMovrPrice = async () => {
  return getTokenPrice(ChainId.MOONRIVER, tokenPriceQuery, {
    id: '0xf50225a84382c74cbdea10b0c176f71fc3de0c4d',
  })
}

export const getSpellPrice = async () => {
  return getTokenPrice(ChainId.ETHEREUM, tokenPriceQuery, {
    id: '0x090185f2135308bad17527004364ebcc2d37e5f6',
  })
}

export const getFusePrice = async () => {
  return getTokenPrice(ChainId.FUSE, tokenPriceQuery, {
    id: '0x0be9e53fd7edac9f859882afdda116645287c629',
  })
}

export const getBundle = async (
  chainId = ChainId.ETHEREUM,
  query = nativePriceQuery,
  variables = {
    id: 1,
  }
) => {
  return exchange(chainId, query, variables)
}

// @ts-ignore TYPE NEEDS FIXING
export const getLiquidityPositions = async (chainId = ChainId.ETHEREUM, variables) => {
  const { liquidityPositions } = await exchange(chainId, liquidityPositionsQuery, variables)
  return liquidityPositions
}

export const getDayData = async (chainId = ChainId.ETHEREUM, variables = undefined) => {
  const { factoryDaySnapshots: dayDatas } = await exchange(chainId, factoryDaySnapshotsQuery, variables)
  return dayDatas
}

export const getFactory = async (chainId = ChainId.ETHEREUM, variables: any = undefined) => {
  const { factories } = await exchange(chainId, factoryQuery, variables)
  return factories[0]
}

export const getTransactions = async (chainId = ChainId.ETHEREUM, variables = undefined) => {
  const { swaps } = await exchange(chainId, transactionsQuery, variables)
  return swaps
}

export const getTokenPairs = async (chainId = ChainId.ETHEREUM, variables = undefined) => {
  console.log('gettokenpairs')
  const { pairs0, pairs1 } = await exchange(chainId, tokenPairsQuery, variables)
  console.log(pairs0, pairs1)

  return pairs0 || pairs1 ? [...(pairs0 ? pairs0 : []), ...(pairs1 ? pairs1 : [])] : undefined
}
