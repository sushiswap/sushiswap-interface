import React, { useEffect, useState } from 'react'
import { useFuse, useSortableData } from '../hooks'
import {
    useMasterChefContract,
    useMasterChefV2Contract,
    useMiniChefV2Contract,
} from '../hooks/useContract'

import Card from '../components/Card'
import CardHeader from '../components/CardHeader'
import Dots from '../components/Dots'
import FarmList from '../features/farm/FarmList'
import FarmListHeader from '../features/farm/FarmListHeader'
import Head from 'next/head'
import Layout from '../layouts/DefaultLayout'
import Menu from '../features/farm/FarmMenu'
import Search from '../components/Search'
import concat from 'lodash/concat'
import { t } from '@lingui/macro'
import useFarms from '../features/farm/useFarms'
import { useLingui } from '@lingui/react'
import useStakedPending from '../features/farm/useStakedPending'

export default function Yield(): JSX.Element {
    const { i18n } = useLingui()
    const [section, setSection] =
        useState<'portfolio' | 'all' | 'kmp' | 'slp' | 'mcv2'>('all')

    const farms = useFarms()

    // Get Contracts
    const masterchefContract = useMasterChefContract()
    const masterchefV2Contract = useMasterChefV2Contract()
    const minichefContract = useMiniChefV2Contract()

    // Get Portfolios
    const [portfolio, setPortfolio] = useState([])
    const masterchefv1Positions = useStakedPending(masterchefContract)
    const masterchefv2Positions = useStakedPending(masterchefV2Contract)
    const minichefPositions = useStakedPending(minichefContract)

    useEffect(() => {
        // determine masterchefv1 positions
        let masterchefv1Portfolio
        if (farms) {
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
                    const pair = farms?.find(
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

        let masterchefv2Portfolio
        if (farms) {
            const masterchefv2WithPids = masterchefv2Positions?.[0].map(
                (position, index) => {
                    return {
                        pid: index,
                        pending_bn: position?.result?.[0],
                        staked_bn:
                            masterchefv2Positions?.[1][index].result?.amount,
                    }
                }
            )
            const masterchefv2Filtered = masterchefv2WithPids.filter(
                (position) => {
                    return (
                        position?.pending_bn?.gt(0) ||
                        position?.staked_bn?.gt(0)
                    )
                }
            )
            // fetch any relevant details through pid
            const masterchefv2PositionsWithDetails = masterchefv2Filtered.map(
                (position) => {
                    const pair = farms?.find(
                        (pair: any) => pair.pid === position.pid
                    )
                    return {
                        ...pair,
                        ...position,
                    }
                }
            )
            masterchefv2Portfolio = masterchefv2PositionsWithDetails
        }

        let minichefPortfolio
        if (farms) {
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
                    const pair = farms?.find(
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
            concat(
                minichefPortfolio || [],
                masterchefv1Portfolio || [],
                masterchefv2Portfolio || []
            )
        )
    }, [farms, masterchefv1Positions, minichefPositions])

    //Search Setup
    const options = { keys: ['symbol', 'name', 'pairAddress'], threshold: 0.4 }

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
                        {section && section === 'portfolio' && (
                            <FarmList farms={portfolio} term={term} />
                        )}
                        {section && section === 'all' && (
                            <FarmList farms={filtered} term={term} />
                        )}
                        {section && section === 'slp' && (
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
                        )}
                    </Card>
                </div>
            </div>
        </Layout>
    )
}
