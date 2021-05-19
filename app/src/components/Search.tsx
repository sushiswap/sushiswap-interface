import React from 'react'
import { Search as SearchIcon } from 'react-feather'

export default function Search({ term, search }: { term: string; search: (value: string) => void }) {
    return (
        <div className="relative w-full">
            <div className="absolute px-3 inset-y-0 pr-7 flex items-center pointer-events-none">
                <SearchIcon size={16} />
            </div>
            <input
                className="outline-none truncate py-2 pl-8 text-white font-bold text-caption2 rounded w-full ring-low-emphesis ring focus:ring"
                onChange={e => search(e.target.value)}
                style={{ background: '#161522' }}
                value={term}
                placeholder="Search by name, symbol, address"
            />
        </div>
    )
}
