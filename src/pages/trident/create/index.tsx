import { PoolType } from '@sushiswap/tines'
import { Feature } from 'app/enums'
import { selectTridentCreate } from 'app/features/trident/create/createSlice'
import { StepOneSelectPoolType } from 'app/features/trident/create/StepOneSelectPoolType'
import { StepperSidebar } from 'app/features/trident/create/StepperSidebar'
import { StepTwoClassic } from 'app/features/trident/create/StepTwoClassic'
import NetworkGuard from 'app/guards/Network'
import TridentLayout from 'app/layouts/Trident'
import { useAppSelector } from 'app/state/hooks'
import React from 'react'

const CreateNewPool = () => {
  const { currentStep, selectedPoolType } = useAppSelector(selectTridentCreate)

  return (
    <div className="flex justify-center">
      <div className="flex w-full mb-10 lg:mb-0">
        <StepperSidebar />
        {currentStep === 1 && <StepOneSelectPoolType />}
        {currentStep === 2 && selectedPoolType === PoolType.ConstantProduct && <StepTwoClassic />}
      </div>
    </div>
  )
}

CreateNewPool.Guard = NetworkGuard(Feature.TRIDENT)
CreateNewPool.Layout = TridentLayout

export default CreateNewPool
