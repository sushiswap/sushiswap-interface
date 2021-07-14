import { BentoBalance, useBentoBalances } from 'state/bentobox/hooks'
import { Card, CardHeader, Layout, Search } from '../../../kashi/components'
import React, { useState } from 'react'
import { useFuse, useSortableData } from 'hooks'

import AsyncTokenIcon from '../../../kashi/components/AsyncTokenIcon'
import BentoBoxImage from 'assets/kashi/bento-illustration.png'
import Deposit from './Deposit'
import { Helmet } from 'react-helmet'
import { Paper } from 'components'
import Withdraw from './Withdraw'
import { ZERO } from 'kashi/functions/math'
import { formattedNum } from '../../../utils'
import { getCurrency } from 'kashi'
import { t } from '@lingui/macro'
import { useActiveWeb3React } from 'hooks/useActiveWeb3React'
import { useLingui } from '@lingui/react'

export default function BentoBalances(): JSX.Element {
    const { i18n } = useLingui()
    const { chainId } = useActiveWeb3React()
    const balances = useBentoBalances()

    // Search Setup
    const options = { keys: ['symbol', 'name'], threshold: 0.1 }
    const { result, search, term } = useFuse({
        data: balances && balances.length > 0 ? balances : [],
        options
    })
    const flattenSearchResults = result.map((a: { item: any }) => (a.item ? a.item : a))
    // Sorting Setup
    const { items, requestSort, sortConfig } = useSortableData(flattenSearchResults)
    return (
        <>
            <Helmet>
                <title>BentoBox Balances | Sushi</title>
            </Helmet>
            <Layout
                left={
                    <Card
                        className="h-full bg-dark-900"
                        backgroundImage={BentoBoxImage}
                        title={i18n._(t`Deposit tokens into BentoBox for all the yields`)}
                        description={i18n._(
                            t`BentoBox provides extra yield on deposits with flash lending, strategies, and fixed, low-gas transfers among integrated dapps, like Kashi markets`
                        )}
                    />
                }
            >
                <Card
                    className="h-full bg-dark-900"
                    header={
                        <CardHeader className="flex justify-between items-center bg-dark-800">
                            <div className="flex flex-col md:flex-row items-center justify-between w-full">
                                <div className="flex items-baseline">
                                    <div className="text-3xl text-high-emphesis mr-4">{i18n._(t`BentoBox`)}</div>
                                </div>
                                <div className="flex justify-end w-full py-4 md:py-0">
                                    <Search search={search} term={term} />
                                </div>
                            </div>
                        </CardHeader>
                    }
                >
                    <div className="grid gap-4 grid-flow-row auto-rows-max">
                        <div className="px-4 grid grid-cols-3 text-sm  text-secondary select-none">
                            <div>{i18n._(t`Token`)}</div>
                            <div className="text-right">{i18n._(t`Wallet`)}</div>
                            <div className="text-right">{i18n._(t`BentoBox`)}</div>
                        </div>
                        {items &&
                            items.length > 0 &&
                            items.map((balance: BentoBalance, i: number) => {
                                return <TokenBalance key={balance.address + '_' + i} balance={balance} />
                            })}
                    </div>
                </Card>
            </Layout>
        </>
    )
}

const TokenBalance = ({ balance }: { balance: BentoBalance }) => {
    const [expand, setExpand] = useState<boolean>(false)
    const { chainId } = useActiveWeb3React()
    return (
        <Paper className="bg-dark-800 ">
            <div
                className="grid grid-cols-3 py-4 px-4 cursor-pointer select-none rounded text-sm "
                onClick={() => setExpand(!expand)}
            >
                <div className="flex items-center">
                    <AsyncTokenIcon
                        address={balance.address}
                        chainId={chainId}
                        className="w-10 sm:w-14 rounded-lg mr-4"
                    />
                    <div>{balance && balance.symbol}</div>
                </div>
                <div className="flex justify-end items-center">
                    <div>
                        <div className="text-right">{formattedNum(balance.wallet.string)} </div>
                        <div className="text-secondary text-right">{formattedNum(balance.wallet.usd, true)}</div>
                    </div>
                </div>
                <div className="flex justify-end items-center">
                    <div>
                        <div className="text-right">{formattedNum(balance.bento.string)} </div>
                        <div className="text-secondary text-right">{formattedNum(balance.bento.usd, true)}</div>
                    </div>
                </div>
            </div>
            {expand && (
                <div className="grid gap-4 grid-cols-2 px-4 pb-4">
                    <div className="text-center col-span-2 md:col-span-1">
                        <Deposit tokenAddress={balance.address} tokenSymbol={balance.symbol} />
                    </div>
                    <div className="text-center col-span-2 md:col-span-1">
                        <Withdraw tokenAddress={balance.address} tokenSymbol={balance.symbol} />
                    </div>
                </div>
            )}
        </Paper>
    )
}
