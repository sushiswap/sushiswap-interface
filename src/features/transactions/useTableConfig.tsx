import { formatDateAgo, getExplorerLink } from 'app/functions'
import { useActiveWeb3React } from 'app/services/web3'
import React, { useMemo } from 'react'

import ExternalLink from '../../components/ExternalLink'
import { shortenAddress } from './table-utils'
import { Transactions } from './types'

export const useTableConfig = (transactions?: Transactions[]) => {
  const { chainId } = useActiveWeb3React()

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
        Header: 'Transaction',
        accessor: 'txHash',
        // @ts-ignore TYPE NEEDS FIXING
        Cell: (props) => {
          return (
            <ExternalLink color="blue" href={getExplorerLink(chainId || 1, props.cell.value, 'transaction')}>
              {shortenAddress(props.cell.value)}
            </ExternalLink>
          )
        },
      },
      {
        Header: 'Time',
        accessor: 'time',
        // @ts-ignore TYPE NEEDS FIXING
        Cell: (props) => {
          return formatDateAgo(new Date(Number(props.cell.value) * 1000))
        },
      },
    ],
    [chainId]
  )

  const defaultColumn = React.useMemo(() => ({ minWidth: 0 }), [])

  return useMemo(
    () => ({
      config: {
        columns: TransactionColumns,
        data: transactions,
        defaultColumn,
        initialState: {
          sortBy: [{ id: 'time', type: 'datetime', desc: true }],
        },
      },
    }),
    [TransactionColumns, defaultColumn, transactions]
  )
}
