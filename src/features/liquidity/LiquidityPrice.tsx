import { Currency, Price } from '@sushiswap/sdk'

import React from 'react'
import Typography from '../../components/Typography'
import { useActiveWeb3React } from '../../hooks/useActiveWeb3React'

export default function LiquidityPrice({
    input,
    output,
    price,
}: {
    input?: Currency
    output?: Currency
    price?: Price
}): JSX.Element {
    const { chainId } = useActiveWeb3React()
    return (
        <div className="p-1 -mt-5 rounded-b-md bg-dark-800">
            <div className="flex justify-between w-full px-5 py-1 rounded-b-md md:bg-dark-900 text-secondary">
                <Typography variant="caption2" className="text-secondary">
                    Exchange Rate
                </Typography>
                <Typography variant="caption2" className="text-secondary">
                    {price?.toSignificant(6) ?? '-'}{' '}
                    {output?.getSymbol(chainId)} per {input?.getSymbol(chainId)}
                </Typography>
            </div>
        </div>
    )
}
