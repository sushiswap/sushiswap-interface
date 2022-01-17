import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Typography from 'app/components/Typography'
import { TableInstance } from 'app/features/trident/balances/AssetBalances/types'
import { classNames } from 'app/functions'
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
    <div id="asset-balances-table" {...getTableProps()} className="w-full">
      <div>
        {headerGroups.map((headerGroup, i) => (
          <div {...headerGroup.getHeaderGroupProps()} key={i} className="lg:pl-[18px] lg:pr-[18px] lg:mb-3">
            {headerGroup.headers.map((column, i) => (
              <div
                key={i}
                {...column.getHeaderProps(column.getSortByToggleProps())}
                className={classNames(column.className, `font-normal`, 'flex items-center lg:gap-2 gap-1')}
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
              </div>
            ))}
          </div>
        ))}
      </div>
      <div
        id="asset-balances-body"
        {...getTableBodyProps()}
        className="lg:border lg:border-dark-700 lg:rounded lg:overflow-hidden"
      >
        {page.length > 0 ? (
          page.map((row, i) => {
            prepareRow(row)
            return (
              <div
                id={`asset-balances-row-${i}`}
                {...row.getRowProps()}
                key={i}
                onClick={() => onSelect && onSelect(row)}
                className={classNames(
                  i % 2 === 0 ? 'lg:bg-[rgb(255,255,255,0.03)]' : '',
                  selected && selected(row) ? 'lg:!bg-dark-800' : '',
                  i < page.length - 1 ? 'border-b lg:border-dark-700 border-dark-900' : '',
                  'lg:hover:bg-dark-900 lg:pl-3.5 lg:pr-5 lg:gap-2 gap-1',
                  onSelect ? 'cursor-pointer' : ''
                )}
              >
                {row.cells.map((cell, i) => {
                  return (
                    <div
                      key={i}
                      {...cell.getCellProps()}
                      className={classNames(
                        'h-[64px] balance-cell flex items-center',
                        headerGroups[0].headers[i].className
                      )}
                    >
                      {cell.render('Cell')}
                    </div>
                  )
                })}
              </div>
            )
          })
        ) : (
          <Typography variant="xs" className="text-center text-low-emphesis h-[60px] flex items-center justify-center">
            {i18n._(t`No balances`)}
          </Typography>
        )}
      </div>
    </div>
  )
}

export default AssetBalances
