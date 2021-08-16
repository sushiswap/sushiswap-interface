import { formatDateAgo, formatNumber, shortenAddress } from '../../../../functions'

import Table from './Table'
import { useMemo } from 'react'

interface TransactionListProps {
  transactions: {
    symbols: {
      incoming: string
      outgoing: string
    }
    incomingAmt: number
    outgoingAmt: number
    address: string
    time: Date
  }[]
}

export default function TransactionList({ transactions }: TransactionListProps): JSX.Element {
  const columns = useMemo(
    () => [
      {
        Header: 'Type',
        accessor: 'symbols',
        Cell: (props) => `Swap ${props.value?.incoming} for ${props.value?.outgoing}`,
        align: 'left',
      },
      {
        Header: 'Value',
        accessor: 'value',
        Cell: (props) => formatNumber(props.value, true),
        align: 'right',
      },
      {
        Header: 'Incoming',
        accessor: 'incomingAmt',
        align: 'right',
      },
      {
        Header: 'Outgoing',
        accessor: 'outgoingAmt',
        align: 'right',
      },
      {
        Header: 'Address',
        accessor: 'address',
        Cell: (props) => <a href={`https://etherscan.com/address/${props.value}`}>{shortenAddress(props.value)}</a>,
        align: 'right',
      },
      {
        Header: 'Time',
        accessor: 'time',
        Cell: (props) => formatDateAgo(props.value),
        align: 'right',
      },
    ],
    []
  )

  return (
    <>
      {transactions && (
        <div className="grid w-screen grid-cols-10 py-8 bg-dark-900">
          <div className="col-span-8 col-start-2 space-y-6">
            <div className="text-2xl font-bold text-high-emphesis">Transactions</div>
            <Table columns={columns} data={transactions} />
          </div>
        </div>
      )}
    </>
  )
}
