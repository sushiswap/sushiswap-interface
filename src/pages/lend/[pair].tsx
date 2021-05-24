import { KashiContext, useKashiPair } from '../../context'
import React, { useContext, useState } from 'react'
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs'
import { formattedNum, formattedPercent } from '../../utils'

import AsyncIcon from '../../components/AsyncIcon'
import Card from '../../components/Card'
import Deposit from '../../containers/lend/Deposit'
import Dots from '../../components/Dots'
import GradientDot from '../../components/GradientDot'
import Head from 'next/head'
import KashiLayout from '../../layouts/KashiLayout'
import { LendCardHeader } from '../../components/CardHeader'
import QuestionHelper from '../../components/QuestionHelper'
import Withdraw from '../../containers/lend/Withdraw'
import { shortenAddress } from '../../functions'
import { t } from '@lingui/macro'
import useActiveWeb3React from '../../hooks/useActiveWeb3React'
import { useLingui } from '@lingui/react'
import { usePair } from '../../hooks/usePairs'
import { useRouter } from 'next/router'
import { useToken } from '../../hooks/Tokens'
import { useUSDCPrice } from '../../hooks'

export default function Pair() {
    const router = useRouter()
    const { i18n } = useLingui()
    const { chainId } = useActiveWeb3React()
    const [tabIndex, setTabIndex] = useState(0)
    const info = useContext(KashiContext).state.info
    const pair = useKashiPair(router.query.pair as string)
    const asset = useToken(pair?.asset.address)
    const collateral = useToken(pair?.collateral.address)
    const [pairState, liquidityPair] = usePair(asset, collateral)
    const assetPrice = useUSDCPrice(asset)
    const collateralPrice = useUSDCPrice(collateral)
    if (!pair) return info && info.blockTimeStamp.isZero() ? null : router.push('/lend')

    return (
        <KashiLayout
            left={
                <Card
                    className="h-full bg-dark-900"
                    backgroundImage="/deposit-graphic.png"
                    title={i18n._(t`Lend assets for interest from borrowers.`)}
                    description={i18n._(
                        t`Have assets you want to earn additional interest on? Lend them in isolated markets and earn interest from borrowers.`
                    )}
                />
            }
            right={
                <Card className="h-full bg-dark-900">
                    <div className="flex-col space-y-2">
                        <div className="flex justify-between">
                            <div className="text-xl text-high-emphesis">{i18n._(t`Market Info`)}</div>
                        </div>
                        <div className="flex justify-between">
                            <div className="text-lg text-secondary">{i18n._(t`Total`)}</div>
                            <div className="text-lg text-high-emphesis">
                                {formattedNum(pair.currentAllAssets.string)} {pair.asset.symbol}
                            </div>
                        </div>
                        <div className="flex justify-between">
                            <div className="text-lg text-secondary">{i18n._(t`Available`)}</div>
                            <div className="text-lg text-high-emphesis">
                                {formattedNum(pair.totalAssetAmount.string)} {pair.asset.symbol}
                            </div>
                        </div>
                        <div className="flex justify-between">
                            <div className="text-lg text-secondary">{i18n._(t`Borrowed`)}</div>
                            <div className="flex items-center">
                                <div className="text-lg text-high-emphesis">
                                    {formattedPercent(pair.utilization.string)}
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-between">
                            <div className="text-lg text-secondary">{i18n._(t`Supply APR`)}</div>
                            <div className="flex items-center">
                                <div className="text-lg text-high-emphesis">
                                    {formattedPercent(pair.currentSupplyAPR.string)}
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-between">
                            <div className="text-lg text-secondary">{i18n._(t`Borrow APR`)}</div>
                            <div className="flex items-center">
                                <div className="text-lg text-high-emphesis">
                                    {formattedPercent(pair.currentInterestPerYear.string)}
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-between">
                            <div className="text-lg text-secondary">{i18n._(t`Collateral`)}</div>
                            <div className="flex items-center">
                                <div className="text-lg text-high-emphesis">
                                    {formattedNum(pair.totalCollateralAmount.string)} {pair.collateral.symbol}
                                </div>
                            </div>
                        </div>
                        {pair.utilization.value.gt(0) && (
                            <div className="flex justify-between">
                                <div className="text-lg text-secondary">{i18n._(t`Health`)}</div>
                                <div className="flex items-center">
                                    <div className="text-lg text-high-emphesis">
                                        {formattedPercent(pair.marketHealth.toFixed(16))}
                                    </div>
                                </div>
                            </div>
                        )}
                        <div className="flex justify-between pt-3">
                            <div className="text-xl text-high-emphesis">{i18n._(t`BentoBox`)}</div>
                        </div>
                        <div className="flex justify-between">
                            <div className="text-lg text-secondary">{i18n._(t`${pair.asset.symbol} Strategy`)}</div>
                            <div className="text-lg text-high-emphesis">
                                {i18n._(t`None`)}
                                <QuestionHelper
                                    text={i18n._(
                                        t`BentoBox strategies can create yield for your liquidity while it is not lent out. This token does not yet have a strategy in the BentoBox.`
                                    )}
                                />
                            </div>
                        </div>

                        {pair && pair.oracle.name === 'SushiSwap' && (
                            <>
                                <div className="flex justify-between pt-3">
                                    <div className="text-xl text-high-emphesis">{i18n._(t`SLP`)}</div>
                                </div>
                                {liquidityPair ? (
                                    <>
                                        <div className="flex justify-between">
                                            <div className="text-lg text-secondary">
                                                {liquidityPair?.token0.getSymbol(chainId)}
                                            </div>
                                            <div className="text-lg text-high-emphesis">
                                                {liquidityPair?.reserve0.toSignificant(4)}
                                            </div>
                                        </div>

                                        <div className="flex justify-between">
                                            <div className="text-lg text-secondary">
                                                {liquidityPair?.token1.getSymbol(chainId)}
                                            </div>
                                            <div className="text-lg text-high-emphesis">
                                                {liquidityPair?.reserve1.toSignificant(4)}
                                            </div>
                                        </div>

                                        <div className="flex justify-between">
                                            <div className="text-lg text-secondary">TVL</div>
                                            <div className="text-lg text-high-emphesis">
                                                {formattedNum(
                                                    liquidityPair?.reserve1
                                                        .multiply(assetPrice?.raw)
                                                        .add(liquidityPair?.reserve1.multiply(collateralPrice?.raw))
                                                        .toSignificant(4),
                                                    true
                                                )}
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <Dots className="text-lg text-secondary">Loading</Dots>
                                )}
                            </>
                        )}
                    </div>
                </Card>
            }
        >
            <Head>
                <title>Lend {pair.asset.symbol} | Sushi</title>
                <meta name="description" content={`Lend ${pair.asset.symbol} on Kashi`} />
            </Head>
            <Card
                className="h-full bg-dark-900"
                header={
                    <LendCardHeader>
                        <div className="flex items-center">
                            <div className="flex items-center mr-4 space-x-2">
                                {pair && (
                                    <>
                                        <AsyncIcon
                                            src={pair?.asset.tokenInfo.logoURI}
                                            className="block w-10 h-10 rounded-lg sm:w-12 sm:h-12"
                                        />
                                        <AsyncIcon
                                            src={pair?.collateral.tokenInfo.logoURI}
                                            className="block w-10 h-10 rounded-lg sm:w-12 sm:h-12"
                                        />
                                    </>
                                )}
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-3xl text-high-emphesis">Lend {pair && pair.asset.symbol}</div>
                                    <div className="flex items-center">
                                        <div className="mr-1 text-sm text-secondary">Collateral:</div>
                                        <div className="mr-2 text-sm text-high-emphesis">
                                            {pair && pair.collateral.symbol}
                                        </div>
                                        <div className="mr-1 text-sm text-secondary">Oracle:</div>
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
                        <div className="text-lg text-secondary">Lent</div>
                        <div className="text-2xl text-blue">
                            {formattedNum(pair.currentUserAssetAmount.string)} {pair.asset.symbol}
                        </div>
                        <div className="text-lg text-high-emphesis">
                            {formattedNum(pair.currentUserAssetAmount.usd, true)}
                        </div>
                    </div>
                    <div>
                        <div className="text-lg text-secondary">Borrowed</div>
                        <div className="text-2xl text-high-emphesis">{formattedPercent(pair.utilization.string)}</div>
                    </div>
                    <div className="text-right">
                        <div>
                            <div className="text-lg text-secondary">Supply APR</div>
                            <div className="text-2xl text-high-emphesis">{formattedPercent(pair.supplyAPR.string)}</div>
                        </div>
                    </div>
                </div>

                <Tabs forceRenderTabPanel selectedIndex={tabIndex} onSelect={(index: number) => setTabIndex(index)}>
                    <TabList className="flex p-1 rounded bg-dark-800">
                        <Tab
                            className="flex items-center justify-center flex-1 px-3 py-4 text-lg rounded cursor-pointer select-none text-secondary hover:text-primary focus:outline-none"
                            selectedClassName="bg-dark-900 text-high-emphesis"
                        >
                            Deposit {pair.asset.symbol}
                        </Tab>
                        <Tab
                            className="flex items-center justify-center flex-1 px-3 py-4 text-lg rounded cursor-pointer select-none text-secondary hover:text-primary focus:outline-none"
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
        </KashiLayout>
    )
}
