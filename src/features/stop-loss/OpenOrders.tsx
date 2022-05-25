import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { LimitOrder } from '@sushiswap/limit-order-sdk'
import { OrderStatus } from '@sushiswap/limit-order-sdk'
import Pagination from 'app/components/Pagination'
import Typography from 'app/components/Typography'
import { DerivedOrder } from 'app/features/legacy/limit-order/types'
import useLimitOrders from 'app/features/legacy/limit-order/useLimitOrders'
import {
  TABLE_TABLE_CLASSNAME,
  TABLE_TBODY_TD_CLASSNAME,
  TABLE_TBODY_TR_CLASSNAME,
  TABLE_TR_TH_CLASSNAME,
  TABLE_WRAPPER_DIV_CLASSNAME,
} from 'app/features/trident/constants'
import { classNames } from 'app/functions'
import { useLimitOrderContract } from 'app/hooks'
import { useActiveWeb3React } from 'app/services/web3'
import { useTransactionAdder } from 'app/state/transactions/hooks'
import Link from 'next/link'
import React, { FC, useCallback, useEffect, useState } from 'react'
import { useFlexLayout, usePagination, useSortBy, useTable } from 'react-table'

import { useOpenOrdersTableConfig } from './useOpenOrdersTableConfig'
import useStopLossOrders from './useStopLossOrders'

interface OrdersData {
  loading: boolean
  totalOrders: number
  all: Array<DerivedOrder>
  executedOrders: number
  executed: Array<DerivedOrder>
}

const OpenOrders: FC = () => {
  const { i18n } = useLingui()
  const { account } = useActiveWeb3React()
  const { pending, mutate } = useLimitOrders()
  const addTransaction = useTransactionAdder()
  const limitOrderContract = useLimitOrderContract(true)

  const { fetchRegistryHistory, fetchExecutedRegistryHistory, transform } = useStopLossOrders()
  const [ordersData, setOrdersData] = useState<OrdersData>({
    loading: false,
    totalOrders: 0,
    all: [],
    executedOrders: 0,
    executed: [],
  })

  const cancelOrder = useCallback(
    async (limitOrder: LimitOrder, summary: string) => {
      if (!limitOrderContract) return
      /*
      const tx = await limitOrderContract.cancelOrder(limitOrder.getTypeHash())
      if (tx) {
        addTransaction(tx, {
          summary,
        })

        await tx.wait()
        // @ts-ignore TYPE NEEDS FIXING
        await mutate((data) => ({ ...data }))
      }
*/
      console.log('canceling order: ', limitOrder.getTypeHash())
      console.log('start time: ', limitOrder.startTime)
      console.log('end time: ', limitOrder.endTime)
    },
    [addTransaction, limitOrderContract, mutate]
  )

  const { config } = useOpenOrdersTableConfig({ orders: ordersData.all, cancelOrder })

  // @ts-ignore TYPE NEEDS FIXING
  const { getTableProps, getTableBodyProps, headerGroups, prepareRow, page } = useTable(
    // @ts-ignore TYPE NEEDS FIXING
    config,
    useSortBy,
    usePagination,
    useFlexLayout
  )

  useEffect(() => {
    const initOrdersData = async () => {
      setOrdersData({
        ...ordersData,
        loading: true,
      })
      const allOrdersCallData: string[] = await fetchRegistryHistory()
      const allOrdersData = allOrdersCallData
        .map((callData, index) => transform(callData, index))
        .filter((order) => order) as DerivedOrder[]

      const executedOrdersCallData: string[] = await fetchExecutedRegistryHistory()
      const executedOrdersData = executedOrdersCallData
        .map((callData, index) => transform(callData, index, OrderStatus.FILLED))
        .filter((order) => order) as DerivedOrder[]

      setOrdersData({
        loading: false,
        totalOrders: allOrdersData.length,
        all: allOrdersData,
        executedOrders: executedOrdersData.length,
        executed: executedOrdersData,
      })

      console.log(
        'allOrdersData: ',
        allOrdersData.map(
          (order) => order?.tokenIn?.name + ' > ' + order?.tokenOut?.name + order.limitOrder.amountOut.toSignificant(6)
        )
      )

      console.log(
        'executedOrdersData: ',
        executedOrdersData.map((order) => order?.tokenIn?.name + ' > ' + order?.tokenOut?.name)
      )
    }

    initOrdersData()
  }, [fetchRegistryHistory, transform])

  return (
    <div className="flex flex-col gap-4">
      <div className={classNames(TABLE_WRAPPER_DIV_CLASSNAME, pending.maxPages > 1 ? 'min-h-[537px]' : '')}>
        <table id="asset-balances-table" {...getTableProps()} className={TABLE_TABLE_CLASSNAME}>
          <thead>
            {headerGroups.map((headerGroup, i) => (
              <tr {...headerGroup.getHeaderGroupProps()} key={i}>
                {headerGroup.headers.map((column, i) => (
                  <th
                    // @ts-ignore TYPE NEEDS FIXING
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    key={i}
                    className={TABLE_TR_TH_CLASSNAME(i, headerGroup.headers.length)}
                  >
                    {column.render('Header')}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.length > 0 ? (
              // @ts-ignore TYPE NEEDS FIXING
              page.map((row, i) => {
                prepareRow(row)
                return (
                  <tr {...row.getRowProps()} key={i} className={TABLE_TBODY_TR_CLASSNAME}>
                    {/*@ts-ignore TYPE NEEDS FIXING*/}
                    {row.cells.map((cell, i) => {
                      return (
                        <td
                          key={i}
                          {...cell.getCellProps()}
                          className={classNames(
                            TABLE_TBODY_TD_CLASSNAME(i, row.cells.length),
                            'cursor-default whitespace-nowrap'
                          )}
                        >
                          {cell.render('Cell')}
                        </td>
                      )
                    })}
                  </tr>
                )
              })
            ) : (
              <tr className={TABLE_TBODY_TR_CLASSNAME}>
                <td colSpan={4} className={classNames(TABLE_TBODY_TD_CLASSNAME(0, 1), 'justify-center cursor-default')}>
                  <Typography
                    variant="xs"
                    className="text-center text-low-emphesis h-[60px] flex items-center justify-center"
                    component="span"
                  >
                    {i18n._(t`No open orders`)}
                  </Typography>
                </td>
              </tr>
            )}
          </tbody>
          <tfoot>
            <tr className={classNames(TABLE_TBODY_TR_CLASSNAME)}>
              <td
                colSpan={4}
                className={classNames(TABLE_TBODY_TD_CLASSNAME(0, 1), 'justify-center cursor-default py-4')}
              >
                <Typography variant="xs" className="italic text-center text-low-emphesis">
                  Funds will be received in your{' '}
                  <Link href={`/account/${account}`} passHref={true}>
                    <Typography variant="xs" className="text-blue" component="span">
                      BentoBox
                    </Typography>
                  </Link>{' '}
                  after order execution
                </Typography>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
      <Pagination
        canPreviousPage={pending.page > 1}
        canNextPage={pending.page < pending.maxPages}
        onChange={(page) => pending.setPage(page + 1)}
        totalPages={pending.maxPages}
        currentPage={pending.page - 1}
        pageNeighbours={1}
      />
    </div>
  )
}

export default OpenOrders
