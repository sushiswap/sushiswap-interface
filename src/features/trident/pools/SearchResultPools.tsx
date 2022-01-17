import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { TablePageToggler } from 'app/features/transactions/TablePageToggler'
import { TableInstance } from 'app/features/transactions/types'
import {
  TABLE_TABLE_CLASSNAME,
  TABLE_TBODY_TD_CLASSNAME,
  TABLE_TBODY_TR_CLASSNAME,
  TABLE_TR_TH_CLASSNAME,
  TABLE_WRAPPER_DIV_CLASSNAME,
} from 'app/features/trident/constants'
import { PoolSortOption } from 'app/features/trident/pools/poolsSlice'
import Link from 'next/link'
import React, { FC } from 'react'
import { useFilters, useFlexLayout, usePagination, useSortBy, useTable } from 'react-table'

import { SearchCategoryLabel } from './SearchCategoryLabel'
import { useInstantiateTableFeatures } from './useInstantiateTableFeatures'
import { DiscoverPoolsTableColumn, usePoolsTableData } from './usePoolsTableData'

export const sortTitleMapper: Record<PoolSortOption, DiscoverPoolsTableColumn['accessor']> = {
  [PoolSortOption.TVL]: 'liquidityUSD',
  [PoolSortOption.APY]: 'apy',
}

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
      <div className={TABLE_WRAPPER_DIV_CLASSNAME}>
        <table {...getTableProps()} className={TABLE_TABLE_CLASSNAME}>
          <thead>
            {headerGroups.map((headerGroup, i) => (
              <tr {...headerGroup.getHeaderGroupProps()} key={i}>
                {headerGroup.headers.map((column, i) => (
                  <th
                    key={i}
                    {...column.getHeaderProps()}
                    className={TABLE_TR_TH_CLASSNAME(i, headerGroup.headers.length)}
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
                    pathname: `/trident/pool`,
                    query: {
                      tokens: row.original.assets.map((asset) => asset.address),
                      fee: row.original.swapFee,
                      twap: row.original.twapEnabled,
                    },
                  }}
                  key={i}
                  passHref
                >
                  <tr {...row.getRowProps()} className={TABLE_TBODY_TR_CLASSNAME}>
                    {row.cells.map((cell, i) => {
                      return (
                        <td key={i} {...cell.getCellProps()} className={TABLE_TBODY_TD_CLASSNAME(i, row.cells.length)}>
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
