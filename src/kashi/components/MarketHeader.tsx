import React from 'react'
import { LendCardHeader, BorrowCardHeader } from '.'
import { BigNumber } from '@ethersproject/bignumber'
import { formattedNum } from 'utils'
import { Search } from 'react-feather'
import { ReactComponent as AddIcon } from 'assets/svg/add.svg'

function MarketHeader({ type = 'Borrow', pairs, search, term }: any) {
  const netWorth = pairs.reduce((previous: any, current: any) => previous.add(current.userNetWorth), BigNumber.from(0))
  const Header = type === 'Borrow' ? BorrowCardHeader : LendCardHeader
  return (
    <Header>
      <div className="flex flex-col md:flex-row items-center justify-between w-full">
        <div className="flex items-center">
          <div className="text-3xl text-high-emphesis mr-2">{type}</div>
          <AddIcon className="fill-current w-5 h-5" />
        </div>

        <div className="flex justify-end w-full py-4 md:py-0">
          <div className="relative w-full max-w-md">
            <input
              className={`py-3 pl-4 pr-14 rounded w-full focus:outline-none focus:ring ${
                type === 'Borrow' ? 'focus:ring-pink' : 'focus:ring-blue'
              }`}
              onChange={e => search(e.target.value)}
              style={{ background: '#161522' }}
              value={term}
              placeholder="Search by name, symbol, address"
            />
            <div className="absolute inset-y-0 right-0 pr-6 flex items-center pointer-events-none">
              <Search size={16} />
            </div>
          </div>
        </div>
        <div className="flex flex-col w-full md:hidden items-center">
          <div className="text-2xl text-high-emphesis">{formattedNum(netWorth, true)}</div>
          <div className="text-sm text-secondary">Net Worth</div>
        </div>
      </div>
    </Header>
  )
}

export default MarketHeader
