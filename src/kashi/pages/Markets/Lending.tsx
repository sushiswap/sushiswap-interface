import { Card, Layout, MarketHeader } from '../../components'
import { Trans, t } from '@lingui/macro'
import { formattedNum, formattedPercent } from '../../../utils'

import AsyncTokenIcon from '../../components/AsyncTokenIcon'
import DepositGraphic from 'assets/kashi/deposit-graphic.png'
import { Link } from 'react-router-dom'
import ListHeaderWithSort from 'kashi/components/ListHeaderWithSort'
import QuestionHelper from '../../../components/QuestionHelper'
import React from 'react'
import { ZERO } from '../../functions'
import { getCurrency } from 'kashi/constants'
import { useActiveWeb3React } from 'hooks/useActiveWeb3React'
import { useKashiPairs } from '../../context'
import useSearchAndSort from 'hooks/useSearchAndSort'
import { useLingui } from '@lingui/react'

export default function LendingMarkets(): JSX.Element | null {
    const { i18n } = useLingui()
    const { chainId } = useActiveWeb3React()
    const fullPairs = useKashiPairs()
    const netWorth: string = fullPairs.reduce((a, b) => a.add(b.netWorth), ZERO).toFixed(getCurrency(chainId).decimals)

    const positions = useSearchAndSort(
        fullPairs.filter((pair: any) => pair.userAssetFraction.gt(0)),
        { keys: ['search'], threshold: 0.1 },
        { key: 'currentUserAssetAmount.usdValue', direction: 'descending' }
    )

    const pairs = useSearchAndSort(
        fullPairs,
        { keys: ['search'], threshold: 0.1 },
        { key: 'currentSupplyAPR.value', direction: 'descending' }
    )

    return (
        <Layout
            netWorth={netWorth}
            left={
                <Card
                    className="h-full bg-dark-900"
                    backgroundImage={DepositGraphic}
                    title={i18n._(t`Lend your assets, earn yield with no impermanent loss`)}
                    description={i18n._(
                        t`Isolated lending markets mitigate your risks as an asset lender. Know exactly what collateral is available to you in the event of counter party insolvency.`
                    )}
                />
            }
        >
            <Card className="bg-dark-900" header={<MarketHeader type="Lending" lists={[pairs, positions]} />}>
                {positions.items && positions.items.length > 0 && (
                    <div className="pb-4">
                        <div>
                            <div className="grid gap-4 grid-flow-col grid-cols-4 md:grid-cols-6 lg:grid-cols-7 pb-4 px-4 text-sm text-secondary">
                                <ListHeaderWithSort sort={positions} sortKey="search">
                                    <Trans>
                                        <span className="hidden md:inline-block">Your</span> Positions
                                    </Trans>
                                </ListHeaderWithSort>
                                <ListHeaderWithSort className="hidden md:flex" sort={positions} sortKey="asset.symbol">
                                    {i18n._(t`Lending`)}
                                </ListHeaderWithSort>
                                <ListHeaderWithSort
                                    className="hidden md:flex"
                                    sort={positions}
                                    sortKey="collateral.symbol"
                                >
                                    {i18n._(t`Collateral`)}
                                </ListHeaderWithSort>
                                <ListHeaderWithSort className="hidden lg:flex" sort={positions} sortKey="oracle.name">
                                    {i18n._(t`Oracle`)}
                                </ListHeaderWithSort>
                                <ListHeaderWithSort
                                    className="justify-end"
                                    sort={positions}
                                    sortKey="currentUserAssetAmount.usdValue"
                                    direction="descending"
                                >
                                    {i18n._(t`Lent`)}
                                </ListHeaderWithSort>
                                <ListHeaderWithSort
                                    className="justify-end"
                                    sort={positions}
                                    sortKey="currentUserLentAmount.usdValue"
                                    direction="descending"
                                >
                                    {i18n._(t`Borrowed`)}
                                </ListHeaderWithSort>
                                <ListHeaderWithSort
                                    className="justify-end"
                                    sort={positions}
                                    sortKey="supplyAPR.value"
                                    direction="descending"
                                >
                                    {i18n._(t`APR`)}
                                </ListHeaderWithSort>
                            </div>
                            <div className="flex-col space-y-2">
                                {positions.items.map((pair: any) => {
                                    return (
                                        <div key={pair.address}>
                                            <Link
                                                to={'/bento/kashi/lend/' + pair.address}
                                                className="block text-high-emphesis"
                                            >
                                                <div className="grid gap-4 grid-flow-col grid-cols-4 md:grid-cols-6 lg:grid-cols-7 py-4 px-4 items-center align-center text-sm rounded bg-dark-800 hover:bg-dark-blue">
                                                    <div className="flex flex-col sm:flex-row items-start sm:items-center">
                                                        <div className="hidden space-x-2 md:flex">
                                                            <AsyncTokenIcon
                                                                address={pair.asset.address}
                                                                chainId={chainId}
                                                                className="block w-5 h-5 md:w-10 md:h-10 lg:w-12 lg:h-12 rounded-lg"
                                                            />
                                                            <AsyncTokenIcon
                                                                address={pair.collateral.address}
                                                                chainId={chainId}
                                                                className="block w-5 h-5 md:w-10 md:h-10 lg:w-12 lg:h-12 rounded-lg"
                                                            />
                                                        </div>
                                                        <div className="sm:items-end md:hidden">
                                                            <div>
                                                                <strong>{pair.asset.symbol}</strong> /{' '}
                                                                {pair.collateral.symbol}
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
                                                    <div className="text-right">
                                                        <div>
                                                            {formattedNum(pair.currentUserAssetAmount.string, false)}{' '}
                                                            {pair.asset.symbol}
                                                        </div>
                                                        <div className="text-secondary text-sm">
                                                            {formattedNum(pair.currentUserAssetAmount.usd, true)}
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div>{formattedPercent(pair.utilization.string)}</div>
                                                        <div className="text-secondary">
                                                            {formattedNum(pair.currentUserLentAmount.usd, true)}
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        {formattedPercent(pair.supplyAPR.string)}
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
                <div>
                    <div className="grid gap-4 grid-flow-col grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7 pb-4 px-4 text-sm text-secondary">
                        <ListHeaderWithSort sort={pairs} sortKey="search">
                            {i18n._(t`Markets`)}
                        </ListHeaderWithSort>
                        <ListHeaderWithSort className="hidden md:flex" sort={pairs} sortKey="asset.symbol">
                            {i18n._(t`Lending`)}
                        </ListHeaderWithSort>
                        <ListHeaderWithSort className="hidden md:flex" sort={pairs} sortKey="collateral.symbol">
                            {i18n._(t`Collateral`)}
                        </ListHeaderWithSort>
                        <ListHeaderWithSort className="hidden lg:flex" sort={pairs} sortKey="oracle.name">
                            {i18n._(t`Oracle`)}
                            <QuestionHelper
                                text={i18n._(t`The onchain oracle that tracks the pricing for this pair `)}
                            />
                        </ListHeaderWithSort>
                        <ListHeaderWithSort
                            className="justify-end"
                            sort={pairs}
                            sortKey="currentSupplyAPR.value"
                            direction="descending"
                        >
                            {i18n._(t`APR`)}
                        </ListHeaderWithSort>
                        <ListHeaderWithSort
                            className="hidden sm:flex justify-end"
                            sort={pairs}
                            sortKey="utilization.value"
                            direction="descending"
                        >
                            {i18n._(t`Borrowed`)}
                        </ListHeaderWithSort>
                        <ListHeaderWithSort
                            className="justify-end"
                            sort={pairs}
                            sortKey="currentAllAssets.usdValue"
                            direction="descending"
                        >
                            {i18n._(t`Total`)}
                        </ListHeaderWithSort>
                    </div>
                    <div className="flex-col space-y-2">
                        {pairs.items &&
                            pairs.items.map(pair => {
                                return (
                                    <div key={pair.address}>
                                        <Link
                                            to={'/bento/kashi/lend/' + String(pair.address).toLowerCase()}
                                            className="block text-high-emphesis"
                                        >
                                            <div className="grid gap-4 grid-flow-col grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7 py-4 px-4 items-center align-center text-sm rounded bg-dark-800 hover:bg-dark-blue">
                                                <div className="flex flex-col sm:flex-row items-start sm:items-center">
                                                    <div className="hidden space-x-2 md:flex">
                                                        <AsyncTokenIcon
                                                            address={pair.asset.address}
                                                            chainId={chainId}
                                                            className="block w-5 h-5 md:w-10 md:h-10 lg:w-12 lg:h-12 rounded-lg"
                                                        />
                                                        <AsyncTokenIcon
                                                            address={pair.collateral.address}
                                                            chainId={chainId}
                                                            className="block w-5 h-5 md:w-10 md:h-10 lg:w-12 lg:h-12 rounded-lg"
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
                                                <div className="text-left hidden md:block">
                                                    <strong>{pair.asset.symbol}</strong>
                                                </div>
                                                <div className="text-left hidden md:block">
                                                    {pair.collateral.symbol}
                                                </div>
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
                </div>
                <div className="w-full py-6 text-center">
                    <Link to="/bento/kashi/create" className="text-lg">
                        {i18n._(t`+ Create a new market`)}
                    </Link>
                </div>
            </Card>
        </Layout>
    )
}
