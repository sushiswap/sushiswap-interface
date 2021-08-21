import React from 'react'
import { ChevronDown, ChevronUp } from 'react-feather'

function ListHeaderWithSort({
  className = '',
  sort,
  sortKey,
  direction = 'ascending',
  children,
}: {
  className?: any
  sort: any
  sortKey: any
  direction?: any
  children: any
}) {
  return (
    <div
      className={`flex items-center cursor-pointer hover:text-primary ${className}`}
      onClick={() => sort.requestSort(sortKey, direction)}
    >
      {children}
      {sort.sortConfig &&
        sort.sortConfig.key === sortKey &&
        ((sort.sortConfig.direction === 'ascending' && <ChevronUp size={12} className="ml-2" />) ||
          (sort.sortConfig.direction === 'descending' && <ChevronDown size={12} className="ml-2" />))}
    </div>
  )
}

export default ListHeaderWithSort
