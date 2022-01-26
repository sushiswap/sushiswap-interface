import CompletedOrdersPro from 'app/features/legacy/limit-order/CompletedOrders/pro'
import { LimitOrderMode, LimitOrderProps } from 'app/features/legacy/limit-order/types'
import { useCompletedOrdersTableConfig } from 'app/features/legacy/limit-order/useCompletedOrdersTableConfig'
import useLimitOrders from 'app/features/legacy/limit-order/useLimitOrders'
import { FC } from 'react'

import CompletedOrdersStandard from './standard'

const CompletedOrders: FC<LimitOrderProps> = ({ mode = LimitOrderMode.standard }) => {
  const { completed } = useLimitOrders()
  const { config } = useCompletedOrdersTableConfig({ orders: completed.data })

  if (mode === LimitOrderMode.standard) {
    return <CompletedOrdersStandard orders={completed} config={config} />
  }

  return <CompletedOrdersPro orders={completed} config={config} />
}

export default CompletedOrders
