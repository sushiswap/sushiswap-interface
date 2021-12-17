import Typography from 'app/components/Typography'
import { classNames } from 'app/functions'
import React, { FC } from 'react'

export interface FormFieldHelperTextProps {
  className?: string
}

const FormFieldHelperText: FC<FormFieldHelperTextProps> = ({ children, className = '' }) => {
  return (
    <Typography variant="sm" className={classNames('text-gray-600 mt-2', className)}>
      {children}
    </Typography>
  )
}

export default FormFieldHelperText
