import { AddressZero } from '@ethersproject/constants'
import { yupResolver } from '@hookform/resolvers/yup'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { DAI_ADDRESS, NATIVE, USDC_ADDRESS, USDT_ADDRESS } from '@sushiswap/core-sdk'
import Button from 'app/components/Button'
import Form from 'app/components/Form'
import FormFieldHelperText from 'app/components/Form/FormFieldHelperText'
import ToggleButtonGroup from 'app/components/ToggleButton'
import Typography from 'app/components/Typography'
import WhitelistChecker from 'app/features/miso/AuctionAdminForm/AuctionAdminFormWhitelistSection/WhitelistChecker'
import { WhitelistEntry } from 'app/features/miso/context/types'
import PointlistCreationReviewModal from 'app/features/miso/PointlistCreationForm/PointlistCreationReviewModal'
import WhitelistUpload from 'app/features/miso/WhitelistUpload'
import { addressValidator } from 'app/functions/yupValidators'
import { useToken } from 'app/hooks/Tokens'
import { useActiveWeb3React } from 'app/services/web3'
import React, { FC, useState } from 'react'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'

export interface PointListFormInputs {
  owner: string
  paymentTokenAddress: string
  wlAddresses: WhitelistEntry[]
}

const schema = yup.object({
  owner: addressValidator.required(),
})

const PointlistCreationFormSetup: FC<{ onAddress(x: string): void }> = () => {
  const { i18n } = useLingui()
  const { account, chainId } = useActiveWeb3React()
  const [open, setOpen] = useState<boolean>(false)

  const methods = useForm<PointListFormInputs>({
    resolver: yupResolver(schema),
    defaultValues: {
      owner: '',
      paymentTokenAddress: '',
      wlAddresses: [],
    },
  })

  const {
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = methods

  const data = watch()
  const token = useToken(data.paymentTokenAddress) ?? NATIVE[chainId || 1]

  const onSubmit = () => setOpen(true)

  if (!chainId || !account) return <></>

  return (
    <>
      <Form {...methods} onSubmit={methods.handleSubmit(onSubmit)}>
        <Form.Card>
          <Form.Section columns={6} header={<Form.Section.Header header={i18n._(t`1. Setup`)} />}>
            <div className="col-span-6">
              <Form.TextField
                name="owner"
                label={i18n._(t`List Owner Address`)}
                helperText={
                  <FormFieldHelperText className="underline cursor-pointer" onClick={() => setValue('owner', account)}>
                    {i18n._(t`Use my address`)}
                  </FormFieldHelperText>
                }
                placeholder="0x..."
              />
            </div>
            <div className="col-span-6 flex flex-col">
              <div>
                <Typography weight={700}>{i18n._(t`Auction Payment Token`)}</Typography>
                <ToggleButtonGroup
                  variant="outlined"
                  value={getValues('paymentTokenAddress')}
                  onChange={(val: string) => setValue('paymentTokenAddress', val, { shouldValidate: true })}
                  className="mt-2 !flex"
                >
                  <ToggleButtonGroup.Button
                    value={AddressZero}
                    activeClassName="border-purple"
                    className="!bg-none px-5 !py-2.5"
                  >
                    {NATIVE[chainId].symbol}
                  </ToggleButtonGroup.Button>
                  <ToggleButtonGroup.Button
                    value={DAI_ADDRESS[chainId]}
                    activeClassName="border-purple"
                    className="!bg-none px-5 !py-2.5"
                  >
                    DAI
                  </ToggleButtonGroup.Button>
                  <ToggleButtonGroup.Button
                    value={USDC_ADDRESS[chainId]}
                    activeClassName="border-purple"
                    className="!bg-none px-5 !py-2.5"
                  >
                    USDC
                  </ToggleButtonGroup.Button>
                  <ToggleButtonGroup.Button
                    value={USDT_ADDRESS[chainId]}
                    activeClassName="border-purple"
                    className="!bg-none px-5 !py-2.5"
                  >
                    USDT
                  </ToggleButtonGroup.Button>
                </ToggleButtonGroup>
              </div>
              <div className="flex flex-col flex-grow">
                <Form.TextField
                  name="paymentTokenAddress"
                  helperText={
                    <FormFieldHelperText className={token?.symbol ? '!text-green' : ''}>
                      {token?.symbol
                        ? i18n._(t`Selected currency: ${token?.symbol}`)
                        : i18n._(
                            t`Select the currency you accept as payment during the auction. If you don’t see the ERC-20 token you are looking for, input by pasting the address in the custom field.`
                          )}
                    </FormFieldHelperText>
                  }
                  placeholder="0x..."
                />
              </div>
            </div>
            <WhitelistUpload
              value={getValues('wlAddresses')}
              disabled={false}
              onChange={(param) =>
                typeof param === 'function'
                  ? setValue('wlAddresses', param(getValues('wlAddresses')))
                  : setValue('wlAddresses', param)
              }
            />
            <div className="flex justify-end col-span-6">
              <div>
                <Button disabled={Object.keys(errors).length > 0} color="blue" type="submit">
                  {i18n._(t`Review`)}
                </Button>
              </div>
            </div>
          </Form.Section>
          <Form.Section header={<></>}>
            <div className="col-span-6">
              <WhitelistChecker paymentToken={token} />
            </div>
          </Form.Section>
        </Form.Card>
      </Form>
      <PointlistCreationReviewModal open={open} onDismiss={() => setOpen(false)} data={data} />
    </>
  )
}

export default PointlistCreationFormSetup
