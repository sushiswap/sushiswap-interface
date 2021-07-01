/* This example requires Tailwind CSS v2.0+ */
import React, { Fragment } from 'react'
import { Popover, Transition } from '@headlessui/react'
import { classNames } from '../functions/styling'
import { ExternalLink } from './Link'
import { ReactComponent as MenuIcon } from '../assets/images/menu.svg'
import { t } from '@lingui/macro'
import { I18n } from '@lingui/core'
import { useLingui } from '@lingui/react'

const items = (i18n: I18n) => [
    {
        name: i18n._(t`Whitepaper`),
        description: i18n._(t`Documentation for community of ROS.`),
        href: 'https://riseofshinobi.net/wp-content/uploads/2021/06/Rise-of-Shinobi-Whitepaper.pdf'
    },
    {
        name: i18n._(t`Telegram`),
        description: i18n._(t`Community for Shinobi.`),
        href: 'https://t.me/riseofshinobi'
    },
    {
        name: i18n._(t`Twitter`),
        description: i18n._(t`Offical Twitter for ROS`),
        href: 'https://twitter.com/riseofshinobi'
    },
    {
        name: i18n._(t`Medium`),
        description: i18n._(t`Updates and news for Rise of Shinobi`),
        href: 'https://riseofshinobi.medium.com'
    },
    {
        name: i18n._(t`CLAIM ARDROP`),
        description: i18n._(t`Claim 1,000,000 ROS Tokens`),
        href: 'https://docs.google.com/forms/d/e/1FAIpQLSeNnQu6rGVsx6sArowdWwc0EpGv4BKQkx7iTb-GlEyfmmL2ag/viewform'
    }
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
                        <MenuIcon
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
                                    {solutions.map(item => (
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
