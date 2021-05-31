import CurrencySelectPanel, { CurrencySelectPanelVariant } from '../../components/CurrencySelectPanel'
import React, { FC } from 'react'
import { Pair } from '@sushiswap/sdk'
import withPair from '../../hoc/withPair'

interface MarketSelectProps {
    pair: Pair
}

const MarketSelect: FC<MarketSelectProps> = ({ pair }) => {
    return (
        <div className="flex h-[64px] px-4 border-dark-800 gap-2 items-center">
            <CurrencySelectPanel
                id="from"
                onCurrencySelect={() => {}}
                variant={CurrencySelectPanelVariant.minimal}
                currency={pair.token0}
            />
            <span className="text-secondary text-lg">-</span>
            <CurrencySelectPanel
                id="to"
                onCurrencySelect={() => {}}
                variant={CurrencySelectPanelVariant.minimal}
                currency={pair.token1}
            />
        </div>
    )
}

export default withPair(MarketSelect)
