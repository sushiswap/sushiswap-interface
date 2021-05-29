import React from 'react'
import Head from 'next/head'
import Layout from '../layouts/DefaultLayout'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import SwapContainer from '../features/swap/SwapContainer'

export default function Swap() {
    const { i18n } = useLingui()
    return (
        <Layout>
            <Head>
                <title>{i18n._(t`SushiSwap`)} | Sushi</title>
                <meta
                    name="description"
                    content="SushiSwap allows for swapping of ERC20 compatible tokens across multiple networks"
                />
            </Head>
            <SwapContainer />
        </Layout>
    )
}
