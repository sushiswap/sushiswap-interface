import { PoolType } from '@sushiswap/tines'
import { Feature } from 'app/enums'
import { StepTwoClassic } from 'app/features/trident/create/classic/StepTwoClassic'
import { currentStepAtom, selectedPoolTypeAtom } from 'app/features/trident/create/context/atoms'
import { StepOneSelectPoolType } from 'app/features/trident/create/StepOneSelectPoolType'
import { StepperSidebar } from 'app/features/trident/create/StepperSidebar'
import NetworkGuard from 'app/guards/Network'
import TridentLayout from 'app/layouts/Trident'
import React from 'react'
import { useRecoilValue } from 'recoil'

const CreateNewPool = () => {
  const currentStep = useRecoilValue(currentStepAtom)
  const selectedPool = useRecoilValue(selectedPoolTypeAtom)

  return (
    <div className="flex justify-center">
      <div className="flex w-full mb-10 lg:mb-0">
        <StepperSidebar />
        {currentStep === 1 && <StepOneSelectPoolType />}
        {currentStep === 2 && selectedPool === PoolType.ConstantProduct && <StepTwoClassic />}
      </div>
    </div>
  )
}

CreateNewPool.Guard = NetworkGuard(Feature.TRIDENT)
CreateNewPool.Layout = (props) => (
  <TridentLayout {...props} breadcrumbs={[{ link: '/trident/pools', label: 'Pools' }, { label: 'Create Pool' }]} />
)

export default CreateNewPool
