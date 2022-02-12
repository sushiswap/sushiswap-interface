import React, { useMemo } from 'react'

import ExternalLink from '../../components/ExternalLink'
import { shortenAddress } from './table-utils'
import { Transactions } from './types'

export const useTableConfig = (transactions?: Transactions[]) => {
  const TransactionColumns = useMemo(
    () => [
      {
        Header: 'Type',
        accessor: 'type',
        minWidth: 200,
      },
      {
        Header: 'Value',
        accessor: 'value',
        maxWidth: 100,
      },
      {
        Header: 'In',
        accessor: 'incomingAmt',
      },
      {
        Header: 'Out',
        accessor: 'outgoingAmt',
      },
      {
        Header: 'To',
        accessor: 'address',
        // @ts-ignore TYPE NEEDS FIXING
        Cell: (props) => {
          return (
            <ExternalLink color="blue" href={`https://etherscan.io/address/${props.cell.value}`}>
              {shortenAddress(props.cell.value)}
            </ExternalLink>
          )
        },
      },
      {
        Header: 'Time',
        accessor: 'time',
      },
    ],
    []
  )

  const defaultColumn = React.useMemo(() => ({ minWidth: 0 }), [])

  return useMemo(
    () => ({
      config: {
        columns: TransactionColumns,
        data: transactions,
        defaultColumn,
        initialState: {
          sortBy: [{ id: 'time', desc: false }],
        },
      },
    }),
    [TransactionColumns, defaultColumn, transactions]
  )
}
