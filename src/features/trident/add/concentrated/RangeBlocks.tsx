import RangeInput from 'app/components/RangeInput'
import { FC } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'

import { maxPriceAtom, minPriceAtom, poolAtom } from '../../context/atoms'

const RangeBlocks: FC = () => {
  const { pool } = useRecoilValue(poolAtom)
  const [minPrice, setMinPrice] = useRecoilState(minPriceAtom)
  const [maxPrice, setMaxPrice] = useRecoilState(maxPriceAtom)

  return (
    <div className="grid grid-cols-2 gap-3 px-5">
      <RangeInput
        color="blue"
        label="MIN PRICE"
        value={minPrice}
        onChange={setMinPrice}
        base={pool?.token0}
        quote={pool?.token1}
      />
      <RangeInput
        color="purple"
        label="MAX PRICE"
        value={maxPrice}
        onChange={setMaxPrice}
        base={pool?.token0}
        quote={pool?.token1}
      />
    </div>
  )
}

export default RangeBlocks
