import React from 'react'
import { Search as SearchIcon } from 'react-feather'

export default function Search({
    term,
    search,
    className = 'bg-dark-900',
}: {
    term: string
    search: (value: string) => void
    className?: string
}) {
    return (
        <div className="relative w-full max-w-md">
            <input
                className={`py-3 pl-4 pr-14 rounded w-full focus:outline-none focus:ring bg-dark-900`}
                onChange={(e) => search(e.target.value)}
                value={term}
                placeholder="Search by name, symbol, address"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-6 pointer-events-none">
                <SearchIcon size={16} />
            </div>
        </div>
    )
}
