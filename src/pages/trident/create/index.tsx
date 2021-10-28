import TridentLayout from '../../../layouts/Trident'
import { RecoilRoot, useRecoilValue } from 'recoil'
import React from 'react'
import { StepperSidebar } from '../../../features/trident/create/StepperSidebar'
import { currentStepAtom, selectedPoolTypeAtom } from '../../../features/trident/create/context/atoms'
import { StepOneSelectPoolType } from '../../../features/trident/create/StepOneSelectPoolType'
import { StepTwoClassic } from '../../../features/trident/create/classic/StepTwoClassic'
import { StepThreeClassic } from '../../../features/trident/create/classic/StepThreeClassic'
import { PoolType } from '../../../features/trident/types'

const CreateNewPool = () => {
  const currentStep = useRecoilValue(currentStepAtom)
  const selectedPool = useRecoilValue(selectedPoolTypeAtom)

  return (
    <div className="flex justify-center">
      <div className="flex w-full lg:mb-0 mb-10">
        <StepperSidebar />
        {currentStep === 1 && <StepOneSelectPoolType />}
        {currentStep === 2 && selectedPool === PoolType.Classic && <StepTwoClassic />}
        {currentStep === 3 && selectedPool === PoolType.Classic && <StepThreeClassic />}
      </div>
    </div>
  )
}

CreateNewPool.Provider = RecoilRoot
CreateNewPool.Layout = (props) => (
  <TridentLayout {...props} breadcrumbs={[{ link: '/trident/pools', label: 'Pools' }, { label: 'Create Pool' }]} />
)

export default CreateNewPool
