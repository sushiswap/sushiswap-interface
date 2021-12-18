import { getAddress } from '@ethersproject/address'
import { AddressZero } from '@ethersproject/constants'
import { yupResolver } from '@hookform/resolvers/yup'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { DAI_ADDRESS, Fraction, JSBI, NATIVE, USDC_ADDRESS, USDT_ADDRESS } from '@sushiswap/core-sdk'
import LoadingCircle from 'app/animation/loading-circle.json'
import Button from 'app/components/Button'
import Form from 'app/components/Form'
import FormFieldHelperText from 'app/components/Form/FormFieldHelperText'
import ToggleButtonGroup from 'app/components/ToggleButton'
import Typography from 'app/components/Typography'
import WhitelistChecker from 'app/features/miso/AuctionAdminForm/AuctionAdminFormWhitelistSection/WhitelistChecker'
import { useAuctionPointListFunctions } from 'app/features/miso/context/hooks/useAuctionPointList'
import { WhitelistEntry } from 'app/features/miso/context/types'
import WhitelistUpload from 'app/features/miso/WhitelistUpload'
import { useToken } from 'app/hooks/Tokens'
import { useActiveWeb3React } from 'app/services/web3'
import Lottie from 'lottie-react'
import React, { FC, useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toWei } from 'web3-utils'
import * as yup from 'yup'

interface IFormInputs {
  owner: string
  paymentTokenAddress: string
  wlAddresses: WhitelistEntry[]
}

const addressValidator = yup
  .string()
  .required()
  .test('is-address', '${value} is not a valid address', (value) => {
    try {
      return !!(value && getAddress(value))
    } catch {
      return false
    }
  })

const schema = yup.object({
  owner: addressValidator,
})

const PointlistCreationFormSetup: FC<{ onAddress(x: string): void }> = ({ onAddress }) => {
  const { i18n } = useLingui()
  const { account, chainId } = useActiveWeb3React()
  const { init, unsubscribe, subscribe } = useAuctionPointListFunctions()
  const [listAddress, setListAddress] = useState<string>()
  const [pending, setPending] = useState(false)
  const methods = useForm<IFormInputs>({
    resolver: yupResolver(schema),
    defaultValues: {
      owner: '',
      paymentTokenAddress: '',
      wlAddresses: [],
    },
  })

  const { setValue, getValues, watch } = methods
  const watchAllFields = watch()
  const token = useToken(watchAllFields.paymentTokenAddress) ?? NATIVE[chainId || 1]

  const onSubmit = useCallback(async () => {
    if (!token) return

    try {
      setPending(true)

      const [accounts, amounts] = watchAllFields.wlAddresses.reduce<[string[], string[]]>(
        (acc, cur) => {
          acc[0].push(cur.account)
          acc[1].push(
            new Fraction(
              toWei(cur.amount),
              JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(18 - token.decimals))
            ).quotient.toString()
          )
          return acc
        },
        [[], []]
      )

      setPending(true)
      const tx = await init(watchAllFields.owner, accounts, amounts)

      if (tx?.hash) {
        await tx.wait()
      }
    } catch (e) {
      console.error('Updating point list failed: ', e.message)
    } finally {
      setPending(false)
    }
  }, [init, token, watchAllFields.owner, watchAllFields.wlAddresses])

  useEffect(() => {
    subscribe('PointListDeployed', (operator, address) => {
      setListAddress(address)
      onAddress(address)
    })

    return () => {
      unsubscribe('PointListDeployed', () => console.log('unsubscribed'))
    }
  }, [onAddress, subscribe, unsubscribe])

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
                <Button
                  {...(pending && {
                    startIcon: (
                      <div className="w-4 h-4 mr-1">
                        <Lottie animationData={LoadingCircle} autoplay loop />
                      </div>
                    ),
                  })}
                  disabled={!watchAllFields.owner || pending}
                  color="blue"
                  type="submit"
                >
                  {i18n._(t`Deploy Point List`)}
                </Button>
              </div>
            </div>
          </Form.Section>
          <Form.Section header={<></>}>
            <div className="col-span-6">
              <WhitelistChecker listAddress={listAddress} paymentToken={token} />
            </div>
          </Form.Section>
        </Form.Card>
      </Form>
    </>
  )
}

export default PointlistCreationFormSetup
