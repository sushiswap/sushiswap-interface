import React, { FC, useState } from 'react'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { PairState } from '../../hooks/usePairs'
import { useDerivedSwapInfo } from '../../state/swap/hooks'
import { usePair } from '../../hooks/usePair'
import loadingCircle from '../../animation/loading-circle.json'
import Lottie from 'lottie-react'

const TVChartContainer: FC = () => {
    const { currencies } = useDerivedSwapInfo()
    const [pairState, pair] = usePair(currencies.INPUT, currencies.OUTPUT)
    const { i18n } = useLingui()
    const [loading, setLoading] = useState(false)

    if (pairState === PairState.LOADING || loading)
        return (
            <div className="h-full flex justify-center items-center">
                <div className="w-10 h-10">
                    <Lottie animationData={loadingCircle} autoplay loop />
                </div>
            </div>
        )

    if (pairState === PairState.NOT_EXISTS)
        return (
            <div className="h-full flex justify-center items-center">
                <div className="text-secondary text-sm">{i18n._(t`Pair does not exist`)}</div>
            </div>
        )

    if (pairState === PairState.INVALID)
        return (
            <div className="h-full flex justify-center items-center">
                <div className="text-secondary text-sm">{i18n._(t`Please select a token`)}</div>
            </div>
        )

    // TODO URL
    return (
        <iframe
            src={`http://localhost:5000?symbol=${pair?.token0.symbol}${pair?.token1.symbol}_USD`}
            width="100%"
            height="100%"
            onLoad={() => setLoading(false)}
        />
    )
}

export default TVChartContainer
