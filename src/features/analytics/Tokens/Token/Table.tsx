import _ from 'lodash'
import React, { useState } from 'react'
import { useTable, usePagination, useSortBy } from 'react-table'
import { classNames } from '../../../../functions'
import { ArrowRightIcon, ArrowLeftIcon } from '@heroicons/react/outline'

export default function Table({ columns, data }) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    rows,
    page,
    nextPage,
    previousPage,
    canPreviousPage,
    canNextPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      defaultCanSort: false,
    },
    useSortBy,
    usePagination
  )

  return (
    <div className="w-full">
      <table className="w-full overflow-hidden border-collapse" {...getTableProps()}>
        <thead className="w-full h-12 border-b border-gray-800">
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column, i) => (
                <th {...column.getHeaderProps()}>
                  <div className={classNames(i === 0 && 'pl-2', i === headerGroup.headers.length - 1 && 'pr-2')}>
                    <div className={classNames('font-bold flex flex-row')}>
                      <div className={classNames(column.align && `text-${column.align}`, 'w-full')}>
                        {column.render('Header')}
                      </div>
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="w-full border-t border-b border-gray-800" {...getTableBodyProps()}>
          {page.map((row, i) => {
            prepareRow(row)
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    <td className={classNames(i === 0 && 'pt-4', 'pl-0 pr-0 pb-4')} {...cell.getCellProps()}>
                      <div className="flex items-center text-secondary">
                        <div
                          className={classNames(
                            cell.column.align === 'right' && `text-right`,
                            cell.column.align === 'left' && 'text-left',
                            'w-full'
                          )}
                        >
                          {cell.render('Cell')}
                        </div>
                      </div>
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
      <div className="flex justify-between mt-5">
        <div />
        <div className="flex">
          <div className="text-sm text-secondary">
            {`${pageSize * pageIndex + 1}-${pageSize * (pageIndex + 1)} of ${rows.length}`}
          </div>
          <button
            onClick={() => previousPage()}
            className={classNames(!canPreviousPage ? 'opacity-50 hover:cursor-default' : '', 'ml-3')}
          >
            <ArrowLeftIcon width={16} height={16} />
          </button>
          <button
            onClick={() => nextPage()}
            className={classNames(!canNextPage ? 'opacity-50 hover:cursor-default' : '', 'ml-3')}
          >
            <ArrowRightIcon width={16} height={16} />
          </button>
        </div>
      </div>
    </div>
  )
}
