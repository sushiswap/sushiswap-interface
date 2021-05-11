import React from 'react'
import { Helmet } from 'react-helmet'
import TradingViewWidget, { Themes, BarStyles } from 'react-tradingview-widget'
import Swap from './index'
import { t } from '@lingui/macro'

export default function TradeLayout() {
    return (
        <>
            <Helmet>
                <title>{t`Trade`} | Sushi</title>
                <meta
                    name="description"
                    content={t`Sushi allows for swapping of ERC20 compatible tokens across multiple networks`}
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
                    height={window.innerHeight - 180}
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
