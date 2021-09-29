import React, { useEffect, useMemo, useState } from 'react'
import { shortenAddress } from './table-utils'
import ExternalLink from '../../../../components/ExternalLink'

const generateMockItem = () => ({
  type: 'Swap ETH for BTC',
  value: `$${(Math.random() * 1000).toFixed(2)}`,
  in: `${Math.random().toFixed(4)} ETH`,
  out: `${(Math.random() / 100).toFixed(4)} WBTC`,
  to: `0x${Math.floor(Math.random() * 100000000000000000000)}`,
  time: new Date(Math.random() * 10000000000000).toDateString(),
})

const MOCK_DATA_PT1 = Array(50)
  .fill('')
  .map((item) => generateMockItem())

const MOCK_DATA_PT2 = Array(36)
  .fill('')
  .map((item) => generateMockItem())

export const useTransactionsData = () => {
  const [data, setData] = useState([])
  const [totalTransactions, setTotalItems] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  // Used to ensure pagination does not reset when new data is loaded in
  const [resetPagination, setResetPagination] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setData(MOCK_DATA_PT1)
      setTotalItems(MOCK_DATA_PT1.length + MOCK_DATA_PT2.length)
      setLoading(false)
      setError(false)
    }, 2000)
    return () => clearTimeout(timer)
  }, [])

  const requestMoreTransactions = () => {
    setLoading(true)
    setResetPagination(false)
    setTimeout(() => {
      setLoading(false)
      setData(MOCK_DATA_PT1.concat(MOCK_DATA_PT2))
      setResetPagination(true)
    }, 1000)
  }

  const TransactionColumns = useMemo(
    () => [
      {
        Header: 'Type',
        accessor: 'type',
      },
      {
        Header: 'Value',
        accessor: 'value',
      },
      {
        Header: 'In',
        accessor: 'in',
      },
      {
        Header: 'Out',
        accessor: 'out',
      },
      {
        Header: 'To',
        accessor: 'to',
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

  const defaultColumn = React.useMemo(() => ({ minWidth: 30 }), [])

  return useMemo(
    () => ({
      config: { columns: TransactionColumns, data, autoResetPage: resetPagination, defaultColumn },
      loading,
      error,
      totalTransactions,
      requestMoreTransactions,
      resetPagination,
    }),
    [TransactionColumns, data, defaultColumn, error, loading, resetPagination, totalTransactions]
  )
}
