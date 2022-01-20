import Typography from 'app/components/Typography'
import { classNames } from 'app/functions'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'

import useBalancesMenuItems from './useBalancesMenuItems'

const BalancesSideBar = () => {
  const items = useBalancesMenuItems()
  const { pathname } = useRouter()

  return (
    <div className="hidden lg:block">
      <div id="balances-sidebar" className="flex gap-8">
        {items.map(({ label, link, key }, index) => (
          <Link href={link} key={index} passHref={true}>
            <div className="h-full space-y-2 cursor-pointer">
              <Typography
                weight={700}
                className={classNames(
                  `/trident/balances/${key}` === pathname
                    ? 'bg-gradient-to-r from-blue to-pink bg-clip-text text-transparent'
                    : '',
                  'font-bold text-sm text-high-emphesis'
                )}
              >
                {label}
              </Typography>
              <div
                className={classNames(
                  `/trident/balances/${key}` === pathname
                    ? 'relative bg-gradient-to-r from-blue to-pink h-[3px] w-full'
                    : ''
                )}
              />
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default BalancesSideBar
