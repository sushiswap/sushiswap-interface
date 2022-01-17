import { selectTridentCreate, setCreateCurrentStep } from 'app/features/trident/create/createSlice'
import { classNames } from 'app/functions'
import { useAppDispatch, useAppSelector } from 'app/state/hooks'
import React, { FC } from 'react'

import { activeStepColor, completedStepGradient, stepAheadColor, StepProps, stepTitleText } from './StepConstants'

const Step: FC<StepProps> = ({ stepNum, title, currentStep, stepSetter }) => {
  const isActive = stepNum === currentStep
  const isCompleted = currentStep > stepNum

  return (
    <div
      className={classNames(
        'flex mt-5 select-none',
        isActive ? 'text-high-emphesis' : 'text-secondary',
        isCompleted && 'hover:cursor-pointer'
      )}
      onClick={() => isCompleted && stepSetter(stepNum)}
    >
      <div
        className={classNames(
          'w-1.5',
          isActive ? activeStepColor : isCompleted ? `bg-gradient-to-b ${completedStepGradient}` : stepAheadColor
        )}
      />
      <div className="ml-5">
        <div>Step {stepNum}</div>
        <div>{title}</div>
      </div>
    </div>
  )
}

export const StepperSidebar: FC = () => {
  const dispatch = useAppDispatch()
  const { currentStep } = useAppSelector(selectTridentCreate)

  return (
    <div className="flex-none w-52 border-r border-dark-800 mt-6 hidden lg:block pr-2">
      <Step
        stepNum={1}
        title={stepTitleText[1]}
        currentStep={currentStep}
        stepSetter={(step) => dispatch(setCreateCurrentStep(step))}
      />
      <Step
        stepNum={2}
        title={stepTitleText[2]}
        currentStep={currentStep}
        stepSetter={(step) => dispatch(setCreateCurrentStep(step))}
      />
    </div>
  )
}
