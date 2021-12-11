import { Popover, Transition } from '@headlessui/react'
import { BeakerIcon, BookOpenIcon, CodeIcon, SparklesIcon } from '@heroicons/react/outline'
import { I18n } from '@lingui/core'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { DiscordIcon, GithubIcon } from 'app/components/Icon'
import Typography from 'app/components/Typography'
import React, { Fragment } from 'react'

import { classNames } from '../../functions/styling'
import ExternalLink from '../ExternalLink'
import NavLink from '../NavLink'

const items = (i18n: I18n) => [
  {
    name: i18n._(t`Docs`),
    icon: <BookOpenIcon width={20} />,
    description: i18n._(t`Documentation for users of Sushi.`),
    href: 'https://docs.sushi.com',
    external: true,
  },
  {
    name: i18n._(t`Development`),
    icon: <CodeIcon width={20} />,
    description: i18n._(t`Documentation for developers of Sushi.`),
    href: 'https://dev.sushi.com',
    external: true,
  },
  {
    name: i18n._(t`Github`),
    icon: <GithubIcon width={20} />,
    description: i18n._(t`Sushi is a supporter of Open Source.`),
    href: 'https://github.com/sushiswap',
    external: true,
  },
  {
    name: i18n._(t`Tools`),
    icon: <BeakerIcon width={20} />,
    description: i18n._(t`Tools to optimize your workflow.`),
    href: '/tools',
    external: false,
  },
  {
    name: i18n._(t`Discord`),
    icon: <DiscordIcon width={20} />,
    description: i18n._(t`Join the community on Discord.`),
    href: 'https://discord.gg/NVPXN4e',
    external: true,
  },
  {
    name: i18n._(t`Vesting`),
    icon: <SparklesIcon width={20} />,
    description: i18n._(t`Weekly unlocks from the vesting period.`),
    href: '/vesting',
    external: false,
  },
]

export default function Menu() {
  const { i18n } = useLingui()
  const solutions = items(i18n)

  return (
    <Popover className="relative ml-auto md:m-0">
      {({ open }) => (
        <>
          <Popover.Button
            className={classNames(
              open ? 'text-primary' : 'text-secondary',
              'focus:outline-none hover:text-high-emphesis'
            )}
          >
            <svg
              width="16px"
              height="16px"
              className="inline-flex items-center w-5 h-5 ml-2"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M19 13C19.5523 13 20 12.5523 20 12C20 11.4477 19.5523 11 19 11C18.4477 11 18 11.4477 18 12C18 12.5523 18.4477 13 19 13Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M5 13C5.55228 13 6 12.5523 6 12C6 11.4477 5.55228 11 5 11C4.44772 11 4 11.4477 4 12C4 12.5523 4.44772 13 5 13Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
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
              className="absolute z-50 w-screen max-w-xs px-2 mt-3 transform -translate-x-full bottom-12 lg:top-12 left-full sm:px-0"
            >
              <div className="shadow-lg">
                <div className="overflow-hidden relative grid bg-dark-900 border rounded-lg border-dark-700">
                  {solutions.map((item) =>
                    item.external ? (
                      <ExternalLink
                        key={item.name}
                        href={item.href}
                        className="flex gap-3 p-3 transition duration-150 ease-in-out hover:bg-dark-800"
                      >
                        {item.icon}
                        <Typography variant="sm" weight={700}>
                          {item.name}
                        </Typography>
                      </ExternalLink>
                    ) : (
                      <NavLink key={item.name} href={item.href}>
                        <a className="flex gap-3 p-3 transition duration-150 ease-in-out hover:bg-dark-800">
                          {item.icon}
                          <Typography variant="sm" weight={700}>
                            {item.name}
                          </Typography>
                        </a>
                      </NavLink>
                    )
                  )}
                </div>
              </div>
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  )
}
