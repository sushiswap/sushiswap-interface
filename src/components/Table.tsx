import React, { useState } from 'react'
import { useTable, usePagination, useSortBy } from 'react-table'
import { classNames } from '../functions'
import { ArrowRightIcon, ArrowLeftIcon } from '@heroicons/react/outline'
import { useRouter } from 'next/router'

interface TableProps {
  columns: any[]
  data: any[]
  columnsHideable?: string[]
  defaultSortBy: {
    id: string
    desc: boolean
  }
  link?: {
    href: string
    id: string
  }
}

export default function Table({
  columns,
  data,
  columnsHideable = [],
  defaultSortBy = { id: '', desc: false },
  link,
}: TableProps) {
  const [isHidden, setHidden] = useState(columnsHideable.length === 0 ? false : true)
  const router = useRouter()

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

  const getProperty = (obj, prop) => {
    var parts = prop.split('.')

    if (Array.isArray(parts)) {
      var last = parts.pop(),
        l = parts.length,
        i = 1,
        current = parts[0]

      while ((obj = obj[current]) && i < l) {
        current = parts[i]
        i++
      }

      if (obj) {
        return obj[last]
      }
    } else {
      throw 'parts is not valid array'
    }
  }

  return (
    <>
      <div className="w-full overflow-x-auto">
        <table className="w-auto min-w-full border-collapse table-fixed" {...getTableProps()}>
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr key="tr" {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column, i, columns) => (
                  <th key={i} {...column.getHeaderProps(column.getSortByToggleProps())}>
                    <div
                      className={classNames(
                        i === 0 && 'pl-2',
                        i === headerGroup.headers.length - 1 && 'pr-2',
                        'w-full'
                      )}
                    >
                      <div className={classNames('w-full text-secondary font-bold text-sm')}>
                        <div
                          className={classNames(
                            column.align === 'right' && `justify-end`,
                            column.align === 'left' && 'justify-start',
                            i !== 0 && 'ml-2',
                            i !== columns.length - 1 && 'mr-2',
                            'whitespace-nowrap flex flex-row xl:mx-auto'
                          )}
                        >
                          {column.render('Header')}
                          {column.HideHeader && isHidden && (
                            <button onClick={(e) => toggleHide(e)} className="ml-1 text-dark-700">
                              {column.render('HideHeader')}
                            </button>
                          )}
                          {column.isSorted && (
                            <span className="flex items-center ml-1">
                              <div
                                className={classNames(
                                  'fill-current text-secondary',
                                  column.isSortedDesc && 'rotate-180 transform'
                                )}
                              >
                                <svg width="12" height="12" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
                                  <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M8.00002 15C8.13263 15 8.25981 14.9473 8.35357 14.8535C8.44734 14.7598 8.50002 14.6326 8.50002 14.5V2.70698L11.646 5.85398C11.7399 5.94786 11.8672 6.00061 12 6.00061C12.1328 6.00061 12.2601 5.94786 12.354 5.85398C12.4479 5.76009 12.5007 5.63275 12.5007 5.49998C12.5007 5.3672 12.4479 5.23986 12.354 5.14598L8.35402 1.14598C8.30758 1.09942 8.2524 1.06247 8.19165 1.03727C8.13091 1.01206 8.06579 0.999084 8.00002 0.999084C7.93425 0.999084 7.86913 1.01206 7.80839 1.03727C7.74764 1.06247 7.69247 1.09942 7.64602 1.14598L3.64602 5.14598C3.59953 5.19247 3.56266 5.24766 3.5375 5.30839C3.51234 5.36913 3.49939 5.43423 3.49939 5.49998C3.49939 5.63275 3.55213 5.76009 3.64602 5.85398C3.73991 5.94786 3.86725 6.00061 4.00002 6.00061C4.1328 6.00061 4.26013 5.94786 4.35402 5.85398L7.50002 2.70698V14.5C7.50002 14.6326 7.5527 14.7598 7.64647 14.8535C7.74024 14.9473 7.86741 15 8.00002 15Z"
                                  />
                                </svg>
                              </div>
                            </span>
                          )}
                        </div>
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
                          onClick={
                            link ? () => router.push(link.href + getProperty(cell.row.values, link.id)) : () => {}
                          }
                        >
                          <div
                            className={classNames(
                              cI === 0 && 'rounded-l pl-4',
                              cI === row.cells.length - 1 && 'rounded-r pr-4',
                              link && 'cursor-pointer',
                              'h-16 text-high-emphesis text-sm font-bold bg-dark-900 flex items-center'
                            )}
                          >
                            <div
                              className={classNames(
                                cell.column.align === 'right' && `text-right`,
                                cell.column.align === 'left' && 'text-left',
                                cI !== 0 && 'ml-2',
                                cI !== row.cells.length - 1 && 'mr-2',
                                'w-full xl:mx-auto'
                              )}
                            >
                              {cell.render('Cell')}
                            </div>
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
      </div>
      {data?.length > 10 && (
        <div className="flex justify-between w-full">
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
