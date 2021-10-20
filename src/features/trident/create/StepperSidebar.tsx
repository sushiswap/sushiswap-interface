import React, { FC } from 'react'
import { classNames } from '../../../functions'
import { SetterOrUpdater, useRecoilState } from 'recoil'
import { CreatePoolStep, currentStepAtom } from './context/atoms'

interface StepProps {
  stepNum: CreatePoolStep
  title: string
  currentStep: CreatePoolStep
  stepSetter: SetterOrUpdater<CreatePoolStep>
}

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
          isActive ? 'bg-blue' : isCompleted ? 'bg-gradient-to-b from-opaque-blue to-opaque-pink' : 'bg-dark-700'
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
  const [currentStep, setCurrentStep] = useRecoilState(currentStepAtom)

  return (
    <div className="flex-none w-52 border-r border-gray-800 mt-6 hidden lg:block">
      <Step stepNum={1} title="Select pool type" currentStep={currentStep} stepSetter={setCurrentStep} />
      <Step stepNum={2} title="Select assets & fees" currentStep={currentStep} stepSetter={setCurrentStep} />
      <Step stepNum={3} title="Deposit & confirm" currentStep={currentStep} stepSetter={setCurrentStep} />
    </div>
  )
}
