export interface TransactionTableData {
  type: string
  value: string
  in: string
  out: string
  to: string
  time: string
}

export interface TableInstance {
  getTableProps: () => any
  getTableBodyProps: () => any
  headerGroups: Array<{ getHeaderGroupProps: () => any; headers: Array<any> }>
  rows: () => any
  page: Array<any>
  pageCount: number
  gotoPage: (arg0: number) => any
  canPreviousPage: boolean
  canNextPage: boolean
  prepareRow: (arg0: any) => any
  state: { pageIndex: number; pageSize: number }
  setFilter: (columnId: string, filterValue: any) => void
  toggleSortBy: (columnId: string, descending: boolean, isMulti?: boolean) => void
}

export interface Transactions {
  address: string
  incomingAmt: string
  outgoingAmt: string
  time: string
  value: string
  type: string
}

export type TransactionFetcherState = { transactions?: Transactions[]; error: Error; loading: boolean }
