import React, { useState } from 'react'
import { ChainId, WETH } from '@sushiswap/sdk'
import { Redirect, RouteComponentProps } from 'react-router-dom'
import { useActiveWeb3React } from 'hooks'
import { useKashiPair } from 'kashi/context'
import { getTokenIcon } from 'kashi/functions'
import { BackButton, LendCardHeader } from '../../../components'
import { formattedNum, formattedPercent } from 'utils'
import { Card, Layout, Paper } from '../../../components'
import DepositGraphic from 'assets/kashi/deposit-graphic.png'
import { GradientDot } from '../../../components'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import { BigNumber } from '@ethersproject/bignumber'
import Deposit from './Deposit'
import Withdraw from './Withdraw'

export default function LendingPair({
    match: {
        params: { pairAddress }
    }
}: RouteComponentProps<{ pairAddress: string }>): JSX.Element | null {
    const [tabIndex, setTabIndex] = useState(0)

    const { chainId } = useActiveWeb3React()

    const pair = useKashiPair(pairAddress)

    if (!pair) return (
        <Redirect to="/bento/kashi/lend"></Redirect>
    )

    return (
        <Layout
            left={
                <Card
                    className="h-full bg-dark-900"
                    backgroundImage={DepositGraphic}
                    title={'Lend assets for interest from borrowers.'}
                    description={
                        "Have assets you want to earn additional interest on? Lend them in isolated markets and earn interest from borrowers. It's as easy as deposit and withdraw whenever you want."
                    }
                />
            }
            right={
                <Card className="h-full bg-dark-900">
                    <div className="flex-col space-y-2">
                        <div className="flex justify-between">
                            <div className="text-xl text-high-emphesis">Market Info</div>
                        </div>
                        <div className="flex justify-between">
                            <div className="text-lg text-secondary">Available</div>
                            <div className="text-lg text-high-emphesis">
                                {formattedNum(pair.totalAssetAmount.string)} {pair.asset.symbol}
                            </div>
                        </div>
                        <div className="flex justify-between">
                            <div className="text-lg text-secondary">Borrowed</div>
                            <div className="flex items-center">
                                <div className="text-lg text-high-emphesis">
                                    {formattedPercent(pair.utilization.string)}
                                </div>
                                <GradientDot percent={pair.utilization.string} desc={false} />
                            </div>
                        </div>
                        <div className="flex justify-between">
                            <div className="text-lg text-secondary">Supply APR</div>
                            <div className="flex items-center">
                                <div className="text-lg text-high-emphesis">{formattedPercent(pair.currentSupplyAPR.string)}</div>
                            </div>
                        </div>
                        <div className="flex justify-between">
                            <div className="text-lg text-secondary">Borrow APR</div>
                            <div className="flex items-center">
                                <div className="text-lg text-high-emphesis">{formattedPercent(pair.currentInterestPerYear.string)}</div>
                            </div>
                        </div>
                        <div className="flex justify-between pt-3">
                            <div className="text-xl text-high-emphesis">BentoBox</div>
                        </div>
                        <div className="flex justify-between">
                            <div className="text-lg text-secondary">{pair.asset.symbol} Strategy</div>
                            <div className="text-lg text-high-emphesis">Inactive</div>
                        </div>
                        <div className="flex justify-between">
                            <div className="text-lg text-secondary">{pair.collateral.symbol} Strategy</div>
                            <div className="text-lg text-high-emphesis">Inactive</div>
                        </div>
                    </div>
                </Card>
            }
        >
            <Card
                className="h-full bg-dark-900"
                header={
                    <LendCardHeader>
                        <div className="flex items-center">
                            <div className="flex items-center space-x-2 mr-4">
                                <BackButton className="hidden md:flex" defaultRoute="/bento/kashi/lend" />
                                <img
                                    src={pair && getTokenIcon(pair?.collateral.address, chainId)}
                                    className="block w-10 h-10 sm:w-12 sm:h-12 rounded-lg"
                                    alt=""
                                />
                                <img
                                    src={pair && getTokenIcon(pair?.asset.address, chainId)}
                                    className="block w-10 h-10 sm:w-12 sm:h-12 rounded-lg"
                                    alt=""
                                />
                            </div>
                            <div className="flex justify-between items-center">
                                <div>
                                    <div className="text-3xl text-high-emphesis">Lend {pair && pair.asset.symbol}</div>
                                    <div className="flex items-center">
                                        <div className="text-sm text-secondary mr-1">Collateral:</div>
                                        <div className="text-sm text-high-emphesis mr-2">
                                            {pair && pair.collateral.symbol}
                                        </div>
                                        <div className="text-sm text-secondary mr-1">Oracle:</div>
                                        <div className="text-sm text-high-emphesis">{pair && pair.oracle.name}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </LendCardHeader>
                }
            >
                <div className="flex justify-between mb-8">
                    <div>
                        <div className="text-secondary text-lg">Lent</div>
                        <div className="text-blue text-2xl">
                            {formattedNum(pair.currentUserAssetAmount.string)} {pair.asset.symbol}
                        </div>
                        <div className="text-high-emphesis text-lg">
                            {formattedNum(pair.currentUserAssetAmount.usd, true)}
                        </div>
                    </div>
                    <div>
                        <div className="text-secondary text-lg">Borrowed</div>
                        <div className="text-high-emphesis text-2xl">{formattedPercent(pair.utilization.string)}</div>
                    </div>
                    <div className="text-right">
                        <div>
                            <div className="text-secondary text-lg">Supply APR</div>
                            <div className="text-high-emphesis text-2xl">{formattedPercent(pair.supplyAPR.string)}</div>
                        </div>
                    </div>
                </div>

                <Tabs forceRenderTabPanel selectedIndex={tabIndex} onSelect={(index: number) => setTabIndex(index)}>
                    <TabList className="flex rounded bg-dark-800 p-1">
                        <Tab
                            className="flex flex-1 justify-center items-center rounded text-lg text-secondary hover:text-primary cursor-pointer focus:outline-none select-none px-3 py-4"
                            selectedClassName="bg-dark-900 text-high-emphesis"
                        >
                            Deposit {pair.asset.symbol}
                        </Tab>
                        <Tab
                            className="flex flex-1 justify-center items-center rounded text-lg text-secondary hover:text-primary cursor-pointer focus:outline-none select-none px-3 py-4"
                            selectedClassName="bg-dark-900 text-high-emphesis"
                        >
                            Withdraw {pair.asset.symbol}
                        </Tab>
                    </TabList>
                    <TabPanel>
                        <Deposit pair={pair} />
                    </TabPanel>
                    <TabPanel>
                        <Withdraw pair={pair} />
                    </TabPanel>
                </Tabs>
            </Card>
            <pre>
                {JSON.stringify(
                    pair,
                    (key, value) => {
                        if (value?.type === 'BigNumber') {
                            return BigNumber.from(value.hex).toString()
                        }
                        if (key.startsWith('_')) {
                            return undefined
                        }
                        return value
                    },
                    2
                )}
            </pre>
        </Layout>
    )
}
