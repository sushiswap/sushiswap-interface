import { FC } from 'react'
import RangeInput from '../../../../components/RangeInput'

const RangeBlocks: FC = () => {
  return (
    <div className="flex flex-row gap-3">
      <RangeInput color="blue" label="MIN PRICE" price={null} />
      <RangeInput color="purple" label="MAX PRICE" price={null} />
    </div>
  )
}

export default RangeBlocks
