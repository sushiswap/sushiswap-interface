import React, { FC } from 'react'
import { useSetRecoilState } from 'recoil'
import { currentStepAtom } from '../context/atoms'
import Button from '../../../../components/Button'
import Typography from '../../../../components/Typography'
import { SushiWethExample } from './SushiWethExample'

export const ClassicDescription: FC = () => {
  const setCurrentStep = useSetRecoilState(currentStepAtom)
  return (
    <div className="mt-12 grid lg:grid-cols-2 grid-cols-1 gap-8">
      <div className="flex flex-col gap-4">
        <Typography variant="h3" weight={700} className="text-high-emphesis">
          Classic
        </Typography>
        <div>The original and most common type of pool, with two assets deposited in roughly equal value amounts.</div>
      </div>
      <div>
        <div>Example</div>
        <SushiWethExample />
      </div>
      <Button className="w-72" color="gradient" variant="filled" onClick={() => setCurrentStep(2)}>
        Continue
      </Button>
    </div>
  )
}
