import React from 'react'
import { Link } from 'react-router-dom'
import QuestionHelper from '../../../../components/QuestionHelper'
import { getTokenIcon, ZERO } from '../../../functions'
import { formattedPercent, formattedNum } from '../../../../utils'
import { useKashiPairs } from '../../../context'
import { Card, MarketHeader, Layout } from '../../../components'
import DepositGraphic from 'assets/kashi/deposit-graphic.png'
import useFuse from 'sushi-hooks/useFuse'
import useSortableData from 'sushi-hooks/useSortableData'
import { ChevronUp, ChevronDown } from 'react-feather'
import Positions from './Positions'
import { useActiveWeb3React } from 'hooks'
import { getCurrency } from 'kashi/constants'
import ListHeaderWithSort from 'kashi/components/ListHeaderWithSort'

export default function LendingMarkets(): JSX.Element | null {
    const { chainId } = useActiveWeb3React()
    const pairs = useKashiPairs()

    const { result, search, term } = useFuse({
        data: pairs && pairs.length > 0 ? pairs : [],
        options: { keys: ['search'], threshold: 0.1 }
    })

    const { items, requestSort, sortConfig } = useSortableData(result.map((a: { item: any }) => (a.item ? a.item : a)))

    const positions = pairs.filter(function(pair: any) {
        return pair.userAssetFraction.gt(0)
    })

    const netWorth: string = pairs.reduce((a, b) => a.add(b.netWorth), ZERO).toFixed(getCurrency(chainId).decimals)

    return (
        <Layout
            netWorth={netWorth}
            left={
                <Card
                    className="h-full bg-dark-900"
                    backgroundImage={DepositGraphic}
                    title={'Lend your assets, earn yield with no impermanent loss'}
                    description={
                        'Isolated lending markets mitigate your risks as an asset lender. Know exactly what collateral is available to you in the event of counter party insolvency.'
                    }
                />
            }
        >
            <Card
                className="bg-dark-900"
                header={<MarketHeader type="Lending" pairs={pairs} search={search} term={term} />}
            >
                {positions && positions.length > 0 && (
                    <div className="pb-4">
                        <Positions pairs={positions} />
                    </div>
                )}
                <div>
                    <div className="grid gap-4 grid-flow-col grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7 pb-4 px-4 text-sm  text-secondary">
                        <ListHeaderWithSort className="" onSort={() => requestSort('search')} headerKey={"search"} sortConfig={sortConfig}>Markets</ListHeaderWithSort>
                        <ListHeaderWithSort className="hidden md:flex" onSort={() => requestSort('asset.symbol')} headerKey={"asset.symbol"} sortConfig={sortConfig}>Lending</ListHeaderWithSort>
                        <ListHeaderWithSort className="hidden md:flex" onSort={() => requestSort('collateral.symbol')} headerKey={"collateral.symbol"} sortConfig={sortConfig}>Collateral</ListHeaderWithSort>
                        <ListHeaderWithSort className="hidden lg:flex" onSort={() => requestSort('oracle.name')} headerKey={"oracle.name"} sortConfig={sortConfig}>
                            Oracle{' '}
                            <QuestionHelper text="The onchain oracle that tracks the pricing for this pair" />                            
                        </ListHeaderWithSort>
                        <ListHeaderWithSort className="justify-end" onSort={() => requestSort('currentSupplyAPR.value', 'descending')} headerKey={"currentSupplyAPR.value"} sortConfig={sortConfig}>APR</ListHeaderWithSort>
                        <ListHeaderWithSort className="hidden sm:flex justify-end" onSort={() => requestSort('utilization.value', 'descending')} headerKey={"utilization.value"} sortConfig={sortConfig}>Borrowed</ListHeaderWithSort>
                        <ListHeaderWithSort className="justify-end" onSort={() => requestSort('currentAllAssets.usdValue', 'descending')} headerKey={"currentAllAssets.usdValue"} sortConfig={sortConfig}>Total</ListHeaderWithSort>
                    </div>
                    <div className="flex-col space-y-2">
                        {items &&
                            items.length > 0 &&
                            items.map(pair => {
                                return (
                                    <div key={pair.address}>
                                        <Link
                                            to={'/bento/kashi/lend/' + String(pair.address).toLowerCase()}
                                            className="block text-high-emphesis"
                                        >
                                            <div className="grid gap-4 grid-flow-col grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7 py-4 px-4 items-center align-center text-sm rounded bg-dark-800 hover:bg-dark-blue">
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
                                                        <div><strong>{pair.asset.symbol}</strong> / {pair.collateral.symbol}</div>
                                                        <div className="mt-0 text-white-500 text-xs block lg:hidden">
                                                            {pair.oracle.name}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-left hidden md:block"><strong>{pair.asset.symbol}</strong></div>
                                                <div className="text-left hidden md:block">{pair.collateral.symbol}</div>
                                                <div className="text-left hidden lg:block">{pair.oracle.name}</div>
                                                <div className="text-center sm:text-right">
                                                    {formattedPercent(pair.currentSupplyAPR.string)}
                                                </div>
                                                <div className="text-right hidden sm:block">
                                                    {formattedPercent(pair.utilization.string)}
                                                </div>
                                                <div className="text-right">
                                                    <div>
                                                        {formattedNum(pair.currentAllAssets.string)} {pair.asset.symbol}
                                                    </div>
                                                    <div className="text-secondary">
                                                        {formattedNum(pair.currentAllAssets.usd, true)}
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    </div>
                                )
                            })}
                    </div>
                    <div className="hidden flex-col space-y-2">
                        {items &&
                            items.length > 0 &&
                            items.map(pair => {
                                return (
                                    <div key={pair.address}>
                                        {pair.address}
                                    </div>
                        )})}
                    </div>
                </div>
                <div className="w-full py-6 text-center">
                    <Link to="/bento/kashi/create" className="text-lg">
                        + Create a new market
                    </Link>
                </div>
            </Card>
        </Layout>
    )
}
