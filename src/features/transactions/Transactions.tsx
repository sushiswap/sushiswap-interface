import React, { FC } from 'react'
import { useLingui } from '@lingui/react'
import { t } from '@lingui/macro'
import Typography from '../../components/Typography'
import { usePagination, useTable, useFlexLayout } from 'react-table'
import { TableInstance } from './types'
import { TablePageToggler } from './TablePageToggler'
import { useTransactionsData } from './useTransactionsData'

interface TransactionsProps {
  pairs: string[]
}

export const Transactions: FC<TransactionsProps> = ({ pairs }) => {
  const { i18n } = useLingui()
  const { config, loading, error, totalTransactions } = useTransactionsData(pairs)

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    gotoPage,
    canPreviousPage,
    canNextPage,
    prepareRow,
    state: { pageIndex, pageSize },
  }: TableInstance = useTable(config, usePagination, useFlexLayout)

  return (
    <div className="flex flex-col gap-3">
      <Typography variant="h3" className="text-high-emphesis" weight={700}>
        {i18n._(t`Transactions`)}
        <div
          className={`animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue inline-block ml-3 transition ${
            loading ? 'opacity-100' : 'opacity-0'
          }`}
        />
        {error && <span className="text-sm italic text-red -ml-2">{i18n._(t`⚠️ Loading Error`)}</span>}
      </Typography>

      <div className="overflow-x-auto">
        <table {...getTableProps()} className="w-full">
          <thead>
            {headerGroups.map((headerGroup, i) => (
              <tr {...headerGroup.getHeaderGroupProps()} key={i}>
                {headerGroup.headers.map((column, i) => (
                  <th
                    key={i}
                    {...column.getHeaderProps()}
                    className={`text-secondary text-sm pt-1 pb-3 ${i === 0 ? 'text-left' : 'text-right'}`}
                  >
                    {column.render('Header')}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map((row, i) => {
              prepareRow(row)
              return (
                <tr {...row.getRowProps()} key={i}>
                  {row.cells.map((cell, i) => {
                    return (
                      <td
                        key={i}
                        {...cell.getCellProps()}
                        className={`py-3 border-t border-gray-800 ${i !== 0 && 'text-right'}`}
                      >
                        {cell.render('Cell')}
                      </td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <TablePageToggler
        pageIndex={pageIndex}
        pageSize={pageSize}
        totalItems={totalTransactions}
        gotoPage={gotoPage}
        canPreviousPage={canPreviousPage}
        canNextPage={canNextPage}
        loading={loading}
      />
    </div>
  )
}
