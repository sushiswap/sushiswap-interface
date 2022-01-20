import FormCard, { FormCardProps } from 'app/components/Form/FormCard'
import FormFieldHelperText, { FormFieldHelperTextProps } from 'app/components/Form/FormFieldHelperText'
import FormSection, { FormSectionProps } from 'app/components/Form/FormSection'
import FormSelectField, { FormSelectFieldProps } from 'app/components/Form/FormSelectField'
import FormSubmit, { FormSubmitProps } from 'app/components/Form/FormSubmit'
import FormTextAreaField, { FormTextAreaFieldProps } from 'app/components/Form/FormTextAreaField'
import FormTextField, { FormTextFieldProps } from 'app/components/Form/FormTextField'
import FormWizard, { FormWizardProps } from 'app/components/Form/FormWizard'
import React, { FC, ReactElement } from 'react'
import { FormProvider } from 'react-hook-form'
import { UseFormReturn } from 'react-hook-form/dist/types'

export const DEFAULT_FORM_FIELD_CLASSNAMES =
  'appearance-none outline-none rounded placeholder:text-low-emphesis bg-dark-1000/40 px-3 py-2 focus:ring-purple focus:border-purple block w-full min-w-0 border border-dark-800'

export interface FormProps extends UseFormReturn<any> {
  // @ts-ignore TYPE NEEDS FIXING
  onSubmit(x): void
  children: ReactElement<FormCardProps>
}

type Form<P> = FC<P> & {
  Card: FC<FormCardProps>
  Section: FormSection<FormSectionProps>
  Submit: FC<FormSubmitProps>
  TextField: FC<FormTextFieldProps>
  SelectField: FC<FormSelectFieldProps>
  TextAreaField: FC<FormTextAreaFieldProps>
  HelperText: FC<FormFieldHelperTextProps>
  Wizard: FC<FormWizardProps>
}

const Form: Form<FormProps> = ({ children, onSubmit, ...rest }) => {
  return (
    <FormProvider {...rest}>
      <form onSubmit={rest.handleSubmit(onSubmit)}>{children}</form>
    </FormProvider>
  )
}

Form.Card = FormCard
Form.Wizard = FormWizard
Form.Section = FormSection
Form.Submit = FormSubmit
Form.TextField = FormTextField
Form.SelectField = FormSelectField
Form.TextAreaField = FormTextAreaField
Form.HelperText = FormFieldHelperText

export default Form
