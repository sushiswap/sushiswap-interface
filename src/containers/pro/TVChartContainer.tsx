import { FC, useState } from 'react'
import withPair from '../../hoc/withPair'
import { Pair } from '@sushiswap/sdk'
import ToggleButtonGroup from '../../components/Toggle/ToggleButtonGroup'
import ToggleButton from '../../components/Toggle/ToggleButton'

interface TVChartContainerProps {
    pair: Pair
}

const TVChartContainer: FC<TVChartContainerProps> = ({ pair }) => {
    const [active, setActive] = useState(pair?.token1.symbol === 'WETH' ? 0 : 1)
    const handleClick = (e, index) => setActive(index)
    return (
        <div className="flex flex-col h-full">
            <div className="p-3">
                <ToggleButtonGroup active={active}>
                    <ToggleButton onClick={handleClick}>
                        <div className="flex gap-1">
                            <span className="text-high-emphesis">{pair?.token0.symbol}</span>
                            <span className="text-secondary">/</span>
                            <span className="text-high-emphesis">USD</span>
                        </div>
                    </ToggleButton>
                    <ToggleButton onClick={handleClick}>
                        {pair?.token0.symbol}/{pair?.token1.symbol}
                    </ToggleButton>
                </ToggleButtonGroup>
            </div>
            <div className="h-full">
                <iframe
                    src={`http://localhost:5000?symbol=${
                        active === 0
                            ? `${pair?.token0.symbol}${pair?.token1.symbol}_USD`
                            : `${pair?.token0.symbol}${pair?.token1.symbol}`
                    }`}
                    width="100%"
                    height="100%"
                />
            </div>
        </div>
    )
}

export default withPair(TVChartContainer)
