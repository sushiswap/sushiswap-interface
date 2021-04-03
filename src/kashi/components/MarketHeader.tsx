import React, { useMemo } from 'react'
import { useLocation } from 'react-router'
import { useKashiPairs } from 'kashi/context'
import { LendCardHeader, BorrowCardHeader } from '.'
import { BigNumber } from '@ethersproject/bignumber'
import { formattedNum } from 'utils'
import { Search } from 'react-feather'

function MarketHeader({ type = 'Borrow', children, search, term }: any) {
  const pairs = useKashiPairs()
  const netWorth = useMemo(() => {
    return pairs.reduce((previous, current) => previous.add(current.userNetWorth), BigNumber.from(0))
  }, [pairs])
  const Header = type === 'Borrow' ? BorrowCardHeader : LendCardHeader
  return (
    <Header>
      <div className="flex flex-col md:flex-row items-center justify-between w-full">
        <div className="font-semibold text-3xl text-high-emphesis">{type}</div>
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
          <div className="text-2xl font-semibold text-high-emphesis">{formattedNum(netWorth, true)}</div>
          <div className="text-sm font-semibold text-secondary">Net Worth</div>
        </div>
      </div>
    </Header>
  )
}

export default MarketHeader
