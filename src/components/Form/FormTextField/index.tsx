import { DEFAULT_FORM_FIELD_CLASSNAMES } from 'app/components/Form'
import Typography from 'app/components/Typography'
import { classNames } from 'app/functions'
import React, { FC, ReactElement, ReactNode } from 'react'
import { useFormContext } from 'react-hook-form'

import FormFieldHelperText from '../FormFieldHelperText'

export interface FormTextFieldProps extends React.HTMLProps<HTMLInputElement> {
  name: string
  error?: string
  helperText?: any
  icon?: ReactNode
  children?: ReactElement<HTMLInputElement>
}

const FormTextField: FC<FormTextFieldProps> = ({ name, label, children, helperText, icon, error, ...rest }) => {
  const {
    register,
    formState: { errors },
  } = useFormContext()

  return (
    <>
      <Typography weight={700}>{label}</Typography>
      <div className="mt-2 flex rounded-md shadow-sm">
        {icon && (
          <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-dark-800 sm:text-sm">
            {icon}
          </span>
        )}
        <input
          {...register(name)}
          {...rest}
          className={classNames(
            icon ? 'rounded-none rounded-r-md' : 'rounded',
            DEFAULT_FORM_FIELD_CLASSNAMES,
            errors[name] ? '!border-red' : ''
          )}
        />
      </div>
      {!!errors[name] ? (
        <FormFieldHelperText className="!text-red">{errors[name].message}</FormFieldHelperText>
      ) : typeof helperText === 'string' ? (
        <FormFieldHelperText>{helperText}</FormFieldHelperText>
      ) : (
        helperText
      )}
    </>
  )
}

export default FormTextField
