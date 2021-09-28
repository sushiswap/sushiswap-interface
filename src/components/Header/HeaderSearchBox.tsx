import React from 'react'
import { Search } from 'react-feather'

function HeaderSearchBox(): JSX.Element {
  return (
    <div className="relative w-full max-w-md">
      <input
        // className={`py-3 pl-4 pr-14 rounded w-full focus:outline-none focus:ring ${
        //   type === 'Borrow' ? 'focus:ring-pink' : 'focus:ring-blue'
        // }`}
        // onChange={(e) => onSearch(e.target.value)}
        style={{ background: '#161522' }}
        // value={lists[0].term}
        placeholder="Search by symbol"
      />
      <div className="absolute inset-y-0 right-0 flex items-center pr-6 pointer-events-none">
        <Search size={16} />
      </div>
    </div>
  )
}

export default HeaderSearchBox
