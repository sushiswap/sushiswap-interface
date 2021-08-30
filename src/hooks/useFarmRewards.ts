import { Chef, PairType } from '../features/onsen/enum'
import {
  useAverageBlockTime,
  useFarms,
  useKashiPairs,
  useMasterChefV1SushiPerBlock,
  useMasterChefV1TotalAllocPoint,
  useMaticPrice,
  useNativePrice,
  useStakePrice,
  useSushiPairs,
  useSushiPrice,
} from '../services/graph'

import { ChainId } from '@sushiswap/sdk'
import { getAddress } from '@ethersproject/address'
import useActiveWeb3React from './useActiveWeb3React'
import { useMemo } from 'react'
import { usePositions } from '../features/onsen/hooks'

export default function useFarmRewards() {
  const { chainId } = useActiveWeb3React()

  const positions = usePositions()

  const farms = useFarms()
  const farmAddresses = useMemo(() => farms.map((farm) => farm.pair), [farms])
  const swapPairs = useSushiPairs({ subset: farmAddresses, shouldFetch: !!farmAddresses })
  const kashiPairs = useKashiPairs({ subset: farmAddresses, shouldFetch: !!farmAddresses })

  const averageBlockTime = useAverageBlockTime()
  const masterChefV1TotalAllocPoint = useMasterChefV1TotalAllocPoint()
  const masterChefV1SushiPerBlock = useMasterChefV1SushiPerBlock()

  const [sushiPrice, nativePrice, maticPrice, stakePrice] = [
    useSushiPrice(),
    useNativePrice(),
    useMaticPrice(),
    useStakePrice(),
  ]

  const blocksPerDay = 86400 / Number(averageBlockTime)

  const map = (pool) => {
    // TODO: Account for fees generated in case of swap pairs, and use standard compounding
    // algorithm with the same intervals acrosss chains to account for consistency.
    // For lending pairs, what should the equivilent for fees generated? Interest gained?
    // How can we include this?

    // TODO: Deal with inconsistencies between properties on subgraph
    pool.owner = pool?.owner || pool?.masterChef || pool?.miniChef
    pool.balance = pool?.balance || pool?.slpBalance

    const swapPair = swapPairs?.find((pair) => pair.id === pool.pair)
    const kashiPair = kashiPairs?.find((pair) => pair.id === pool.pair)

    const type = swapPair ? PairType.SWAP : PairType.KASHI

    const pair = swapPair || kashiPair

    const blocksPerHour = 3600 / averageBlockTime

    function getRewards() {
      // TODO: Some subgraphs give sushiPerBlock & sushiPerSecond, and mcv2 gives nothing
      const sushiPerBlock =
        pool?.owner?.sushiPerBlock / 1e18 ||
        (pool?.owner?.sushiPerSecond / 1e18) * averageBlockTime ||
        masterChefV1SushiPerBlock

      const rewardPerBlock = (pool.allocPoint / pool.owner.totalAllocPoint) * sushiPerBlock

      const defaultReward = {
        token: 'SUSHI',
        icon: 'https://raw.githubusercontent.com/sushiswap/icons/master/token/sushi.jpg',
        rewardPerBlock,
        rewardPerDay: rewardPerBlock * blocksPerDay,
        rewardPrice: sushiPrice,
      }

      const defaultRewards = [defaultReward]

      if (pool.chef === Chef.MASTERCHEF_V2) {
        // override for mcv2...
        pool.owner.totalAllocPoint = masterChefV1TotalAllocPoint

        const icon = ['0', '3', '4', '8'].includes(pool.id)
          ? `https://raw.githubusercontent.com/sushiswap/icons/master/token/${pool.rewardToken.symbol.toLowerCase()}.jpg`
          : `https://raw.githubusercontent.com/sushiswap/assets/master/blockchains/ethereum/assets/${getAddress(
              pool.rewarder.rewardToken
            )}/logo.png`

        const decimals = 10 ** pool.rewardToken.decimals

        const rewardPerBlock =
          pool.rewardToken.symbol === 'ALCX'
            ? pool.rewarder.rewardPerSecond / decimals
            : (pool.rewarder.rewardPerSecond / decimals) * averageBlockTime

        const rewardPerDay =
          pool.rewardToken.symbol === 'ALCX'
            ? (pool.rewarder.rewardPerSecond / decimals) * blocksPerDay
            : (pool.rewarder.rewardPerSecond / decimals) * averageBlockTime * blocksPerDay

        const reward = {
          token: pool.rewardToken.symbol,
          icon: icon,
          rewardPerBlock: rewardPerBlock,
          rewardPerDay: rewardPerDay,
          rewardPrice: pool.rewardToken.derivedETH * nativePrice,
        }

        return [...defaultRewards, reward]
      } else if (pool.chef === Chef.MINICHEF) {
        const sushiPerSecond = ((pool.allocPoint / pool.miniChef.totalAllocPoint) * pool.miniChef.sushiPerSecond) / 1e18
        const sushiPerBlock = sushiPerSecond * averageBlockTime
        const sushiPerDay = sushiPerBlock * blocksPerDay
        const rewardPerSecond =
          ((pool.allocPoint / pool.miniChef.totalAllocPoint) * pool.rewarder.rewardPerSecond) / 1e18
        const rewardPerBlock = rewardPerSecond * averageBlockTime
        const rewardPerDay = rewardPerBlock * blocksPerDay

        const reward = {
          [ChainId.MATIC]: {
            token: 'MATIC',
            icon: 'https://raw.githubusercontent.com/sushiswap/icons/master/token/polygon.jpg',
            rewardPrice: maticPrice,
          },
          [ChainId.XDAI]: {
            token: 'STAKE',
            icon: 'https://raw.githubusercontent.com/sushiswap/icons/master/token/stake.jpg',
            rewardPrice: stakePrice,
          },
          [ChainId.HARMONY]: {
            token: 'ONE',
            icon: 'https://raw.githubusercontent.com/sushiswap/icons/master/token/one.jpg',
            rewardPrice: nativePrice, // Reward token = Native token
          },
        }

        return [
          {
            ...defaultReward,
            rewardPerBlock: sushiPerBlock,
            rewardPerDay: sushiPerDay,
          },
          {
            ...reward[chainId],
            rewardPerBlock: rewardPerBlock,
            rewardPerDay: rewardPerDay,
          },
        ]
      }
      return defaultRewards
    }

    const rewards = getRewards()

    const balance = swapPair ? Number(pool.balance / 1e18) : pool.balance / 10 ** kashiPair.token0.decimals

    const tvl = swapPair
      ? (balance / Number(swapPair.totalSupply)) * Number(swapPair.reserveUSD)
      : balance * kashiPair.token0.derivedETH * nativePrice

    const roiPerBlock =
      rewards.reduce((previousValue, currentValue) => {
        return previousValue + currentValue.rewardPerBlock * currentValue.rewardPrice
      }, 0) / tvl

    const roiPerHour = roiPerBlock * blocksPerHour

    const roiPerDay = roiPerHour * 24

    const roiPerMonth = roiPerDay * 30

    const roiPerYear = roiPerMonth * 12

    const position = positions.find((position) => position.id === pool.id && position.chef === pool.chef)

    return {
      ...pool,
      ...position,
      pair: {
        ...pair,
        decimals: pair.type === PairType.KASHI ? Number(pair.asset.tokenInfo.decimals) : 18,
        type,
      },
      balance,
      roiPerBlock,
      roiPerHour,
      roiPerDay,
      roiPerMonth,
      roiPerYear,
      rewards,
      tvl,
    }
  }

  return farms
    .filter((farm) => {
      return (
        (swapPairs && swapPairs.find((pair) => pair.id === farm.pair)) ||
        (kashiPairs && kashiPairs.find((pair) => pair.id === farm.pair))
      )
    })
    .map(map)
}
