import React, { useContext, useState } from 'react'
import Router from 'next/router'
import { ChevronDown, ChevronUp } from 'react-feather'
import styled, { ThemeContext } from 'styled-components'
import { Text } from 'rebass'
import Head from 'next/head'

import { useFuse, useSortableData } from '../../hooks'
import useFarms from '../../hooks/useFarms'
import Dots from '../../components/Dots'
import Paper from '../../components/Paper'
import { formattedNum, formattedPercent } from '../../utils'
import { RowBetween, RowFixed } from '../../components/Row'
import Button from '../../components/Button'
import { AutoColumn } from '../../components/Column'
import Card from '../../components/Card'
import CardHeader from '../../components/CardHeader'
import Search from '../../components/Search'
import DoubleLogo from '../../components/DoubleLogo'
import DoubleCurrencyLogo from '../../components/DoubleLogo'
import { useCurrency } from '../../hooks/Tokens'

const PageWrapper = styled(AutoColumn)`
    max-width: 640px;
    width: 100%;
`

const FixedHeightRow = styled(RowBetween)`
    height: 24px;
`

const TokenBalance = ({ farm }: any) => {
    return (
        <>
            {farm.type === 'SLP' && (
                <Paper className="bg-dark-800">
                    <div
                        className="grid grid-cols-3 py-4 px-4 cursor-pointer select-none rounded text-sm"
                        onClick={() => Router.push(`zap?poolAddress=${farm.pairAddress}&currencyId=ETH`)}
                    >
                        <div className="flex items-center">
                            <div className="mr-4">
                                <DoubleLogo
                                    currency0={useCurrency(farm.liquidityPair.token0.id)}
                                    currency1={useCurrency(farm.liquidityPair.token1.id)}
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
                </Paper>
            )}
        </>
    )
}

const PoolList = () => {
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
    const { items, requestSort, sortConfig } = useSortableData(flattenSearchResults, {
        key: 'tvl',
        direction: 'descending'
    })

    return (
        <>
            <Head>
                <title>Zap | Sushi</title>
                <meta name="description" content="Farm SUSHI by staking LP (Liquidity Provider) tokens" />
            </Head>
            <div className="container max-w-2xl mx-auto px-0 sm:px-4">
                <Card
                    className="h-full bg-dark-900 rounded"
                    header={
                        <CardHeader className="flex justify-between items-center bg-dark-800">
                            <div className="flex w-full justify-between flex-col items-center">
                                <div className="hidden md:flex items-center">
                                    {/* <BackButton defaultRoute="/pool" /> */}
                                    <div className="text-lg mr-2 mb-2 whitespace-nowrap">Select a Pool to Zap Into</div>
                                </div>
                                <Search search={search} term={term} />
                            </div>
                        </CardHeader>
                    }
                >
                    {/* All Farms */}
                    <div className="grid grid-cols-3 pb-4 px-4 text-sm  text-secondary">
                        <div
                            className="flex items-center cursor-pointer hover:text-secondary"
                            onClick={() => requestSort('symbol')}
                        >
                            <div>Pool</div>
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
                                        <Dots>Fetching Pools</Dots>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </Card>
            </div>
        </>
    )
}

export default PoolList