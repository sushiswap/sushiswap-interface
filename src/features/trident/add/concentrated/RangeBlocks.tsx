import { FC } from 'react'
import RangeInput from '../../../../components/RangeInput'
import { useTridentContext, useTridentState } from '../../context'
import { ConcentratedPoolContext, ConcentratedPoolState } from './context/types'

const RangeBlocks: FC = () => {
  const { minPrice, maxPrice } = useTridentState<ConcentratedPoolState>()
  const { setMinPrice, setMaxPrice, pool } = useTridentContext<ConcentratedPoolContext>()

  return (
    <div className="grid grid-cols-2 gap-3 px-5">
      <RangeInput
        color="blue"
        label="MIN PRICE"
        value={minPrice}
        onChange={setMinPrice}
        base={pool.tokens[0]}
        quote={pool.tokens[1]}
      />
      <RangeInput
        color="purple"
        label="MAX PRICE"
        value={maxPrice}
        onChange={setMaxPrice}
        base={pool.tokens[0]}
        quote={pool.tokens[1]}
      />
    </div>
  )
}

export default RangeBlocks
