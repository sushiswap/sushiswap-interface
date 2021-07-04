import _ from 'lodash'
import React, { useState } from 'react'
import { useTable, usePagination, useSortBy } from 'react-table'
import { classNames } from '../functions'
import { ArrowRightIcon, ArrowLeftIcon } from '@heroicons/react/outline'

export default function Table({
  columns,
  data,
  columnsHideable = [],
  defaultSortBy = { id: '', desc: false },
  loading = true,
}) {
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
      initialState: {
        hiddenColumns: columnsHideable,
        sortBy: [
          {
            id: defaultSortBy.id,
            desc: defaultSortBy.desc,
          },
        ],
      },
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
            <tr key="tr" {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column, i) => (
                <th key={i} {...column.getHeaderProps(column.getSortByToggleProps())}>
                  <div
                    className={classNames(
                      i === 0 && 'pl-2',
                      i === headerGroup.headers.length - 1 && 'pr-2',
                      'select-none'
                    )}
                  >
                    <div className={classNames('text-secondary font-bold text-sm flex flex-row')}>
                      <div className={classNames(column.align && `text-${column.align}`, 'w-full')}>
                        {column.render('Header')}
                        {column.HideHeader && isHidden && (
                          <button onClick={(e) => toggleHide(e)} className="ml-1 text-dark-700">
                            {column.render('HideHeader')}
                          </button>
                        )}
                      </div>
                      <span className={classNames('flex items-center ml-1', column.isSorted ? 'visible' : 'invisible')}>
                        <div
                          className={classNames(
                            'fill-current text-secondary',
                            !column.isSortedDesc && 'rotate-180 transform'
                          )}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-5 h-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      </span>
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
              <tr key={i} {...row.getRowProps()}>
                {row.cells.map((cell, cI) => {
                  return (
                    <td key={cI} className="pb-3 pl-0 pr-0" {...cell.getCellProps()}>
                      <div
                        className={classNames(
                          cI === 0 && 'rounded-l pl-4',
                          cI === row.cells.length - 1 && 'rounded-r pr-4',
                          'h-16 text-high-emphesis text-sm font-bold bg-dark-900 flex items-center'
                        )}
                      >
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
      {data?.length > 10 && (
        <div className="flex justify-between">
          <div className="flex text-sm font-bold text-secondary">
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
      )}
    </>
  )
}
