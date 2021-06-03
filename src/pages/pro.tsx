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
import { Responsive, WidthProvider } from 'react-grid-layout'
import Tabs from '../components/Tabs'
import Balances from '../features/pro/Balances'

const ResponsiveGridLayout = WidthProvider(Responsive)

const Card: FC<{ title?: string }> = ({ children, title }) => {
    return (
        <div className="bg-dark-900 rounded-sm overflow-hidden h-full">
            {title && (
                <div className="flex text-sm font-bold text-secondary h-10 bg-dark-800 items-center px-4">
                    {title}
                </div>
            )}
            {children}
        </div>
    )
}

const Pro: FC = () => {
    const layouts = {
        lg: [
            { i: 'OrderForm', x: 0, y: 0, w: 4, h: 10 },
            { i: 'QuantStats', x: 0, y: 20, w: 4, h: 10 },
            { i: 'SwapHistory', x: 4, y: 20, w: 4, h: 20 },
            { i: 'TVChart', x: 8, y: 0, w: 16, h: 14 },
            { i: 'Positions', x: 8, y: 20, w: 16, h: 6 },
        ],
    }
    return (
        <ProProvider>
            <Header />
            <Head>
                <title>SushiPro | Sushi</title>
                <meta name="description" content="Pro" />
            </Head>
            <div className="flex flex-col w-full gap-2">
                <div className="flex flex-row w-full p-4 pb-0">
                    <div className="flex flex-col min-w-[324px] justify-center">
                        <MarketSelect />
                    </div>
                    <div className="flex flex-col justify-center">
                        <PriceHeaderStats />
                    </div>
                </div>
                <div className="flex flex-row w-full relative">
                    <ResponsiveGridLayout
                        style={{ width: '100%' }}
                        breakpoints={{
                            lg: 1200,
                            md: 996,
                            sm: 768,
                            xs: 480,
                            xxs: 0,
                        }}
                        cols={{ lg: 24, md: 10, sm: 6, xs: 4, xxs: 2 }}
                        className="layout"
                        layouts={layouts}
                        rowHeight={30}
                    >
                        <div key="OrderForm">
                            <Card>
                                <OrderForm />
                            </Card>
                        </div>
                        <div key="QuantStats">
                            <Card>
                                <QuantStats />
                            </Card>
                        </div>
                        <div key="SwapHistory">
                            <Card title="Recent Trades">
                                <SwapHistory />
                            </Card>
                        </div>
                        <div key="Positions">
                            <Card>
                                <Tabs
                                    titles={['Balances', 'Transaction History']}
                                    components={[
                                        <Balances />,
                                        <UserSwapHistory />,
                                    ]}
                                />
                            </Card>
                        </div>
                        <div key="TVChart">
                            <Card>
                                <TVChartContainer />
                            </Card>
                        </div>
                    </ResponsiveGridLayout>
                </div>
            </div>

            <Footer />
        </ProProvider>
    )
}

export default Pro
