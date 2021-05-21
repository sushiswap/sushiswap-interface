import { Percent } from '@sushiswap/sdk'
import React from 'react'
import { ONE_BIPS } from '../../constants'
import { warningSeverity } from '../../utils/prices'

const SEVERITY = {
    0: 'text-green',
    1: 'text-high-emphesis',
    2: 'text-yellow',
    3: 'text-red',
    4: 'text-red'
}

export default function FormattedPriceImpact({ priceImpact }: { priceImpact?: Percent }) {
    return (
        <div className={`text-sm ${SEVERITY[warningSeverity(priceImpact)]}`}>
            {priceImpact ? (priceImpact.lessThan(ONE_BIPS) ? '<0.01%' : `${priceImpact.toFixed(2)}%`) : '-'}
        </div>
    )
}
