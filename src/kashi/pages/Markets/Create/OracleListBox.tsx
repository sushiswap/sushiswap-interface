import { Listbox, Transition } from '@headlessui/react'
import React, { useState } from 'react'

import AsyncOracleIcon from '../../../components/AsyncOracleIcon'

const oracles = [
    { id: 1, name: 'Chainlink', unavailable: false },
    { id: 2, name: 'SushiSwap', unavailable: false },
    { id: 3, name: 'Pegged', unavailable: true }
]

function OracleListBox(): JSX.Element {
    const [selectedOracle, setSelectedOracle] = useState(oracles[0])
    return (
        <div className="flex items-center justify-center">
            <div className="w-full">
                <Listbox as="div" className="space-y-1" value={selectedOracle} onChange={setSelectedOracle}>
                    {({ open }) => (
                        <>
                            <Listbox.Label className="block text-base leading-5 font-medium text-gray-700 pb-2">
                                Oracle
                            </Listbox.Label>
                            <div className="relative">
                                <span className="inline-block w-full rounded-md shadow-sm">
                                    <Listbox.Button className="cursor-pointer relative w-full rounded-md border bg-input border-none p-3 text-left focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition ease-in-out duration-150 sm:text-sm sm:leading-5">
                                        <span className="truncate flex items-center">
                                            <AsyncOracleIcon
                                                name={selectedOracle.name}
                                                className="w-10 h-10 rounded-sm mr-4"
                                            />
                                            <span className="text-lg">{selectedOracle.name}&nbsp;</span>
                                        </span>
                                        <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                            <svg
                                                className="h-5 w-5 text-secondary"
                                                viewBox="0 0 20 20"
                                                fill="none"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    d="M7 7l3-3 3 3m0 6l-3 3-3-3"
                                                    strokeWidth="1.5"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                        </span>
                                    </Listbox.Button>
                                </span>

                                <Transition
                                    show={open}
                                    leave="transition ease-in duration-100"
                                    leaveFrom="opacity-100"
                                    leaveTo="opacity-0"
                                    className="z-10 absolute mt-1 w-full rounded-md bg-input shadow-lg"
                                >
                                    <Listbox.Options
                                        static
                                        className="max-h-60 rounded-md py-1 text-base leading-6 shadow-xs overflow-auto focus:border-none focus:outline-none sm:text-sm sm:leading-5"
                                    >
                                        {oracles.map((oracle: any) => (
                                            <Listbox.Option
                                                key={oracle.id}
                                                value={oracle}
                                                disabled={oracle.unavailable}
                                            >
                                                {({ selected, active }) => (
                                                    <div
                                                        className={`
                                                        ${active ? 'bg-dark-blue' : ''}
                                                        ${oracle.unavailable ? 'cursor-not-allowed' : 'cursor-pointer'}
                                                        relative p-3`}
                                                    >
                                                        <span className="flex truncate items-center">
                                                            <AsyncOracleIcon
                                                                name={oracle.name}
                                                                className="w-10 h-10 rounded-sm mr-4"
                                                            />
                                                            <span className="text-lg">{oracle.name}&nbsp;</span>
                                                        </span>
                                                    </div>
                                                )}
                                            </Listbox.Option>
                                        ))}
                                    </Listbox.Options>
                                </Transition>
                            </div>
                        </>
                    )}
                </Listbox>
            </div>
        </div>
    )
}

export default OracleListBox
