import React, { FC, useState } from 'react'

import Badge from '../../components/Badge'
import Button from '../../components/Button'
import CurrencyLogo from '../../components/CurrencyLogo'
import { LimitOrder } from '@sushiswap/sdk'
import Lottie from 'lottie-react'
import NavLink from '../../components/NavLink'
import Pagination from './Pagination'
import TransactionConfirmationModal from '../../modals/TransactionConfirmationModal'
import loadingCircle from '../../animation/loading-circle.json'
import { t } from '@lingui/macro'
import { useLimitOrderContract } from '../../hooks'
import useLimitOrders from '../../hooks/useLimitOrders'
import { useLingui } from '@lingui/react'
import { useTransactionAdder } from '../../state/transactions/hooks'

const OpenOrders: FC = () => {
  const { i18n } = useLingui()
  const { pending, mutate } = useLimitOrders()
  const limitOrderContract = useLimitOrderContract(true)
  const addTransaction = useTransactionAdder()
  const [hash, setHash] = useState('')

  const cancelOrder = async (limitOrder: LimitOrder, summary: string) => {
    const tx = await limitOrderContract.cancelOrder(limitOrder.getTypeHash())
    addTransaction(tx, {
      summary,
    })

    setHash(tx.hash)

    await tx.wait()
    await mutate((data) => ({ ...data }))
  }

  return (
    <>
      <TransactionConfirmationModal
        isOpen={!!hash}
        onDismiss={() => setHash('')}
        hash={hash}
        content={() => <div />}
        attemptingTxn={false}
        pendingText={''}
      />
      <div className="flex items-center gap-2 pb-4 text-xl border-b text-high-emphesis border-dark-800">
        {i18n._(t`Open Orders`)}{' '}
        <span className="inline-flex">
          <Badge color="blue" size="medium">
            {pending.totalOrders}
          </Badge>
        </span>
      </div>
      <div className="text-center text-secondary">
        {pending.loading ? (
          <div className="w-8 m-auto">
            <Lottie animationData={loadingCircle} autoplay loop />
          </div>
        ) : pending.data.length > 0 ? (
          <>
            <div className="grid grid-flow-col grid-cols-3 gap-4 px-4 pb-4 text-sm font-bold md:grid-cols-4 text-secondary">
              <div className="flex items-center cursor-pointer hover:text-primary">{i18n._(t`Receive`)}</div>
              <div className="flex items-center cursor-pointer hover:text-primary">{i18n._(t`Pay`)}</div>
              <div className="flex items-center hidden text-left cursor-pointer hover:text-primary md:block">
                {i18n._(t`Rate`)}
              </div>
              <div className="flex items-center justify-end cursor-pointer hover:text-primary" />
            </div>
            <div className="flex flex-col gap-2 md:gap-5">
              {pending.data.map((order, index) => (
                <div key={index} className="block overflow-hidden rounded text-high-emphesis bg-dark-800">
                  <div className="grid items-center grid-flow-col grid-cols-3 gap-4 px-4 py-3 text-sm md:grid-cols-4 align-center text-primary">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-4 font-bold">
                        <div className="min-w-[32px] flex items-center">
                          <CurrencyLogo size={32} currency={order.tokenOut} />
                        </div>
                        <div className="flex flex-col">
                          <div>{order.limitOrder.amountOut.toSignificant(6)} </div>
                          <div className="text-xs text-left text-secondary">{order.tokenOut.symbol}</div>
                        </div>
                      </div>
                    </div>
                    <div className="font-bold text-left">
                      <div className="flex flex-col">
                        <div>{order.limitOrder.amountIn.toSignificant(6)} </div>
                        <div className="text-xs text-left text-secondary">{order.tokenIn.symbol}</div>
                      </div>
                    </div>
                    <div className="hidden font-bold text-left md:block">
                      <div>{order.rate}</div>
                      <div className="text-xs text-secondary">
                        {order.tokenOut.symbol} per {order.tokenIn.symbol}
                      </div>
                    </div>
                    <div className="font-bold text-right">
                      <div className="mb-1">
                        {order.filledPercent}% {i18n._(t`Filled`)}
                      </div>
                      <div>
                        <Button
                          color="pink"
                          variant="outlined"
                          size="xs"
                          onClick={() => cancelOrder(order.limitOrder, `Cancel order`)}
                        >
                          {i18n._(t`Cancel Order`)}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Pagination
              onChange={pending.setPage}
              totalPages={pending.maxPages}
              currentPage={pending.page}
              pageNeighbours={2}
            />
          </>
        ) : (
          <span>
            No open limit orders. Why not{' '}
            <NavLink href="/limit-order">
              <a className="text-sm underline cursor-pointer text-blue">place one?</a>
            </NavLink>
          </span>
        )}
      </div>
    </>
  )
}

export default OpenOrders
