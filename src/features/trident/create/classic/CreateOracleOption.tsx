import React, { FC } from 'react'
import Typography from '../../../../components/Typography'
import Checkbox from '../../../../components/Checkbox'
import { useRecoilState } from 'recoil'
import { createAnOracleSelectionAtom } from '../context/atoms'

export const CreateOracleOption: FC = () => {
  const [createAnOracle, setCreateAnOracle] = useRecoilState(createAnOracleSelectionAtom)

  return (
    <div>
      <Typography variant="h3" weight={700} className="text-high-emphesis">
        Create Oracle for this Pair?
      </Typography>
      <div className="text-secondary mt-2">
        Creating oracle enables the pool to store its price data and provides more accurate swap rate. However, the swap
        gas fee will be higher.
      </div>
      <div
        className="flex gap-2 items-center mt-8 hover:cursor-pointer"
        onClick={() => setCreateAnOracle(!createAnOracle)}
      >
        <Checkbox color="blue" checked={createAnOracle} />
        <span className="text-xs">Yes create an oracle</span>
      </div>
    </div>
  )
}
