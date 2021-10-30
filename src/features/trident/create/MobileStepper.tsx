import { classNames } from 'functions'
import React, { FC } from 'react'
import { useRecoilState } from 'recoil'

import { currentStepAtom } from './context/atoms'
import { activeStepColor, completedStepGradient, stepAheadColor, StepProps, stepTitleText } from './StepConstants'

const Step: FC<StepProps> = ({ stepNum, title, currentStep, stepSetter }) => {
  const isActive = stepNum === currentStep
  const isCompleted = currentStep > stepNum

  return (
    <div
      onClick={() => isCompleted && stepSetter(stepNum)}
      className={classNames(isActive ? 'text-high-emphesis' : 'text-secondary', isCompleted && 'hover:cursor-pointer')}
    >
      <div className="p-4">
        <div>Step {stepNum}</div>
        <div className="truncate">{title}</div>
      </div>
      <div
        className={classNames(
          'h-1.5',
          isActive ? activeStepColor : isCompleted ? `bg-gradient-to-r ${completedStepGradient}` : stepAheadColor
        )}
      />
    </div>
  )
}

export const MobileStepper: FC = () => {
  const [currentStep, setCurrentStep] = useRecoilState(currentStepAtom)

  return (
    <div className="lg:hidden grid grid-cols-3 gap-6 -mb-10">
      <Step stepNum={1} title={stepTitleText[1]} currentStep={currentStep} stepSetter={setCurrentStep} />
      <Step stepNum={2} title={stepTitleText[2]} currentStep={currentStep} stepSetter={setCurrentStep} />
      <Step stepNum={3} title={stepTitleText[3]} currentStep={currentStep} stepSetter={setCurrentStep} />
    </div>
  )
}
