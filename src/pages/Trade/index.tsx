import React from 'react'
import { Helmet } from 'react-helmet'
import TradingViewWidget, { BarStyles, Themes } from 'react-tradingview-widget'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'

export default function TradeLayout() {
    const { i18n } = useLingui()
    return (
        <>
            <Helmet>
                <title>{i18n._(t`Trade`)} | Sushi</title>
                <meta
                    name="description"
                    content={i18n._(t`Sushi allows for swapping of ERC20 compatible tokens across multiple networks`)}
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
