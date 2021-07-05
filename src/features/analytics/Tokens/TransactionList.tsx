import { useMemo } from 'react'
import { formatDateAgo, formatNumber, shortenAddress } from '../../../functions'
import Table from './Table'

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
        <div className="w-screen bg-dark-900 grid grid-cols-10 py-8">
          <div className="col-start-2 col-span-8 space-y-6">
            <div className="text-high-emphesis text-2xl font-bold">Transactions</div>
            <Table columns={columns} data={transactions} />
          </div>
        </div>
      )}
    </>
  )
}
