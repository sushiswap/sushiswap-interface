import React from 'react'
import { Helmet } from 'react-helmet'
import TradingViewWidget, { Themes, BarStyles } from 'react-tradingview-widget'

export default function TradeLayout() {
    return (
        <>
            <Helmet>
                <title>Trade | Sushi</title>
                <meta
                    name="description"
                    content="Sushi allows for trading of ERC20 compatible tokens across multiple networks"
                />
            </Helmet>
            <div className="w-full">
                <TradingViewWidget
                    symbol="BINANCE:SUSHIUSDT"
                    theme={Themes.DARK}
                    locale="en"
                    autosize={false}
                    range={'5D'}
                    withdateranges={true}
                    width={'100%'}
                    height={700}
                    style={BarStyles.AREA}
                    save_image={false}
                    details={false}
                    hide_side_toolbar={true}
                    hide_legend={true}
                    hideideas={true}
                />
            </div>
        </>
    )
}
