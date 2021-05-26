import Head from 'next/head'
import Layout from '../layouts/DefaultLayout'
import React from 'react'

export default function Migrate() {
    return (
        <Layout>
            <Head>
                <title>Migrate | Sushi</title>
                <meta name="description" content="Migrate your liquidity to SushiSwap." />
            </Head>
        </Layout>
    )
}
