import { FC } from 'react'
import withPair from '../../hoc/withPair'
import CurrencyLogo from '../../components/CurrencyLogo'
import { Pair } from '@sushiswap/sdk'

interface PriceHeaderStatsProps {
    pair: Pair
}

const PriceHeaderStats: FC<PriceHeaderStatsProps> = ({ pair }) => {
    return (
        <div className="flex flex-col p-3">
            <div className="flex flex-row gap-3">
                <div className="flex flex-row">
                    <CurrencyLogo currency={pair.token0} />
                    <CurrencyLogo currency={pair.token1} />
                </div>
                <div className="flex flex-row gap-1">
                    <span className="text-high-emphesis font-bold">{pair.token0.symbol}</span>
                    <span className="text-secondary">/</span>
                    <span className="text-secondary font-bold">{pair.token1.symbol}</span>
                </div>
            </div>
        </div>
    )
}

export default withPair(PriceHeaderStats)
