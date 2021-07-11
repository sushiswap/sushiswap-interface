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
  tokenDayDatasQuery,
} from '../queries'

import { ChainId } from '@sushiswap/sdk'
import { GRAPH_HOST } from '../constants'
import { pager } from './'

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
}

export const exchange = async (chainId = ChainId.MAINNET, query, variables = {}) =>
  pager(`${GRAPH_HOST[chainId]}/subgraphs/name/${EXCHANGE[chainId]}`, query, variables)

export const getPairs = async (chainId = ChainId.MAINNET, variables = undefined, query = pairsQuery) => {
  const { pairs } = await exchange(chainId, query, variables)
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

export const getTokenDayData = async (chainId = ChainId.MAINNET, query = tokenDayDatasQuery, variables) => {
  // console.log('getTokens')
  const { tokenDayDatas } = await exchange(chainId, query, variables)
  return tokenDayDatas
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
  return token[0]?.derivedETH * ethPrice
}

export const getNativePrice = async (chainId = ChainId.MAINNET, variables = undefined) => {
  // console.log('getEthPrice')
  const data = await getBundle(chainId, undefined, variables)
  return data?.bundles[0]?.ethPrice
}

export const getEthPrice = async (variables = undefined) => {
  return getNativePrice(ChainId.MAINNET, variables)
}

export const getCvxPrice = async (variables = {}) => {
  return getTokenPrice(ChainId.MAINNET, tokenPriceQuery, {
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
  return getTokenPrice(ChainId.MAINNET, tokenPriceQuery, {
    id: '0xdbdb4d16eda451d0503b854cf79d55697f90c8df',
    ...variables,
  })
}

export const getSushiPrice = async (variables = {}) => {
  // console.log('getSushiPrice')
  return getTokenPrice(ChainId.MAINNET, tokenPriceQuery, {
    id: '0x6b3595068778dd592e39a122f4f5a5cf09c90fe2',
    ...variables,
  })
}

export const getStakePrice = async (variables = undefined) => {
  return getNativePrice(ChainId.XDAI, variables)
}

export const getOnePrice = async (variables = undefined) => {
  return getNativePrice(ChainId.HARMONY, variables)
}

export const getAvaxPrice = async (variables = undefined) => {
  return getNativePrice(ChainId.AVALANCHE, variables)
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
  const { pairs0, pairs1 } = await exchange(chainId, query, variables)
  return pairs0 || pairs1 ? [...(pairs0 ? pairs0 : []), ...(pairs1 ? pairs1 : [])] : undefined
}
