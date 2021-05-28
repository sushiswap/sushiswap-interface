import { useLingui } from '@lingui/react'
import { useDerivedSwapInfo } from '../state/swap/hooks'
import { usePair } from '../hooks/usePair'
import { PairState } from '../hooks/usePairs'
import Lottie from 'lottie-react'
import loadingCircle from '../animation/loading-circle.json'
import { t } from '@lingui/macro'
import React from 'react'

const withPair = Component => ({ ...props }) => {
    const { i18n } = useLingui()
    const { currencies } = useDerivedSwapInfo()
    const [pairState, pair] = usePair(currencies.INPUT, currencies.OUTPUT)

    if (pairState === PairState.LOADING)
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
                <span className="text-secondary text-sm">{i18n._(t`Pair does not exist`)}</span>
            </div>
        )

    if (pairState === PairState.INVALID)
        return (
            <div className="h-full flex justify-center items-center">
                <span className="text-secondary text-sm">{i18n._(t`Please select a token`)}</span>
            </div>
        )

    return <Component pair={pair} {...props} />
}

export default withPair
