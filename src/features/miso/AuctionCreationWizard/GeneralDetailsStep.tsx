import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Form from 'app/components/Form'
import AuctionPaymentCurrencyField from 'app/features/miso/AuctionAdminForm/AuctionPaymentCurrencyField'
import React, { FC } from 'react'

const GeneralDetailsStep: FC = () => {
  const { i18n } = useLingui()

  return (
    <>
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
    </>
  )
}

export default GeneralDetailsStep
