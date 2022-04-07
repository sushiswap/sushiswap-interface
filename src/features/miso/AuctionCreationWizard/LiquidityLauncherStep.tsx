import { Switch } from '@headlessui/react'
import { yupResolver } from '@hookform/resolvers/yup'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Form from 'app/components/Form'
import FormFieldHelperText from 'app/components/Form/FormFieldHelperText'
import ToggleButtonGroup from 'app/components/ToggleButton'
import Typography from 'app/components/Typography'
import { classNames, formatNumber } from 'app/functions'
import { useCurrency } from 'app/hooks/Tokens'
import React, { FC, ReactNode, useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import * as yup from 'yup'

interface LiquidityLauncherForm {
  paymentCurrencyAddress: string
  tokenSymbol?: string
  tokenAmount: number
  tokenForLiquidity?: number
  liqLockTime?: number
  liqPercentage?: number
  liqLauncherEnabled: boolean
}

const liquidityLauncherSchema = yup.object().shape({
  liqLauncherEnabled: yup.boolean().required(),
  tokenForLiquidity: yup.number().when('liqLauncherEnabled', {
    is: true,
    then: yup
      .number()
      .typeError('Must be a valid number')
      .required('Must enter a valid number')
      .integer('Must be a whole number')
      .test({
        message: 'Amount of tokens for liquidity seeding must be at least 1 percent of tokens for sale',
        test: (value, ctx) => Number(value) * 100 >= ctx.parent.tokenAmount,
      })
      .test({
        message: 'Amount of tokens for liquidity cannot be larger than amount of tokens for sale',
        test: (value, ctx) => Number(value) <= ctx.parent.tokenAmount,
      }),
  }),
  liqLockTime: yup.number().when('liqLauncherEnabled', {
    is: true,
    then: yup.number().typeError('Must be a number'),
  }),
  liqPercentage: yup.number().when('liqLauncherEnabled', {
    is: true,
    then: yup
      .number()
      .typeError('Must be a number')
      .required('Must enter a number')
      .moreThan(0, 'Must be a number between 0 and 100')
      .max(100, 'Must be a number between 0 and 100')
      .integer('Must be a whole number'),
  }),
})

const LiquidityLauncherStep: FC<{ children(isValid: boolean): ReactNode }> = ({ children }) => {
  const { i18n } = useLingui()
  const methods = useForm<LiquidityLauncherForm>({
    defaultValues: {
      liqLauncherEnabled: false,
      liqLockTime: 180,
    },
    resolver: yupResolver(liquidityLauncherSchema),
    reValidateMode: 'onChange',
    mode: 'onChange',
  })

  const { getValues, setValue, watch } = methods
  const [
    paymentCurrencyAddress,
    tokenAmount,
    tokenSymbol,
    tokenForLiquidity,
    liqPercentage,
    liqLauncherEnabled,
    liqLockTime,
  ] = watch([
    'paymentCurrencyAddress',
    'tokenAmount',
    'tokenSymbol',
    'tokenForLiquidity',
    'liqPercentage',
    'liqLauncherEnabled',
    'liqLockTime',
  ])

  const paymentToken = useCurrency(paymentCurrencyAddress)

  useEffect(() => {
    const value = Math.round((Number(getValues('liqPercentage')) / 100) * tokenAmount)
    setValue('tokenForLiquidity', value > 0 ? value : undefined)
  }, [getValues, liqPercentage, setValue, tokenAmount])

  useEffect(() => {
    const value = Math.round((Number(getValues('tokenForLiquidity')) * 100) / tokenAmount)
    setValue('liqPercentage', value > 0 ? value : undefined)
  }, [getValues, tokenForLiquidity, setValue, tokenAmount])

  return (
    <FormProvider {...methods}>
      <div className="flex flex-col">
        <Switch.Group>
          <Typography weight={700}>{i18n._(t`Use liquidity launcher`)}</Typography>
          <div className="mt-2 flex items-center h-[42px]">
            <Switch
              name="whitelistEnabled"
              checked={liqLauncherEnabled}
              onChange={() => setValue('liqLauncherEnabled', !liqLauncherEnabled)}
              className={classNames(
                liqLauncherEnabled ? 'bg-purple border-purple border-opacity-80' : 'bg-dark-700 border-dark-700',
                'filter bg-opacity-60 border  relative inline-flex items-center h-[32px] rounded-full w-[54px] transition-colors focus:outline-none'
              )}
            >
              <span
                className={classNames(
                  liqLauncherEnabled ? 'translate-x-[23px]' : 'translate-x-[1px]',
                  'inline-block w-7 h-7 transform rounded-full transition-transform text-blue bg-white'
                )}
              />
            </Switch>
          </div>
        </Switch.Group>
      </div>
      <div className={classNames('col-span-4', liqLauncherEnabled ? '' : 'opacity-40 pointer-events-none')}>
        <Typography weight={700}>{i18n._(t`Liquidity lockup time`)}</Typography>
        <div className="flex">
          <ToggleButtonGroup
            size="sm"
            variant="filled"
            value={Number(getValues('liqLockTime'))}
            onChange={(val) => {
              val && setValue('liqLockTime', Number(val), { shouldValidate: true })
            }}
            className="mt-2 flex gap-2"
          >
            <ToggleButtonGroup.Button value={180} className="!px-3 whitespace-nowrap h-[36px]">
              {i18n._(t`${180} days`)}
            </ToggleButtonGroup.Button>
            <ToggleButtonGroup.Button value={90} className="!px-3 whitespace-nowrap h-[36px]">
              {i18n._(t`${90} days`)}
            </ToggleButtonGroup.Button>
            <ToggleButtonGroup.Button value={60} className="!px-3 whitespace-nowrap h-[36px]">
              {i18n._(t`${60} days`)}
            </ToggleButtonGroup.Button>
            <ToggleButtonGroup.Button value={30} className="!px-3 whitespace-nowrap h-[36px]">
              {i18n._(t`${30} days`)}
            </ToggleButtonGroup.Button>
          </ToggleButtonGroup>
        </div>
        <Form.TextField
          name="liqLockTime"
          helperText={i18n._(t`Custom amount of days`)}
          placeholder=""
          endIcon={
            <Typography variant="sm" weight={700} className="text-secondary">
              {i18n._(t`Days`)}
            </Typography>
          }
        />
      </div>
      <div
        className={classNames('flex gap-6 col-span-4', liqLauncherEnabled ? '' : 'opacity-40 pointer-events-none', '')}
      >
        <div className="w-1/2">
          <Form.TextField
            endIcon={
              <Typography variant="sm" weight={700} className="text-secondary">
                %
              </Typography>
            }
            name="liqPercentage"
            label={i18n._(t`Auction proceeds percentage*`)}
            placeholder="50"
            helperText={i18n._(
              t`Percentage of auction proceeds paired with auctioned token used for liquidity seeding.`
            )}
          />
        </div>
        <div className="w-1/2">
          <Form.TextField
            endIcon={
              <Typography variant="sm" weight={700} className="text-secondary">
                {tokenSymbol}
              </Typography>
            }
            name="tokenForLiquidity"
            label={i18n._(t`Tokens for liquidity*`)}
            placeholder="50"
            helperText={i18n._(
              t`Amount of tokens you want to reserve for seeding liquidity. This value is directly related to the auction proceeds percentage. Must be at least ${
                tokenAmount / 100
              }`
            )}
          />
        </div>
      </div>
      <div className={classNames('col-span-4', liqLauncherEnabled ? '' : 'opacity-40 pointer-events-none', '')}>
        <Typography weight={700}>{i18n._(t`Liquidity Pair`)}</Typography>
        {tokenAmount && liqPercentage && (
          <Typography className="mt-2">
            {formatNumber((Number(tokenAmount) * Number(liqPercentage)) / 100)} {tokenSymbol} + {Number(liqPercentage)}%
            of auction {paymentToken?.symbol} proceeds
          </Typography>
        )}
        <FormFieldHelperText>
          {i18n._(
            t`Liquidity pair token is set to the payment currency from your auction + the token that is set for auction`
          )}
        </FormFieldHelperText>
      </div>
      {children(
        liquidityLauncherSchema.isValidSync({
          tokenForLiquidity,
          liqPercentage,
          liqLauncherEnabled,
          liqLockTime,
        })
      )}
    </FormProvider>
  )
}

export default LiquidityLauncherStep
