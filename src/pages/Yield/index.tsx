import { useFuse, useSortableData } from 'hooks'
import React, { useState } from 'react'
import { ChevronDown, ChevronUp } from 'react-feather'
import styled from 'styled-components'
import useFarms from 'hooks/useFarms'
import { RowBetween } from '../../components/Row'
import { formattedNum, formattedPercent } from '../../utils'
import { Card, CardHeader, Paper, Search, DoubleLogo, TokenLogo } from './components'
import InputGroup from './InputGroup'
import { Dots } from 'kashi/components'
import { Helmet } from 'react-helmet'

export const FixedHeightRow = styled(RowBetween)`
    height: 24px;
`

export default function Yield(): JSX.Element {
    const query = useFarms()
    const farms = query?.farms
    const userFarms = query?.userFarms

    // Search Setup
    const options = { keys: ['symbol', 'name', 'pairAddress'], threshold: 0.4 }
    const { result, search, term } = useFuse({
        data: farms && farms.length > 0 ? farms : [],
        options
    })
    const flattenSearchResults = result.map((a: { item: any }) => (a.item ? a.item : a))
    // Sorting Setup
    const { items, requestSort, sortConfig } = useSortableData(flattenSearchResults)

    return (
        <div className="container max-w-2xl mx-auto px-0 sm:px-4">
            <Helmet>
                <title>Yield | Sushi</title>
            </Helmet>
            <Card
                className="h-full bg-dark-900"
                header={
                    <CardHeader className="flex justify-between items-center bg-dark-800">
                        <div className="flex w-full justify-between">
                            <div className="hidden md:flex items-center">
                                {/* <BackButton defaultRoute="/pool" /> */}
                                <div className="text-lg mr-2 whitespace-nowrap">Yield Instruments</div>
                            </div>
                            <Search search={search} term={term} />
                        </div>
                    </CardHeader>
                }
            >
                {/* UserFarms */}
                {userFarms && userFarms.length > 0 && (
                    <>
                        <div className="pb-4">
                            <div className="grid grid-cols-3 pb-4 px-4 text-sm  text-secondary">
                                <div className="flex items-center">
                                    <div>Your Yields</div>
                                </div>
                                <div className="flex items-center justify-end">
                                    <div>Deposited</div>
                                </div>
                                <div className="flex items-center justify-end">
                                    <div>Claim</div>
                                </div>
                            </div>
                            <div className="flex-col space-y-2">
                                {userFarms.map((farm: any, i: number) => {
                                    return <UserBalance key={farm.address + '_' + i} farm={farm} />
                                })}
                            </div>
                        </div>
                    </>
                )}
                {/* All Farms */}
                <div className="grid grid-cols-3 pb-4 px-4 text-sm  text-secondary">
                    <div
                        className="flex items-center cursor-pointer hover:text-secondary"
                        onClick={() => requestSort('symbol')}
                    >
                        <div>Instruments</div>
                        {sortConfig &&
                            sortConfig.key === 'symbol' &&
                            ((sortConfig.direction === 'ascending' && <ChevronUp size={12} />) ||
                                (sortConfig.direction === 'descending' && <ChevronDown size={12} />))}
                    </div>
                    <div className="hover:text-secondary cursor-pointer" onClick={() => requestSort('tvl')}>
                        <div className="flex items-center justify-end">
                            <div>TVL</div>
                            {sortConfig &&
                                sortConfig.key === 'tvl' &&
                                ((sortConfig.direction === 'ascending' && <ChevronUp size={12} />) ||
                                    (sortConfig.direction === 'descending' && <ChevronDown size={12} />))}
                        </div>
                    </div>
                    <div className="hover:text-secondary cursor-pointer" onClick={() => requestSort('roiPerYear')}>
                        <div className="flex items-center justify-end">
                            <div>APR</div>
                            {sortConfig &&
                                sortConfig.key === 'roiPerYear' &&
                                ((sortConfig.direction === 'ascending' && <ChevronUp size={12} />) ||
                                    (sortConfig.direction === 'descending' && <ChevronDown size={12} />))}
                        </div>
                    </div>
                </div>
                <div className="flex-col space-y-2">
                    {items && items.length > 0 ? (
                        items.map((farm: any, i: number) => {
                            return <TokenBalance key={farm.address + '_' + i} farm={farm} />
                        })
                    ) : (
                        <>
                            {term ? (
                                <div className="w-full text-center py-6">No Results.</div>
                            ) : (
                                <div className="w-full text-center py-6">
                                    <Dots>Fetching Instruments</Dots>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </Card>
        </div>
    )
}

const TokenBalance = ({ farm }: any) => {
    const [expand, setExpand] = useState<boolean>(false)
    return (
        <>
            {farm.type === 'SLP' && (
                <Paper className="bg-dark-800">
                    <div
                        className="grid grid-cols-3 py-4 px-4 cursor-pointer select-none rounded text-sm"
                        onClick={() => setExpand(!expand)}
                    >
                        <div className="flex items-center">
                            <div className="mr-4">
                                <DoubleLogo
                                    a0={farm.liquidityPair.token0.id}
                                    a1={farm.liquidityPair.token1.id}
                                    size={32}
                                    margin={true}
                                />
                            </div>
                            <div className="hidden sm:block">
                                {farm && farm.liquidityPair.token0.symbol + '-' + farm.liquidityPair.token1.symbol}
                            </div>
                        </div>
                        <div className="flex justify-end items-center">
                            <div>
                                <div className="text-right">{formattedNum(farm.tvl, true)} </div>
                                <div className="text-secondary text-right">
                                    {formattedNum(farm.slpBalance / 1e18, false)} SLP
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end items-center">
                            <div className="text-right font-semibold text-xl">
                                {formattedPercent(farm.roiPerYear * 100)}{' '}
                            </div>
                        </div>
                    </div>
                    {expand && (
                        <InputGroup
                            pid={farm.pid}
                            pairAddress={farm.pairAddress}
                            pairSymbol={farm.symbol}
                            token0Address={farm.liquidityPair.token0.id}
                            token1Address={farm.liquidityPair.token1.id}
                            type={'LP'}
                        />
                    )}
                </Paper>
            )}
            {farm.type === 'KMP' && (
                <Paper className="bg-dark-800">
                    <div
                        className="grid grid-cols-3 py-4 px-4 cursor-pointer select-none rounded text-sm"
                        onClick={() => setExpand(!expand)}
                    >
                        <div className="flex items-center">
                            <div className="mr-4">
                                <DoubleLogo
                                    a0={'kashiLogo'}
                                    a1={farm.liquidityPair.asset.id}
                                    size={32}
                                    margin={true}
                                    higherRadius={'0px'}
                                />
                            </div>
                            <div className="hidden sm:block">{farm && farm.symbol}</div>
                        </div>
                        <div className="flex justify-end items-center">
                            <div>
                                <div className="text-right">{formattedNum(farm.tvl, true)} </div>
                                <div className="text-secondary text-right">
                                    {formattedNum(farm.totalAssetStaked, false)} KMP
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end items-center">
                            <div className="text-right font-semibold text-xl">
                                {formattedPercent(farm.roiPerYear * 100)}{' '}
                            </div>
                        </div>
                    </div>
                    {expand && (
                        <InputGroup
                            pid={farm.pid}
                            pairAddress={farm.pairAddress}
                            pairSymbol={farm.symbol}
                            token0Address={farm.liquidityPair.collateral.id}
                            token1Address={farm.liquidityPair.asset.id}
                            type={'KMP'}
                            assetSymbol={farm.liquidityPair.asset.symbol}
                            assetDecimals={farm.liquidityPair.asset.decimals}
                        />
                    )}
                </Paper>
            )}
        </>
    )
}

const UserBalance = ({ farm }: any) => {
    const [expand, setExpand] = useState<boolean>(false)
    return (
        <>
            {farm.type === 'SLP' && (
                <Paper className="bg-dark-800">
                    <div
                        className="grid grid-cols-3 py-4 px-4 cursor-pointer select-none rounded text-sm"
                        onClick={() => setExpand(!expand)}
                    >
                        <div className="flex items-center">
                            <div className="mr-4">
                                <DoubleLogo
                                    a0={farm.liquidityPair.token0.id}
                                    a1={farm.liquidityPair.token1.id}
                                    size={26}
                                    margin={true}
                                />
                            </div>
                            <div className="hidden sm:block">
                                {farm && farm.liquidityPair.token0.symbol + '-' + farm.liquidityPair.token1.symbol}
                            </div>
                        </div>
                        <div className="flex justify-end items-center">
                            <div>
                                <div className="text-right">{formattedNum(farm.depositedUSD, true)} </div>
                                <div className="text-secondary text-right">
                                    {formattedNum(farm.depositedLP, false)} SLP
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end items-center">
                            <div>
                                <div className="text-right">{formattedNum(farm.pendingSushi)} </div>
                                <div className="text-secondary text-right">SUSHI</div>
                            </div>
                        </div>
                    </div>
                    {expand && (
                        <InputGroup
                            pid={farm.pid}
                            pairAddress={farm.pairAddress}
                            pairSymbol={farm.symbol}
                            token0Address={farm.liquidityPair.token0.id}
                            token1Address={farm.liquidityPair.token1.id}
                            type={'LP'}
                        />
                    )}
                </Paper>
            )}
            {farm.type === 'KMP' && (
                <Paper className="bg-dark-800">
                    <div
                        className="grid grid-cols-3 py-4 px-4 cursor-pointer select-none rounded text-sm"
                        onClick={() => setExpand(!expand)}
                    >
                        <div className="flex items-center">
                            <div className="mr-4">
                                <DoubleLogo
                                    a0={'kashiLogo'}
                                    a1={farm.liquidityPair.asset.id}
                                    size={32}
                                    margin={true}
                                    higherRadius={'0px'}
                                />
                            </div>
                            <div className="hidden sm:block">{farm && farm.symbol}</div>
                        </div>
                        <div className="flex justify-end items-center">
                            <div>
                                <div className="text-right">{formattedNum(farm.depositedUSD, true)} </div>
                                <div className="text-secondary text-right">
                                    {formattedNum(farm.depositedLP, false)} KMP
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end items-center">
                            <div>
                                <div className="text-right">{formattedNum(farm.pendingSushi)} </div>
                                <div className="text-secondary text-right">SUSHI</div>
                            </div>
                        </div>
                    </div>
                    {expand && (
                        <InputGroup
                            pid={farm.pid}
                            pairAddress={farm.pairAddress}
                            pairSymbol={farm.symbol}
                            token0Address={farm.liquidityPair.collateral.id}
                            token1Address={farm.liquidityPair.asset.id}
                            type={'KMP'}
                            assetSymbol={farm.liquidityPair.asset.symbol}
                            assetDecimals={farm.liquidityPair.asset.decimals}
                        />
                    )}
                </Paper>
            )}
        </>
    )
}
