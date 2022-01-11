import { Chef, PairType } from '../features/farm/enum'
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
  useCeloPrice,
  useMovrPrice,
  useSpellPrice,
  useGnoPrice,
  useOhmPrice,
  useMagicPrice,
  useSushiPairs,
  useSushiPrice,
  useFusePrice,
} from '../services/graph'

import { ChainId } from '@sushiswap/sdk'
import { aprToApy } from '../functions/convert/apyApr'
import { getAddress } from '@ethersproject/address'
import useActiveWeb3React from './useActiveWeb3React'
import { useMemo } from 'react'
import { usePositions } from '../features/farm/hooks'

export default function useFarmRewards() {
  const { chainId } = useActiveWeb3React()

  const positions = usePositions(chainId)

  const block1d = useBlock({ daysAgo: 1, chainId })

  const farms = useFarms()
  const farmAddresses = useMemo(() => farms.map((farm) => farm.pair), [farms])
  const swapPairs = useSushiPairs({ subset: farmAddresses, shouldFetch: !!farmAddresses, chainId })

  const swapPairs1d = useSushiPairs({
    subset: farmAddresses,
    block: block1d,
    shouldFetch: !!block1d && !!farmAddresses,
    chainId,
  })

  const kashiPairs = useKashiPairs({ subset: farmAddresses, shouldFetch: !!farmAddresses })

  const averageBlockTime = useAverageBlockTime()
  const masterChefV1TotalAllocPoint = useMasterChefV1TotalAllocPoint()
  const masterChefV1SushiPerBlock = useMasterChefV1SushiPerBlock()

  const [
    sushiPrice,
    ethPrice,
    maticPrice,
    gnoPrice,
    onePrice,
    spellPrice,
    celoPrice,
    movrPrice,
    ohmPrice,
    fusePrice,
    magicPrice,
  ] = [
    useSushiPrice(),
    useEthPrice(),
    useMaticPrice(),
    useGnoPrice(),
    useOnePrice(),
    useSpellPrice(),
    useCeloPrice(),
    useMovrPrice(),
    useOhmPrice(),
    useFusePrice(),
    useMagicPrice(),
  ]

  const blocksPerDay = 86400 / Number(averageBlockTime)

  const map = (pool) => {
    // TODO: Deal with inconsistencies between properties on subgraph
    pool.owner = pool?.owner || pool?.masterChef || pool?.miniChef
    pool.balance = pool?.balance || pool?.slpBalance

    const swapPair = swapPairs?.find((pair) => pair.id === pool.pair)
    const swapPair1d = swapPairs1d?.find((pair) => pair.id === pool.pair)
    const kashiPair = kashiPairs?.find((pair) => pair.id === pool.pair)

    const pair = swapPair || kashiPair

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
        icon: 'https://raw.githubusercontent.com/sushiswap/logos/main/network/ethereum/0x6B3595068778DD592e39A122f4f5a5cF09C90fE2.jpg',
        rewardPerBlock,
        rewardPerDay: rewardPerBlock * blocksPerDay,
        rewardPrice: sushiPrice,
      }

      let rewards = [defaultReward]

      if (pool.chef === Chef.MASTERCHEF_V2) {
        // override for mcv2...
        pool.owner.totalAllocPoint = masterChefV1TotalAllocPoint

        // CVX-WETH hardcode 0 rewards since ended, can remove after swapping out rewarder
        if (pool.id === '1') {
          pool.rewarder.rewardPerSecond = 0
        }

        // vestedQUARTZ to QUARTZ adjustments
        if (pool.rewarder.rewardToken === '0x5dd8905aec612529361a35372efd5b127bb182b3') {
          pool.rewarder.rewardToken = '0xba8a621b4a54e61c442f5ec623687e2a942225ef'
          pool.rewardToken.symbol = 'vestedQUARTZ'
          pool.rewardToken.derivedETH = pair.token1.derivedETH
          pool.rewardToken.decimals = 18
        }

        const icon = `https://raw.githubusercontent.com/sushiswap/logos/main/network/ethereum/${getAddress(
          pool.rewarder.rewardToken
        )}.jpg`

        const decimals = 10 ** pool.rewardToken.decimals

        if (pool.rewarder.rewardToken !== '0x0000000000000000000000000000000000000000') {
          const rewardPerBlock =
            pool.rewardToken.symbol === 'ALCX'
              ? pool.rewarder.rewardPerSecond / decimals
              : pool.rewardToken.symbol === 'LDO'
              ? (77160493827160493 / decimals) * averageBlockTime
              : (pool.rewarder.rewardPerSecond / decimals) * averageBlockTime

          const rewardPerDay =
            pool.rewardToken.symbol === 'ALCX'
              ? (pool.rewarder.rewardPerSecond / decimals) * blocksPerDay
              : pool.rewardToken.symbol === 'LDO'
              ? (77160493827160493 / decimals) * averageBlockTime * blocksPerDay
              : (pool.rewarder.rewardPerSecond / decimals) * averageBlockTime * blocksPerDay

          const rewardPrice = pool.rewardToken.derivedETH * ethPrice

          const reward = {
            token: pool.rewardToken.symbol,
            icon: icon,
            rewardPerBlock,
            rewardPerDay,
            rewardPrice,
          }

          rewards[1] = reward
        }
      } else if (pool.chef === Chef.MINICHEF) {
        const sushiPerSecond = ((pool.allocPoint / pool.miniChef.totalAllocPoint) * pool.miniChef.sushiPerSecond) / 1e18
        const sushiPerBlock = sushiPerSecond * averageBlockTime
        const sushiPerDay = sushiPerBlock * blocksPerDay

        const rewardPerSecond =
          pool.rewarder.rewardPerSecond && chainId === ChainId.ARBITRUM
            ? pool.rewarder.rewardPerSecond / 1e18
            : ((pool.allocPoint / pool.miniChef.totalAllocPoint) * pool.rewarder.rewardPerSecond) / 1e18

        const rewardPerBlock = rewardPerSecond * averageBlockTime

        const rewardPerDay = rewardPerBlock * blocksPerDay

        const reward = {
          [ChainId.MATIC]: {
            token: 'MATIC',
            icon: 'https://raw.githubusercontent.com/sushiswap/logos/main/network/matic/0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270.jpg',
            rewardPerBlock,
            rewardPerDay: rewardPerSecond * 86400,
            rewardPrice: maticPrice,
          },
          [ChainId.XDAI]: {
            token: 'GNO',
            icon: 'https://raw.githubusercontent.com/sushiswap/logos/main/network/ethereum/0x6810e776880C02933D47DB1b9fc05908e5386b96.jpg',
            rewardPerBlock,
            rewardPerDay: rewardPerSecond * 86400,
            rewardPrice: gnoPrice,
          },
          [ChainId.HARMONY]: {
            token: 'ONE',
            icon: 'https://raw.githubusercontent.com/sushiswap/logos/main/network/harmony/0xcF664087a5bB0237a0BAd6742852ec6c8d69A27a.jpg',
            rewardPerBlock,
            rewardPerDay: rewardPerSecond * 86400,
            rewardPrice: onePrice,
          },
          [ChainId.CELO]: {
            token: 'CELO',
            icon: 'https://raw.githubusercontent.com/sushiswap/icons/master/token/celo.jpg',
            rewardPerBlock,
            rewardPerDay: rewardPerSecond * 86400,
            rewardPrice: celoPrice,
          },
          [ChainId.MOONRIVER]: {
            token: 'MOVR',
            icon: 'https://raw.githubusercontent.com/sushiswap/icons/master/token/movr.jpg',
            rewardPerBlock,
            rewardPerDay: rewardPerSecond * 86400,
            rewardPrice: movrPrice,
          },
          [ChainId.FUSE]: {
            token: 'FUSE',
            icon: 'https://raw.githubusercontent.com/sushiswap/icons/master/token/fuse.jpg',
            rewardPerBlock,
            rewardPerDay: rewardPerSecond * 86400,
            rewardPrice: fusePrice,
          },
        }

        if (chainId === ChainId.FUSE) {
          // Secondary reward only
          rewards[0] = reward[chainId]
        } else {
          rewards[0] = {
            ...defaultReward,
            rewardPerBlock: sushiPerBlock,
            rewardPerDay: sushiPerDay,
          }
          if (chainId in reward) {
            rewards[1] = reward[chainId]
          }
        }

        if (chainId === ChainId.ARBITRUM && ['9', '11'].includes(pool.id)) {
          rewards[1] = {
            token: 'SPELL',
            icon: 'https://raw.githubusercontent.com/sushiswap/logos/main/network/ethereum/0x090185f2135308BaD17527004364eBcC2D37e5F6.jpg',
            rewardPerBlock,
            rewardPerDay,
            rewardPrice: spellPrice,
          }
        }
        if (chainId === ChainId.ARBITRUM && ['12'].includes(pool.id)) {
          rewards[1] = {
            token: 'gOHM',
            icon: 'https://raw.githubusercontent.com/sushiswap/logos/main/network/arbitrum/0x8D9bA570D6cb60C7e3e0F31343Efe75AB8E65FB1.jpg',
            rewardPerBlock,
            rewardPerDay,
            rewardPrice: ohmPrice,
          }
        }
        if (chainId === ChainId.ARBITRUM && ['13'].includes(pool.id)) {
          rewards[1] = {
            token: 'MAGIC',
            icon: 'https://raw.githubusercontent.com/sushiswap/assets/master/blockchains/arbitrum/assets/0x539bdE0d7Dbd336b79148AA742883198BBF60342/logo.png',
            rewardPerBlock,
            rewardPerDay,
            rewardPrice: magicPrice,
          }
        }
        if (chainId === ChainId.MATIC && ['47'].includes(pool.id)) {
          const rewardTokenPerSecond = 0.00000462962963
          const rewardTokenPerBlock = rewardTokenPerSecond * averageBlockTime
          const rewardTokenPerDay = 0.4
          rewards[1] = {
            token: 'gOHM',
            icon: 'https://raw.githubusercontent.com/sushiswap/logos/main/network/arbitrum/0x8D9bA570D6cb60C7e3e0F31343Efe75AB8E65FB1.jpg',
            rewardPerBlock: rewardTokenPerBlock,
            rewardPerDay: rewardTokenPerDay,
            rewardPrice: ohmPrice,
          }
        }
      } else if (pool.chef === Chef.OLD_FARMS) {
        const sushiPerSecond = ((pool.allocPoint / pool.miniChef.totalAllocPoint) * pool.miniChef.sushiPerSecond) / 1e18
        const sushiPerBlock = sushiPerSecond * averageBlockTime
        const sushiPerDay = sushiPerBlock * blocksPerDay

        const rewardPerSecond =
          pool.rewarder.rewardPerSecond && chainId == ChainId.ARBITRUM
            ? pool.rewarder.rewardPerSecond / 1e18
            : ((pool.allocPoint / pool.miniChef.totalAllocPoint) * pool.rewarder.rewardPerSecond) / 1e18

        const rewardPerBlock = rewardPerSecond * averageBlockTime

        const rewardPerDay = rewardPerBlock * blocksPerDay

        const reward = {
          [ChainId.CELO]: {
            token: 'CELO',
            icon: 'https://raw.githubusercontent.com/sushiswap/icons/master/token/celo.jpg',
            rewardPerBlock,
            rewardPerDay: rewardPerSecond * 86400,
            rewardPrice: celoPrice,
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
