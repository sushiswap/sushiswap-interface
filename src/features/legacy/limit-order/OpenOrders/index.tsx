import { LimitOrder } from '@sushiswap/limit-order-sdk'
import OpenOrdersPro from 'app/features/legacy/limit-order/OpenOrders/pro'
import { LimitOrderMode, LimitOrderProps } from 'app/features/legacy/limit-order/types'
import useLimitOrders from 'app/features/legacy/limit-order/useLimitOrders'
import { useOpenOrdersTableConfig } from 'app/features/legacy/limit-order/useOpenOrdersTableConfig'
import { useLimitOrderContract } from 'app/hooks'
import { useTransactionAdder } from 'app/state/transactions/hooks'
import { FC, useCallback } from 'react'

import OpenOrdersStandard from './standard'

const CompletedOrders: FC<LimitOrderProps> = ({ mode = LimitOrderMode.standard }) => {
  const { pending, mutate } = useLimitOrders()
  const addTransaction = useTransactionAdder()
  const limitOrderContract = useLimitOrderContract(true)

  const cancelOrder = useCallback(
    async (limitOrder: LimitOrder, summary: string) => {
      if (!limitOrderContract) return

      const tx = await limitOrderContract.cancelOrder(limitOrder.getTypeHash())
      if (tx) {
        addTransaction(tx, {
          summary,
        })

        await tx.wait()
        // @ts-ignore TYPE NEEDS FIXING
        await mutate((data) => ({ ...data }))
      }
    },
    [addTransaction, limitOrderContract, mutate]
  )

  const { config } = useOpenOrdersTableConfig({ orders: pending.data, cancelOrder })

  if (mode === LimitOrderMode.standard) {
    return <OpenOrdersStandard orders={pending} config={config} />
  }

  return <OpenOrdersPro orders={pending} config={config} />
}

export default CompletedOrders
