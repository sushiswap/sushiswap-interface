import CurrencySelectPanel, {
    CurrencySelectPanelVariant,
} from '../../components/CurrencySelectPanel'
import React, { FC } from 'react'
import withPair, { WithPairProps } from '../../hoc/withPair'

interface MarketSelectProps extends WithPairProps {}

const MarketSelect: FC<MarketSelectProps> = ({ pair }) => {
    return (
        <div className="flex h-full gap-2 items-center">
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
