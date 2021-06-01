import { ChevronDown, ChevronUp } from 'react-feather'
import React, { useState } from 'react'
import { formatNumber, formatPercent } from '../functions/format'
import { useFuse, useSortableData } from '../hooks'
import {
    useMasterChefContract,
    useMiniChefV2Contract,
} from '../hooks/useContract'

import Card from '../components/Card'
import CardHeader from '../components/CardHeader'
import { ChainId } from '@sushiswap/sdk'
import Dots from '../components/Dots'
import Head from 'next/head'
import Header from '../features/farm/Header'
import KashiLending from '../features/farm/KashiLending'
import Layout from '../layouts/DefaultLayout'
import LiquidityPosition from '../features/farm/LiquidityPosition'
import Loading from '../features/farm/Loading'
import Menu from '../features/farm/Menu'
import { RowBetween } from '../components/Row'
import Search from '../components/Search'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import useMasterChefFarms from '../features/farm/useFarms'
import useRewarder from '../hooks/useRewarder'

export default function Farm() {
    const { i18n } = useLingui()

    const [section, setSection] =
        useState<'portfolio' | 'all' | 'kmp' | 'slp' | 'mcv2'>('all')

    // MasterChef v1
    const masterchefContract = useMasterChefContract()
    const masterchefv1Positions = useRewarder(masterchefContract)
    const masterchefv1 = useMasterChefFarms()

    // MasterChef v2

    // MiniChef for multichain
    const minichefContract = useMiniChefV2Contract()
    const minichefPositions = useRewarder(minichefContract)
    // const minichef = useMiniChefFarms()

    console.log(
        'positions:',
        minichefPositions[0].filter((p) => !p?.result?.[0].isZero()),
        masterchefv1Positions[0].filter((p) => !p?.result?.[0].isZero())
    )

    const farms = masterchefv1

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

    return (
        <Layout>
            <Head>
                <title>Farm | Sushi</title>
                <meta
                    name="description"
                    content="Farm SUSHI with Liquidity Mining Pools and the Sushi Bar."
                />
            </Head>

            <div className="container grid grid-cols-12 gap-4">
                <div
                    className="sticky top-0 col-span-3 space-y-2 "
                    style={{ maxHeight: '40rem' }}
                >
                    <Menu section={section} setSection={setSection} />
                </div>

                <div className="col-span-9">
                    <Card
                        className="w-full h-full bg-dark-900"
                        header={
                            <CardHeader className="flex items-center justify-between bg-dark-800">
                                <div className="flex justify-between w-full">
                                    <div className="items-center hidden md:flex">
                                        <div className="mr-2 text-lg whitespace-nowrap">
                                            {i18n._(t`Yield Instruments`)}
                                        </div>
                                    </div>
                                    <Search search={search} term={term} />
                                </div>
                            </CardHeader>
                        }
                    >
                        <Header
                            sortConfig={sortConfig}
                            requestSort={requestSort}
                        />
                        {section && section === 'slp' && (
                            <div className="flex-col space-y-2">
                                {items && items.length > 0 ? (
                                    items.map((farm: any, i: number) => {
                                        if (farm.type === 'SLP') {
                                            return (
                                                <LiquidityPosition
                                                    key={farm.address + '_' + i}
                                                    farm={farm}
                                                />
                                            )
                                        } else {
                                            return null
                                        }
                                    })
                                ) : (
                                    <>
                                        {term ? (
                                            <div className="w-full py-6 text-center">
                                                No Results.
                                            </div>
                                        ) : (
                                            <div className="w-full py-6 text-center">
                                                <Dots>
                                                    Fetching Instruments
                                                </Dots>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        )}
                        {section && section === 'kmp' && (
                            <div className="flex-col space-y-2">
                                {items && items.length > 0 ? (
                                    items.map((farm: any, i: number) => {
                                        if (farm.type === 'KMP') {
                                            return (
                                                <KashiLending
                                                    key={farm.address + '_' + i}
                                                    farm={farm}
                                                />
                                            )
                                        } else {
                                            return null
                                        }
                                    })
                                ) : (
                                    <>
                                        {term ? (
                                            <div className="w-full py-6 text-center">
                                                No Results.
                                            </div>
                                        ) : (
                                            <div className="w-full py-6 text-center">
                                                <Dots>
                                                    Fetching Instruments
                                                </Dots>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        )}
                        {section && section === 'all' && (
                            <div className="flex-col space-y-2">
                                {items && items.length > 0 ? (
                                    items.map((farm: any, i: number) => {
                                        if (farm.type === 'KMP') {
                                            return (
                                                <KashiLending
                                                    key={farm.address + '_' + i}
                                                    farm={farm}
                                                />
                                            )
                                        } else if (farm.type === 'SLP') {
                                            return (
                                                <LiquidityPosition
                                                    key={farm.address + '_' + i}
                                                    farm={farm}
                                                />
                                            )
                                        } else {
                                            return null
                                        }
                                    })
                                ) : (
                                    <>
                                        {term ? (
                                            <div className="w-full py-6 text-center">
                                                No Results.
                                            </div>
                                        ) : (
                                            <div className="w-full py-6 text-center">
                                                <Dots>
                                                    Fetching Instruments
                                                </Dots>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        )}
                    </Card>
                </div>
            </div>
        </Layout>
    )
}
