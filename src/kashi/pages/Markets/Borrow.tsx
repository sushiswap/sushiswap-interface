import BorrowGraphic from 'assets/kashi/borrow-graphic.png'
import { useActiveWeb3React, useFuse, useSortableData } from 'hooks'
import { getCurrency } from 'kashi/constants'
import React from 'react'
import { ChevronDown, ChevronUp } from 'react-feather'
import { Link } from 'react-router-dom'
import { getTokenIcon, ZERO } from '../../functions'
import { formattedNum, formattedPercent } from '../../../utils'
import { useKashiPairs } from '../../context'
import { Card, MarketHeader, Layout, GradientDot } from '../../components'
import useSearchAndSort from 'sushi-hooks/useSearchAndSort'
import ListHeaderWithSort from 'kashi/components/ListHeaderWithSort'
import Helmet from 'react-helmet'

export default function BorrowMarkets(): JSX.Element {
    const { chainId } = useActiveWeb3React()
    const fullPairs = useKashiPairs()

    const netWorth: string = fullPairs.reduce((a, b) => a.add(b.netWorth), ZERO).toFixed(getCurrency(chainId).decimals)

    const positions = useSearchAndSort(
        fullPairs.filter((pair: any) => pair.userCollateralShare.gt(0) || pair.userBorrowPart.gt(0)),
        { keys: ['search'], threshold: 0.1 },
        { key: 'health.value', direction: 'descending' }
    )

    const pairs = useSearchAndSort(
        fullPairs,
        { keys: ['search'], threshold: 0.1 },
        { key: 'totalAssetAmount.usdValue', direction: 'descending' }
    )

    return (
        <Layout
            netWorth={netWorth}
            left={
                <Card
                    className="h-full bg-dark-900"
                    backgroundImage={BorrowGraphic}
                    title={'Borrow assets and leverage up'}
                    description={
                        'Borrowing allows you to obtain liquidity without selling. Your borrow limit depends on the amount of deposited collateral. You will be able to borrow up to 75% of your collateral and repay at any time with accrued interest.'
                    }
                />
            }
        >
            <Helmet>
                <title>Borrow | Sushi</title>
            </Helmet>
            <Card className="h-full bg-dark-900" header={<MarketHeader type="Borrow" lists={[pairs, positions]} />}>
                {positions.items && positions.items.length > 0 && (
                    <div className="pb-4">
                        <div>
                            <div className="grid gap-4 grid-cols-4 md:grid-cols-6 lg:grid-cols-7 pb-4 px-4 text-sm text-secondary">
                                <ListHeaderWithSort
                                    className="col-span-1 md:col-span-2 lg:col-span-3"
                                    sort={positions}
                                    sortKey="search"
                                >
                                    <span className="hidden md:inline-block">Your</span> Positions
                                </ListHeaderWithSort>
                                <ListHeaderWithSort
                                    className="justify-end"
                                    sort={positions}
                                    sortKey="currentUserBorrowAmount.usdValue"
                                    direction="descending"
                                >
                                    Borrowed
                                </ListHeaderWithSort>
                                <ListHeaderWithSort
                                    className="hidden md:flex justify-end"
                                    sort={positions}
                                    sortKey="userCollateralAmount.usdValue"
                                    direction="descending"
                                >
                                    Collateral
                                </ListHeaderWithSort>
                                <ListHeaderWithSort
                                    className="hidden lg:flex justify-end"
                                    sort={positions}
                                    sortKey="health.value"
                                    direction="descending"
                                >
                                    Limit <span className="hidden md:inline-block">Used</span>
                                </ListHeaderWithSort>
                                <ListHeaderWithSort
                                    className="justify-end"
                                    sort={positions}
                                    sortKey="interestPerYear.value"
                                    direction="descending"
                                >
                                    APR
                                </ListHeaderWithSort>
                            </div>
                            <div className="flex-col space-y-2">
                                {positions.items.map((pair: any) => {
                                    return (
                                        <div key={pair.address}>
                                            <Link
                                                to={'/bento/kashi/borrow/' + pair.address}
                                                className="block text-high-emphesis"
                                            >
                                                <div className="grid gap-4 grid-cols-4 md:grid-cols-6 lg:grid-cols-7 py-4 px-4 items-center align-center  text-sm  rounded bg-dark-800 hover:bg-dark-pink">
                                                    <div className="hidden space-x-2 md:flex">
                                                        <img
                                                            src={getTokenIcon(pair.asset.address, chainId)}
                                                            className="block w-5 h-5 md:w-10 md:h-10 lg:w-12 lg:h-12 rounded-lg"
                                                            alt=""
                                                        />
                                                        <img
                                                            src={getTokenIcon(pair.collateral.address, chainId)}
                                                            className="block w-5 h-5 md:w-10 md:h-10 lg:w-12 lg:h-12 rounded-lg"
                                                            alt=""
                                                        />
                                                    </div>
                                                    <div className="sm:block md:col-span-1 lg:col-span-2">
                                                        <div>
                                                            <strong>{pair.asset.symbol}</strong> /{' '}
                                                            {pair.collateral.symbol}
                                                        </div>
                                                        <div>{pair.oracle.name}</div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div>
                                                            {formattedNum(pair.currentUserBorrowAmount.string, false)}{' '}
                                                            {pair.asset.symbol}
                                                        </div>
                                                        <div className="text-secondary text-sm">
                                                            {formattedNum(pair.currentUserBorrowAmount.usd, true)}
                                                        </div>
                                                    </div>
                                                    <div className="hidden md:block text-right">
                                                        <div>
                                                            {formattedNum(pair.userCollateralAmount.string, false)}{' '}
                                                            {pair.collateral.symbol}
                                                        </div>
                                                        <div className="text-secondary text-sm">
                                                            {formattedNum(pair.userCollateralAmount.usd, true)}
                                                        </div>
                                                    </div>
                                                    <div className="flex justify-end items-center">
                                                        {formattedPercent(pair.health.string)}
                                                        <GradientDot percent={pair.health.string} />
                                                    </div>
                                                    <div className="text-right">
                                                        {formattedPercent(pair.interestPerYear.string)}
                                                    </div>
                                                </div>
                                            </Link>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                )}

                <div className="grid gap-4 grid-flow-col grid-cols-4 md:grid-cols-6 lg:grid-cols-7 pb-4 px-4 text-sm  text-secondary">
                    <ListHeaderWithSort sort={pairs} sortKey="search">
                        Markets
                    </ListHeaderWithSort>
                    <ListHeaderWithSort className="hidden md:flex" sort={pairs} sortKey="asset.symbol">
                        Borrow
                    </ListHeaderWithSort>
                    <ListHeaderWithSort className="hidden md:flex" sort={pairs} sortKey="collateral.symbol">
                        Collateral
                    </ListHeaderWithSort>
                    <ListHeaderWithSort className="hidden lg:flex" sort={pairs} sortKey="oracle.name">
                        Oracle
                    </ListHeaderWithSort>
                    <ListHeaderWithSort
                        className="justify-end"
                        sort={pairs}
                        sortKey="currentBorrowAmount.usdValue"
                        direction="descending"
                    >
                        Borrowed
                    </ListHeaderWithSort>
                    <ListHeaderWithSort
                        className="justify-end"
                        sort={pairs}
                        sortKey="totalAssetAmount.usdValue"
                        direction="descending"
                    >
                        Available
                    </ListHeaderWithSort>
                    <ListHeaderWithSort
                        className="justify-end"
                        sort={pairs}
                        sortKey="currentInterestPerYear.value"
                        direction="descending"
                    >
                        APR
                    </ListHeaderWithSort>
                </div>
                <div className="flex-col space-y-2">
                    {pairs.items &&
                        pairs.items.map(pair => {
                            return (
                                <div key={pair.address}>
                                    <Link
                                        to={'/bento/kashi/borrow/' + String(pair.address).toLowerCase()}
                                        className="block text-high-emphesis"
                                    >
                                        <div className="grid gap-4 grid-cols-4 md:grid-cols-6 lg:grid-cols-7 py-4 px-4 items-center align-center text-sm  rounded bg-dark-800 hover:bg-dark-pink">
                                            <div className="flex flex-col sm:flex-row items-start sm:items-center">
                                                <div className="hidden space-x-2 md:flex">
                                                    <img
                                                        src={getTokenIcon(pair.asset.address, chainId)}
                                                        className="block w-5 h-5 md:w-10 md:h-10 lg:w-12 lg:h-12 rounded-lg"
                                                        alt=""
                                                    />
                                                    <img
                                                        src={getTokenIcon(pair.collateral.address, chainId)}
                                                        className="block w-5 h-5 md:w-10 md:h-10 lg:w-12 lg:h-12 rounded-lg"
                                                        alt=""
                                                    />
                                                </div>
                                                <div className="sm:items-end md:hidden">
                                                    <div className="flex flex-col md:flex-row">
                                                        <div className="font-semibold">{pair.asset.symbol} / </div>
                                                        <div>{pair.collateral.symbol}</div>
                                                    </div>
                                                    <div className="mt-0 text-left text-white-500 text-xs block lg:hidden">
                                                        {pair.oracle.name}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-white hidden md:block">
                                                <strong>{pair.asset.symbol}</strong>
                                            </div>
                                            <div className="hidden md:block">{pair.collateral.symbol}</div>
                                            <div className="hidden lg:block">{pair.oracle.name}</div>
                                            <div className="text-left md:text-right">
                                                <div className="md:hidden">
                                                    <div className="flex flex-col">
                                                        <div>{formattedNum(pair.currentBorrowAmount.string)}</div>
                                                        <div>{pair.asset.symbol}</div>
                                                    </div>
                                                    <div className="text-secondary">
                                                        {formattedNum(pair.currentBorrowAmount.usd, true)}
                                                    </div>
                                                </div>
                                                <div className="hidden md:block">
                                                    {formattedNum(pair.currentBorrowAmount.string)} {pair.asset.symbol}
                                                    <div className="text-secondary">
                                                        {formattedNum(pair.currentBorrowAmount.usd, true)}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="md:hidden">
                                                    <div className="flex flex-col">
                                                        <div>{formattedNum(pair.totalAssetAmount.string)}</div>
                                                        <div>{pair.asset.symbol}</div>
                                                    </div>
                                                    <div className="text-secondary">
                                                        {formattedNum(pair.totalAssetAmount.usd, true)}
                                                    </div>
                                                </div>
                                                <div className="hidden md:block">
                                                    {formattedNum(pair.totalAssetAmount.string)} {pair.asset.symbol}
                                                    <div className="text-secondary">
                                                        {formattedNum(pair.totalAssetAmount.usd, true)}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                {formattedPercent(pair.currentInterestPerYear.string)}
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            )
                        })}
                </div>
            </Card>
        </Layout>
    )
}
