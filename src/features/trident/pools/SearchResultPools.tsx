import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { classNames } from 'functions'
import React, { FC } from 'react'
import { useFilters, useFlexLayout, usePagination, useSortBy, useTable } from 'react-table'

import { TablePageToggler } from '../../transactions/TablePageToggler'
import { TableInstance } from '../../transactions/types'
import { SearchCategoryLabel } from './SearchCategoryLabel'
import { useInstantiateTableFeatures } from './useInstantiateTableFeatures'
import { usePoolsTableData } from './usePoolsTableData'

const SearchResultPools: FC = () => {
  const { i18n } = useLingui()
  const { config, loading, error } = usePoolsTableData()
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    page,
    gotoPage,
    canPreviousPage,
    canNextPage,
    prepareRow,
    setFilter,
    toggleSortBy,
    state: { pageIndex, pageSize },
  }: TableInstance = useTable(config, useFlexLayout, useFilters, useSortBy, useFlexLayout, usePagination)
  useInstantiateTableFeatures(setFilter, toggleSortBy)

  return (
    <div className="flex flex-col gap-2">
      <SearchCategoryLabel />
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
                    {i === 0 && (
                      <>
                        <div
                          className={`animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue inline-block ml-3 transition ${
                            loading ? 'opacity-100' : 'opacity-0'
                          }`}
                        />
                        {error && <span className="text-sm italic text-red ml-2">{i18n._(t`⚠️ Loading Error`)}</span>}
                      </>
                    )}
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
                        className={classNames(
                          'py-3 border-t border-gray-800 flex items-center',
                          i === 0 ? 'justify-start' : 'justify-end'
                        )}
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
        totalItems={rows.length}
        gotoPage={gotoPage}
        canPreviousPage={canPreviousPage}
        canNextPage={canNextPage}
        loading={loading}
      />
    </div>
  )
}

export default SearchResultPools
