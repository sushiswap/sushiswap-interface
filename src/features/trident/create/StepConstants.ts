import { SetterOrUpdater } from 'recoil'

import { CreatePoolStep } from './context/atoms'

export const completedStepGradient = 'from-opaque-blue to-opaque-pink'
export const activeStepColor = 'bg-blue'
export const stepAheadColor = 'bg-dark-700'

export interface StepProps {
  stepNum: CreatePoolStep
  title: string
  currentStep: CreatePoolStep
  stepSetter: SetterOrUpdater<CreatePoolStep>
  isLastStep?: boolean
}

export const stepTitleText: Record<CreatePoolStep, string> = {
  1: 'Select pool type',
  2: 'Select assets & deposit',
}
