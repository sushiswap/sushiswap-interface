import { FC, useState } from 'react'
import withPair, { WithPairProps } from '../../hoc/withPair'
import ToggleButtonGroup from '../../components/Toggle/ToggleButtonGroup'
import ToggleButton from '../../components/Toggle/ToggleButton'

interface TVChartContainerProps extends WithPairProps {}

const TVChartContainer: FC<TVChartContainerProps> = ({ pair }) => {
    const [active, setActive] = useState(pair?.token1.symbol === 'WETH' ? 0 : 1)
    const handleClick = (e, index) => setActive(index)
    return (
        <div className="h-full">
            <div className="border-b border-dark-800 h-10">
                <ToggleButtonGroup active={active}>
                    <ToggleButton value={0} onClick={handleClick}>
                        <div className="flex gap-0.5 text-xs">
                            <span className="text-high-emphesis">{pair?.token0.symbol}</span>
                            <span className="text-secondary">-</span>
                            <span className="text-high-emphesis">USD</span>
                        </div>
                    </ToggleButton>
                    <ToggleButton value={1} onClick={handleClick}>
                        <div className="flex gap-0.5 text-xs">
                            <span className="text-high-emphesis">{pair?.token0.symbol}</span>
                            <span className="text-secondary">-</span>
                            <span className="text-high-emphesis">{pair?.token1.symbol}</span>
                        </div>
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
