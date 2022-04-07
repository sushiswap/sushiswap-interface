import { Switch } from '@headlessui/react'
import { yupResolver } from '@hookform/resolvers/yup'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Typography from 'app/components/Typography'
import { WhitelistEntry } from 'app/features/miso/context/types'
import WhitelistUpload from 'app/features/miso/WhitelistUpload'
import { classNames } from 'app/functions'
import React, { FC, ReactNode } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import * as yup from 'yup'

interface WhitelistForm {
  whitelistEnabled: boolean
  whitelistAddresses: WhitelistEntry[]
}

const whitelistSchema = yup.object().shape({
  whitelistEnabled: yup.boolean().required(),
  whitelistAddresses: yup.array().when('whitelistEnabled', {
    is: true,
    then: yup.array().ensure().min(1, 'There must be at least 1 whitelisted address when enabled'),
  }),
})

const WhitelistDetailsStep: FC<{ children(isValid: boolean): ReactNode }> = ({ children }) => {
  const { i18n } = useLingui()
  const methods = useForm<WhitelistForm>({
    defaultValues: {
      whitelistEnabled: false,
      whitelistAddresses: [],
    },
    resolver: yupResolver(whitelistSchema),
    reValidateMode: 'onChange',
    mode: 'onChange',
  })

  const { getValues, setValue, watch } = methods
  const [whitelistEnabled, whitelistAddresses] = watch(['whitelistEnabled', 'whitelistAddresses'])

  return (
    <FormProvider {...methods}>
      <div className="flex flex-col">
        <Switch.Group>
          <Typography weight={700}>{i18n._(t`Use whitelist`)}</Typography>
          <div className="mt-2 flex items-center h-[42px]">
            <Switch
              name="whitelistEnabled"
              checked={whitelistEnabled}
              onChange={() => setValue('whitelistEnabled', !whitelistEnabled)}
              className={classNames(
                whitelistEnabled ? 'bg-purple border-purple border-opacity-80' : 'bg-dark-700 border-dark-700',
                'filter bg-opacity-60 border  relative inline-flex items-center h-[32px] rounded-full w-[54px] transition-colors focus:outline-none'
              )}
            >
              <span
                className={classNames(
                  whitelistEnabled ? 'translate-x-[23px]' : 'translate-x-[1px]',
                  'inline-block w-7 h-7 transform rounded-full transition-transform text-blue bg-white'
                )}
              />
            </Switch>
          </div>
        </Switch.Group>
      </div>
      <div className={classNames(whitelistEnabled ? '' : 'opacity-40 pointer-events-none', 'col-span-6')}>
        <WhitelistUpload
          value={getValues('whitelistAddresses')}
          disabled={false}
          onChange={(param) =>
            typeof param === 'function'
              ? setValue('whitelistAddresses', param(getValues('whitelistAddresses')))
              : setValue('whitelistAddresses', param)
          }
        />
      </div>
      {children(whitelistSchema.isValidSync({ whitelistEnabled, whitelistAddresses }))}
    </FormProvider>
  )
}

export default WhitelistDetailsStep
