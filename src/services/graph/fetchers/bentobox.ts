import { bentoBoxQuery, bentoStrategiesQuery, kashiPairsQuery } from '../queries/bentobox'
import { getFraction, toAmount } from '../../../functions'

import { ChainId } from '@sushiswap/core-sdk'
import { GRAPH_HOST } from '../constants'
import { getTokenSubset } from './exchange'
import { pager } from '../functions'

export const BENTOBOX = {
  [ChainId.ETHEREUM]: 'lufycz/bentobox',
  [ChainId.XDAI]: 'sushiswap/xdai-bentobox',
  [ChainId.MATIC]: 'lufycz/matic-bentobox',
  [ChainId.FANTOM]: 'sushiswap/fantom-bentobox',
  [ChainId.BSC]: 'sushiswap/bsc-bentobox',
  [ChainId.ARBITRUM]: 'sushiswap/arbitrum-bentobox',
}

const fetcher = async (chainId = ChainId.ETHEREUM, query, variables = undefined) =>
  pager(`${GRAPH_HOST[chainId]}/subgraphs/name/${BENTOBOX[chainId]}`, query, variables)

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

export const getBentoBox = async (chainId = ChainId.ETHEREUM, variables) => {
  const { bentoBoxes } = await fetcher(chainId, bentoBoxQuery, variables)

  return bentoBoxes[0]
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
