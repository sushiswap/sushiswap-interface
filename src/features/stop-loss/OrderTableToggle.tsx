import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Typography from 'app/components/Typography'
import { classNames } from 'app/functions'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useMemo } from 'react'

const OrdersTableToggle = () => {
  const { i18n } = useLingui()
  const { asPath } = useRouter()

  const items = useMemo(
    () => [
      {
        key: 'open',
        label: i18n._(t`Orders`),
        link: '/stop-loss/open',
      },
      {
        key: 'history',
        label: i18n._(t`History`),
        link: '/stop-loss/history',
      },
    ],
    [i18n]
  )

  return (
    <div className="flex gap-8">
      {items.map(({ label, link, key }, index) => (
        <Link href={link} key={index} passHref={true} replace={true}>
          <a className="h-full space-y-2 cursor-pointer">
            <Typography
              weight={700}
              className={classNames(
                asPath.includes(`/stop-loss/${key}`)
                  ? 'bg-gradient-to-r from-blue to-pink bg-clip-text text-transparent'
                  : '',
                'font-bold text-sm text-high-emphesis'
              )}
            >
              {label}
            </Typography>
            <div
              className={classNames(
                asPath.includes(`/stop-loss/${key}`) ? 'relative bg-gradient-to-r from-blue to-pink h-[3px] w-full' : ''
              )}
            />
          </a>
        </Link>
      ))}
    </div>
  )
}

export default OrdersTableToggle
