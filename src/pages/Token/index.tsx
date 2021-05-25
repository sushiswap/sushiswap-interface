import React, { useContext, useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { ThemeContext } from 'styled-components'

import { useActiveWeb3React } from '../../hooks/useActiveWeb3React'

import { useLingui } from '@lingui/react'

export default function Token() {
    const { i18n } = useLingui()

    const theme = useContext(ThemeContext)
    const { account, chainId } = useActiveWeb3React()

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

            <div className="bg-dark-900 w-full max-w-2xl rounded mb-5">Chart</div>

            <div className="flex w-full max-w-2xl mb-5">
                <div className="flex flex-col bg-dark-900 rounded p-4">
                    <div className="text-sm">Liquidity (24H)</div>
                    <div className="text-body text-high-emphesis">$222,275,124.89</div>
                    <div className="text-sm">+2.34%</div>
                </div>
                <div className="flex flex-col bg-dark-900 rounded p-4">
                    <div className="text-sm">Volume (24H)</div>
                    <div className="text-body text-high-emphesis">$14,682,757.45</div>
                    <div className="text-sm">-24.94%</div>
                </div>
                <div className="flex flex-col bg-dark-900 rounded p-4">
                    <div className="text-sm">Fees (24H)</div>
                    <div className="text-body text-high-emphesis">$44,048.27</div>
                    <div className="text-sm">-24.94%</div>
                </div>
            </div>

            <div className="bg-dark-900 w-full max-w-2xl rounded mb-5">Swap</div>

            <div className="bg-dark-900 w-full max-w-2xl rounded mb-5">About</div>

            <div className="bg-dark-900 w-full max-w-2xl rounded mb-5">Top Moving Pairs</div>

            <div className="bg-dark-900 w-full max-w-2xl rounded mb-5">Top Farms</div>
        </>
    )
}
