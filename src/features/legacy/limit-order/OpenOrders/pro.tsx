import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Pagination from 'app/components/Pagination'
import Typography from 'app/components/Typography'
import { CompletedOrdersProps } from 'app/features/legacy/limit-order/types'
import { TABLE_TBODY_TD_CLASSNAME, TABLE_TBODY_TR_CLASSNAME } from 'app/features/trident/constants'
import { classNames } from 'app/functions'
import React, { FC } from 'react'
import { useFlexLayout, usePagination, useSortBy, useTable } from 'react-table'

const OpenOrdersPro: FC<CompletedOrdersProps> = ({ config, orders }) => {
  const { i18n } = useLingui()

  // @ts-ignore TYPE NEEDS FIXING
  const { getTableProps, getTableBodyProps, headerGroups, prepareRow, page } = useTable(
    // @ts-ignore TYPE NEEDS FIXING
    config,
    useSortBy,
    usePagination,
    useFlexLayout
  )

  return (
    <div className="flex flex-col gap-3 px-2">
      <div {...getTableProps()}>
        <div>
          {headerGroups.map((headerGroup, i) => (
            <div {...headerGroup.getHeaderGroupProps()} key={i}>
              {headerGroup.headers.map((column, i) => (
                <div
                  // @ts-ignore TYPE NEEDS FIXING
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  className={classNames(
                    i === 0 ? 'text-left' : 'text-right',
                    'text-sm text-secondary pb-1 border-b border-dark-800'
                  )}
                  key={i}
                >
                  {column.render('Header')}
                </div>
              ))}
            </div>
          ))}
        </div>
        <div {...getTableBodyProps()} className="overflow-auto h-[260px]">
          {page.length > 0 ? (
            // @ts-ignore TYPE NEEDS FIXING
            page.map((row, i) => {
              prepareRow(row)
              return (
                <div {...row.getRowProps()} key={i} className={classNames('hover:bg-dark-800 flex items-center')}>
                  {/*@ts-ignore TYPE NEEDS FIXING*/}
                  {row.cells.map((cell, i) => {
                    return (
                      <div
                        key={i}
                        {...cell.getCellProps()}
                        className={classNames(
                          i === 0 ? 'text-left' : 'text-right justify-end',
                          'flex items-center cursor-default whitespace-nowrap border-b border-dark-850 h-[36px]'
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
            <div className={TABLE_TBODY_TR_CLASSNAME}>
              <div className={classNames(TABLE_TBODY_TD_CLASSNAME(0, 1), 'justify-center cursor-default')}>
                <Typography
                  variant="xs"
                  className="text-center text-low-emphesis h-[60px] flex items-center justify-center"
                  component="span"
                >
                  {i18n._(t`No open orders`)}
                </Typography>
              </div>
            </div>
          )}
        </div>
      </div>
      <Pagination
        canPreviousPage={orders.page > 1}
        canNextPage={orders.page < orders.maxPages}
        onChange={(page) => orders.setPage(page + 1)}
        totalPages={orders.maxPages}
        currentPage={orders.page - 1}
        pageNeighbours={1}
      />
    </div>
  )
}

export default OpenOrdersPro
