import Head from 'next/head'
import useActiveWeb3React from '../hooks/useActiveWeb3React'
import SwapHistory from '../containers/pro/SwapHistory'
import { Field, selectCurrency } from '../state/swap/actions'
import TabCard from '../components/TabCard'
import { FC, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import UserSwapHistory from '../containers/pro/UserSwapHistory'
import TVChartContainer from '../containers/pro/TVChartContainer'
import { ChainId } from '@sushiswap/sdk'
import Layout from '../components/Layout'
import { useLingui } from '@lingui/react'
import { t } from '@lingui/macro'
import SwapContainer from '../containers/swap/SwapContainer'
import QuantStats from '../containers/pro/QuantStats'

const Pro: FC = () => {
    const { i18n } = useLingui()
    const { chainId } = useActiveWeb3React()
    const dispatch = useDispatch()
    let address = ''
    switch (chainId) {
        case ChainId.MAINNET:
        case ChainId.GÖRLI:
        case ChainId.KOVAN:
        case ChainId.ROPSTEN:
        case ChainId.RINKEBY:
        default:
            address = '0x6B3595068778DD592e39A122f4f5a5cF09C90fE2'
            break
        case ChainId.BSC:
            address = '0x947950BcC74888a40Ffa2593C5798F11Fc9124C4'
            break
        case ChainId.MATIC:
            address = '0x0b3F868E0BE5597D5DB7fEB59E1CADBb0fdDa50a'
            break
    }

    useEffect(() => {
        dispatch(
            selectCurrency({
                field: Field.OUTPUT,
                currencyId: address,
            })
        )
    }, [chainId])

    return (
        <Layout>
            <Head>
                <title>SushiPro | Sushi</title>
                <meta name="description" content="Pro" />
            </Head>
            <div className="grid grid-flow-col grid-rows-12 xl:container gap-4">
                <div className="row-span-3 gap-4">
                    <div>
                        <SwapContainer />
                    </div>
                    <div>
                        <QuantStats />
                    </div>
                </div>
                <div style={{ minHeight: 600 }} className="col-span-8 border-gray-800 rounded pr-2 py-1 bg-dark-900">
                    <TVChartContainer />
                </div>
                <div style={{ minHeight: 500, maxHeight: 500 }} className="col-span-8 bg-dark-900 rounded">
                    <TabCard
                        titles={[i18n._(t`All Swaps`), i18n._(t`User Swaps`)]}
                        components={[<SwapHistory />, <UserSwapHistory />]}
                    />
                </div>
            </div>
        </Layout>
    )
}

export default Pro
