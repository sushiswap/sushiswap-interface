import { Listbox, Transition } from '@headlessui/react'
import { SelectorIcon } from '@heroicons/react/outline'
import Typography from 'app/components/Typography'
import React, { FC, Fragment, ReactNode } from 'react'

interface AuctionAdminFormSelectProps {
  value?: string
  label: string
  placeholder?: string
  onChange(e): void
  error?: string
  helperText: ReactNode
  options: string[]
}

const AuctionAdminFormSelect: FC<AuctionAdminFormSelectProps> = ({
  value,
  label,
  options,
  onChange,
  error,
  helperText,
}) => {
  return (
    <>
      <Typography weight={700}>{label}</Typography>
      <div className="mt-2 flex rounded-md shadow-sm bg-dark-900">
        <Listbox value={value} onChange={onChange}>
          <div className="relative mt-1 w-1/4">
            <Listbox.Button className="relative w-full py-2 pl-3 pr-10 text-left bg-dark-1000/40 border border-dark-800 rounded-lg shadow-md cursor-default px-3 py-2 focus:ring-purple focus:border-purple cursor-pointer">
              <span className="block truncate">{value || 'Select category'}</span>
              <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <SelectorIcon className="w-5 h-5 text-gray-400" aria-hidden="true" />
              </span>
            </Listbox.Button>
            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="shadow-md absolute w-full mt-1 overflow-auto rounded bg-dark-900 focus:ring-purple focus:border-purple block w-full min-w-0 border border-dark-800">
                <div className="bg-dark-1000/40">
                  {options.map((category, index) => (
                    <Listbox.Option
                      key={index}
                      className={({ active }) =>
                        `${active ? 'text-high-emphesis bg-dark-900' : 'text-baseline'}
                          cursor-default select-none relative py-2 px-3`
                      }
                      value={category}
                    >
                      <Typography>{category}</Typography>
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

export default AuctionAdminFormSelect
