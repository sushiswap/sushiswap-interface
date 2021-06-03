import React, { useEffect, useState } from 'react'
import { useFuse, useSortableData } from '../hooks'
import {
    useMasterChefContract,
    useMiniChefV2Contract,
} from '../hooks/useContract'

import Card from '../components/Card'
import CardHeader from '../components/CardHeader'
import Dots from '../components/Dots'
import FarmList from '../features/farm/FarmList'
import Head from 'next/head'
import Header from '../features/farm/Header'
import Layout from '../layouts/DefaultLayout'
import Menu from '../features/farm/FarmMenu'
import Search from '../components/Search'
import concat from 'lodash/concat'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import useMasterChefFarms from '../features/farm/useFarms'
import useMasterChefV2Farms from '../features/farm/masterchefv2/hooks/useFarms'
import useMiniChefFarms from '../features/farm/minichef/hooks/useFarms'
import useStakedPending from '../features/farm/useStakedPending'

export default function Yield(): JSX.Element {
    const { i18n } = useLingui()
    const [section, setSection] =
        useState<'portfolio' | 'all' | 'kmp' | 'slp' | 'mcv2'>('all')

    // Get Farms
    const masterchefv1 = useMasterChefFarms()
    const masterchefv2 = useMasterChefV2Farms()
    const minichef = useMiniChefFarms()

    console.log('masterchefv2:', masterchefv2)

    // Get Contracts
    const masterchefContract = useMasterChefContract()
    const minichefContract = useMiniChefV2Contract()

    // Get Portfolios
    const [portfolio, setPortfolio] = useState([])
    const masterchefv1Positions = useStakedPending(masterchefContract)
    const minichefPositions = useStakedPending(minichefContract)

    const farms = concat(
        masterchefv2 ? masterchefv2 : [],
        masterchefv1 ? masterchefv1 : [],
        minichef ? minichef : []
    )

    console.log(
        minichefPositions[0].filter((p) => !p?.result?.[0].isZero()),
        masterchefv1Positions[0].filter((p) => !p?.result?.[0].isZero())
    )

    useEffect(() => {
        // determine masterchefv1 positions
        let masterchefv1Portfolio
        if (masterchefv1) {
            const masterchefv1WithPids = masterchefv1Positions?.[0].map(
                (position, index) => {
                    return {
                        pid: index,
                        pending_bn: position?.result?.[0],
                        staked_bn:
                            masterchefv1Positions?.[1][index].result?.amount,
                    }
                }
            )
            const masterchefv1Filtered = masterchefv1WithPids.filter(
                (position) => {
                    return (
                        position?.pending_bn?.gt(0) ||
                        position?.staked_bn?.gt(0)
                    )
                }
            )
            // fetch any relevant details through pid
            const masterchefv1PositionsWithDetails = masterchefv1Filtered.map(
                (position) => {
                    const pair = masterchefv1?.find(
                        (pair: any) => pair.pid === position.pid
                    )
                    return {
                        ...pair,
                        ...position,
                    }
                }
            )
            masterchefv1Portfolio = masterchefv1PositionsWithDetails
        }

        let minichefPortfolio
        if (minichef) {
            // determine minichef positions
            const minichefWithPids = minichefPositions?.[0].map(
                (position, index) => {
                    return {
                        pid: index,
                        pending: position?.result?.[0],
                        staked: minichefPositions?.[1][index].result?.amount,
                    }
                }
            )
            const minichefFiltered = minichefWithPids.filter(
                (position: any) => {
                    return position?.pending?.gt(0) || position?.staked?.gt(0)
                }
            )
            // fetch any relevant details through pid
            const minichefPositionsWithDetails = minichefFiltered.map(
                (position) => {
                    const pair = minichef?.find(
                        (pair: any) => pair.pid === position.pid
                    )
                    return {
                        ...pair,
                        ...position,
                    }
                }
            )
            minichefPortfolio = minichefPositionsWithDetails
        }

        console.log({ minichefPortfolio, masterchefv1Portfolio })

        setPortfolio(
            concat(minichefPortfolio, masterchefv1Portfolio)[0]
                ? concat(minichefPortfolio, masterchefv1Portfolio)
                : []
        )

        // setPortfolio(
        //     concat(minichefPortfolio || [], masterchefv1Portfolio || [])
        // )
    }, [masterchefv1, masterchefv1Positions, minichef, minichefPositions])

    //Search Setup
    const options = { keys: ['symbol', 'name', 'pairAddress'], threshold: 0.4 }
    const { result, search, term } = useFuse({
        data: farms && farms.length > 0 ? farms : [],
        options,
    })
    const flattenSearchResults = result.map((a: { item: any }) =>
        a.item ? a.item : a
    )

    // Sorting Setup
    const { items, requestSort, sortConfig } =
        useSortableData(flattenSearchResults)

    console.log({ portfolio })

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
                        <Header
                            sortConfig={sortConfig}
                            requestSort={requestSort}
                        />
                        {section && section === 'portfolio' && (
                            <>
                                {portfolio && portfolio.length > 0 ? (
                                    <FarmList farms={portfolio} />
                                ) : term ? (
                                    <div className="w-full py-6 text-center">
                                        No Results.
                                    </div>
                                ) : (
                                    <div className="w-full py-6 text-center">
                                        <Dots>Fetching Portfolio</Dots>
                                    </div>
                                )}
                            </>
                        )}

                        {section && section === 'all' && (
                            <>
                                {items && items.length > 0 ? (
                                    <FarmList farms={items} />
                                ) : term ? (
                                    <div className="w-full py-6 text-center">
                                        No Results.
                                    </div>
                                ) : (
                                    <div className="w-full py-6 text-center">
                                        <Dots>Fetching Farms</Dots>
                                    </div>
                                )}
                            </>
                        )}

                        {section && section === 'slp' && (
                            <>
                                {items && items.length > 0 ? (
                                    <FarmList
                                        farms={items.filter(
                                            (farm) => farm.type === 'SLP'
                                        )}
                                    />
                                ) : term ? (
                                    <div className="w-full py-6 text-center">
                                        No Results.
                                    </div>
                                ) : (
                                    <div className="w-full py-6 text-center">
                                        <Dots>Fetching Farms</Dots>
                                    </div>
                                )}
                            </>
                        )}
                        {section && section === 'kmp' && (
                            <>
                                {items && items.length > 0 ? (
                                    <FarmList
                                        farms={items.filter(
                                            (farm) => farm.type === 'KMP'
                                        )}
                                    />
                                ) : term ? (
                                    <div className="w-full py-6 text-center">
                                        No Results.
                                    </div>
                                ) : (
                                    <div className="w-full py-6 text-center">
                                        <Dots>Fetching Farms</Dots>
                                    </div>
                                )}
                            </>
                        )}
                        {section && section === 'mcv2' && (
                            <>
                                {items && items.length > 0 ? (
                                    <FarmList
                                        farms={items.filter(
                                            (farm) =>
                                                farm.type === 'SLP' &&
                                                farm.contract === 'masterchefv2'
                                        )}
                                    />
                                ) : term ? (
                                    <div className="w-full py-6 text-center">
                                        No Results.
                                    </div>
                                ) : (
                                    <div className="w-full py-6 text-center">
                                        <Dots>Fetching Farms</Dots>
                                    </div>
                                )}
                            </>
                        )}
                    </Card>
                </div>
            </div>
        </Layout>
    )
}
