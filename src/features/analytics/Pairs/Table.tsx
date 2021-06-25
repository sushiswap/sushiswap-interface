import _ from 'lodash'
import React, { useState } from 'react'
import { useTable, usePagination, useSortBy } from 'react-table'
import { classNames } from '../../../functions'
import { ArrowRightIcon, ArrowLeftIcon } from '@heroicons/react/outline'

export default function Table({ columns, data, columnsHideable = [] }) {
  const [isHidden, setHidden] = useState(columnsHideable.length === 0 ? false : true)

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    rows,
    page,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    canPreviousPage,
    canNextPage,
    setPageSize,
    allColumns,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      defaultCanSort: false,
      initialState: { hiddenColumns: columnsHideable },
    },
    useSortBy,
    usePagination
  )

  const toggleHide = (e) => {
    const list = allColumns.filter((column) => columnsHideable.find((c) => c === column.id))
    list.forEach((column) => column.toggleHidden(!isHidden))
    setHidden(!isHidden)
    e.stopPropagation()
  }

  return (
    <>
      <table className="w-full overflow-hidden border-collapse" {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column, i) => (
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  <div
                    className={classNames(
                      column.align && `text-${column.align}`,
                      i === 0 && 'pl-2',
                      i === headerGroup.headers.length - 1 && 'pr-2'
                    )}
                  >
                    <div className="text-secondary font-bold text-sm">
                      {column.render('Header')}
                      {column.HideHeader && isHidden && (
                        <button onClick={(e) => toggleHide(e)} className="ml-1 text-dark-700">
                          {column.render('HideHeader')}
                        </button>
                      )}
                      {column.isSorted && <span className="ml-1">{column.isSortedDesc ? ' ˅' : ' ˄'}</span>}
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row, i) => {
            prepareRow(row)
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell, cI) => {
                  return (
                    <td className="pl-0 pr-0 pb-3" {...cell.getCellProps()}>
                      <div
                        className={classNames(
                          cI === 0 && 'rounded-l pl-4',
                          cI === row.cells.length - 1 && 'rounded-r pr-4',
                          'h-16 text-high-emphesis text-sm font-bold bg-dark-900 flex items-center'
                        )}
                      >
                        <div className={classNames(cell.column.align && `text-${cell.column.align}`, 'w-full')}>
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
      <div className="flex justify-between">
        <div className="flex font-bold text-sm text-secondary">
          <div>Rows per page: </div>
          <select
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
            className="ml-1 bg-transparent"
          >
            {[10, 20, 30, 40, 50].map((pageSize) => (
              <option className="bg-dark-1000" key={pageSize} value={pageSize}>
                {pageSize}
              </option>
            ))}
          </select>
        </div>
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
    </>
  )
}
