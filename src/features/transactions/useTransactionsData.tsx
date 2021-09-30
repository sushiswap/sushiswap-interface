import React, { useMemo } from 'react'
import { transactionDataFormatter } from './table-utils'
import ExternalLink from '../../components/ExternalLink'
import { useTransactions } from '../../services/graph'

export const useTransactionsData = (pairs: string[]) => {
  const { transactions, error } = useTransactions(pairs)
  const formattedTransactions = useMemo(() => transactionDataFormatter(transactions || []), [transactions])

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
        Cell: (props) => {
          return (
            <ExternalLink color="blue" href={`https://etherscan.io/address/${props.cell.value}`}>
              {props.cell.value}
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
        data: formattedTransactions,
        defaultColumn,
      },
      loading: !transactions && !error,
      error,
      totalTransactions: transactions ? transactions.length : 0,
      requestMoreTransactions: () => undefined,
    }),
    [TransactionColumns, defaultColumn, error, formattedTransactions, transactions]
  )
}
