import { Currency, CurrencyAmount } from '@sushiswap/core-sdk'

export interface TableInstance {
  getTableProps: () => any
  getTableBodyProps: () => any
  headerGroups: Array<{ getHeaderGroupProps: () => any; headers: Array<any> }>
  rows: () => any
  page: Array<any>
  prepareRow: (arg0: any) => any
  state: { pageIndex: number; pageSize: number }
  setFilter: (columnId: string, filterValue: any) => void
  toggleSortBy: (columnId: string, descending: boolean, isMulti?: boolean) => void
}

export interface Assets {
  asset: CurrencyAmount<Currency>
}
