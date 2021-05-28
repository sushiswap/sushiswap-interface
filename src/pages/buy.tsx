import Head from 'next/head'
import Layout from '../layouts/DefaultLayout'
import transakSDK from '@transak/transak-sdk'
import { useEffect } from 'react'

let transak = new transakSDK({
    apiKey: '790ce36e-bc59-4c48-81b3-a245c34b71dc', // Your API Key
    environment: 'STAGING', // STAGING/PRODUCTION
    defaultCryptoCurrency: 'ETH',
    walletAddress: '', // Your customer's wallet address
    themeColor: '000000', // App theme color
    fiatCurrency: '', // INR/GBP
    email: '', // Your customer's email address
    redirectURL: '',
    hostURL: window.location.origin,
    widgetHeight: '550px',
    widgetWidth: '450px',
})

export default function Buy() {
    useEffect(() => {
        transak.init()

        // To get all the events
        transak.on(transak.ALL_EVENTS, (data) => {
            console.log(data)
        })

        // This will trigger when the user marks payment is made.
        transak.on(transak.EVENTS.TRANSAK_ORDER_SUCCESSFUL, (orderData) => {
            console.log(orderData)
            transak.close()
        })
    }, [])
    return (
        <Layout>
            <Head>
                <title>Buy | Sushi</title>
                <meta name="description" content="Buy..." />
            </Head>
        </Layout>
    )
}
