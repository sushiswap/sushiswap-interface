import Head from 'next/head'
import { FC } from 'react'
import PriceHeaderStats from '../features/pro/PriceHeaderStats'
import Header from '../components/Header'
import Footer from '../components/Footer'
import ProProvider from '../context/Pro'
import TVChartContainer from '../features/pro/TVChartContainer'
import SwapHistory from '../features/pro/SwapHistory'
import QuantStats from '../features/pro/QuantStats'
import UserSwapHistory from '../features/pro/UserSwapHistory'
import OrderForm from '../features/pro/OrderForm'
import MarketSelect from '../features/pro/MarketSelect'

const Pro: FC = () => {
    return (
        <ProProvider>
            <Header />
            <Head>
                <title>SushiPro | Sushi</title>
                <meta name="description" content="Pro" />
            </Head>
            <div className="flex flex-col max-h-[calc(100vh-80px)] min-h-[calc(100vh-80px)] bg-[rgba(255,255,255,0.04)] fixed left-0 right-0">
                <div className="flex flex-col relative w-full h-full">
                    <div className="flex flex-row min-h-[48px] max-h-[48px] border-b border-gray-800">
                        <div className="flex flex-col w-[324px] border-r border-gray-800">
                            <MarketSelect />
                        </div>
                        <div className="flex flex-col border-gray-800">
                            <PriceHeaderStats />
                        </div>
                    </div>
                    <div className="flex flex-row relative h-[calc(100vh-128px)] w-full">
                        <div className="flex flex-col w-[324px] h-full border-r border-gray-800">
                            <OrderForm />
                        </div>
                        <div className="flex flex-col w-[324px] border-r border-gray-800">
                            <SwapHistory />
                        </div>
                        <div className="flex flex-col min-w-[calc(100%-648px)] max-w-[calc(100%-648px)]">
                            <div className="min-h-[600px] border-b border-gray-800">
                                <TVChartContainer />
                            </div>
                            <UserSwapHistory />
                        </div>
                    </div>
                    <div className="col-span-2 border-dark-800">
                        <QuantStats />
                    </div>
                </div>
            </div>
            <Footer />
        </ProProvider>
    )
}

export default Pro
