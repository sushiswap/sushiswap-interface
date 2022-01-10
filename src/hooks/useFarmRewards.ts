import { getAddress } from '@ethersproject/address'
import { ChainId, Currency, NATIVE, SUSHI, Token } from '@sushiswap/core-sdk'
import { ARBITRUM_TOKENS, MATIC_TOKENS } from 'app/config/tokens'
import { Chef, PairType } from 'app/features/onsen/enum'
import { usePositions } from 'app/features/onsen/hooks'
import { aprToApy } from 'app/functions/convert'
import {
  useAverageBlockTime,
  useCeloPrice,
  useEthPrice,
  useFarms,
  useFusePrice,
  useKashiPairs,
  useMagicPrice,
  useMasterChefV1SushiPerBlock,
  useMasterChefV1TotalAllocPoint,
  useMaticPrice,
  useMovrPrice,
  useOhmPrice,
  useOneDayBlock,
  useOnePrice,
  useSpellPrice,
  useStakePrice,
  useSushiPairs,
  useSushiPrice,
} from 'app/services/graph'
import { useActiveWeb3React } from 'app/services/web3'
import toLower from 'lodash/toLower'
import { useMemo } from 'react'

export default function useFarmRewards() {
  const { chainId } = useActiveWeb3React()

  const positions = usePositions(chainId)

  const block1d = useOneDayBlock({ chainId, shouldFetch: !!chainId })

  const farms = useFarms({ chainId })

  const farmAddresses = useMemo(() => farms.map((farm) => farm.pair), [farms])

  const swapPairs = useSushiPairs({
    chainId,
    variables: {
      where: {
        id_in: farmAddresses.map(toLower),
      },
    },
    shouldFetch: !!farmAddresses,
  })

  const swapPairs1d = useSushiPairs({
    chainId,
    variables: {
      block: block1d,
      where: {
        id_in: farmAddresses.map(toLower),
      },
    },
    shouldFetch: !!block1d && !!farmAddresses,
  })

  const kashiPairs = useKashiPairs({
    chainId,
    variables: { where: { id_in: farmAddresses.map(toLower) } },
    shouldFetch: !!farmAddresses,
  })

  const averageBlockTime = useAverageBlockTime({ chainId })

  const masterChefV1TotalAllocPoint = useMasterChefV1TotalAllocPoint()
  const masterChefV1SushiPerBlock = useMasterChefV1SushiPerBlock()

  const [
    sushiPrice,
    ethPrice,
    maticPrice,
    stakePrice,
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
    useStakePrice(),
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
        currency: SUSHI[ChainId.ETHEREUM],
        rewardPerBlock,
        rewardPerDay: rewardPerBlock * blocksPerDay,
        rewardPrice: sushiPrice,
      }

      let rewards: { currency: Currency; rewardPerBlock: number; rewardPerDay: number; rewardPrice: number }[] = [
        defaultReward,
      ]

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
          pool.rewardToken.id = '0xba8a621b4a54e61c442f5ec623687e2a942225ef'
          pool.rewardToken.symbol = 'vestedQUARTZ'
          pool.rewardToken.derivedETH = pair.token1.derivedETH
          pool.rewardToken.decimals = 18
        }

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
            currency: new Token(
              ChainId.ETHEREUM,
              getAddress(pool.rewardToken.id),
              Number(pool.rewardToken.decimals),
              pool.rewardToken.symbol,
              pool.rewardToken.name
            ),
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
            currency: NATIVE[ChainId.MATIC],
            rewardPerBlock,
            rewardPerDay: rewardPerSecond * 86400,
            rewardPrice: maticPrice,
          },
          [ChainId.XDAI]: {
            currency: new Token(ChainId.XDAI, '0xb7D311E2Eb55F2f68a9440da38e7989210b9A05e', 18, 'STAKE', 'Stake'),
            rewardPerBlock,
            rewardPerDay: rewardPerSecond * 86400,
            rewardPrice: stakePrice,
          },
          [ChainId.HARMONY]: {
            currency: NATIVE[ChainId.HARMONY],
            rewardPerBlock,
            rewardPerDay: rewardPerSecond * 86400,
            rewardPrice: onePrice,
          },
          [ChainId.CELO]: {
            currency: NATIVE[ChainId.CELO],
            rewardPerBlock,
            rewardPerDay: rewardPerSecond * 86400,
            rewardPrice: celoPrice,
          },
          [ChainId.MOONRIVER]: {
            currency: NATIVE[ChainId.MOONRIVER],
            rewardPerBlock,
            rewardPerDay: rewardPerSecond * 86400,
            rewardPrice: movrPrice,
          },
          [ChainId.FUSE]: {
            currency: NATIVE[ChainId.FUSE],
            rewardPerBlock,
            rewardPerDay: rewardPerSecond * 86400,
            rewardPrice: fusePrice,
          },
        }

        if (chainId === ChainId.FUSE) {
          // Secondary reward only
          rewards[0] = reward[ChainId.FUSE]
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
            currency: ARBITRUM_TOKENS.SPELL,
            rewardPerBlock,
            rewardPerDay,
            rewardPrice: spellPrice,
          }
        }
        if (chainId === ChainId.ARBITRUM && ['12'].includes(pool.id)) {
          rewards[1] = {
            currency: ARBITRUM_TOKENS.gOHM,
            rewardPerBlock,
            rewardPerDay,
            rewardPrice: ohmPrice,
          }
        }
        if (chainId === ChainId.ARBITRUM && ['13'].includes(pool.id)) {
          rewards[1] = {
            currency: ARBITRUM_TOKENS.MAGIC,
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
            currency: MATIC_TOKENS.gOHM,
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
          pool.rewarder.rewardPerSecond && chainId === ChainId.ARBITRUM
            ? pool.rewarder.rewardPerSecond / 1e18
            : ((pool.allocPoint / pool.miniChef.totalAllocPoint) * pool.rewarder.rewardPerSecond) / 1e18

        const rewardPerBlock = rewardPerSecond * averageBlockTime

        const rewardPerDay = rewardPerBlock * blocksPerDay

        const reward = {
          [ChainId.CELO]: {
            currency: NATIVE[ChainId.CELO],
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

    // console.log({ feeApyPerYear, feeApyPerMonth, feeApyPerDay, feeApyPerHour })

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

    if (positions.length) {
      console.log({ positions })
    }

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
