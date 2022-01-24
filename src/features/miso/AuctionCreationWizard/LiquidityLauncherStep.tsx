import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Form from 'app/components/Form'
import FormFieldHelperText from 'app/components/Form/FormFieldHelperText'
import ToggleButtonGroup from 'app/components/ToggleButton'
import Typography from 'app/components/Typography'
import { AuctionCreationWizardInput } from 'app/features/miso/AuctionCreationWizard/index'
import { formatNumber } from 'app/functions'
import { useCurrency } from 'app/hooks/Tokens'
import React, { FC, useEffect } from 'react'
import { useFormContext } from 'react-hook-form'

const LiquidityLauncherStep: FC = () => {
  const { i18n } = useLingui()
  const { getValues, setValue, watch } = useFormContext<AuctionCreationWizardInput>()
  const [paymentCurrencyAddress, tokenForLiquidity, tokenAmount, tokenSymbol, liqPercentage] = watch([
    'paymentCurrencyAddress',
    'tokenForLiquidity',
    'tokenAmount',
    'tokenSymbol',
    'liqPercentage',
  ])
  const paymentToken = useCurrency(paymentCurrencyAddress)

  useEffect(() => {
    const value = Math.round((Number(getValues('liqPercentage')) / 100) * tokenAmount)
    // @ts-ignore TYPE NEEDS FIXING
    setValue('tokenForLiquidity', value > 0 ? value : undefined)
  }, [getValues, liqPercentage, setValue, tokenAmount])

  useEffect(() => {
    const value = Math.round((Number(getValues('tokenForLiquidity')) * 100) / tokenAmount)
    // @ts-ignore TYPE NEEDS FIXING
    setValue('liqPercentage', value > 0 ? value : undefined)
  }, [getValues, tokenForLiquidity, setValue, tokenAmount])

  return (
    <>
      <div className="col-span-4">
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
      <div className="flex col-span-4 gap-6">
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
      <div className="col-span-4">
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
    </>
  )
}

export default LiquidityLauncherStep
