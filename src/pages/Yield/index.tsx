import { Card, CardHeader, Search } from './components'
import { ChevronDown, ChevronUp } from 'react-feather'
import { Header, KashiLending, LiquidityPosition } from './components/Farms'
import React, { useEffect, useState } from 'react'
import { formattedNum, formattedPercent } from '../../utils'
import { useFuse, useSortableData } from 'hooks'
import { useMasterChefContract, useMiniChefV2Contract } from '../../hooks/useContract'

import { ChainId } from '@sushiswap/sdk'
import { SimpleDots as Dots } from 'kashi/components'
import { Helmet } from 'react-helmet'
import Menu from './Menu'
import { RowBetween } from '../../components/Row'
import _ from 'lodash'
import styled from 'styled-components'
import { t } from '@lingui/macro'
import { useActiveWeb3React } from 'hooks/useActiveWeb3React'
import { useLingui } from '@lingui/react'
import useMasterChefFarms from './hooks/masterchefv1/useFarms'
import useMasterChefV2Farms from './hooks/masterchefv2/useFarms'
import useMiniChefFarms from './hooks/minichef/useFarms'
import useStakedPending from './hooks/portfolio/useStakedPending'

export const FixedHeightRow = styled(RowBetween)`
    height: 24px;
`

export default function Yield(): JSX.Element {
    const { i18n } = useLingui()
    const [section, setSection] = useState<'portfolio' | 'all' | 'kmp' | 'slp' | 'mcv2'>('all')
    const { account, chainId } = useActiveWeb3React()

    // Get Farms
    const masterchefv1 = useMasterChefFarms()
    const masterchefv2 = useMasterChefV2Farms()
    const minichef = useMiniChefFarms()
    const allFarms = _.concat(
        masterchefv2 ? masterchefv2 : [],
        minichef ? minichef : [],
        masterchefv1 ? masterchefv1 : []
    )

    console.log('masterchefv2:', masterchefv2)

    // Get Contracts
    const masterchefContract = useMasterChefContract()
    const minichefContract = useMiniChefV2Contract()

    // Get Portfolios
    const [portfolio, setPortfolio] = useState<any[]>()
    const masterchefv1Positions = useStakedPending(masterchefContract)
    const minichefPositions = useStakedPending(minichefContract)
    useEffect(() => {
        // determine masterchefv1 positions
        let masterchefv1Portfolio
        if (masterchefv1) {
            const masterchefv1WithPids = masterchefv1Positions?.[0].map((position, index) => {
                return {
                    pid: index,
                    pending_bn: position?.result?.[0],
                    staked_bn: masterchefv1Positions?.[1][index].result?.amount
                }
            })
            const masterchefv1Filtered = masterchefv1WithPids.filter(position => {
                return position?.pending_bn?.gt(0) || position?.staked_bn?.gt(0)
            })
            // fetch any relevant details through pid
            const masterchefv1PositionsWithDetails = masterchefv1Filtered.map(position => {
                const pair = masterchefv1?.find((pair: any) => pair.pid === position.pid)
                return {
                    ...pair,
                    ...position
                }
            })
            masterchefv1Portfolio = masterchefv1PositionsWithDetails
        }

        let minichefPortfolio
        if (minichef) {
            // determine minichef positions
            const minichefWithPids = minichefPositions?.[0].map((position, index) => {
                return {
                    pid: index,
                    pending: position?.result?.[0],
                    staked: minichefPositions?.[1][index].result?.amount
                }
            })
            const minichefFiltered = minichefWithPids.filter((position: any) => {
                return position?.pending?.gt(0) || position?.staked?.gt(0)
            })
            // fetch any relevant details through pid
            const minichefPositionsWithDetails = minichefFiltered.map(position => {
                const pair = minichef?.find((pair: any) => pair.pid === position.pid)
                return {
                    ...pair,
                    ...position
                }
            })
            minichefPortfolio = minichefPositionsWithDetails
        }

        setPortfolio(
            _.concat(minichefPortfolio, masterchefv1Portfolio)[0]
                ? _.concat(minichefPortfolio, masterchefv1Portfolio)
                : []
        )
    }, [masterchefv1, masterchefv1Positions, minichef, minichefPositions])

    // MasterChef v2
    const farms = allFarms

    //Search Setup
    const options = { keys: ['symbol', 'name', 'pairAddress'], threshold: 0.4 }
    const { result, search, term } = useFuse({
        data: farms && farms.length > 0 ? farms : [],
        options
    })
    const flattenSearchResults = result.map((a: { item: any }) => (a.item ? a.item : a))

    // Sorting Setup
    const { items, requestSort, sortConfig } = useSortableData(flattenSearchResults)

    console.log('term:', term)

    return (
        <>
            <Helmet>
                <title>{i18n._(t`Yield`)} | Sushi</title>
                <meta name="description" content="Farm SUSHI by staking LP (Liquidity Provider) tokens" />
            </Helmet>
            <div className="container grid grid-cols-4 gap-4 mx-auto">
                <div className="sticky top-0 hidden lg:block md:col-span-1" style={{ maxHeight: '40rem' }}>
                    <Menu section={section} setSection={setSection} />
                </div>
                <div className="col-span-4 lg:col-span-3">
                    <Card
                        className="h-full bg-dark-900"
                        header={
                            <CardHeader className="flex flex-col items-center bg-dark-800">
                                <div className="flex justify-between w-full">
                                    <div className="items-center hidden md:flex">
                                        <div className="mr-2 text-lg whitespace-nowrap">{i18n._(t`Yield Farms`)}</div>
                                    </div>
                                    <Search search={search} term={term} />
                                </div>
                                <div className="container block pt-6 lg:hidden">
                                    <Menu section={section} setSection={setSection} />
                                </div>
                                {chainId === ChainId.MATIC && (
                                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-4">
                                        <div className="flex">
                                            <div className="ml-3">
                                                <p className="text-sm text-yellow-700">
                                                    Polygon subgraphs are currently experiencing high loads. The APY
                                                    displayed are based on lagging fees. Funds are safe, we are working
                                                    on resolving and providing accurate consolidated APY information.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </CardHeader>
                        }
                    >
                        {section && section === 'portfolio' && (
                            <>
                                {account ? (
                                    <>
                                        <Header sortConfig={sortConfig} requestSort={requestSort} />
                                        <div className="flex-col space-y-2">
                                            {portfolio && portfolio.length > 0 ? (
                                                portfolio.map((farm: any, i: number) => {
                                                    console.log('portfolio farm:', farm, portfolio)
                                                    if (farm.type === 'KMP') {
                                                        return <KashiLending key={farm.address + '_' + i} farm={farm} />
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
                                                        <div className="w-full py-6 text-center">No Results.</div>
                                                    ) : (
                                                        <div className="w-full py-6 text-center">
                                                            <Dots>Fetching Portfolio</Dots>
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </>
                                ) : (
                                    <div className="w-full py-6 text-center">Connect Wallet.</div>
                                )}
                            </>
                        )}
                        {section && section === 'all' && (
                            <>
                                <Header sortConfig={sortConfig} requestSort={requestSort} />
                                <div className="flex-col space-y-2">
                                    {items && items.length > 0 ? (
                                        items.map((farm: any, i: number) => {
                                            if (farm.type === 'KMP') {
                                                return <KashiLending key={farm.address + '_' + i} farm={farm} />
                                            } else if (farm.type === 'SLP') {
                                                return <LiquidityPosition key={farm.address + '_' + i} farm={farm} />
                                            } else {
                                                return null
                                            }
                                        })
                                    ) : (
                                        <>
                                            {term ? (
                                                <div className="w-full py-6 text-center">No Results.</div>
                                            ) : (
                                                <div className="w-full py-6 text-center">
                                                    <Dots>Fetching Farms</Dots>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            </>
                        )}
                        {section && section === 'slp' && (
                            <>
                                <Header sortConfig={sortConfig} requestSort={requestSort} />
                                <div className="flex-col space-y-2">
                                    {items && items.length > 0 ? (
                                        items.map((farm: any, i: number) => {
                                            if (farm.type === 'SLP') {
                                                return <LiquidityPosition key={farm.address + '_' + i} farm={farm} />
                                            } else {
                                                return null
                                            }
                                        })
                                    ) : (
                                        <>
                                            {term ? (
                                                <div className="w-full py-6 text-center">No Results.</div>
                                            ) : (
                                                <div className="w-full py-6 text-center">
                                                    <Dots>Fetching Farms</Dots>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            </>
                        )}
                        {section && section === 'kmp' && (
                            <>
                                <Header sortConfig={sortConfig} requestSort={requestSort} />
                                <div className="flex-col space-y-2">
                                    {items && items.length > 0 ? (
                                        items.map((farm: any, i: number) => {
                                            if (farm.type === 'KMP') {
                                                return <KashiLending key={farm.address + '_' + i} farm={farm} />
                                            } else {
                                                return null
                                            }
                                        })
                                    ) : (
                                        <>
                                            {term ? (
                                                <div className="w-full py-6 text-center">No Results.</div>
                                            ) : (
                                                <div className="w-full py-6 text-center">
                                                    <Dots>Fetching Farms</Dots>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            </>
                        )}
                        {section && section === 'mcv2' && (
                            <>
                                <Header sortConfig={sortConfig} requestSort={requestSort} />
                                <div className="flex-col space-y-2">
                                    {items && items.length > 0 ? (
                                        items.map((farm: any, i: number) => {
                                            if (farm.type === 'SLP' && farm.contract === 'masterchefv2') {
                                                return <LiquidityPosition key={farm.address + '_' + i} farm={farm} />
                                            } else {
                                                return null
                                            }
                                        })
                                    ) : (
                                        <>
                                            {term ? (
                                                <div className="w-full py-6 text-center">No Results.</div>
                                            ) : (
                                                <div className="w-full py-6 text-center">
                                                    <Dots>Fetching Farms</Dots>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            </>
                        )}
                    </Card>
                </div>
            </div>
        </>
    )
}
