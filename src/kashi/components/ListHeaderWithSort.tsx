import React from 'react'
import { ChevronDown, ChevronUp } from 'react-feather'

function ListHeaderWithSort({ className = '', onSort, headerKey, sortConfig, children }: { className?: any, onSort: any, headerKey: string, sortConfig: any, children: any }) {
    console.log(sortConfig.key, headerKey)
    return (
        <div
            className={`flex items-center cursor-pointer hover:text-secondary ${className}`}
            onClick={onSort}
        >
            <div>{children}</div>
            {sortConfig &&
                sortConfig.key === headerKey &&
                ((sortConfig.direction === 'ascending' && <ChevronUp size={12} className="ml-2" />) ||
                    (sortConfig.direction === 'descending' && (
                        <ChevronDown size={12} className="ml-2" />
                    )))}
        </div>        
    )
}

export default ListHeaderWithSort
