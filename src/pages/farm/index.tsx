import { Chef, PairType } from '../../features/farm/enum'
import React, { useCallback, useMemo } from 'react'
import { useActiveWeb3React, useFuse } from '../../hooks'
import {
  useAlcxPrice,
  useAverageBlockTime,
  useCvxPrice,
  useEthPrice,
  useMasterChefV1SushiPerBlock,
  useMasterChefV1TotalAllocPoint,
  useMaticPrice,
  useOnePrice,
  usePairSubset,
  useStakePrice,
  useSushiPrice,
  useFarms,
  useFarmPairAddresses,
} from '../../services/graph'
import { usePositions } from '../../features/farm/hooks'
import { ChainId } from '@sushiswap/sdk'
import Container from '../../components/Container'
import FarmList from '../../features/farm/FarmList'
import Head from 'next/head'
import Menu from '../../features/farm/FarmMenu'
import Search from '../../components/Search'
import { useKashiPairs } from '../../services/graph/hooks/bentobox'
import { useRouter } from 'next/router'

export default function Farm(): JSX.Element {
  const { chainId } = useActiveWeb3React()

  const router = useRouter()

  const type = router.query.filter as string

  const pairAddresses = useFarmPairAddresses()

  const swapPairs = usePairSubset(pairAddresses)

  const kashiPairs = useKashiPairs(pairAddresses)

  const farms = useFarms()

  const positions = usePositions()

  const averageBlockTime = useAverageBlockTime()

  const masterChefV1TotalAllocPoint = useMasterChefV1TotalAllocPoint()

  const masterChefV1SushiPerBlock = useMasterChefV1SushiPerBlock()

  // TODO: Obviously need to sort this out but this is fine for time being
  const [sushiPrice, ethPrice, maticPrice, alcxPrice, cvxPrice, stakePrice, onePrice] = [
    useSushiPrice(),
    useEthPrice(),
    useMaticPrice(),
    useAlcxPrice(),
    useCvxPrice(),
    useStakePrice(),
    useOnePrice(),
  ]

  const blocksPerDay = 86400 / Number(averageBlockTime)

  const filter = useCallback(
    (pool) => {
      // !POOL_DENY.includes(pool.id) &&
      return (
        pool.allocPoint !== '0' &&
        pool.accSushiPerShare !== '0' &&
        ((swapPairs && swapPairs.find((pair) => pair.id === pool.pair)) ||
          (kashiPairs && kashiPairs.find((pair) => pair.id === pool.pair)))
      )
    },
    [kashiPairs, swapPairs]
  )

  const map = useCallback(
    (pool) => {
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

          const REWARDS = [
            {
              token: 'ALCX',
              icon: 'https://raw.githubusercontent.com/sushiswap/icons/master/token/alcx.jpg',
              rewardPerBlock: 0.217544236043011,
              rewardPerDay: 0.217544236043011 * blocksPerDay,
              rewardPrice: alcxPrice,
            },
            {
              token: 'CVX',
              icon: 'https://raw.githubusercontent.com/sushiswap/icons/master/token/unknown.png',
              rewardPerBlock: 0.08336413675376289 * averageBlockTime,
              rewardPerDay: 0.08336413675376289 * averageBlockTime * blocksPerDay,
              rewardPrice: cvxPrice,
            },
            {
              token: 'CVX',
              icon: 'https://raw.githubusercontent.com/sushiswap/icons/master/token/unknown.png',
              rewardPerBlock: 0.125 * averageBlockTime,
              rewardPerDay: 0.125 * averageBlockTime * blocksPerDay,
              rewardPrice: cvxPrice,
            },
          ]

          return [...defaultRewards, REWARDS[pool.id]]
        } else if (pool.chef === Chef.MINICHEF) {
          const sushiPerSecond = ((pool.allocPoint / 1000) * pool.miniChef.sushiPerSecond) / 1e18
          const sushiPerBlock = sushiPerSecond * averageBlockTime
          const sushiPerDay = sushiPerBlock * blocksPerDay
          const rewardPerSecond = ((pool.allocPoint / 1000) * pool.rewarder.rewardPerSecond) / 1e18

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
              rewardPrice: onePrice,
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
        : balance * kashiPair.token0.derivedETH * ethPrice

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
    },
    [
      alcxPrice,
      averageBlockTime,
      blocksPerDay,
      chainId,
      cvxPrice,
      ethPrice,
      kashiPairs,
      masterChefV1SushiPerBlock,
      masterChefV1TotalAllocPoint,
      maticPrice,
      onePrice,
      positions,
      stakePrice,
      sushiPrice,
      swapPairs,
    ]
  )

  const data = useMemo(() => farms.filter(filter).map(map), [farms, filter, map])

  const options = {
    keys: ['id', 'pair.id', 'pair.token0.symbol', 'pair.token1.symbol', 'pair.token0.name', 'pair.token1.name'],
    threshold: 0.4,
  }

  const { result, term, search } = useFuse({
    data,
    options,
  })

  const filters = {
    portfolio: (farm) => farm?.amount && !farm.amount.isZero(),
    sushi: (farm) => farm.pair.type === PairType.SWAP,
    kashi: (farm) => farm.pair.type === PairType.KASHI,
    '2x': (farm) => farm.chef === Chef.MASTERCHEF_V2 || farm.chef === Chef.MINICHEF,
  }

  const filtered = type ? result?.filter(filters[type]) : result

  return (
    <>
      <Head>
        <title>Farm | Sushi</title>
        <meta name="description" content="Farm SUSHI" />
      </Head>
      <Container maxWidth="full" className="grid h-full grid-cols-4 mx-auto gap-9">
        <div className="sticky top-0 hidden lg:block md:col-span-1" style={{ maxHeight: '40rem' }}>
          <Menu positionsLength={positions.length} />
        </div>
        <div className="col-span-4 space-y-6 lg:col-span-3">
          <Search
            search={search}
            term={term}
            inputProps={{
              className:
                'relative w-full bg-transparent border border-transparent focus:border-gradient-r-blue-pink-dark-900 rounded placeholder-secondary focus:placeholder-primary font-bold text-base px-6 py-3.5',
            }}
          />

          {/* <div className="flex items-center text-lg font-bold text-high-emphesis whitespace-nowrap">
            Ready to Stake{" "}
            <div className="w-full h-0 ml-4 font-bold bg-transparent border border-b-0 border-transparent rounded text-high-emphesis md:border-gradient-r-blue-pink-dark-800 opacity-20"></div>
          </div>
          <FarmList farms={filtered} term={term} /> */}

          <div className="flex items-center text-lg font-bold text-high-emphesis whitespace-nowrap">
            Farms{' '}
            <div className="w-full h-0 ml-4 font-bold bg-transparent border border-b-0 border-transparent rounded text-high-emphesis md:border-gradient-r-blue-pink-dark-800 opacity-20"></div>
          </div>
          <FarmList farms={filtered} term={term} />
        </div>
      </Container>
    </>
  )
}
