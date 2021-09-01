import { getEthPrice, getTokenPrices, getTokenSubset, getTokens } from './exchange'

import { ChainId } from '@sushiswap/sdk'
import { GRAPH_HOST } from '../constants'
import { kashiPairsQuery } from '../queries/bentobox'
import { request } from 'graphql-request'

export const BENTOBOX = {
  [ChainId.MAINNET]: 'sushiswap/bentobox',
  [ChainId.XDAI]: 'sushiswap/xdai-bentobox',
  [ChainId.MATIC]: 'sushiswap/matic-bentobox',
  [ChainId.FANTOM]: 'sushiswap/fantom-bentobox',
  [ChainId.BSC]: 'sushiswap/bsc-bentobox',
  [ChainId.ARBITRUM]: 'sushiswap/arbitrum-bentobox',
}
export const fetcher = async (chainId = ChainId.MAINNET, query, variables) =>
  request(`${GRAPH_HOST[chainId]}/subgraphs/name/${BENTOBOX[chainId]}`, query)

export const getKashiPairs = async (chainId = ChainId.MAINNET, variables = undefined) => {
  const { kashiPairs } = await fetcher(chainId, kashiPairsQuery, variables)

  const tokens = await getTokenSubset(chainId, {
    tokenAddresses: Array.from(
      kashiPairs.reduce(
        (previousValue, currentValue) => previousValue.add(currentValue.asset.id, currentValue.collateral.id),
        new Set() // use set to avoid duplicates
      )
    ),
  })

  return kashiPairs.map((pair) => ({
    ...pair,
    token0: {
      ...pair.asset,
      ...tokens.find((token) => token.id === pair.asset.id),
    },
    token1: {
      ...pair.collateral,
      ...tokens.find((token) => token.id === pair.collateral.id),
    },
  }))
}
