import { BorrowCardHeader, LendCardHeader } from './CardHeader'

import React from 'react'
import { Search } from 'react-feather'

function MarketHeader({ type = 'Borrow', lists }: any) {
  if (lists.setTerm) {
    lists = [lists]
  }

  const Header = type === 'Borrow' ? BorrowCardHeader : LendCardHeader

  function onSearch(term: any) {
    lists.forEach((list: any) => {
      list.setTerm(term)
    })
  }

  return (
    <Header>
      <div className="flex flex-col md:flex-row items-center justify-between w-full">
        <div className="flex items-center">
          <div className="text-3xl text-high-emphesis mr-4">{type}</div>
        </div>

        <div className="flex justify-end w-full py-4 md:py-0">
          <div className="relative w-full max-w-md">
            <input
              className={`py-3 pl-4 pr-14 rounded w-full focus:outline-none focus:ring ${
                type === 'Borrow' ? 'focus:ring-pink' : 'focus:ring-blue'
              }`}
              onChange={(e) => onSearch(e.target.value)}
              style={{ background: '#161522' }}
              value={lists[0].term}
              placeholder="Search by symbol"
            />
            <div className="absolute inset-y-0 right-0 pr-6 flex items-center pointer-events-none">
              <Search size={16} />
            </div>
          </div>
        </div>
      </div>
    </Header>
  )
}

export default MarketHeader
