import React, { useState } from 'react'
import styled from 'styled-components'
import { RowBetween } from '../../components/Row'
import Deposit from './Deposit'
import Withdraw from './Withdraw'
import { useActiveWeb3React } from 'hooks'
import useBentoBalances, { BentoBalance } from 'sushi-hooks/useBentoBalances'
import { formattedNum } from '../../utils'
import { Card, CardHeader, Paper, Layout, Search } from '../../kashi/components'
import { getTokenIcon } from 'kashi/functions'
import { ReactComponent as BentoBoxLogo } from 'assets/kashi/bento-symbol.svg'
import BentoBoxImage from 'assets/kashi/bento-illustration.png'
import useFuse from 'sushi-hooks/useFuse'
import useSortableData from 'sushi-hooks/useSortableData'
import { BackButton } from 'kashi/components'
import { ZERO } from 'kashi/functions/math'

export const FixedHeightRow = styled(RowBetween)`
    height: 24px;
`

export default function BentoBalances(): JSX.Element {
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
                    backgroundImage={BentoBoxImage}
                    title={'Deposit tokens into BentoBox for all the yields.'}
                    description={
                        'BentoBox provides extra yield on deposits with flash lending, strategies, and fixed, low-gas transfers among integrated dapps, like Kashi markets.'
                    }
                />
            }
        >
            <Card
                className="h-full bg-dark-900"
                header={
                    <CardHeader className="flex justify-between items-center bg-dark-800">
                        <div className="md:hidden">
                            <div className="flex float-right items-center">
                                <div className="">BentoBox</div>
                            </div>
                        </div>
                        <div className="flex w-full justify-between">
                            <div className="hidden md:flex items-center">
                                <BackButton defaultRoute="/bento" />
                                <div className="text-3xl text-high-emphesis mr-2">My BentoBox</div>
                                <div className="text-lg text-secondary">
                                    {formattedNum(
                                        balances
                                            ?.reduce((previousValue, currentValue) => {
                                                return previousValue.add(currentValue.bento.usdValue)
                                            }, ZERO)
                                            .toFixed(6),
                                        true
                                    )}
                                </div>
                            </div>
                            <div className="ml-3">
                                <Search search={search} term={term} />
                            </div>
                        </div>
                    </CardHeader>
                }
            >
                <div className="grid gap-4 grid-flow-row auto-rows-max">
                    <div className="px-4 grid grid-cols-3 text-sm  text-secondary select-none">
                        <div>Token</div>
                        <div className="text-right">Wallet</div>
                        <div className="text-right">BentoBox</div>
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
                className="grid grid-cols-3 py-4 px-4 cursor-pointer select-none rounded text-sm "
                onClick={() => setExpand(!expand)}
            >
                <div className="flex items-center">
                    <img
                        alt={balance.symbol}
                        src={getTokenIcon(balance.address, chainId)}
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
