import { ChainId } from '@sushiswap/core-sdk'
import { PairType } from 'app/features/onsen/enum'
import { aprToApy } from 'app/functions/convert'
import { useFarmHistories } from 'app/services/graph'
import { useCallback, useMemo } from 'react'

import { getRewards, useRewardCalculationData } from './useFarmRewardsWithUsers'

export default function useFarmRewardHistories({
  chainId = ChainId.ETHEREUM,
  variables,
}: {
  chainId: ChainId
  variables: any
}) {
  const farmHistories = useFarmHistories({ chainId, variables })
  const farmAddresses = useMemo(
    () => farmHistories.map((farmHistory: any) => farmHistory.pool.pair.toLowerCase()),
    [farmHistories]
  )
  const {
    positions,
    allTokens,
    swapPairs,
    swapPairs1d,
    kashiPairs,
    averageBlockTime,
    masterChefV1TotalAllocPoint,
    masterChefV1SushiPerBlock,
    sushiPrice,
    ethPrice,
    maticPrice,
    gnoPrice,
    onePrice,
    celoPrice,
    fantomPrice,
    movrPrice,
    fusePrice,
    glimmerPrice,
    blocksPerDay,
  } = useRewardCalculationData(chainId, farmAddresses)

  // @ts-ignore TYPE NEEDS FIXING
  const map = useCallback(
    // @ts-ignore TYPE NEEDS FIXING
    (poolHistory) => {
      const { pool } = poolHistory
      // TODO: Deal with inconsistencies between properties on subgraph
      poolHistory.balance = poolHistory?.balance || poolHistory?.slpBalance
      pool.owner = pool?.owner || pool?.masterChef || pool?.miniChef
      pool.balance = pool?.balance || pool?.slpBalance

      // @ts-ignore TYPE NEEDS FIXING
      const swapPair = swapPairs?.find((pair) => pair.id === pool.pair)
      // @ts-ignore TYPE NEEDS FIXING
      const swapPair1d = swapPairs1d?.find((pair) => pair.id === pool.pair)
      // @ts-ignore TYPE NEEDS FIXING
      const kashiPair = kashiPairs?.find((pair) => pair.id === pool.pair)

      const pair = swapPair || kashiPair

      const type = swapPair ? PairType.SWAP : PairType.KASHI

      const blocksPerHour = 3600 / averageBlockTime

      const rewards = getRewards({
        chainId,
        pool,
        pair,
        allTokens,
        averageBlockTime,
        blocksPerDay,
        masterChefV1SushiPerBlock,
        masterChefV1TotalAllocPoint,
        sushiPrice,
        ethPrice,
        maticPrice,
        gnoPrice,
        onePrice,
        celoPrice,
        fantomPrice,
        movrPrice,
        fusePrice,
        glimmerPrice,
      })

      const balance = swapPair ? Number(pool.balance / 1e18) : pool.balance / 10 ** kashiPair.token0.decimals
      const balanceHistory = swapPair
        ? Number(poolHistory.balance / 1e18)
        : poolHistory.balance / 10 ** kashiPair.token0.decimals

      const tvl = swapPair
        ? (balance / Number(swapPair.totalSupply)) * Number(swapPair.reserveUSD)
        : balance * kashiPair.token0.derivedETH * ethPrice

      const tvlHistory = swapPair
        ? (balanceHistory / Number(swapPair.totalSupply)) * Number(swapPair.reserveUSD)
        : balanceHistory * kashiPair.token0.derivedETH * ethPrice

      const feeApyPerYear =
        swapPair && swapPair1d
          ? aprToApy((((pair?.volumeUSD - swapPair1d?.volumeUSD) * 0.0025 * 365) / pair?.reserveUSD) * 100, 3650) / 100
          : 0

      const feeApyPerMonth = feeApyPerYear / 12
      const feeApyPerDay = feeApyPerMonth / 30
      const feeApyPerHour = feeApyPerDay / blocksPerHour

      const roiPerBlock =
        rewards.reduce((previousValue, currentValue) => {
          return previousValue + currentValue.rewardPerBlock * currentValue.rewardPrice
        }, 0) / tvl

      const rewardAprPerHour = roiPerBlock * blocksPerHour
      const rewardAprPerDay = rewardAprPerHour * 24
      const rewardAprPerMonth = rewardAprPerDay * 30
      const rewardAprPerYear = rewardAprPerMonth * 12

      const roiPerHour = rewardAprPerHour + feeApyPerHour
      const roiPerMonth = rewardAprPerMonth + feeApyPerMonth
      const roiPerDay = rewardAprPerDay + feeApyPerDay
      const roiPerYear = rewardAprPerYear + feeApyPerYear

      const position = positions.find((position) => position.id === pool.id && position.chef === pool.chef)

      return {
        ...poolHistory,
        balance: balanceHistory,
        tvl: tvlHistory,
        rewardAprPerYear: rewardAprPerYear,
        userCount: Number(poolHistory.userCount),
        timestamp: Number(poolHistory.timestamp),
        pool: {
          ...pool,
          ...position,
          pair: {
            ...pair,
            decimals: pair.type === PairType.KASHI ? Number(pair.asset.tokenInfo.decimals) : 18,
            type,
          },
          balance,
          feeApyPerHour,
          feeApyPerDay,
          feeApyPerMonth,
          feeApyPerYear,
          rewardAprPerHour,
          rewardAprPerDay,
          rewardAprPerMonth,
          rewardAprPerYear,
          roiPerBlock,
          roiPerHour,
          roiPerDay,
          roiPerMonth,
          roiPerYear,
          rewards,
          tvl,
        },
      }
    },
    [
      allTokens,
      averageBlockTime,
      blocksPerDay,
      celoPrice,
      chainId,
      ethPrice,
      fantomPrice,
      fusePrice,
      glimmerPrice,
      gnoPrice,
      kashiPairs,
      masterChefV1SushiPerBlock,
      masterChefV1TotalAllocPoint,
      maticPrice,
      movrPrice,
      onePrice,
      positions,
      sushiPrice,
      swapPairs,
      swapPairs1d,
    ]
  )

  const filter = useCallback(
    (farmHistory) => {
      return (
        // @ts-ignore TYPE NEEDS FIXING
        (swapPairs && swapPairs.find((pair) => pair.id === farmHistory.pool.pair)) ||
        // @ts-ignore TYPE NEEDS FIXING
        (kashiPairs && kashiPairs.find((pair) => pair.id === farmHistory.pool.pair))
      )
    },
    [kashiPairs, swapPairs]
  )

  return useMemo(
    () =>
      farmHistories
        .filter(filter)
        .map(map)
        .sort((a, b) => a.timestamp - b.timestamp),
    [farmHistories, filter, map]
  )
}
