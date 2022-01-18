import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { OrderStatus } from '@sushiswap/limit-order-sdk'
import loadingCircle from 'app/animation/loading-circle.json'
import Badge from 'app/components/Badge'
import { CurrencyLogo } from 'app/components/CurrencyLogo'
import Pagination from 'app/components/Pagination'
import useLimitOrders from 'app/hooks/useLimitOrders'
import Lottie from 'lottie-react'
import React, { FC } from 'react'

const CompletedOrders: FC = () => {
  const { i18n } = useLingui()
  const { completed } = useLimitOrders()

  return (
    <>
      <div className="flex items-center gap-2 pb-4 text-xl border-b text-high-emphesis border-dark-800">
        {i18n._(t`Order History`)}{' '}
        <span className="inline-flex">
          <Badge color="pink" size="medium">
            {completed.totalOrders}
          </Badge>
        </span>
      </div>
      <div className="text-center text-secondary">
        {completed.loading ? (
          <div className="w-8 m-auto">
            <Lottie animationData={loadingCircle} autoplay loop />
          </div>
        ) : completed.data.length > 0 ? (
          <>
            <div className="grid grid-flow-col grid-cols-3 gap-4 px-4 pb-4 text-sm font-bold md:grid-cols-4 text-secondary">
              <div className="flex items-center cursor-pointer hover:text-primary">{i18n._(t`Receive`)}</div>
              <div className="flex items-center justify-center cursor-pointer hover:text-primary md:justify-start">
                {i18n._(t`Pay`)}
              </div>
              <div className="flex items-center hidden text-left cursor-pointer hover:text-primary md:block">
                {i18n._(t`Rate`)}
              </div>
              <div className="flex items-center justify-end cursor-pointer hover:text-primary">{i18n._(t`Filled`)}</div>
            </div>
            <div className="flex flex-col gap-2 md:gap-5">
              {completed.data.map((order, index) => (
                <div
                  key={index}
                  className="block overflow-hidden rounded text-high-emphesis bg-dark-800"
                  style={{
                    background:
                      order.status === OrderStatus.FILLED
                        ? 'linear-gradient(90deg, rgba(0, 255, 79, 0.075) 0%, rgba(0, 255, 79, 0) 50%), #202231'
                        : order.status === OrderStatus.CANCELLED
                        ? 'linear-gradient(90deg, rgba(200, 200, 200, 0.075) 0%, rgba(200, 200, 200, 0) 50%), #202231'
                        : 'linear-gradient(90deg, rgba(255, 56, 56, 0.15) 0%, rgba(255, 56, 56, 0) 50%), #202231',
                  }}
                >
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
                    <div className="font-bold md:text-left">
                      <div className="flex flex-col">
                        <div>{order.limitOrder.amountIn.toSignificant(6)} </div>
                        <div className="text-xs md:text-left text-secondary">{order.tokenIn.symbol}</div>
                      </div>
                    </div>
                    <div className="hidden font-bold text-left md:block">
                      <div>{order.rate}</div>
                      <div className="text-xs text-secondary">
                        {order.tokenOut.symbol} per {order.tokenIn.symbol}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="mb-1">
                        {order.status === OrderStatus.FILLED ? (
                          <span className="text-green">{i18n._(t`Filled`)}</span>
                        ) : order.status === OrderStatus.CANCELLED ? (
                          <span className="text-secondary">{i18n._(t`Cancelled`)}</span>
                        ) : (
                          <span className="text-red">{i18n._(t`Expired`)}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Pagination
              onChange={completed.setPage}
              totalPages={completed.maxPages}
              currentPage={completed.page}
              pageNeighbours={2}
              canNextPage={false}
              canPreviousPage={false}
            />
          </>
        ) : (
          <span>{i18n._(t`No order history`)}</span>
        )}
      </div>
    </>
  )
}

export default CompletedOrders
