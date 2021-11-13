import { ClipboardListIcon } from '@heroicons/react/outline'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Badge from 'components/Badge'
import NavLink from 'components/NavLink'
import useLimitOrders from 'hooks/useLimitOrders'
import React, { FC } from 'react'

const MyOrders: FC = () => {
  const { i18n } = useLingui()
  const { pending } = useLimitOrders()

  return (
    <NavLink href="/open-order">
      <a className="text-secondary hover:text-high-emphesis">
        <div className="md:flex hidden gap-3 items-center">
          <div>{i18n._(t`My Orders`)}</div>
          <Badge color="blue">{pending.totalOrders}</Badge>
        </div>
        <div className="flex md:hidden text-primary">
          <ClipboardListIcon className="w-[26px] h-[26px]" />
        </div>
      </a>
    </NavLink>
  )
}

export default MyOrders
