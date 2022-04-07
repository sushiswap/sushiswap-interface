import { RadioGroup } from '@headlessui/react'
import { InformationCircleIcon } from '@heroicons/react/outline'
import { yupResolver } from '@hookform/resolvers/yup'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { BatchAuctionIcon, CrowdsaleIcon, DutchAuctionIcon } from 'app/components/Icon'
import Typography from 'app/components/Typography'
import AuctionCreationStepGeneralDetails from 'app/features/miso/AuctionCreationWizard/AuctionDetailsStep/AuctionTypeDetails'
import useAuctionTemplateMap from 'app/features/miso/context/hooks/useAuctionTemplateMap'
import { AuctionTemplate } from 'app/features/miso/context/types'
import { classNames } from 'app/functions'
import React, { FC, ReactNode } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import * as yup from 'yup'

interface AuctionDetailsForm {
  auctionType: AuctionTemplate
  fixedPrice?: number
  minimumTarget?: number
  minimumRaised?: number
}

const auctionDetailsSchema = yup.object().shape({
  auctionType: yup.number().required('Must select an auction type'),
  fixedPrice: yup.number().when('auctionType', {
    is: (value: AuctionTemplate) => value === AuctionTemplate.CROWDSALE,
    then: yup.number().typeError('Price must be a number').required('Must enter a fixed price'),
  }),
  minimumTarget: yup.number().when('auctionType', {
    is: (value: AuctionTemplate) => value === AuctionTemplate.CROWDSALE,
    then: yup
      .number()
      .typeError('Target must be a number')
      .moreThan(0, 'Must be a number between 0 and 100')
      .max(100, 'Must be a number between 0 and 100')
      .integer('Must be a whole number'),
  }),
  minimumRaised: yup.number().when('auctionType', {
    is: (value: AuctionTemplate) => value === AuctionTemplate.BATCH_AUCTION,
    then: yup.number().typeError('Target must be a number').min(0, 'Must be greater than zero'),
  }),
  startPrice: yup.number().when('auctionType', {
    is: (value: AuctionTemplate) => value === AuctionTemplate.DUTCH_AUCTION,
    then: yup.number().typeError('Price must be a number').required('Must enter a start price'),
  }),
  endPrice: yup.number().when('auctionType', {
    is: (value: AuctionTemplate) => value === AuctionTemplate.DUTCH_AUCTION,
    then: yup
      .number()
      .typeError('Price must be a number')
      .lessThan(yup.ref('startPrice'), 'End price must be less than start price')
      .required('Must enter a start price'),
  }),
})

const AuctionDetailsStep: FC<{ children(isValid: boolean): ReactNode }> = ({ children }) => {
  const { i18n } = useLingui()
  const methods = useForm<AuctionDetailsForm>({
    resolver: yupResolver(auctionDetailsSchema),
    reValidateMode: 'onChange',
    mode: 'onChange',
  })
  const {
    watch,
    setValue,
    formState: { isValid },
  } = methods
  const auctionType = watch('auctionType')
  const { templateIdToLabel } = useAuctionTemplateMap()

  const items = [
    {
      icon: <DutchAuctionIcon height={83} width={83} />,
      value: AuctionTemplate.DUTCH_AUCTION,
      label: templateIdToLabel(AuctionTemplate.DUTCH_AUCTION),
      description: i18n._(
        t`The price is set at a higher value per token than expected and descends linearly over time.`
      ),
      note: i18n._(t`Great for a completely novel item’s true price discovery`),
    },
    {
      icon: <CrowdsaleIcon height={83} width={83} />,
      value: AuctionTemplate.CROWDSALE,
      label: templateIdToLabel(AuctionTemplate.CROWDSALE),
      description: i18n._(t`A fixed price and a fixed set of tokens.`),
      note: i18n._(t`Great when the token price is already known or has been decided on previously`),
    },
    {
      icon: <BatchAuctionIcon height={83} width={83} />,
      value: AuctionTemplate.BATCH_AUCTION,
      label: templateIdToLabel(AuctionTemplate.BATCH_AUCTION),
      description: i18n._(
        t`A set amount of tokens are divided amongst all the contributors to the Market event, weighted according to their contribution to the pool.`
      ),
      note: i18n._(t`Great for projects looking to ensure that everyone taking part is rewarded`),
    },
  ]

  return (
    <FormProvider {...methods}>
      <div className="col-span-4">
        <RadioGroup
          value={auctionType}
          onChange={(auctionType) => setValue('auctionType', auctionType)}
          className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-10"
        >
          <input className="hidden" name="auctionType" value={auctionType} onChange={() => {}} />
          {items.map(({ icon, value, label, description, note }) => (
            <RadioGroup.Option value={value} key={value}>
              {({ checked }) => (
                <div
                  className={classNames(
                    checked ? 'bg-dark-1000/40 border-purple' : 'bg-dark-900 hover:border-purple/40',
                    'flex flex-col gap-4 border border-dark-800 p-5 rounded h-full cursor-pointer'
                  )}
                >
                  <Typography variant="lg" weight={700} className="text-high-emphesis">
                    {label}
                  </Typography>
                  {icon}
                  <Typography className="text-high-emphesis">{description}</Typography>
                  <div className="flex items-baseline gap-1">
                    <InformationCircleIcon width={20} height={20} className="top-1 relative" />
                    <Typography className="text-secondary italic">{note}</Typography>
                  </div>
                </div>
              )}
            </RadioGroup.Option>
          ))}
        </RadioGroup>
      </div>
      <AuctionCreationStepGeneralDetails />
      {children(isValid)}
    </FormProvider>
  )
}

export default AuctionDetailsStep
