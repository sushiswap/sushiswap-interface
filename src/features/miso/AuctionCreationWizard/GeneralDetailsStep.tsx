import { yupResolver } from '@hookform/resolvers/yup'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Form from 'app/components/Form'
import AuctionPaymentCurrencyField from 'app/features/miso/AuctionAdminForm/AuctionPaymentCurrencyField'
import React, { FC, ReactNode } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import * as yup from 'yup'

interface GeneralDetailsForm {
  startDate: string
  endDate: string
}

export const generalDetailsSchema = yup.object().shape({
  startDate: yup
    .date()
    .typeError('Please enter a valid date')
    .min(new Date(), 'Start date may not be due already')
    .required('Must enter a valid date'),
  endDate: yup
    .date()
    .typeError('Please enter a valid date')
    .min(yup.ref('startDate'), 'Date must be later than start date')
    .required('Must enter a valid date'),
})

const GeneralDetailsStep: FC<{ children(isValid: boolean): ReactNode }> = ({ children }) => {
  const { i18n } = useLingui()
  const methods = useForm<GeneralDetailsForm>({
    resolver: yupResolver(generalDetailsSchema),
    reValidateMode: 'onChange',
    mode: 'onChange',
  })

  const {
    formState: { isValid },
  } = methods

  return (
    <FormProvider {...methods}>
      <div className="col-span-4">
        <AuctionPaymentCurrencyField name="paymentCurrencyAddress" label={i18n._(t`Auction Payment Currency*`)} />
      </div>
      <div className="col-span-4 md:col-span-2">
        <Form.TextField
          className="inline-flex"
          type="datetime-local"
          name="startDate"
          label={i18n._(t`Start Date*`)}
          placeholder={i18n._(t`Selected a start date for your auction`)}
          helperText={i18n._(t`Please enter your auction start date`)}
        />
      </div>
      <div className="col-span-4 md:col-span-2">
        <Form.TextField
          className="inline-flex"
          type="datetime-local"
          name="endDate"
          label={i18n._(t`End Date*`)}
          placeholder={i18n._(t`Selected an end date for your auction`)}
          helperText={i18n._(t`Please enter your auction end date`)}
        />
      </div>
      {children(isValid)}
    </FormProvider>
  )
}

export default GeneralDetailsStep
