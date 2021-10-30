import { ChainId } from '@sushiswap/core-sdk'
import { getFraction, toAmount } from 'functions'
import { GRAPH_HOST } from 'services/graph/constants'
import { getTokenSubset } from 'services/graph/fetchers'
import {
  bentoBoxQuery,
  bentoStrategiesQuery,
  bentoTokensQuery,
  bentoUserTokensQuery,
  clonesQuery,
  kashiPairsQuery,
  kashiUserPairsQuery,
} from 'services/graph/queries/bentobox'

import { pager } from './pager'

export const BENTOBOX = {
  [ChainId.ETHEREUM]: 'sushiswap/bentobox',
  [ChainId.XDAI]: 'sushiswap/xdai-bentobox',
  [ChainId.MATIC]: 'lufycz/matic-bentobox',
  [ChainId.FANTOM]: 'sushiswap/fantom-bentobox',
  [ChainId.BSC]: 'sushiswap/bsc-bentobox',
  [ChainId.ARBITRUM]: 'sushiswap/arbitrum-bentobox',
}
const fetcher = async (chainId = ChainId.ETHEREUM, query, variables = undefined) =>
  pager(`${GRAPH_HOST[chainId]}/subgraphs/name/${BENTOBOX[chainId]}`, query, variables)

export const getClones = async (chainId = ChainId.ETHEREUM) => {
  const { clones } = await fetcher(chainId, clonesQuery)
  return clones
}

export const getKashiPairs = async (chainId = ChainId.ETHEREUM, variables = undefined) => {
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
    assetAmount: Math.floor(pair.totalAssetBase / getFraction({ ...pair, token0: pair.asset })).toString(),
    borrowedAmount: toAmount(
      {
        bentoAmount: pair.totalBorrowElastic.toBigNumber(0),
        bentoShare: pair.totalBorrowBase.toBigNumber(0),
      },
      pair.totalBorrowElastic.toBigNumber(0)
    ).toString(),
    collateralAmount: toAmount(
      {
        bentoAmount: pair.collateral.totalSupplyElastic.toBigNumber(0),
        bentoShare: pair.collateral.totalSupplyBase.toBigNumber(0),
      },
      pair.totalCollateralShare.toBigNumber(0)
    ).toString(),
  }))
}

export const getUserKashiPairs = async (chainId = ChainId.ETHEREUM, variables) => {
  const { userKashiPairs } = await fetcher(chainId, kashiUserPairsQuery, variables)

  return userKashiPairs.map((userPair) => ({
    ...userPair,
    assetAmount: Math.floor(
      userPair.assetFraction / getFraction({ ...userPair.pair, token0: userPair.pair.asset })
    ).toString(),
    borrowedAmount: toAmount(
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

export const getBentoUserTokens = async (chainId = ChainId.ETHEREUM, variables) => {
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

export const getBentoBox = async (chainId = ChainId.ETHEREUM, variables) => {
  const { bentoBoxes } = await fetcher(chainId, bentoBoxQuery, variables)

  return bentoBoxes[0]
}

export const getBentoTokens = async (chainId = ChainId.ETHEREUM, variables) => {
  const { tokens } = await fetcher(chainId, bentoTokensQuery, variables)

  return tokens
}

export const getBentoStrategies = async (chainId = ChainId.ETHEREUM, variables) => {
  const { strategies } = await fetcher(chainId, bentoStrategiesQuery, variables)

  const SECONDS_IN_YEAR = 60 * 60 * 24 * 365

  return strategies?.map((strategy) => {
    const [lastHarvest, previousHarvest] = [strategy.harvests?.[0], strategy.harvests?.[1]]

    const profitPerYear =
      ((SECONDS_IN_YEAR / (lastHarvest.timestamp - previousHarvest.timestamp)) * lastHarvest.profit) /
      10 ** strategy.token.decimals

    const [tvl, tvlPrevious] = [
      lastHarvest?.tokenElastic / 10 ** strategy.token.decimals,
      previousHarvest?.tokenElastic / 10 ** strategy.token.decimals,
    ]

    const apy = (profitPerYear / ((tvl + tvlPrevious) / 2)) * 100

    return {
      token: strategy.token.id,
      apy: !isNaN(apy) ? apy : 0,
      targetPercentage: Number(strategy.token.strategyTargetPercentage ?? 0),
    }
  })
}
