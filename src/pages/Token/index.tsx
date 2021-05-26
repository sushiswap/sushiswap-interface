import React, { useContext, useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { ThemeContext } from 'styled-components'
import { createChart } from 'lightweight-charts'
import { useActiveWeb3React } from '../../hooks/useActiveWeb3React'
import { useLingui } from '@lingui/react'
import { mockData } from './chartMockData'

export default function Token() {
    const { i18n } = useLingui()

    const theme = useContext(ThemeContext)
    const { account, chainId } = useActiveWeb3React()

    const chartRef = React.useRef() as any

    useEffect(() => {
        const chart = createChart(chartRef.current, {
            width: 672,
            height: 300,
            layout: {
                textColor: '#d1d4dc',
                backgroundColor: 'transparent'
            },
            rightPriceScale: {
                visible: false
            },
            leftPriceScale: {
                visible: false
            },
            timeScale: {
                visible: false
            },
            crosshair: {
                horzLine: {
                    visible: false,
                },
                vertLine: {
                    visible: false,
                },
            },
            grid: {
                vertLines: {
                    color: 'rgba(42, 46, 57, 0)'
                },
                horzLines: {
                    color: 'rgba(42, 46, 57, 0)'
                }
            }
        })

        const areaSeries = chart.addAreaSeries({
            topColor: 'rgba(38, 198, 218, 0.56)',
            bottomColor: 'rgba(38, 198, 218, 0.04)',
            lineColor: 'rgba(38, 198, 218, 1)',
            lineWidth: 2
        })

        const lineSeries = chart.addLineSeries({
            color: '#7d48b9',
            lineWidth: 2,
          });

        lineSeries.setData(mockData)
    }, [])

    return (
        <>
            <Helmet>
                <title>Token | Sushi</title>
            </Helmet>

            <div className="w-full max-w-2xl mb-5">
                Tokens - <span className="text-high-emphesis">SUSHI</span>
            </div>

            <div className="flex justify-between w-full max-w-2xl rounded mb-6">
                <div className="flex items-center">
                    <span className="text-body font-bold md:text-h5 text-high-emphesis">SUSHI</span>
                    <span className="ml-2">(SUSHI)</span>
                </div>
                <div className="flex items-center">
                    <div className="text-body font-bold md:text-h5 text-high-emphesis">$17.01</div>
                    <div className="ml-2">+13.8%</div>
                </div>
            </div>

            <div ref={chartRef} className="w-full max-w-2xl rounded mb-6" />

            <div className="grid grid-cols-3 gap-6 w-full max-w-2xl mb-6">
                <div className="flex flex-col bg-dark-900 rounded p-6">
                    <div className="text-sm">Liquidity (24H)</div>
                    <div className="text-body text-high-emphesis">$222,275,124.89</div>
                    <div className="text-sm">+2.34%</div>
                </div>
                <div className="flex flex-col bg-dark-900 rounded p-6">
                    <div className="text-sm">Volume (24H)</div>
                    <div className="text-body text-high-emphesis">$14,682,757.45</div>
                    <div className="text-sm">-24.94%</div>
                </div>
                <div className="flex flex-col bg-dark-900 rounded p-6">
                    <div className="text-sm">Fees (24H)</div>
                    <div className="text-body text-high-emphesis">$44,048.27</div>
                    <div className="text-sm">-24.94%</div>
                </div>
            </div>

            <div className="bg-dark-900 w-full max-w-2xl rounded mb-5">Swap</div>

            <div className="w-full max-w-2xl rounded mb-6 py-4">
                <div className="flex justify-between pb-6">
                    <div className="text-body font-bold md:text-h5 text-high-emphesis">About SUSHI</div>
                    <div>View Contract</div>
                </div>
                <div className="text-high-emphesis">
                    SUSHI is the native liquidity incentive and governance token associated with the SushiSwap protocol,
                    an on-chain automated market maker protocol that is a community fork of the Uniswap protocol. Users
                    can earn SUSHI by contributing liquidity to pools though the SushiSwap staking interface. Holders of
                    SUSHI can participate in future governance over the protocol.
                </div>
            </div>

            <div className="w-full max-w-2xl mb-6">
                <div className="text-body font-bold md:text-h5 text-high-emphesis pb-6">Top Moving Pairs</div>
                <div className="grid grid-cols-4 gap-6">
                    <div className="bg-dark-900 p-4 rounded">ETH</div>
                    <div className="bg-dark-900 p-4 rounded">USDT</div>
                    <div className="bg-dark-900 p-4 rounded">UNI</div>
                    <div className="bg-dark-900 p-4 rounded">LINK</div>
                    <div className="bg-dark-900 p-4 rounded">WBTC</div>
                    <div className="bg-dark-900 p-4 rounded">AAVE</div>
                    <div className="bg-dark-900 p-4 rounded">COMP</div>
                    <div className="bg-dark-900 p-4 rounded">MKR</div>
                </div>
            </div>

            <div className="w-full max-w-2xl mb-6">
                <div className="text-body font-bold md:text-h5 text-high-emphesis pb-6">Top Farms</div>
                <div className="grid grid-cols-3 gap-6 px-4 py-2">
                    <div>Token Pair</div>
                    <div>ROI (1Y)</div>
                    <div>Rewards</div>
                </div>
                <div className="grid grid-cols-3 gap-6 bg-dark-900 rounded p-4">
                    <div>SUSHI-WETH</div>
                    <div>40.32%</div>
                    <div className="flex justify-between">
                        <div>ICON1</div>
                        <div>ICON2</div>
                    </div>
                </div>
            </div>
        </>
    )
}
