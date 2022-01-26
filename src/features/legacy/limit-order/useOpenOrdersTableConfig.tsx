import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { LimitOrder } from '@sushiswap/limit-order-sdk'
import Button from 'app/components/Button'
import Typography from 'app/components/Typography'
import { DerivedOrder } from 'app/features/legacy/limit-order/types'
import React, { useMemo, useState } from 'react'
import { CellProps } from 'react-table'

export const useOpenOrdersTableConfig = ({
  orders,
  cancelOrder,
}: {
  orders?: DerivedOrder[]
  cancelOrder: (limitOrder: LimitOrder, type: string) => void
}) => {
  const { i18n } = useLingui()

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
        accessor: 'timestamp',
        Header: 'Expires',
        Cell: (props: CellProps<DerivedOrder>) => {
          return (
            <Typography weight={700} variant="xs" className="font-sans">
              {Number(props.cell.row.original.limitOrder.endTime) === Number.MAX_SAFE_INTEGER
                ? 'Never'
                : new Date(Number(props.cell.row.original.limitOrder.endTime) * 1000).toLocaleString('en-uS', {
                    year: 'numeric',
                    month: 'numeric',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric',
                    timeZone: 'UTC',
                  })}
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
        accessor: 'id',
        Header: 'Cancel',
        Cell: (props: CellProps<DerivedOrder>) => {
          return (
            <Button
              color="blue"
              variant="empty"
              size="xs"
              onClick={() => cancelOrder(props.cell.row.original.limitOrder, `Cancel order`)}
              className="whitespace-nowrap font-sans"
            >
              {i18n._(t`Cancel Order`)}
            </Button>
          )
        },
      },
    ],
    [cancelOrder, i18n]
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
