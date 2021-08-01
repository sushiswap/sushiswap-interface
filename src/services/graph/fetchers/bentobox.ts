import { getTokenSubset } from './exchange'

import { ChainId } from '@sushiswap/sdk'
import { GRAPH_HOST } from '../constants'
import { bentoUserTokensQuery, kashiPairsQuery, kashiUserPairsQuery } from '../queries/bentobox'
import { getFraction, toAmount } from '../../../functions'
import { pager } from '.'

export const BENTOBOX = {
  [ChainId.MAINNET]: 'sushiswap/bentobox',
  [ChainId.XDAI]: 'sushiswap/xdai-bentobox',
  [ChainId.MATIC]: 'sushiswap/matic-bentobox',
  [ChainId.FANTOM]: 'sushiswap/fantom-bentobox',
  [ChainId.BSC]: 'sushiswap/bsc-bentobox',
}
export const fetcher = async (chainId = ChainId.MAINNET, query, variables = undefined) =>
  pager(`${GRAPH_HOST[chainId]}/subgraphs/name/${BENTOBOX[chainId]}`, query, variables)

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

export const getUserKashiPairs = async (chainId = ChainId.MAINNET, variables) => {
  const { userKashiPairs } = await fetcher(chainId, kashiUserPairsQuery, variables)

  return userKashiPairs.map((userPair) => ({
    ...userPair,
    assetAmount: Math.floor(
      userPair.assetFraction / getFraction({ ...userPair.pair, token0: userPair.pair.asset })
    ).toString(),
    borrowAmount: toAmount(
      {
        bentoAmount: userPair.pair.totalBorrowElastic.toBigNumber(0),
        bentoShare: userPair.pair.totalBorrowBase.toBigNumber(0),
      },
      userPair.borrowPart.toBigNumber(0)
    ).toString(),
    collateralAmount: toAmount(
      {
        bentoAmount: userPair.pair.collateral.totalSupplyElastic.toBigNumber(0),
        bentoShare: userPair.pair.collateral.totalSupplyBase.toBigNumber(0),
      },
      userPair.collateralShare.toBigNumber(0)
    ).toString(),
  }))
}

export const getBentoUserTokens = async (chainId = ChainId.MAINNET, variables) => {
  const { userTokens } = await fetcher(chainId, bentoUserTokensQuery, variables)

  return userTokens
    .map((token) => ({
      ...(token.token as any),
      shares: token.share as string,
    }))
    .map((token) => ({
      ...token,
      amount: toAmount(
        {
          bentoAmount: token.totalSupplyElastic.toBigNumber(0),
          bentoShare: token.totalSupplyBase.toBigNumber(0),
        },
        token.shares.toBigNumber(0)
      ).toString(),
    }))
}
