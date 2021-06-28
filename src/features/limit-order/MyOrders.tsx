import React, { FC } from 'react'
import Badge from '../../components/Badge'
import useLimitOrders from '../../hooks/useLimitOrders'
import { useLingui } from '@lingui/react'
import { t } from '@lingui/macro'
import NavLink from '../../components/NavLink'
import HoverLottie from '../../components/HoverLottie'
import orderHistoryJson from '../../animation/order-history.json'

const MyOrders: FC = () => {
  const { i18n } = useLingui()
  const { pending } = useLimitOrders()

  return (
    <NavLink href="/open-orders">
      <a className="text-secondary hover:text-high-emphesis">
        <div className="md:flex hidden gap-3 items-center">
          <div>{i18n._(t`My Orders`)}</div>
          <Badge color="blue">{pending.length}</Badge>
        </div>
        <div className="flex md:hidden">
          <HoverLottie animationData={orderHistoryJson} className="w-[32px] h-[32px]" />
        </div>
      </a>
    </NavLink>
  )
}

export default MyOrders
