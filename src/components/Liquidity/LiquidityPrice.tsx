import React from 'react'
import { Currency, Price } from '@sushiswap/sdk'
import { AutoRow } from '../../components/Row'
import { useActiveWeb3React } from '../../hooks/useActiveWeb3React'
import { Field } from '../../state/mint/actions'

export default function LiquidityPrice({
    currencies,
    price
}: {
    currencies: { [field in Field]?: Currency }
    price?: Price
}): JSX.Element {
    const { chainId } = useActiveWeb3React()
    return (
        <div className="rounded-b-md md:bg-dark-800 p-1" style={{ marginTop: '-20px' }}>
            <AutoRow
                justify={'space-between'}
                style={{ padding: '0 1rem' }}
                className="rounded-b-md md:bg-dark-900 text-secondary py-1"
            >
                <div>Current Rate</div>
                <div>
                    {price?.toSignificant(6) ?? '-'} {currencies[Field.CURRENCY_B]?.getSymbol(chainId)} per{' '}
                    {currencies[Field.CURRENCY_A]?.getSymbol(chainId)}
                </div>
            </AutoRow>
        </div>
    )
}
