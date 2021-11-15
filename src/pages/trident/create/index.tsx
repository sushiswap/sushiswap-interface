import { PoolType } from '@sushiswap/tines'
import { TRIDENT_NETWORKS } from 'app/features/trident/constants'
import NetworkGuard from 'app/guards/Network'
import { StepThreeClassic } from 'features/trident/create/classic/StepThreeClassic'
import { StepTwoClassic } from 'features/trident/create/classic/StepTwoClassic'
import { currentStepAtom, selectedPoolTypeAtom } from 'features/trident/create/context/atoms'
import { StepOneSelectPoolType } from 'features/trident/create/StepOneSelectPoolType'
import { StepperSidebar } from 'features/trident/create/StepperSidebar'
import TridentLayout from 'layouts/Trident'
import React from 'react'
import { RecoilRoot, useRecoilValue } from 'recoil'

const CreateNewPool = () => {
  const currentStep = useRecoilValue(currentStepAtom)
  const selectedPool = useRecoilValue(selectedPoolTypeAtom)

  return (
    <div className="flex justify-center">
      <div className="flex w-full lg:mb-0 mb-10">
        <StepperSidebar />
        {currentStep === 1 && <StepOneSelectPoolType />}
        {currentStep === 2 && selectedPool === PoolType.ConstantProduct && <StepTwoClassic />}
        {currentStep === 3 && selectedPool === PoolType.ConstantProduct && <StepThreeClassic />}
      </div>
    </div>
  )
}

CreateNewPool.Guard = NetworkGuard(TRIDENT_NETWORKS)
CreateNewPool.Provider = RecoilRoot
CreateNewPool.Layout = (props) => (
  <TridentLayout {...props} breadcrumbs={[{ link: '/trident/pools', label: 'Pools' }, { label: 'Create Pool' }]} />
)

export default CreateNewPool
