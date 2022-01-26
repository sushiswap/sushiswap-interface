import { OrderStatus } from '@sushiswap/limit-order-sdk'
import Typography from 'app/components/Typography'
import { classNames } from 'app/functions'
import React, { useMemo, useState } from 'react'
import { CellProps } from 'react-table'

import { DerivedOrder } from './types'

export const useCompletedOrdersTableConfig = ({ orders }: { orders?: DerivedOrder[] }) => {
  const data = useMemo(
    () => [
      {
        accessor: 'tokenIn',
        Header: 'Token In',
        Cell: (props: CellProps<DerivedOrder>) => {
          return (
            <Typography variant="xs" className="flex items-baseline gap-2 text-secondary">
              <Typography variant="xs" weight={700} component="span" className="text-high-emphesis">
                {props.cell.row.original.limitOrder.amountIn.toSignificant(6)}
              </Typography>{' '}
              {props.cell.row.original.tokenIn.symbol}
            </Typography>
          )
        },
      },
      {
        accessor: 'tokenOut',
        Header: 'Token Out',
        Cell: (props: CellProps<DerivedOrder>) => {
          return (
            <Typography variant="xs" className="flex gap-2 text-secondary">
              <Typography variant="xs" weight={700} component="span" className="text-high-emphesis">
                {props.cell.row.original.limitOrder.amountOut.toSignificant(6)}
              </Typography>{' '}
              {props.cell.row.original.tokenOut.symbol}
            </Typography>
          )
        },
      },
      {
        accessor: 'rate',
        Header: 'Rate',
        Cell: (props: CellProps<DerivedOrder>) => {
          const [invert, setInvert] = useState(false)

          return (
            <Typography
              variant="xs"
              className="flex items-baseline gap-2 text-secondary cursor-pointer"
              onClick={() => setInvert(!invert)}
            >
              <Typography weight={700} variant="xs" component="span" className="text-high-emphesis">
                {invert ? props.cell.value.invert().toSignificant(6) : props.cell.value.toSignificant(6)}
              </Typography>{' '}
              {invert ? props.cell.row.original.tokenIn.symbol : props.cell.row.original.tokenOut.symbol}
            </Typography>
          )
        },
      },
      {
        accessor: 'filledPercent',
        Header: 'Filled',
        Cell: (props: CellProps<DerivedOrder>) => {
          return (
            <Typography variant="xs" weight={700} component="span" className="text-high-emphesis">
              {props.cell.value}%
            </Typography>
          )
        },
      },
      {
        accessor: 'updated',
        Header: 'Created at',
        Cell: (props: CellProps<DerivedOrder>) => {
          return (
            <Typography weight={700} variant="xs" className="font-sans">
              {new Date(Number(props.cell.row.original.limitOrder.startTime) * 1000).toLocaleString('en-uS', {
                year: 'numeric',
                month: 'numeric',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
              })}
            </Typography>
          )
        },
      },
      {
        accessor: 'status',
        Header: 'Status',
        Cell: (props: CellProps<DerivedOrder>) => {
          return (
            <Typography
              variant="xs"
              className={classNames(
                'font-sans capitalize',
                props.cell.row.original.status === OrderStatus.CANCELLED
                  ? 'text-red'
                  : props.cell.row.original.status === OrderStatus.EXPIRED
                  ? 'text-purple'
                  : props.cell.row.original.status === OrderStatus.FILLED
                  ? 'text-green'
                  : ''
              )}
            >
              {props.cell.row.original.status.toLowerCase()}
            </Typography>
          )
        },
      },
    ],
    []
  )

  const defaultColumn = React.useMemo(() => ({ minWidth: 0 }), [])

  return useMemo(
    () => ({
      config: {
        columns: data,
        data: orders,
        defaultColumn,
        // initialState: {
        //   sortBy: [{ id: 'receive', desc: true }],
        // },
      },
    }),
    [orders, data, defaultColumn]
  )
}
