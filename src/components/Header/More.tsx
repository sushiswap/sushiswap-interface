import { BeakerIcon, BookOpenIcon, CodeIcon, SparklesIcon } from '@heroicons/react/outline'
import { I18n } from '@lingui/core'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { DiscordIcon, GithubIcon } from 'app/components/Icon'
import Typography from 'app/components/Typography'
import React from 'react'

import ExternalLink from '../ExternalLink'
import NavLink from '../NavLink'
import Popover from '../Popover'

const items = (i18n: I18n) => [
  {
    name: i18n._(t`Docs`),
    icon: <BookOpenIcon width={20} />,
    href: 'https://docs.sushi.com',
    external: true,
  },
  {
    name: i18n._(t`Development`),
    icon: <CodeIcon width={20} />,
    href: 'https://dev.sushi.com',
    external: true,
  },
  {
    name: i18n._(t`Github`),
    icon: <GithubIcon width={20} />,
    href: 'https://github.com/sushiswap',
    external: true,
  },
  {
    name: i18n._(t`Tools`),
    icon: <BeakerIcon width={20} />,
    href: '/tools',
    external: false,
  },
  {
    name: i18n._(t`Discord`),
    icon: <DiscordIcon width={20} />,
    href: 'https://discord.gg/NVPXN4e',
    external: true,
  },
  {
    name: i18n._(t`Vesting`),
    icon: <SparklesIcon width={20} />,
    href: '/vesting',
    external: false,
  },
  {
    name: i18n._(t`Sushi Relay`),
    description: i18n._(t`MEV Protection & Gas Refund Solution`),
    href: 'https://docs.openmev.org',
    external: true,
  },
]

export default function Menu() {
  const { i18n } = useLingui()
  const solutions = items(i18n)

  return (
    <Popover
      placement="bottom-end"
      modifiers={[{ name: 'offset', options: { offset: [8, 0] } }]}
      content={
        <div className="px-2 mt-3 cursor-pointer">
          <div className="overflow-hidden border rounded shadow-lg bg-dark-900 border-dark-700">
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
      }
    >
      <div className="w-9 h-9">
        <svg
          width="16px"
          height="16px"
          className="inline-flex items-center p-2 border rounded cursor-pointer w-9 h-9 border-dark-700 hover:bg-dark-800 bg-dark-1000"
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
      </div>
    </Popover>
  )
}
