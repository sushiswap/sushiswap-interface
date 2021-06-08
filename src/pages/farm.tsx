import { Chef, PairType } from '../features/farm/enum'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs'
import {
    useAverageBlockTime,
    useEthPrice,
    useExchange,
    useLiquidityPositionSubset,
    useMasterChefV1Farms,
    useMasterChefV2Farms,
    useMiniChefFarms,
    useOneDayBlock,
    usePairSubset,
    usePairs,
    useSushiPrice,
} from '../services/graph'
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
import { usePositions } from '../features/farm/hooks'

export default function Farm(): JSX.Element {
    const { i18n } = useLingui()
    const [section, setSection] =
        useState<'portfolio' | 'all' | 'kmp' | 'slp' | 'mcv2'>('all')

    const { data: averageBlockTime } = useAverageBlockTime()

    const { data: oneDayBlock } = useOneDayBlock()
    const { data: sushiPrice } = useSushiPrice()
    const { data: ethPrice } = useEthPrice()

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

    // console.log({
    //     masterChefV1Farms,
    //     masterChefV2Farms,
    //     miniChefFarms,
    //     pairAddresses,
    // })

    const { data: swapPairs } = usePairSubset(pairAddresses)

    const { data: lendingPairs } = useLendingPairSubset(pairAddresses)

    // Get Contracts
    const masterchefContract = useMasterChefContract()
    const masterchefV2Contract = useMasterChefV2Contract()
    const minichefContract = useMiniChefV2Contract()

    const masterChefV1Positions = usePositions(masterchefContract)
    const masterChefV2Positions = usePositions(masterchefV2Contract)
    const miniChefPositions = usePositions(minichefContract)

    // const { data: masterChefV1LiquidityPositions } = useLiquidityPositionSubset(
    //     '0xc2edad668740f1aa35e4d8f227fb8e17dca888cd' // masterchefv1 address
    // )

    // const { data: masterChefV2LiquidityPositions } = useLiquidityPositionSubset(
    //     '0xef0881ec094552b2e128cf945ef17a6752b4ec5d' // masterchefv2 address
    // )

    // const liquidityPositions = [
    //     ...masterChefV1LiquidityPositions,
    //     ...masterChefV2LiquidityPositions,
    // ]

    const blocksPerDay = 86400 / Number(averageBlockTime)

    function filter(pool) {
        if (!swapPairs || !lendingPairs) {
            return false
        }
        // !POOL_DENY.includes(pool.id) &&
        return (
            pool.allocPoint !== '0' &&
            pool.accSushiPerShare !== '0' &&
            // [
            //     ...masterChefV1LiquidityPositions,
            //     ...masterChefV2LiquidityPositions,
            // ].map(
            //     (liquidityPosition) => liquidityPosition.pair.id === pool.pair
            // ) &&
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

        // console.log({ pair })

        // const liquidityPosition = [
        //     ...masterChefV1LiquidityPositions,
        //     ...masterChefV2LiquidityPositions,
        //     ...miniChefLiquidityPositions,
        // ]?.find((liquidityPosition) => liquidityPosition.pair.id === pair.id)

        const blocksPerHour = 3600 / averageBlockTime

        const balance = swapPair
            ? Number(pool.balance / 1e18)
            : pool.balance / 10 ** lendingPair.token0.decimals

        const tvl = swapPair
            ? (balance / Number(swapPair.totalSupply)) *
              Number(swapPair.reserveUSD)
            : balance * lendingPair.token0.derivedETH * ethPrice

        // override for mcv2...
        if (pool?.rewarder === '0x7519c93fc5073e15d89131fd38118d73a72370f8') {
            pool.owner.totalAllocPoint = 100
        }

        const sushiPerBlock =
            pool?.owner?.sushiPerBlock ||
            pool?.owner?.sushiPerSecond * averageBlockTime

        const rewardPerBlock =
            ((pool.allocPoint / pool.owner.totalAllocPoint) * sushiPerBlock) /
            1e18

        const roiPerBlock = (rewardPerBlock * sushiPrice) / tvl

        const roiPerHour = roiPerBlock * blocksPerHour

        const roiPerDay = roiPerHour * 24

        const roiPerMonth = roiPerDay * 30

        const roiPerYear = roiPerMonth * 12

        // Temporary solution
        function rewards() {
            const defaultRewards = [
                {
                    token: 'SUSHI',
                    icon: '/images/tokens/sushi-square.jpg',
                    rewardPerDay: rewardPerBlock * blocksPerDay,
                },
            ]
            if (chef === Chef.MASTERCHEF_V2) {
                return [
                    ...defaultRewards,
                    {
                        token: 'ALCX',
                        icon: '/images/tokens/alcx-square.jpg',
                        rewardPerDay: 0.437861008791398,
                    },
                ]
            } else if (chef === Chef.MINICHEF) {
                return [
                    ...defaultRewards,
                    {
                        token: 'MATIC',
                        icon: '/images/tokens/polygon-square.jpg',
                        rewardPerDay:
                            ((pool.allocPoint / pool.owner.totalAllocPoint) *
                                pool.rewarder.rewardPerSecond) /
                            1e18,
                    },
                ]
            }
            return defaultRewards
        }

        return {
            ...pool,
            chef,
            pair: {
                ...pair,
                type,
            },
            balance,
            rewardPerBlock,
            roiPerBlock,
            roiPerHour,
            roiPerDay,
            roiPerMonth,
            roiPerYear,
            rewardPerThousand: 1 * roiPerDay * (1000 / sushiPrice),
            rewards: rewards(),
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
    // console.log({ farms })

    // console.log({
    //     masterchefv1Positions,
    //     masterchefv2Positions,
    //     minichefPositions,
    // })

    // console.log({ masterChefV1Farms, masterChefV2Farms, miniChefFarms, farms })

    // const farms = concat([
    //     masterChefV1Farms ? masterChefV1Farms : [],
    //     masterChefV2Farms ? masterChefV2Farms : [],
    //     miniChefFarms ? miniChefFarms : [],
    // ])

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

    // console.log({ positions })

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
                            <CardHeader className="flex items-center bg-dark-800">
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
