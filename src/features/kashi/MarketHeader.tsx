import React from 'react'
import { Search } from 'react-feather'

import Card from '../../components/Card'
import { classNames } from '../../functions'

function MarketHeader({ type = 'Borrow', lists }: any) {
  if (lists.setTerm) {
    lists = [lists]
  }

  function onSearch(term: any) {
    lists.forEach((list: any) => {
      list.setTerm(term)
    })
  }

  return (
    <Card.Header
      className={classNames('border-b-8', type === 'Borrow' ? 'bg-dark-pink border-pink' : 'bg-dark-blue border-blue')}
    >
      <div className="flex flex-col items-center justify-between w-full md:flex-row">
        <div className="flex items-center">
          <div className="mr-4 text-3xl text-high-emphesis">{type}</div>
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
            <div className="absolute inset-y-0 right-0 flex items-center pr-6 pointer-events-none">
              <Search size={16} />
            </div>
          </div>
        </div>
      </div>
    </Card.Header>
  )
}

export default MarketHeader
