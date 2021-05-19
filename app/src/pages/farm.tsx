import React, { useState } from 'react'

import Button from '../components/Button'
import Head from 'next/head'
import Layout from '../components/Layout'
import OnsenCategory from '../components/Onsen/OnsenCategory'
import OnsenJumbotron from '../components/Onsen/OnsenJumbotron'
import OnsenTable from '../components/Onsen/OnsenTable'
import Search from '../components/Search'
import useFuse from '../hooks/useFuse'

export type Farm = {
    symbol: string
    address: string
    type: string
    token0: string
    token1: string
    liquidity: number
    liquidityChange: number
    volume: number
    volumeChange: number
    fees: number
    apr: number
    earnings?: number
}

export enum ONSEN_CATEGORY {
    ALL,
    KASHI,
    NFT_INDEX,
    BLUE_CHIP,
    NEWLY_ADDED,
    TOP_MOVER,
    STABLE_COIN
}

export enum ONSEN_VIEWS {
    ALL_POOLS,
    USER_POOLS
}

const mockUserFarms: Farm[] = [
    {
        symbol: 'kmUNI/SUSHI-LINK',
        address: '',
        type: 'KMP',
        token0: 'kashiLogo',
        token1: '0x6B3595068778DD592e39A122f4f5a5cF09C90fE2',
        liquidity: 2350000000,
        liquidityChange: 6.84,
        volume: 118687,
        volumeChange: 154,
        fees: 34567,
        apr: 35.6,
        earnings: 875.44
    },
    {
        symbol: 'SUSHI-WETH',
        address: '',
        type: 'SLP',
        token0: '0x6B3595068778DD592e39A122f4f5a5cF09C90fE2',
        token1: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
        liquidity: 514750000,
        liquidityChange: 4.56,
        volume: 120456,
        volumeChange: 12.4,
        fees: 186606,
        apr: 13.8,
        earnings: 344.23
    }
]

const mockAllFarms: Farm[] = [
    ...mockUserFarms,
    {
        symbol: 'WBTC-BADGER',
        address: '',
        type: 'SLP',
        token0: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
        token1: '0x3472A5A71965499acd81997a54BBA8D852C6E53d',
        liquidity: 1134000000,
        liquidityChange: -1.32,
        volume: 99765,
        volumeChange: 99.7,
        fees: 55678,
        apr: 24.56
    },
    {
        symbol: 'COMP-WETH',
        address: '',
        type: 'SLP',
        token0: '0xc00e94Cb662C3520282E6f5717214004A7f26888',
        token1: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
        liquidity: 1984000000,
        liquidityChange: 10.55,
        volume: 224567,
        volumeChange: -14.6,
        fees: 35987,
        apr: 13.8
    }
]

export default function Farm() {
    const [onsenView, setOnsenView] = useState(ONSEN_VIEWS.ALL_POOLS)
    const [onsenCategory, setOnsenCategory] = useState(ONSEN_CATEGORY.KASHI)

    const allFarms: Farm[] = mockAllFarms
    const userFarms: Farm[] = mockUserFarms
    const farms = onsenView === ONSEN_VIEWS.ALL_POOLS ? allFarms : userFarms

    // Search Setup
    const options = { keys: ['symbol', 'name', 'address'], threshold: 0.4 }
    const { result, search, term } = useFuse({
        data: farms && farms.length > 0 ? farms : [],
        options
    })
    const searchedFarms = result.map((a: { item: any }) => (a.item ? a.item : a))
    return (
        <Layout>
            <Head>
                <title>Farm | Sushi</title>
                <meta name="description" content="Farm SUSHI with Liquidity Mining Pools and the Sushi Bar." />
            </Head>
            <div className="xl:px-28 container">
                <OnsenJumbotron onsenView={onsenView} />

                <div>
                    <div className="overflow-x-auto -ml-5">
                        <div className="mt-6 flex justify-between">
                            <div className="flex-auto" onClick={() => setOnsenCategory(ONSEN_CATEGORY.KASHI)}>
                                <OnsenCategory
                                    name="Kashi KMP Farms"
                                    tokenAddress="kashiLogo"
                                    count={18}
                                    isNew={true}
                                    isActive={onsenCategory === ONSEN_CATEGORY.KASHI}
                                />
                            </div>
                            <div className="flex-auto" onClick={() => setOnsenCategory(ONSEN_CATEGORY.NFT_INDEX)}>
                                <OnsenCategory
                                    name="NFT Index Farms"
                                    tokenAddress="0x87d73E916D7057945c9BcD8cdd94e42A6F47f776"
                                    count={9}
                                    isNew={true}
                                    isActive={onsenCategory === ONSEN_CATEGORY.NFT_INDEX}
                                />
                            </div>
                            <div className="flex-auto" onClick={() => setOnsenCategory(ONSEN_CATEGORY.BLUE_CHIP)}>
                                <OnsenCategory
                                    name="DeFi Blue Chips"
                                    tokenAddress="0x0bc529c00C6401aEF6D220BE8C6Ea1667F6Ad93e"
                                    count={18}
                                    isActive={onsenCategory === ONSEN_CATEGORY.BLUE_CHIP}
                                />
                            </div>
                            <div className="flex-auto" onClick={() => setOnsenCategory(ONSEN_CATEGORY.NEWLY_ADDED)}>
                                <OnsenCategory
                                    name="Newly Added"
                                    tokenAddress="0x1b40183EFB4Dd766f11bDa7A7c3AD8982e998421"
                                    count={15}
                                    isActive={onsenCategory === ONSEN_CATEGORY.NEWLY_ADDED}
                                />
                            </div>
                            <div className="flex-auto" onClick={() => setOnsenCategory(ONSEN_CATEGORY.TOP_MOVER)}>
                                <OnsenCategory
                                    name="Top Movers"
                                    tokenAddress="0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
                                    count={15}
                                    isActive={onsenCategory === ONSEN_CATEGORY.TOP_MOVER}
                                />
                            </div>
                            <div className="flex-auto" onClick={() => setOnsenCategory(ONSEN_CATEGORY.STABLE_COIN)}>
                                <OnsenCategory
                                    name="Stable Coins"
                                    tokenAddress="0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
                                    count={24}
                                    isActive={onsenCategory === ONSEN_CATEGORY.STABLE_COIN}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-row flex-nowrap sm:space-x-5 pt-6 bp-4">
                        <Button
                            className="w-max min-w-max h-full"
                            color={onsenView === ONSEN_VIEWS.ALL_POOLS ? 'gradient' : 'gray'}
                            onClick={() => {
                                setOnsenView(ONSEN_VIEWS.ALL_POOLS)
                            }}
                        >
                            Pool List
                        </Button>
                        <Button
                            className="w-max min-w-max h-full"
                            color={onsenView === ONSEN_VIEWS.USER_POOLS ? 'gradient' : 'gray'}
                            onClick={() => {
                                setOnsenView(ONSEN_VIEWS.USER_POOLS)
                            }}
                        >
                            My Positions
                        </Button>
                        <Search search={search} term={term} />
                    </div>
                </div>

                <OnsenTable farms={searchedFarms} onsenView={onsenView} />
            </div>
        </Layout>
    )
}
