import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Typography from 'app/components/Typography'
import { TableInstance } from 'app/features/trident/balances/AssetBalances/types'
import {
  TABLE_TABLE_CLASSNAME,
  TABLE_TBODY_TD_CLASSNAME,
  TABLE_TBODY_TR_CLASSNAME,
  TABLE_TR_TH_CLASSNAME,
  TABLE_WRAPPER_DIV_CLASSNAME,
} from 'app/features/trident/constants'
import React, { FC } from 'react'
import { useFlexLayout, usePagination, useSortBy, useTable } from 'react-table'

interface AssetBalancesProps {
  config: any
  loading?: boolean
  error?: boolean
  selected?(row: any): boolean
  onSelect?(row: any): void
}

const AssetBalances: FC<AssetBalancesProps> = ({ config, loading, error, onSelect, selected }) => {
  const { i18n } = useLingui()

  const { getTableProps, getTableBodyProps, headerGroups, prepareRow, page }: TableInstance = useTable(
    config,
    useSortBy,
    usePagination,
    useFlexLayout
  )

  return (
    <div className={TABLE_WRAPPER_DIV_CLASSNAME}>
      <table {...getTableProps()} className={TABLE_TABLE_CLASSNAME}>
        <thead>
          {headerGroups.map((headerGroup, i) => (
            <tr {...headerGroup.getHeaderGroupProps()} key={i}>
              {headerGroup.headers.map((column, i) => (
                <th
                  key={i}
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  className={TABLE_TR_TH_CLASSNAME(i, headerGroup.headers.length)}
                >
                  {column.render('Header')}
                  {i === 0 && (
                    <div className="inline-flex items-center">
                      <div
                        className={`animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue inline-block ml-3 transition ${
                          loading ? 'opacity-100' : 'opacity-0'
                        }`}
                      />
                      {error && <span className="ml-2 text-sm italic text-red">{i18n._(t`⚠️ Loading Error`)}</span>}
                    </div>
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.length > 0 ? (
            page.map((row, i) => {
              prepareRow(row)
              return (
                <tr
                  {...row.getRowProps()}
                  key={i}
                  onClick={() => onSelect && onSelect(row)}
                  className={TABLE_TBODY_TR_CLASSNAME}
                >
                  {row.cells.map((cell, i) => {
                    return (
                      <td key={i} {...cell.getCellProps()} className={TABLE_TBODY_TD_CLASSNAME(i, row.cells.length)}>
                        {cell.render('Cell')}
                      </td>
                    )
                  })}
                </tr>
              )
            })
          ) : (
            <Typography
              variant="xs"
              className="text-center text-low-emphesis h-[60px] flex items-center justify-center"
            >
              {i18n._(t`No balances`)}
            </Typography>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default AssetBalances
