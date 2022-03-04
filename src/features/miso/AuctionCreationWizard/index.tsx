import { AddressZero } from '@ethersproject/constants'
import { yupResolver } from '@hookform/resolvers/yup'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Currency, CurrencyAmount, NATIVE, Price, Token } from '@sushiswap/core-sdk'
import Button from 'app/components/Button'
import Form from 'app/components/Form'
import AuctionCreationWizardReviewModal from 'app/features/miso/AuctionCreationWizard/AuctionCreationWizardReviewModal'
import AuctionCreationStep from 'app/features/miso/AuctionCreationWizard/AuctionDetailsStep'
import GeneralDetailsStep from 'app/features/miso/AuctionCreationWizard/GeneralDetailsStep'
import LiquidityLauncherStep from 'app/features/miso/AuctionCreationWizard/LiquidityLauncherStep'
import TokenCreationStep from 'app/features/miso/AuctionCreationWizard/TokenCreationStep'
import { formatCreationFormData } from 'app/features/miso/AuctionCreationWizard/utils'
import WhitelistDetailsStep from 'app/features/miso/AuctionCreationWizard/WhitelistDetailsStep'
import { AuctionTemplate, TokenType, WhitelistEntry } from 'app/features/miso/context/types'
import { addressValidator } from 'app/functions/yupValidators'
import { useToken } from 'app/hooks/Tokens'
import { useActiveWeb3React } from 'app/services/web3'
import React, { FC, useState } from 'react'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'

export interface AuctionCreationWizardInput {
  paymentCurrencyAddress: string
  startDate: string
  endDate: string
  tokenType: TokenType
  tokenName: string
  tokenSymbol: string
  tokenSupply: number
  tokenAmount: number
  tokenForLiquidity: number
  auctionType: AuctionTemplate
  fixedPrice?: number
  minimumTarget?: number
  minimumRaised?: number
  startPrice?: number
  endPrice?: number
  liqLockTime?: number
  liqPercentage: number
  whitelistEnabled: boolean
  whitelistAddresses: WhitelistEntry[]
}

export type AuctionCreationWizardInputFormatted = Omit<
  AuctionCreationWizardInput,
  | 'startDate'
  | 'endDate'
  | 'tokenSupply'
  | 'tokenAmount'
  | 'tokenForLiquidity'
  | 'fixedPrice'
  | 'minimumTarget'
  | 'minimumRaised'
  | 'startPrice'
  | 'endPrice'
> & {
  paymentCurrency: Currency
  startDate: Date
  endDate: Date
  tokenAmount: CurrencyAmount<Token>
  tokenSupply: CurrencyAmount<Token>
  auctionType: AuctionTemplate
  fixedPrice?: Price<Token, Currency>
  minimumTarget?: CurrencyAmount<Currency>
  minimumRaised?: CurrencyAmount<Currency>
  startPrice?: Price<Token, Currency>
  endPrice?: Price<Token, Currency>
  auctionToken: Token
  accounts: string[]
  amounts: string[]
}

const schema = yup.object().shape({
  paymentCurrencyAddress: addressValidator.required('Please enter a valid ERC20-address'),
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
  tokenType: yup.number().required('Must select a token type'),
  tokenName: yup.string().required('Must enter a valid name'),
  tokenSymbol: yup.string().required('Must enter a valid symbol'),
  tokenSupply: yup
    .number()
    .typeError('Supply must be a number')
    .required('Must enter a valid number')
    .moreThan(0, 'Token supply must be larger than zero')
    .max(2e256 - 1, 'Token supply can be at most 2^256 - 1 due to network limitations')
    .integer('Must be a whole number'),
  tokenAmount: yup
    .number()
    .typeError('Must be a valid number')
    .required('Must enter a valid number')
    .moreThan(0, 'Token supply must be larger than zero')
    .integer('Must be a whole number')
    .test({
      message: 'Amount of tokens for sale must be less than half the total supply',
      test: (value, ctx) => (value ? value * 2 <= ctx.parent.tokenSupply : false),
    }),
  tokenForLiquidity: yup
    .number()
    .typeError('Must be a valid number')
    .required('Must enter a valid number')
    .integer('Must be a whole number')
    .test({
      message: 'Amount of tokens for liquidity seeding must be at least 1 percent of tokens for sale',
      // @ts-ignore TYPE NEEDS FIXING
      test: (value, ctx) => value * 100 >= ctx.parent.tokenAmount,
    })
    .test({
      message: 'Amount of tokens for liquidity cannot be larger than amount of tokens for sale',
      // @ts-ignore TYPE NEEDS FIXING
      test: (value, ctx) => value <= ctx.parent.tokenAmount,
    }),
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
  liqLauncherEnabled: yup.boolean(),
  liqLockTime: yup.number().typeError('Must be a number'),
  liqPercentage: yup
    .number()
    .typeError('Must be a number')
    .required('Must enter a number')
    .moreThan(0, 'Must be a number between 0 and 100')
    .max(100, 'Must be a number between 0 and 100')
    .integer('Must be a whole number'),
  whitelistEnabled: yup.boolean(),
})

const AuctionCreationWizard: FC = () => {
  const { chainId } = useActiveWeb3React()
  const { i18n } = useLingui()
  const [open, setOpen] = useState<boolean>(false)
  const methods = useForm<AuctionCreationWizardInput>({
    defaultValues: {
      auctionType: AuctionTemplate.DUTCH_AUCTION,
      tokenType: TokenType.FIXED,
      whitelistEnabled: false,
      whitelistAddresses: [],
      paymentCurrencyAddress: AddressZero,
      liqLockTime: 180,
    },
    resolver: yupResolver(schema),
    reValidateMode: 'onChange',
    mode: 'onChange',
  })

  const {
    watch,
    formState: { isValid, isValidating },
  } = methods

  const data = watch()

  // @ts-ignore TYPE NEEDS FIXING
  const paymentToken = useToken(data.paymentCurrencyAddress) ?? NATIVE[chainId || 1]
  const formattedData =
    paymentToken && !isValidating && isValid ? formatCreationFormData(data, paymentToken) : undefined
  const handleSubmit = () => setOpen(true)

  return (
    <>
      <Form {...methods} onSubmit={methods.handleSubmit(handleSubmit)}>
        <Form.Card className="divide-none">
          <Form.Wizard
            submitButton={
              <Button disabled={!formattedData} color="blue" type="submit">
                {i18n._(t`Review`)}
              </Button>
            }
          >
            <Form.Section header={<Form.Section.Header header={i18n._(t`Token Details`)} />}>
              <TokenCreationStep />
            </Form.Section>
            <Form.Section header={<Form.Section.Header header={i18n._(t`General Details`)} />}>
              <GeneralDetailsStep />
            </Form.Section>
            <Form.Section columns={4} header={<Form.Section.Header header={i18n._(t`Auction Details`)} />}>
              <AuctionCreationStep />
            </Form.Section>
            <Form.Section header={<Form.Section.Header header={i18n._(t`Liquidity Details`)} />}>
              <LiquidityLauncherStep />
            </Form.Section>
            <Form.Section header={<Form.Section.Header header={i18n._(t`Whitelist`)} />}>
              <WhitelistDetailsStep />
            </Form.Section>
          </Form.Wizard>
        </Form.Card>
      </Form>
      <AuctionCreationWizardReviewModal open={open} onDismiss={() => setOpen(false)} data={formattedData} />
    </>
  )
}

export default AuctionCreationWizard
