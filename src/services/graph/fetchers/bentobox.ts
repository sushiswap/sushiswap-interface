import { getEthPrice, getTokenPrices, getTokenSubset, getTokens } from './exchange'

import { ChainId } from '@sushiswap/sdk'
import { kashiPairsQuery } from '../queries/bentobox'
import { request } from 'graphql-request'
import { tokens } from '@sushiswap/sushi-data/typings/exchange'

export const BENTOBOX = {
  [ChainId.MAINNET]: 'sushiswap/bentobox',
  [ChainId.XDAI]: 'sushiswap/xdai-bentobox',
  [ChainId.MATIC]: 'sushiswap/matic-bentobox',
  [ChainId.FANTOM]: 'sushiswap/fantom-bentobox',
  [ChainId.BSC]: 'sushiswap/bsc-bentobox',
}
export const bentobox = async (query, chainId = ChainId.MAINNET) =>
  request(`https://api.thegraph.com/subgraphs/name/${BENTOBOX[chainId]}`, query)

export const getKashiPairs = async (chainId = ChainId.MAINNET, variables = undefined) => {
  const { kashiPairs } = await request(
    `https://api.thegraph.com/subgraphs/name/${BENTOBOX[chainId]}`,
    kashiPairsQuery,
    variables
  )

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
