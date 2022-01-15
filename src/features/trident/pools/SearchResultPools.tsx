import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { PoolType } from '@sushiswap/tines'
import { TablePageToggler } from 'app/features/transactions/TablePageToggler'
import { TableInstance } from 'app/features/transactions/types'
import { poolTypeNameMapper } from 'app/features/trident/types'
import { classNames } from 'app/functions/styling'
import Link from 'next/link'
import React, { FC } from 'react'
import { useFilters, useFlexLayout, usePagination, useSortBy, useTable } from 'react-table'

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
      <div className="overflow-x-auto border border-dark-900 rounded">
        <table {...getTableProps()} className="w-full">
          <thead>
            {headerGroups.map((headerGroup, i) => (
              <tr {...headerGroup.getHeaderGroupProps()} key={i}>
                {headerGroup.headers.map((column, i) => (
                  <th
                    key={i}
                    {...column.getHeaderProps()}
                    className={classNames(
                      'text-secondary text-sm py-3',
                      i === 0 ? 'pl-4 text-left' : 'text-right',
                      i === headerGroup.headers.length - 1 ? 'pr-4' : ''
                    )}
                  >
                    {column.render('Header')}
                    {i === 0 && (
                      <>
                        <div
                          className={`animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue inline-block ml-3 transition ${
                            loading ? 'opacity-100' : 'opacity-0'
                          }`}
                        />
                        {error && <span className="ml-2 text-sm italic text-red">{i18n._(t`⚠️ Loading Error`)}</span>}
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
                <Link
                  href={{
                    pathname: `/trident/pool/${poolTypeNameMapper[row.original.type as PoolType].toLowerCase()}`,
                    query: {
                      tokens: row.original.assets.map((asset) => asset.address),
                      fee: row.original.swapFee,
                      twap: row.original.twapEnabled,
                    },
                  }}
                  key={i}
                  passHref
                >
                  <tr {...row.getRowProps()} className={classNames('hover:bg-dark-900/40 hover:cursor-pointer')}>
                    {row.cells.map((cell, i) => {
                      return (
                        <td
                          key={i}
                          {...cell.getCellProps()}
                          className={classNames(
                            'py-3 border-t border-dark-900 flex items-center',
                            i === 0 ? 'pl-4 justify-start' : 'justify-end',
                            i === row.cells.length - 1 ? 'pr-4' : ''
                          )}
                        >
                          {cell.render('Cell')}
                        </td>
                      )
                    })}
                  </tr>
                </Link>
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
