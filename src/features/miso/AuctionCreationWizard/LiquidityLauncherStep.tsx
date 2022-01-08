import { Switch } from '@headlessui/react'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Form from 'app/components/Form'
import FormFieldHelperText from 'app/components/Form/FormFieldHelperText'
import ToggleButtonGroup from 'app/components/ToggleButton'
import Typography from 'app/components/Typography'
import { AuctionCreationWizardInput } from 'app/features/miso/AuctionCreationWizard/index'
import { classNames, formatNumber } from 'app/functions'
import { useCurrency } from 'app/hooks/Tokens'
import React, { FC } from 'react'
import { useFormContext } from 'react-hook-form'

const LiquidityLauncherStep: FC = () => {
  const { i18n } = useLingui()
  const { getValues, setValue, watch } = useFormContext<AuctionCreationWizardInput>()
  const value = getValues('liqLauncherEnabled')
  const [paymentCurrencyAddress, tokenSupply, tokenSymbol, liqPercentage] = watch([
    'paymentCurrencyAddress',
    'tokenSupply',
    'tokenSymbol',
    'liqPercentage',
  ])
  const paymentToken = useCurrency(paymentCurrencyAddress)

  return (
    <>
      <div className="flex flex-col">
        <Switch.Group>
          <Typography weight={700}>{i18n._(t`Liquidity launcher`)}</Typography>
          <div className="mt-2 flex items-center h-[42px]">
            <Switch
              name="liqLauncherEnabled"
              checked={value}
              onChange={() => setValue('liqLauncherEnabled', !value)}
              className={classNames(
                value ? 'bg-purple border-purple border-opacity-80' : 'bg-dark-700 border-dark-700',
                'filter bg-opacity-60 border  relative inline-flex items-center h-[32px] rounded-full w-[54px] transition-colors focus:outline-none'
              )}
            >
              <span
                className={classNames(
                  value ? 'translate-x-[23px]' : 'translate-x-[1px]',
                  'inline-block w-7 h-7 transform rounded-full transition-transform text-blue bg-white'
                )}
              />
            </Switch>
          </div>
        </Switch.Group>
      </div>
      <div className={classNames('col-span-4', value ? '' : 'opacity-40 pointer-events-none')}>
        <Typography weight={700}>{i18n._(t`Liquidity lockup time`)}</Typography>
        <ToggleButtonGroup
          variant="outlined"
          value={getValues('liqLockTime')}
          onChange={(val) => setValue('liqLockTime', Number(val), { shouldValidate: true })}
          className="mt-2 !flex"
        >
          <ToggleButtonGroup.Button value={180} activeClassName="border-purple" className="!bg-none px-5 !py-2.5">
            {i18n._(t`${180} days`)}
          </ToggleButtonGroup.Button>
          <ToggleButtonGroup.Button value={90} activeClassName="border-purple" className="!bg-none px-5 !py-2.5">
            {i18n._(t`${90} days`)}
          </ToggleButtonGroup.Button>
        </ToggleButtonGroup>
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
      <div className={classNames('col-span-4', value ? '' : 'opacity-40 pointer-events-none')}>
        <Form.TextField
          endIcon={
            <Typography variant="sm" weight={700} className="text-secondary">
              %
            </Typography>
          }
          name="liqPercentage"
          label={i18n._(t`Liquidity launch percentage*`)}
          placeholder="50"
          helperText={i18n._(t`Percent of initial auction token liquidity you want to launch.`)}
        />
      </div>

      <div className={classNames('col-span-4', value ? '' : 'opacity-40 pointer-events-none')}>
        <Typography weight={700}>{i18n._(t`Liquidity Pair`)}</Typography>
        {tokenSupply && liqPercentage && (
          <Typography className="mt-2">
            {formatNumber((Number(tokenSupply) * Number(liqPercentage)) / 100)} {tokenSymbol} + {Number(liqPercentage)}%
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
