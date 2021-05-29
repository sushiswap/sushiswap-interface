import React, { FC, useMemo } from 'react'
import CurrencyLogo from '../../components/CurrencyLogo'
import { Pair } from '@sushiswap/sdk'
import withPair from '../../hoc/withPair'
import { useSwapHistory } from '../../context/Pro/hooks'
import { useLingui } from '@lingui/react'
import { t } from '@lingui/macro'
import { priceFormatter } from '../../functions'
import usePrevious from '../../hooks/usePrevious'

interface PriceHeaderStatsProps {
    pair: Pair
}

const PriceHeaderStats: FC<PriceHeaderStatsProps> = ({ pair }) => {
    const { i18n } = useLingui()
    const swapHistory = useSwapHistory()
    const price = useMemo(() => (swapHistory.length > 0 ? swapHistory[swapHistory.length - 1].price : 0), [swapHistory])
    const prevPrice = usePrevious(price)

    return (
        <div className="flex h-[64px] px-4 border-dark-800 items-center">
            <div className="flex gap-12">
                <div className="flex flex-row gap-3">
                    <div className="flex flex-row">
                        <CurrencyLogo currency={pair.token0} squared />
                        <CurrencyLogo currency={pair.token1} squared />
                    </div>
                    <div className="flex flex-row gap-1">
                        <span className="text-high-emphesis font-bold">{pair.token0.symbol}</span>
                        <span className="text-secondary">-</span>
                        <span className="text-secondary font-bold">{pair.token1.symbol}</span>
                    </div>
                </div>
                <div className="flex gap-1 items-baseline">
                    <span
                        className={`text-high-emphesis font-bold flex items-baseline ${
                            price > prevPrice ? 'text-green' : 'text-red'
                        }`}
                    >
                        {priceFormatter.format(price)}
                    </span>
                    <span className="text-secondary text-sm">{i18n._(t`Price`)}</span>
                </div>
                <div className="flex gap-1 items-baseline">
                    <span className="text-high-emphesis font-bold">$158,014,358.38</span>
                    <span className="text-secondary text-sm">{i18n._(t`24h Volume`)}</span>
                </div>
                <div className="flex gap-1 items-baseline">
                    <span className="text-high-emphesis font-bold">$3,131,517,279.36</span>
                    <span className="text-secondary text-sm">{i18n._(t`Liquidity`)}</span>
                </div>
            </div>
        </div>
    )
}

export default withPair(PriceHeaderStats)
