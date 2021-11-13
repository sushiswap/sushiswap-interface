import { getAddress } from '@ethersproject/address'
import { ChainId } from '@sushiswap/core-sdk'
import { Chef, PairType } from 'app/features/onsen/enum'
import { usePositions } from 'app/features/onsen/hooks'
import { aprToApy } from 'app/functions/convert'
import {
  useAverageBlockTime,
  useBlock,
  useEthPrice,
  useFarms,
  useKashiPairs,
  useMasterChefV1SushiPerBlock,
  useMasterChefV1TotalAllocPoint,
  useMaticPrice,
  useOnePrice,
  useStakePrice,
  useSushiPairs,
  useSushiPrice,
} from 'app/services/graph'
import { useActiveWeb3React } from 'app/services/web3'
import { useMemo } from 'react'

export default function useFarmRewards() {
  const { chainId } = useActiveWeb3React()

  const positions = usePositions(chainId)

  const block1w = useBlock({ daysAgo: 7, chainId })

  const farms = useFarms({ chainId })
  const farmAddresses = useMemo(() => farms.map((farm) => farm.pair), [farms])
  const swapPairs = useSushiPairs({ subset: farmAddresses, shouldFetch: !!farmAddresses, chainId })
  const swapPairs1w = useSushiPairs({
    subset: farmAddresses,
    block: block1w,
    shouldFetch: !!block1w && !!farmAddresses,
    chainId,
  })
  const kashiPairs = useKashiPairs({ subset: farmAddresses, shouldFetch: !!farmAddresses, chainId })

  const averageBlockTime = useAverageBlockTime()
  const masterChefV1TotalAllocPoint = useMasterChefV1TotalAllocPoint()
  const masterChefV1SushiPerBlock = useMasterChefV1SushiPerBlock()

  const [sushiPrice, ethPrice, maticPrice, stakePrice, onePrice] = [
    useSushiPrice(),
    useEthPrice(),
    useMaticPrice(),
    useStakePrice(),
    useOnePrice(),
  ]

  const blocksPerDay = 86400 / Number(averageBlockTime)

  const map = (pool) => {
    // TODO: Deal with inconsistencies between properties on subgraph
    pool.owner = pool?.owner || pool?.masterChef || pool?.miniChef
    pool.balance = pool?.balance || pool?.slpBalance

    const swapPair = swapPairs?.find((pair) => pair.id === pool.pair)
    const swapPair1w = swapPairs1w?.find((pair) => pair.id === pool.pair)
    const kashiPair = kashiPairs?.find((pair) => pair.id === pool.pair)

    const pair = swapPair || kashiPair
    const pair1w = swapPair1w

    const type = swapPair ? PairType.SWAP : PairType.KASHI

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

      let rewards = [defaultReward]

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
          rewardPrice: pool.rewardToken.derivedETH * ethPrice,
        }

        rewards[1] = reward
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
            rewardPerBlock,
            rewardPerDay,
          },
          [ChainId.XDAI]: {
            token: 'STAKE',
            icon: 'https://raw.githubusercontent.com/sushiswap/icons/master/token/stake.jpg',
            rewardPerBlock,
            rewardPerDay,
            rewardPrice: stakePrice,
          },
          [ChainId.HARMONY]: {
            token: 'ONE',
            icon: 'https://raw.githubusercontent.com/sushiswap/icons/master/token/one.jpg',
            rewardPrice: onePrice,
          },
        }

        rewards[0] = {
          ...defaultReward,
          rewardPerBlock: sushiPerBlock,
          rewardPerDay: sushiPerDay,
        }

        if (chainId in reward) {
          rewards[1] = reward[chainId]
        }
      }

      return rewards
    }

    const rewards = getRewards()

    const balance = swapPair ? Number(pool.balance / 1e18) : pool.balance / 10 ** kashiPair.token0.decimals

    const tvl = swapPair
      ? (balance / Number(swapPair.totalSupply)) * Number(swapPair.reserveUSD)
      : balance * kashiPair.token0.derivedETH * ethPrice

    const feeApyPerYear = swapPair
      ? aprToApy((((((pair?.volumeUSD - pair1w?.volumeUSD) * 0.0025) / 7) * 365) / pair?.reserveUSD) * 100, 3650) / 100
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
