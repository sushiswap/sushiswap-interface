import { BentoBalance, useBentoBalances } from '../state/bentobox/hooks'
import React, { useState } from 'react'
import { useFuse, useSortableData } from '../hooks'

import Back from '../components/Back'
import Card from '../components/Card'
import CardHeader from '../components/CardHeader'
import Head from 'next/head'
import Layout from '../layouts/KashiLayout'
import Paper from '../components/Paper'
import Search from '../components/Search'
import { formattedNum } from '../utils'
import { t } from '@lingui/macro'
import useActiveWeb3React from '../hooks/useActiveWeb3React'
import { useLingui } from '@lingui/react'

export default function Balances() {
    const { i18n } = useLingui()
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
        <Layout
            left={
                <Card
                    className="h-full bg-dark-900"
                    backgroundImage="bento-illustration.png"
                    title={i18n._(t`Deposit tokens into BentoBox for all the yields`)}
                    description={i18n._(
                        t`BentoBox provides extra yield on deposits with flash lending, strategies, and fixed, low-gas transfers among integrated dapps, like Kashi markets`
                    )}
                />
            }
        >
            <Head>
                <title>Balances | Sushi</title>
                <meta name="description" content="" />
            </Head>
            <Card
                className="h-full bg-dark-900"
                header={
                    <CardHeader className="flex items-center justify-between bg-dark-800">
                        <div className="flex flex-col items-center justify-between w-full md:flex-row">
                            <div className="flex items-baseline">
                                <div className="mr-4 text-3xl text-high-emphesis">{i18n._(t`BentoBox`)}</div>
                            </div>
                            <div className="flex justify-end w-full py-4 md:py-0">
                                <Search search={search} term={term} />
                            </div>
                        </div>
                    </CardHeader>
                }
            >
                <div className="grid grid-flow-row gap-4 auto-rows-max">
                    <div className="grid grid-cols-3 px-4 text-sm select-none text-secondary">
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
    )
}

const TokenBalance = ({ balance }: { balance: BentoBalance }) => {
    const [expand, setExpand] = useState<boolean>(false)
    const { chainId } = useActiveWeb3React()
    return (
        <Paper className="bg-dark-800 ">
            <div
                className="grid grid-cols-3 px-4 py-4 text-sm rounded cursor-pointer select-none "
                onClick={() => setExpand(!expand)}
            >
                <div className="flex items-center">
                    {/* <AsyncTokenIcon
                        address={balance.address}
                        chainId={chainId}
                        className="w-10 mr-4 rounded-lg sm:w-14"
                    /> */}
                    <div>{balance && balance.symbol}</div>
                </div>
                <div className="flex items-center justify-end">
                    <div>
                        <div className="text-right">{formattedNum(balance.wallet.string)} </div>
                        <div className="text-right text-secondary">{formattedNum(balance.wallet.usd, true)}</div>
                    </div>
                </div>
                <div className="flex items-center justify-end">
                    <div>
                        <div className="text-right">{formattedNum(balance.bento.string)} </div>
                        <div className="text-right text-secondary">{formattedNum(balance.bento.usd, true)}</div>
                    </div>
                </div>
            </div>
            {expand && (
                <div className="grid grid-cols-2 gap-4 px-4 pb-4">
                    <div className="col-span-2 text-center md:col-span-1">
                        {/* <Deposit tokenAddress={balance.address} tokenSymbol={balance.symbol} /> */}
                    </div>
                    <div className="col-span-2 text-center md:col-span-1">
                        {/* <Withdraw tokenAddress={balance.address} tokenSymbol={balance.symbol} /> */}
                    </div>
                </div>
            )}
        </Paper>
    )
}
