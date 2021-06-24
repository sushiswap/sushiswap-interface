import React, { FC, useState } from 'react'
import useLimitOrders from '../../hooks/useLimitOrders'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import CurrencyLogo from '../../components/CurrencyLogo'
import { useActiveWeb3React, useLimitOrderContract } from '../../hooks'
import Button from '../../components/Button'
import { LimitOrder } from 'limitorderv2-sdk'
import NavLink from '../../components/NavLink'
import Badge from '../../components/Badge'
import { useTransactionAdder } from '../../state/transactions/hooks'
import Lottie from 'lottie-react'
import loadingCircle from '../../animation/loading-circle.json'
import TransactionConfirmationModal from '../../components/TransactionConfirmationModal'
import { JSBI, Percent } from '@sushiswap/sdk'

const OpenOrders: FC = () => {
  const { i18n } = useLingui()
  const { pending, loading, mutate } = useLimitOrders()
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
      <div className="text-xl text-high-emphesis flex items-center gap-2 border-b border-dark-800 pb-4">
        {i18n._(t`Open Orders`)}{' '}
        <span className="inline-flex">
          <Badge color="blue" size="medium">
            {pending.length}
          </Badge>
        </span>
      </div>
      <div className="text-secondary text-center">
        {pending.length > 0 ? (
          <>
            <div className="grid grid-flow-col grid-cols-3 md:grid-cols-4 gap-4 px-4 pb-4 text-sm text-secondary font-bold">
              <div className="flex items-center cursor-pointer hover:text-primary">{i18n._(t`Receive`)}</div>
              <div className="flex items-center cursor-pointer hover:text-primary">{i18n._(t`Pay`)}</div>
              <div className="flex items-center cursor-pointer hover:text-primary text-left hidden md:block">
                {i18n._(t`Rate`)}
              </div>
              <div className="flex items-center cursor-pointer hover:text-primary justify-end" />
            </div>
            <div className="flex flex-col-reverse gap-2 md:gap-5">
              {pending.map((order, index) => (
                <div key={index} className="block text-high-emphesis bg-dark-800 overflow-hidden rounded">
                  <div className="grid items-center grid-flow-col grid-cols-3 md:grid-cols-4 gap-4 px-4 py-3 text-sm align-center text-primary">
                    <div className="flex flex-col">
                      <div className="flex gap-4 font-bold items-center">
                        <div className="min-w-[32px] flex items-center">
                          <CurrencyLogo size={32} currency={order.tokenOut} />
                        </div>
                        <div className="flex flex-col">
                          <div>{order.limitOrder.amountOut.toSignificant(6)} </div>
                          <div className="text-left text-secondary text-xs">{order.tokenOut.symbol}</div>
                        </div>
                      </div>
                    </div>
                    <div className="text-left font-bold">
                      <div className="flex flex-col">
                        <div>{order.limitOrder.amountIn.toSignificant(6)} </div>
                        <div className="text-left text-secondary text-xs">{order.tokenIn.symbol}</div>
                      </div>
                    </div>
                    <div className="text-left font-bold hidden md:block">
                      <div>
                        {new Percent(order.limitOrder.amountOut.quotient, order.limitOrder.amountIn.quotient)
                          .divide(JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(0)))
                          .toSignificant(6)}
                      </div>
                      <div className="text-xs text-secondary">
                        {order.tokenOut.symbol} per {order.tokenIn.symbol}
                      </div>
                    </div>
                    <div className="text-right font-bold">
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
          </>
        ) : loading ? (
          <div className="w-8 m-auto">
            <Lottie animationData={loadingCircle} autoplay loop />
          </div>
        ) : (
          <span>
            No open limit orders. Why not{' '}
            <NavLink href="/limit-order">
              <a className="text-sm text-blue underline cursor-pointer">place one?</a>
            </NavLink>
          </span>
        )}
      </div>
    </>
  )
}

export default OpenOrders
