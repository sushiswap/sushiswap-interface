import { Currency, Price } from '@sushiswap/sdk'

import { AutoRow } from '../../components/Row'
import React from 'react'
import { useActiveWeb3React } from '../../hooks/useActiveWeb3React'

export default function LiquidityPrice({
    input,
    output,
    price
}: {
    input?: Currency
    output?: Currency
    price?: Price
}): JSX.Element {
    const { chainId } = useActiveWeb3React()
    return (
        <div className="p-1 rounded-b-md md:bg-dark-800" style={{ marginTop: '-20px' }}>
            <AutoRow
                justify={'space-between'}
                style={{ padding: '0 1rem' }}
                className="py-1 rounded-b-md md:bg-dark-900 text-secondary"
            >
                <div>Current Rate</div>
                <div>
                    {price?.toSignificant(6) ?? '-'} {output?.getSymbol(chainId)} per {input?.getSymbol(chainId)}
                </div>
            </AutoRow>
        </div>
    )
}
