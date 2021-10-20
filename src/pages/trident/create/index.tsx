import TridentLayout from '../../../layouts/Trident'
import { RecoilRoot, useRecoilValue } from 'recoil'
import React from 'react'
import { StepperSidebar } from '../../../features/trident/create/StepperSidebar'
import { currentStepAtom } from '../../../features/trident/create/context/atoms'
import { StepOneSelectPoolType } from '../../../features/trident/create/StepOneSelectPoolType'
import { StepTwoSelectAssets } from '../../../features/trident/create/StepTwoSelectAssets'
import { StepThreeConfirm } from '../../../features/trident/create/StepThreeConfirm'

const CreateNewPool = () => {
  const currentStep = useRecoilValue(currentStepAtom)

  return (
    <div className="flex justify-center">
      <div className="flex w-full">
        <StepperSidebar />
        {currentStep === 1 && <StepOneSelectPoolType />}
        {currentStep === 2 && <StepTwoSelectAssets />}
        {currentStep === 3 && <StepThreeConfirm />}
      </div>
    </div>
  )
}

CreateNewPool.Provider = RecoilRoot
CreateNewPool.Layout = (props) => (
  <TridentLayout {...props} breadcrumbs={[{ link: '/trident/pools', label: 'Pools' }, { label: 'Create Pool' }]} />
)

export default CreateNewPool
