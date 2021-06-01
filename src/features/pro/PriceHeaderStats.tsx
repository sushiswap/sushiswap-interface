import React, { FC, useMemo } from 'react'
import { useSwapHistory } from '../../context/Pro/hooks'
import { useLingui } from '@lingui/react'
import { t } from '@lingui/macro'
import { priceFormatter } from '../../functions'
import { OrderDirection, SwapMessage } from '../../context/Pro/types'

interface PriceHeaderStatsProps {}

const PriceHeaderStats: FC<PriceHeaderStatsProps> = () => {
    const { i18n } = useLingui()
    const swapHistory = useSwapHistory()
    const lastSwap = useMemo<SwapMessage | null>(
        () => (swapHistory.length > 0 ? swapHistory[swapHistory.length - 1] : null),
        [swapHistory]
    )

    return (
        <div className="flex h-full px-4 gap-12 text-sm items-center">
            <div className="flex gap-1 items-baseline">
                <span
                    className={`text-high-emphesis font-bold flex items-baseline font-mono ${
                        lastSwap?.side === OrderDirection.BUY ? 'text-green' : 'text-red'
                    }`}
                >
                    {priceFormatter.format(lastSwap?.price)}
                </span>
                <span className="text-secondary text-xs">{i18n._(t`Last trade price`)}</span>
            </div>
            <div className="flex gap-1 items-baseline">
                <span className="text-high-emphesis font-bold font-mono">$158,014,358.38</span>
                <span className="text-secondary text-xs">{i18n._(t`24h volume`)}</span>
            </div>
            <div className="flex gap-1 items-baseline">
                <span className="text-high-emphesis font-bold font-mono">$3,131,517,279.36</span>
                <span className="text-secondary text-xs">{i18n._(t`Liquidity`)}</span>
            </div>
            <div className="flex gap-1 items-baseline">
                <span className="text-high-emphesis font-bold font-mono">$3,131,517,279.36</span>
                <span className="text-secondary text-xs">{i18n._(t`Fully diluted market cap`)}</span>
            </div>
        </div>
    )
}

export default PriceHeaderStats
