import React, { useCallback, useEffect, useMemo, useState } from 'react'
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
import { useFuse, useSortableData } from '../hooks'
import {
    useMasterChefContract,
    useMasterChefV2Contract,
    useMiniChefV2Contract,
} from '../hooks/useContract'

import Card from '../components/Card'
import CardHeader from '../components/CardHeader'
import { ChefId } from '../features/farm/enum'
import FarmList from '../features/farm/FarmList'
import Head from 'next/head'
import Layout from '../layouts/DefaultLayout'
import Menu from '../features/farm/FarmMenu'
import Search from '../components/Search'
import concat from 'lodash/concat'
import { t } from '@lingui/macro'
import useFarms from '../features/farm/_useFarmsOld'
import { useLendingPairSubset } from '../services/graph/hooks/bentobox'
import { useLingui } from '@lingui/react'
import useStaked from '../features/farm/useStaked'

export default function Yield(): JSX.Element {
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

    const { data: masterChefV1LiquidityPositions } = useLiquidityPositionSubset(
        '0xc2edad668740f1aa35e4d8f227fb8e17dca888cd' // masterchefv1 address
    )

    const { data: masterChefV2LiquidityPositions } = useLiquidityPositionSubset(
        '0xef0881ec094552b2e128cf945ef17a6752b4ec5d' // masterchefv2 address
    )

    const pairAddresses = useMemo(
        () =>
            concat(
                masterChefV1Farms?.pools,
                masterChefV2Farms?.pools,
                miniChefFarms?.pools
            )
                .filter((pool) => pool && pool.pair)
                .map((pool) => pool.pair)
                .sort(),
        [masterChefV1Farms, masterChefV2Farms, miniChefFarms]
    )

    // const liquidityPositions = [
    //     ...masterChefV1LiquidityPositions,
    //     ...masterChefV2LiquidityPositions,
    // ]

    const { data: swapPairs } = usePairSubset(pairAddresses)

    const { data: lendingPairs } = useLendingPairSubset(pairAddresses)

    // console.log({
    //     // masterChefV1Farms,
    //     // masterChefV2Farms,
    //     // miniChefFarms,
    //     // pairAddresses,
    //     masterChefV1LiquidityPositions,
    //     pairs,
    //     sushiPrice,
    // })

    function filter(pool) {
        if (!swapPairs || !lendingPairs) {
            return false
        }
        // !POOL_DENY.includes(pool.id) &&
        return (
            pool.allocPoint !== '0' &&
            pool.accSushiPerShare !== '0' &&
            [
                ...masterChefV1LiquidityPositions,
                ...masterChefV2LiquidityPositions,
            ].map(
                (liquidityPosition) => liquidityPosition.pair.id === pool.pair
            ) &&
            (swapPairs.find((pair) => pair.id === pool.pair) ||
                lendingPairs.find((pair) => pair.id === pool.pair))
        )
    }

    function map(pool) {
        const swapPair = swapPairs?.find((pair) => pair.id === pool.pair)
        const lendingPair = lendingPairs?.find((pair) => pair.id === pool.pair)

        const pair = swapPair || lendingPair

        // console.log({ pair })

        const liquidityPosition = [
            ...masterChefV1LiquidityPositions,
            ...masterChefV2LiquidityPositions,
            // ...miniChefLiquidityPositions,
        ]?.find((liquidityPosition) => liquidityPosition.pair.id === pair.id)

        const blocksPerHour = 3600 / averageBlockTime

        const balance = swapPair
            ? Number(pool.balance / 1e18)
            : pool.balance / 10 ** lendingPair.token0.decimals

        const tvl = swapPair
            ? (balance / Number(swapPair.totalSupply)) *
              Number(swapPair.reserveUSD)
            : balance * lendingPair.token0.derivedETH * ethPrice

        // whut pool.owner & pool.masterChef?, consistency plz
        const totalAllocPoint = pool.owner
            ? pool.owner.totalAllocPoint
            : pool.masterChef.totalAllocPoint

        // whut pool.owner & pool.masterChef?, consistency plz
        const sushiPerBlock = pool.owner
            ? pool.owner.sushiPerBlock
            : pool.masterChef.sushiPerBlock

        const rewardPerBlock =
            ((pool.allocPoint / totalAllocPoint) * sushiPerBlock) / 1e18

        const roiPerBlock = (rewardPerBlock * sushiPrice) / tvl

        const roiPerHour = roiPerBlock * blocksPerHour

        const roiPerDay = roiPerHour * 24

        const roiPerMonth = roiPerDay * 30

        const roiPerYear = roiPerMonth * 12

        return {
            ...pool,
            pair,
            balance,
            roiPerBlock,
            roiPerHour,
            roiPerDay,
            roiPerMonth,
            roiPerYear,
            rewardPerThousand: 1 * roiPerDay * (1000 / sushiPrice),
            tvl,
        }
    }

    const farms = concat(
        masterChefV1Farms?.pools
            ? masterChefV1Farms?.pools?.filter?.(filter)?.map((pool) => {
                  return {
                      ...map(pool),
                      chefId: ChefId.MASTERCHEF,
                  }
              })
            : [],
        masterChefV2Farms?.pools
            ? masterChefV2Farms?.pools?.filter?.(filter)?.map((pool) => {
                  return {
                      ...map(pool),
                      chefId: ChefId.MASTERCHEF_V2,
                  }
              })
            : [],
        miniChefFarms?.pools
            ? miniChefFarms?.pools?.filter?.(filter)?.map((pool) => {
                  return {
                      ...map(pool),
                      chefId: ChefId.MINICHEF,
                  }
              })
            : []
    )

    console.log({ farms })

    // const farms = useFarms()

    // // Get Contracts
    // const masterchefContract = useMasterChefContract()
    // const masterchefV2Contract = useMasterChefV2Contract()
    // const minichefContract = useMiniChefV2Contract()

    // // Get Portfolios
    // const [portfolio, setPortfolio] = useState([])
    // const masterchefv1Positions = useStaked(masterchefContract)
    // const masterchefv2Positions = useStaked(masterchefV2Contract)
    // const minichefPositions = useStaked(minichefContract)

    // useEffect(() => {
    //     // determine masterchefv1 positions
    //     let masterchefv1Portfolio
    //     if (farms) {
    //         const masterchefv1WithPids = masterchefv1Positions?.[0].map(
    //             (position, index) => {
    //                 return {
    //                     pid: index,
    //                     pending_bn: position?.result?.[0],
    //                     staked_bn:
    //                         masterchefv1Positions?.[1][index].result?.amount,
    //                 }
    //             }
    //         )
    //         const masterchefv1Filtered = masterchefv1WithPids.filter(
    //             (position) => {
    //                 return (
    //                     position?.pending_bn?.gt(0) ||
    //                     position?.staked_bn?.gt(0)
    //                 )
    //             }
    //         )
    //         // fetch any relevant details through pid
    //         const masterchefv1PositionsWithDetails = masterchefv1Filtered.map(
    //             (position) => {
    //                 const pair = farms?.find(
    //                     (pair: any) => pair.pid === position.pid
    //                 )
    //                 return {
    //                     ...pair,
    //                     ...position,
    //                 }
    //             }
    //         )
    //         masterchefv1Portfolio = masterchefv1PositionsWithDetails
    //     }

    //     let masterchefv2Portfolio
    //     if (farms) {
    //         const masterchefv2WithPids = masterchefv2Positions?.[0].map(
    //             (position, index) => {
    //                 return {
    //                     pid: index,
    //                     pending_bn: position?.result?.[0],
    //                     staked_bn:
    //                         masterchefv2Positions?.[1][index].result?.amount,
    //                 }
    //             }
    //         )
    //         const masterchefv2Filtered = masterchefv2WithPids.filter(
    //             (position) => {
    //                 return (
    //                     position?.pending_bn?.gt(0) ||
    //                     position?.staked_bn?.gt(0)
    //                 )
    //             }
    //         )
    //         // fetch any relevant details through pid
    //         const masterchefv2PositionsWithDetails = masterchefv2Filtered.map(
    //             (position) => {
    //                 const pair = farms?.find(
    //                     (pair: any) => pair.pid === position.pid
    //                 )
    //                 return {
    //                     ...pair,
    //                     ...position,
    //                 }
    //             }
    //         )
    //         masterchefv2Portfolio = masterchefv2PositionsWithDetails
    //     }

    //     let minichefPortfolio
    //     if (farms) {
    //         // determine minichef positions
    //         const minichefWithPids = minichefPositions?.[0].map(
    //             (position, index) => {
    //                 return {
    //                     pid: index,
    //                     pending: position?.result?.[0],
    //                     staked: minichefPositions?.[1][index].result?.amount,
    //                 }
    //             }
    //         )
    //         const minichefFiltered = minichefWithPids.filter(
    //             (position: any) => {
    //                 return position?.pending?.gt(0) || position?.staked?.gt(0)
    //             }
    //         )
    //         // fetch any relevant details through pid
    //         const minichefPositionsWithDetails = minichefFiltered.map(
    //             (position) => {
    //                 const pair = farms?.find(
    //                     (pair: any) => pair.pid === position.pid
    //                 )
    //                 return {
    //                     ...pair,
    //                     ...position,
    //                 }
    //             }
    //         )
    //         minichefPortfolio = minichefPositionsWithDetails
    //     }

    //     console.log({ minichefPortfolio, masterchefv1Portfolio })

    //     setPortfolio(
    //         concat(
    //             minichefPortfolio || [],
    //             masterchefv1Portfolio || [],
    //             masterchefv2Portfolio || []
    //         )
    //     )
    // }, [farms, masterchefv1Positions, minichefPositions])

    // //Search Setup
    const options = { keys: ['symbol', 'name', 'pair.id'], threshold: 0.4 }

    const { result, search, term } = useFuse({
        data: farms && farms.length > 0 ? farms : [],
        options,
    })

    const filtered = result.map((a: { item: any }) => (a?.item ? a.item : a))

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
                                <div className="flex justify-between w-full">
                                    <div className="items-center hidden md:flex">
                                        <div className="mr-2 text-lg whitespace-nowrap">
                                            {i18n._(t`Yield Farms`)}
                                        </div>
                                    </div>
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
                        {/* {section && section === 'portfolio' && (
                            <FarmList farms={portfolio} term={term} />
                        )} */}
                        {section && section === 'all' && (
                            <FarmList farms={filtered} term={term} />
                        )}
                        {/* {section && section === 'slp' && (
                            <FarmList
                                farms={filtered.filter(
                                    (farm) => farm.type === 'SLP'
                                )}
                                term={term}
                            />
                        )}
                        {section && section === 'kmp' && (
                            <FarmList
                                farms={filtered.filter(
                                    (farm) => farm.type === 'KMP'
                                )}
                                term={term}
                            />
                        )}
                        {section && section === 'mcv2' && (
                            <FarmList
                                farms={filtered.filter(
                                    (farm) =>
                                        farm.type === 'SLP' &&
                                        farm.contract === 'masterchefv2'
                                )}
                                term={term}
                            />
                        )} */}
                    </Card>
                </div>
            </div>
        </Layout>
    )
}
