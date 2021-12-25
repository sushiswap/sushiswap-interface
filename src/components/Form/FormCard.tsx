import { FC, ReactElement } from 'react'

import { FormSectionProps } from './FormSection'

export interface FormCardProps {
  children: ReactElement<FormSectionProps> | ReactElement<FormSectionProps>[]
}

const FormCard: FC<FormCardProps> = ({ children }) => {
  return (
    <div className="bg-dark-900 p-10 rounded space-y-8 divide-y divide-dark-700 shadow-xl shadow-red/5">{children}</div>
  )
}

export default FormCard
