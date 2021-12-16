import { Listbox, Transition } from '@headlessui/react'
import Chip from 'app/components/Chip'
import Typography from 'app/components/Typography'
import { getCountryName, ISO_COUNTRIES } from 'app/features/miso/context/utils'
import React, { FC, Fragment, ReactNode, useCallback } from 'react'

interface AuctionAdminFormSelectProps {
  value?: string
  label: string
  placeholder?: string
  onChange(e): void
  error?: string
  helperText: ReactNode
}

const AuctionAdminFormBannedCountries: FC<AuctionAdminFormSelectProps> = ({
  value,
  label,
  onChange,
  error,
  helperText,
}) => {
  const values = value?.split(',') || []
  const deleteCountry = useCallback(
    (values, value) => onChange(values?.filter((el) => el !== value).join(',')),
    [onChange]
  )

  const addCountry = useCallback(
    (values, value) => {
      return onChange([...values, value].join(','))
    },
    [onChange]
  )

  const list = Object.entries(ISO_COUNTRIES).filter(([k]) => !values.includes(k))

  return (
    <>
      <Typography weight={700}>{label}</Typography>
      <div className="mt-2">
        <Listbox value={value} onChange={(value) => addCountry(values, value)}>
          <div className="relative mt-1 w-full cursor-pointer">
            <Listbox.Button className="flex flex-wrap gap-2 min-h-[42px] relative w-full py-2 pl-3 pr-10 text-left bg-dark-1000/40 border border-dark-800 rounded-lg shadow-md cursor-default px-3 py-2 focus:ring-purple focus:border-purple cursor-pointer">
              {values?.map((el, index) => {
                return (
                  <Chip
                    key={index}
                    label={getCountryName(el)}
                    onClick={(e) => {
                      e.stopPropagation()

                      deleteCountry(values, el)
                    }}
                    color="purple"
                  />
                )
              })}
            </Listbox.Button>
            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="max-h-[240px] shadow-md absolute w-full mt-1 overflow-auto rounded bg-dark-900 focus:ring-purple focus:border-purple block w-full min-w-0 border border-dark-800">
                <div className="bg-dark-1000/40">
                  {list.map(([iso, label], index) => (
                    <Listbox.Option
                      key={index}
                      className={({ active }) =>
                        `${active ? 'text-high-emphesis bg-dark-900' : 'text-baseline'}
                          cursor-default select-none relative py-2 px-3`
                      }
                      value={iso}
                    >
                      <Typography>{label}</Typography>
                    </Listbox.Option>
                  ))}
                </div>
              </Listbox.Options>
            </Transition>
          </div>
        </Listbox>
      </div>
      {error ? <p className="mt-2 text-sm text-red">{error}</p> : helperText}
    </>
  )
}

export default AuctionAdminFormBannedCountries
