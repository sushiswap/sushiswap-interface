import React, { useMemo } from 'react'
import { useLocation } from 'react-router'
import { useKashiPairs } from 'kashi/context'
import sumBy from 'lodash/sumBy'
import millify from 'millify'
import { LendCardHeader, BorrowCardHeader, Search } from '.'

function MarketHeader({ type = 'Borrow', children, search, term }: any) {
  const pairs = useKashiPairs()
  const netWorth = useMemo(() => {
    return millify(sumBy(pairs, pair => Number(pair.userNetWorth)))
  }, [pairs])
  const Header = type === 'Borrow' ? BorrowCardHeader : LendCardHeader
  return (
    <Header>
      <div className="flex flex-col md:flex-row items-center justify-between w-full">
        <div className="font-semibold text-lg">{type}</div>
        <div className="flex justify-end w-full py-4 md:py-0">
          <Search term={term} search={search} />
        </div>
        <div className="flex flex-col w-full md:hidden items-center">
          <div className="text-2xl font-semibold text-high-emphesis">${netWorth}</div>
          <div className="text-sm font-semibold text-secondary">Net Worth</div>
        </div>
      </div>
    </Header>
  )
}

export default MarketHeader
