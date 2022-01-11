import { Switch } from '@headlessui/react'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Typography from 'app/components/Typography'
import WhitelistUpload from 'app/features/miso/WhitelistUpload'
import { classNames } from 'app/functions'
import React, { FC } from 'react'
import { useFormContext } from 'react-hook-form'

const WhitelistDetailsStep: FC = () => {
  const { i18n } = useLingui()
  const { getValues, setValue } = useFormContext()
  const value = getValues('whitelistEnabled')

  return (
    <>
      <div className="flex flex-col">
        <Switch.Group>
          <Typography weight={700}>{i18n._(t`Use whitelist`)}</Typography>
          <div className="mt-2 flex items-center h-[42px]">
            <Switch
              name="whitelistEnabled"
              checked={value}
              onChange={() => setValue('whitelistEnabled', !value)}
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
      <div className={classNames(value ? '' : 'opacity-40 pointer-events-none', 'col-span-6')}>
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
    </>
  )
}

export default WhitelistDetailsStep
