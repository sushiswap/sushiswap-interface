import { Chef, PairType } from '../features/farm/enum'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs'
import {
    useAlcxPrice,
    useAverageBlockTime,
    useEthPrice,
    useExchange,
    useLiquidityPositionSubset,
    useMasterChefV1Farms,
    useMasterChefV2Farms,
    useMaticPrice,
    useMiniChefFarms,
    useOneDayBlock,
    usePairSubset,
    usePairs,
    useSushiPrice,
} from '../services/graph'
import { useChefContracts, usePositions } from '../features/farm/hooks'
import {
    useMasterChefContract,
    useMasterChefV2Contract,
    useMiniChefV2Contract,
} from '../hooks/useContract'

import Card from '../components/Card'
import CardHeader from '../components/CardHeader'
import Dots from '../components/Dots'
import FarmList from '../features/farm/FarmList'
import Head from 'next/head'
import Layout from '../layouts/DefaultLayout'
import Menu from '../features/farm/FarmMenu'
import Search from '../components/Search'
import concat from 'lodash/concat'
import { t } from '@lingui/macro'
import { useFuse } from '../hooks'
import { useLendingPairSubset } from '../services/graph/hooks/bentobox'
import { useLingui } from '@lingui/react'

export default function Farm(): JSX.Element {
    const { i18n } = useLingui()
    const [section, setSection] = useState<
        'portfolio' | 'all' | 'kmp' | 'slp' | 'mcv2'
    >('all')

    const { data: averageBlockTime } = useAverageBlockTime()

    const { data: oneDayBlock } = useOneDayBlock()

    const { data: sushiPrice } = useSushiPrice()
    const { data: ethPrice } = useEthPrice()
    const { data: maticPrice } = useMaticPrice()
    const { data: alcxPrice } = useAlcxPrice()

    const { data: masterChefV1Farms } = useMasterChefV1Farms()

    const { data: masterChefV2Farms } = useMasterChefV2Farms()

    const { data: miniChefFarms } = useMiniChefFarms()

    const pairAddresses = useMemo(
        () =>
            concat(masterChefV1Farms, masterChefV2Farms, miniChefFarms)
                .filter((pool) => pool && pool.pair)
                .map((pool) => pool.pair)
                .sort(),
        [masterChefV1Farms, masterChefV2Farms, miniChefFarms]
    )

    const { data: swapPairs } = usePairSubset(pairAddresses)

    const { data: lendingPairs } = useLendingPairSubset(pairAddresses)

    // Get Contracts
    const masterchefContract = useMasterChefContract()
    const masterchefV2Contract = useMasterChefV2Contract()
    const minichefContract = useMiniChefV2Contract()

    // const chefContracts = useChefContracts()

    const masterChefV1Positions = usePositions(masterchefContract)
    const masterChefV2Positions = usePositions(masterchefV2Contract)
    const miniChefPositions = usePositions(minichefContract)

    const blocksPerDay = 86400 / Number(averageBlockTime)

    function filter(pool) {
        if (!swapPairs || !lendingPairs) {
            return false
        }
        // !POOL_DENY.includes(pool.id) &&
        return (
            pool.allocPoint !== '0' &&
            pool.accSushiPerShare !== '0' &&
            (swapPairs.find((pair) => pair.id === pool.pair) ||
                lendingPairs.find((pair) => pair.id === pool.pair))
        )
    }

    function map(pool, chef) {
        // TODO: Account for fees generated in case of swap pairs, and use standard compounding
        // algorithm with the same intervals acrosss chains to account for consistency.
        // For lending pairs, what should the equivilent for fees generated? Interest gained?
        // How can we include this?

        // TODO: Deal with inconsistencies between properties on subgraph
        pool.owner = pool?.owner || pool?.masterChef || pool?.miniChef
        pool.balance = pool?.balance || pool?.slpBalance

        const swapPair = swapPairs?.find((pair) => pair.id === pool.pair)
        const lendingPair = lendingPairs?.find((pair) => pair.id === pool.pair)

        const type = swapPair ? PairType.SWAP : PairType.LENDING

        const pair = swapPair || lendingPair

        const blocksPerHour = 3600 / averageBlockTime

        // override for mcv2...
        if (pool?.rewarder === '0x7519c93fc5073e15d89131fd38118d73a72370f8') {
            pool.owner.totalAllocPoint = 26480
        }

        function getRewards() {
            // TODO: Some subgraphs give sushiPerBlock & sushiPerSecond, and mcv2 gives nothing
            const sushiPerBlock =
                pool?.owner?.sushiPerBlock / 1e18 ||
                (pool?.owner?.sushiPerSecond / 1e18) * averageBlockTime ||
                18.6

            const rewardPerBlock =
                (pool.allocPoint / pool.owner.totalAllocPoint) * sushiPerBlock

            const defaultReward = {
                token: 'SUSHI',
                icon: '/images/tokens/sushi-square.jpg',
                rewardPerBlock,
                rewardPerDay: rewardPerBlock * blocksPerDay,
                rewardPrice: sushiPrice,
            }

            const defaultRewards = [defaultReward]

            if (chef === Chef.MASTERCHEF_V2) {
                const rewardPerBlock = 0.437861008791398
                console.log(pool)
                return [
                    ...defaultRewards,
                    {
                        token: 'ALCX',
                        icon: '/images/tokens/alcx-square.jpg',
                        rewardPerBlock,
                        rewardPerDay: rewardPerBlock * blocksPerDay,
                        rewardPrice: alcxPrice,
                    },
                ]
            } else if (chef === Chef.MINICHEF) {
                const sushiPerSecond =
                    ((pool.allocPoint / 1000) * pool.miniChef.sushiPerSecond) /
                    1e18
                const sushiPerBlock = sushiPerSecond * averageBlockTime
                const sushiPerDay = sushiPerBlock * blocksPerDay
                const maticPerSecond =
                    ((pool.allocPoint / 1000) * pool.rewarder.rewardPerSecond) /
                    1e18
                const maticPerBlock = maticPerSecond * averageBlockTime
                const maticPerDay = maticPerBlock * blocksPerDay
                return [
                    {
                        ...defaultReward,
                        rewardPerBlock: sushiPerBlock,
                        rewardPerDay: sushiPerDay,
                    },
                    {
                        token: 'MATIC',
                        icon: '/images/tokens/polygon-square.jpg',
                        rewardPerBlock: maticPerBlock,
                        rewardPerDay: maticPerDay,
                        rewardPrice: maticPrice,
                    },
                ]
            }
            return defaultRewards
        }

        const rewards = getRewards()

        const balance = swapPair
            ? Number(pool.balance / 1e18)
            : pool.balance / 10 ** lendingPair.token0.decimals

        const tvl = swapPair
            ? (balance / Number(swapPair.totalSupply)) *
              Number(swapPair.reserveUSD)
            : balance * lendingPair.token0.derivedETH * ethPrice

        const roiPerBlock =
            rewards.reduce((previousValue, currentValue) => {
                return (
                    previousValue +
                    currentValue.rewardPerBlock * currentValue.rewardPrice
                )
            }, 0) / tvl

        const roiPerHour = roiPerBlock * blocksPerHour

        const roiPerDay = roiPerHour * 24

        const roiPerMonth = roiPerDay * 30

        const roiPerYear = roiPerMonth * 12

        return {
            ...pool,
            chef,
            pair: {
                ...pair,
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

    const farms = concat(
        masterChefV1Farms
            ? masterChefV1Farms?.filter?.(filter)?.map((pool) => {
                  return map(pool, Chef.MASTERCHEF)
              })
            : [],
        masterChefV2Farms
            ? masterChefV2Farms?.filter?.(filter)?.map((pool) => {
                  return map(pool, Chef.MASTERCHEF_V2)
              })
            : [],
        miniChefFarms
            ? miniChefFarms?.filter?.(filter)?.map((pool) => {
                  return map(pool, Chef.MINICHEF)
              })
            : []
    )

    const positions = farms
        ? [
              ...masterChefV1Positions.map((position) => ({
                  ...position,
                  ...farms?.find(
                      (farm) =>
                          farm.id === position.id &&
                          farm.chef === Chef.MASTERCHEF
                  ),
              })),
              ...masterChefV2Positions.map((position) => ({
                  ...position,
                  ...farms?.find(
                      (farm) =>
                          farm.id === position.id &&
                          farm.chef === Chef.MASTERCHEF_V2
                  ),
              })),
              ...miniChefPositions.map((position) => ({
                  ...position,
                  ...farms?.find(
                      (farm) =>
                          farm.id === position.id && farm.chef === Chef.MINICHEF
                  ),
              })),
          ]
        : []

    // //Search Setup
    const options = {
        keys: [
            'id',
            'pair.id',
            'pair.token0.symbol',
            'pair.token1.symbol',
            'pair.token0.name',
            'pair.token1.name',
        ],
        threshold: 0.4,
    }

    const { result, term, search } = useFuse({
        data: farms,
        options,
    })

    const filterForSection = {
        portfolio: (farm) =>
            positions.find((position) => position.id === farm.id),
        all: () => true,
        slp: (farm) => farm.pair.type === PairType.SWAP,
        kmp: (farm) => farm.pair.type === PairType.LENDING,
        mcv2: (farm) => farm.chef === Chef.MASTERCHEF_V2,
    }

    const filtered = result?.filter(filterForSection[section])

    return (
        <Layout>
            <Head>
                <title>Farm | Sushi</title>
                <meta name="description" content="Farm SUSHI" />
            </Head>
            <div className="container grid h-full grid-cols-4 gap-4 mx-auto">
                <div
                    className="sticky top-0 hidden lg:block md:col-span-1"
                    style={{ maxHeight: '40rem' }}
                >
                    <Menu section={section} setSection={setSection} />
                </div>
                <div className="col-span-4 lg:col-span-3">
                    <Card
                        className="h-full bg-dark-900"
                        header={
                            <CardHeader className="flex flex-col items-center bg-dark-800">
                                <div className="w-full">
                                    <Search search={search} term={term} />
                                </div>
                                <div className="container block pt-6 lg:hidden">
                                    <Menu
                                        section={section}
                                        setSection={setSection}
                                    />
                                </div>
                            </CardHeader>
                        }
                    >
                        <FarmList farms={filtered} term={term} />
                    </Card>
                </div>
            </div>
        </Layout>
    )
}
