import { FC } from 'react'
import RangeInput from '../../../../components/RangeInput'
import { useTridentAddConcentratedContext, useTridentAddConcentratedState } from './context'

const RangeBlocks: FC = () => {
  const { minPrice, maxPrice } = useTridentAddConcentratedState()
  const { currencies, setMinPrice, setMaxPrice } = useTridentAddConcentratedContext()

  const [currencyA, currencyB] = Object.values(currencies)

  return (
    <div className="grid grid-cols-2 gap-3 px-5">
      <RangeInput
        color="blue"
        label="MIN PRICE"
        value={minPrice}
        onChange={setMinPrice}
        base={currencyA}
        quote={currencyB}
      />
      <RangeInput
        color="purple"
        label="MAX PRICE"
        value={maxPrice}
        onChange={setMaxPrice}
        base={currencyA}
        quote={currencyB}
      />
    </div>
  )
}

export default RangeBlocks
