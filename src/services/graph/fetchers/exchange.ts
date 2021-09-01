import {
  dayDatasQuery,
  ethPriceQuery,
  factoryQuery,
  liquidityPositionsQuery,
  pairsQuery,
  tokenPairsQuery,
  tokenPriceQuery,
  tokenQuery,
  tokenSubsetQuery,
  tokensQuery,
  transactionsQuery,
} from '../queries'

import { ChainId } from '@sushiswap/sdk'
import { GRAPH_HOST } from '../constants'
import { request } from 'graphql-request'

export const EXCHANGE = {
  [ChainId.MAINNET]: 'sushiswap/exchange',
  [ChainId.XDAI]: 'sushiswap/xdai-exchange',
  [ChainId.MATIC]: 'sushiswap/matic-exchange',
  [ChainId.FANTOM]: 'sushiswap/fantom-exchange',
  [ChainId.BSC]: 'sushiswap/bsc-exchange',
  [ChainId.HARMONY]: 'sushiswap/harmony-exchange',
  [ChainId.OKEX]: 'sushiswap/okex-exchange',
  [ChainId.AVALANCHE]: 'sushiswap/avalanche-exchange',
  [ChainId.CELO]: 'sushiswap/celo-exchange',
  [ChainId.ARBITRUM]: 'sushiswap/arbitrum-exchange',
}

export const exchange = async (chainId = ChainId.MAINNET, query, variables) =>
  request(`${GRAPH_HOST[chainId]}/subgraphs/name/${EXCHANGE[chainId]}`, query, variables)

export const getPairs = async (chainId = ChainId.MAINNET, variables = undefined, query = pairsQuery) => {
  const { pairs } = await exchange(chainId, query, variables)
  console.log({ chainId, pairs })
  return pairs
}

export const getTokenSubset = async (chainId = ChainId.MAINNET, variables) => {
  // console.log('getTokenSubset')
  const { tokens } = await exchange(chainId, tokenSubsetQuery, variables)
  return tokens
}

export const getTokens = async (chainId = ChainId.MAINNET, query = tokensQuery, variables) => {
  // console.log('getTokens')
  const { tokens } = await exchange(chainId, query, variables)
  return tokens
}

export const getToken = async (chainId = ChainId.MAINNET, query = tokenQuery, variables) => {
  // console.log('getTokens')
  const { token } = await exchange(chainId, query, variables)
  return token
}

export const getTokenPrices = async (chainId = ChainId.MAINNET, variables) => {
  // console.log('getTokenPrice')
  const { tokens } = await exchange(chainId, tokensQuery, variables)
  return tokens.map((token) => token?.derivedETH)
}

export const getTokenPrice = async (chainId = ChainId.MAINNET, query, variables) => {
  // console.log('getTokenPrice')
  const ethPrice = await getEthPrice(chainId)

  const { token } = await exchange(chainId, query, variables)
  return token?.derivedETH * ethPrice
}

export const getEthPrice = async (chainId = ChainId.MAINNET, variables = undefined) => {
  // console.log('getEthPrice')
  const data = await getBundle(chainId, undefined, variables)
  return data?.bundles?.[0]?.ethPrice
}

export const getYggPrice = async () => {
  return getTokenPrice(ChainId.MAINNET, tokenPriceQuery, {
    id: '0x25f8087ead173b73d6e8b84329989a8eea16cf73',
  })
}

export const getRulerPrice = async () => {
  return getTokenPrice(ChainId.MAINNET, tokenPriceQuery, {
    id: '0x2aeccb42482cc64e087b6d2e5da39f5a7a7001f8',
  })
}

export const getTruPrice = async () => {
  return getTokenPrice(ChainId.MAINNET, tokenPriceQuery, {
    id: '0x4c19596f5aaff459fa38b0f7ed92f11ae6543784',
  })
}

export const getCvxPrice = async () => {
  return getTokenPrice(ChainId.MAINNET, tokenPriceQuery, {
    id: '0x4e3fbd56cd56c3e72c1403e103b45db9da5b9d2b',
  })
}

export const getMaticPrice = async () => {
  // console.log('getMaticPrice')
  return getTokenPrice(ChainId.MATIC, tokenPriceQuery, {
    id: '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270',
  })
}

export const getAlcxPrice = async () => {
  // console.log('getAlcxPrice')
  return getTokenPrice(ChainId.MAINNET, tokenPriceQuery, {
    id: '0xdbdb4d16eda451d0503b854cf79d55697f90c8df',
  })
}

export const getPicklePrice = async () => {
  return getTokenPrice(ChainId.MAINNET, tokenPriceQuery, {
    id: '0x429881672b9ae42b8eba0e26cd9c73711b891ca5',
  })
}

export const getMphPrice = async () => {
  return getTokenPrice(ChainId.MAINNET, tokenPriceQuery, {
    id: '0x8888801af4d980682e47f1a9036e589479e835c5',
  })
}

export const getSushiPrice = async () => {
  // console.log('getSushiPrice')
  return getTokenPrice(ChainId.MAINNET, tokenPriceQuery, {
    id: '0x6b3595068778dd592e39a122f4f5a5cf09c90fe2',
  })
}

export const getStakePrice = async () => {
  return getTokenPrice(ChainId.XDAI, tokenPriceQuery, {
    id: '0xb7d311e2eb55f2f68a9440da38e7989210b9a05e',
  })
}

export const getOnePrice = async () => {
  return getTokenPrice(ChainId.HARMONY, tokenPriceQuery, {
    id: '0xcf664087a5bb0237a0bad6742852ec6c8d69a27a',
  })
}

export const getBundle = async (
  chainId = ChainId.MAINNET,
  query = ethPriceQuery,
  variables = {
    id: 1,
  }
) => {
  return exchange(chainId, query, variables)
}

export const getLiquidityPositions = async (chainId = ChainId.MAINNET, variables) => {
  const { liquidityPositions } = await exchange(chainId, liquidityPositionsQuery, variables)
  return liquidityPositions
}

export const getDayData = async (chainId = ChainId.MAINNET, query = dayDatasQuery, variables = undefined) => {
  const { dayDatas } = await exchange(chainId, query, variables)
  return dayDatas
}

export const getFactory = async (chainId = ChainId.MAINNET, variables = undefined) => {
  const { factory } = await exchange(chainId, factoryQuery, variables)
  return factory
}

export const getTransactions = async (chainId = ChainId.MAINNET, query = transactionsQuery, variables = undefined) => {
  const { swaps } = await exchange(chainId, query, variables)
  return swaps
}

export const getTokenPairs = async (chainId = ChainId.MAINNET, query = tokenPairsQuery, variables = undefined) => {
  const { pairs1, pairs2 } = await exchange(chainId, query, variables)
  return pairs1 || pairs2 ? [...(pairs1 ? pairs1 : []), ...(pairs2 ? pairs2 : [])] : undefined
}
