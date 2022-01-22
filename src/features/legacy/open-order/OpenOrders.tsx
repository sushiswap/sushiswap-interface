import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { LimitOrder } from '@sushiswap/limit-order-sdk'
import loadingCircle from 'app/animation/loading-circle.json'
import Button from 'app/components/Button'
import Chip from 'app/components/Chip'
import { CurrencyLogo } from 'app/components/CurrencyLogo'
import NavLink from 'app/components/NavLink'
import Pagination from 'app/components/Pagination'
import { useLimitOrderContract } from 'app/hooks/useContract'
import useLimitOrders from 'app/hooks/useLimitOrders'
import TransactionConfirmationModal from 'app/modals/TransactionConfirmationModal'
import { useTransactionAdder } from 'app/state/transactions/hooks'
import Lottie from 'lottie-react'
import React, { FC, useState } from 'react'

const OpenOrders: FC = () => {
  const { i18n } = useLingui()
  const { pending, mutate } = useLimitOrders()
  const limitOrderContract = useLimitOrderContract(true)
  const addTransaction = useTransactionAdder()
  const [hash, setHash] = useState('')

  const cancelOrder = async (limitOrder: LimitOrder, summary: string) => {
    // @ts-ignore TYPE NEEDS FIXING
    const tx = await limitOrderContract.cancelOrder(limitOrder.getTypeHash())
    addTransaction(tx, {
      summary,
    })

    setHash(tx.hash)

    await tx.wait()
    // @ts-ignore TYPE NEEDS FIXING
    await mutate((data) => ({ ...data }))
  }

  return (
    <>
      <TransactionConfirmationModal
        isOpen={!!hash}
        onDismiss={() => setHash('')}
        hash={hash}
        content={<div />}
        attemptingTxn={false}
        pendingText={''}
      />
      <div className="flex items-center gap-2 pb-4 text-xl border-b text-high-emphesis border-dark-800">
        {i18n._(t`Open Orders`)}
        <Chip color="blue" label={pending.totalOrders} />
      </div>
      <div className="text-center text-secondary">
        {pending.loading ? (
          <div className="w-8 m-auto">
            <Lottie animationData={loadingCircle} autoplay loop />
          </div>
        ) : pending.data.length > 0 ? (
          <>
            <div className="grid grid-flow-col grid-cols-4 gap-4 px-4 pb-4 text-sm font-bold md:grid-cols-5 text-secondary">
              <div className="flex items-center cursor-pointer hover:text-primary">{i18n._(t`Receive`)}</div>
              <div className="flex items-center justify-center cursor-pointer md:text-left hover:text-primary md:block">
                {i18n._(t`Pay`)}
              </div>
              <div className="flex items-center hidden cursor-pointer md:text-left hover:text-primary md:block">
                {i18n._(t`Rate`)}
              </div>
              <div className="flex items-center justify-center cursor-pointer md:text-left hover:text-primary md:block">
                {i18n._(t`Filled`)}
              </div>
              <div className="flex items-center justify-end cursor-pointer hover:text-primary" />
            </div>
            <div className="flex flex-col gap-2 md:gap-5">
              {pending.data.map((order, index) => (
                <div key={index} className="block overflow-hidden rounded text-high-emphesis bg-dark-800">
                  <div className="grid items-center grid-flow-col grid-cols-4 gap-4 px-4 py-3 text-sm md:grid-cols-5 align-center text-primary">
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
                    <div className="font-bold md:text-left">
                      <div className="flex flex-col">
                        <div>{order.limitOrder.amountIn.toSignificant(6)} </div>
                        <div className="text-xs md:text-left text-secondary">{order.tokenIn.symbol}</div>
                      </div>
                    </div>
                    <div className="hidden font-bold md:text-left md:block">
                      <div>{order.rate}</div>
                      <div className="text-xs text-secondary">
                        {order.tokenOut.symbol} per {order.tokenIn.symbol}
                      </div>
                    </div>
                    <div className="font-bold md:text-left md:block">{order.filledPercent}%</div>
                    <div className="flex justify-end font-bold text-right">
                      <Button
                        color="pink"
                        variant="filled"
                        size="xs"
                        onClick={() => cancelOrder(order.limitOrder, `Cancel order`)}
                        className="whitespace-nowrap"
                      >
                        {i18n._(t`Cancel Order`)}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Pagination
              onChange={(page) => {
                pending.setPage(page + 1)
              }}
              // @ts-ignore TYPE NEEDS FIXING
              totalPages={pending.maxPages}
              currentPage={pending.page - 1}
              pageNeighbours={2}
              canNextPage={false}
              canPreviousPage={false}
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
