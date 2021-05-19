import { Popover, Transition } from '@headlessui/react'
import React, { Fragment } from 'react'

import ExternalLink from '../ExternalLink'
import { I18n } from '@lingui/core'
import Image from 'next/image'
import { classNames } from '../../functions/styling'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'

const items = (i18n: I18n) => [
    {
        name: i18n._(t`Docs`),
        description: i18n._(t`Documentation for users of Sushi.`),
        href: 'https://docs.sushi.com',
    },
    {
        name: i18n._(t`Dev`),
        description: i18n._(t`Documentation for developers of Sushi.`),
        href: 'https://dev.sushi.com',
    },
    {
        name: i18n._(t`Open Source`),
        description: i18n._(t`Sushi is a supporter of Open Source.`),
        href: 'https://github.com/sushiswap',
    },
    {
        name: i18n._(t`Tools`),
        description: i18n._(t`Tools to optimize your workflow.`),
        href: '/tools',
    },
    {
        name: i18n._(t`Discord`),
        description: i18n._(t`Join the community on Discord.`),
        href: 'https://discord.gg/NVPXN4e',
    },
]

export default function Menu() {
    const { i18n } = useLingui()
    const solutions = items(i18n)

    return (
        <Popover className="relative">
            {({ open }) => (
                <>
                    <Popover.Button
                        className={classNames(open ? 'text-secondary' : 'text-primary', 'focus:outline-none')}
                    >
                        <Image
                            src="/menu.svg"
                            width="16px"
                            height="16px"
                            title="More"
                            className={classNames(
                                open ? 'text-gray-600' : 'text-gray-400',
                                'inline-flex items-center ml-2 h-5 w-5 group-hover:text-secondary hover:text-high-emphesis'
                            )}
                            aria-hidden="true"
                        />
                    </Popover.Button>

                    <Transition
                        show={open}
                        as={Fragment}
                        enter="transition ease-out duration-200"
                        enterFrom="opacity-0 translate-y-1"
                        enterTo="opacity-100 translate-y-0"
                        leave="transition ease-in duration-150"
                        leaveFrom="opacity-100 translate-y-0"
                        leaveTo="opacity-0 translate-y-1"
                    >
                        <Popover.Panel
                            static
                            className="absolute z-10 bottom-12 lg:top-12 left-full transform -translate-x-full mt-3 px-2 w-screen max-w-xs sm:px-0"
                        >
                            <div className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 overflow-hidden">
                                <div className="relative grid gap-6 bg-dark-900 px-5 py-6 sm:gap-8 sm:p-8">
                                    {solutions.map((item) => (
                                        <ExternalLink
                                            key={item.name}
                                            href={item.href}
                                            className="-m-3 p-3 block rounded-md hover:bg-dark-800 transition ease-in-out duration-150"
                                        >
                                            <p className="text-base font-medium text-high-emphesis">{item.name}</p>
                                            <p className="mt-1 text-sm text-secondary">{item.description}</p>
                                        </ExternalLink>
                                    ))}
                                </div>
                            </div>
                        </Popover.Panel>
                    </Transition>
                </>
            )}
        </Popover>
    )
}
