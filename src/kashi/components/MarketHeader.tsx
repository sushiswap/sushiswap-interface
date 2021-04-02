import React, { useMemo } from 'react'
import { useLocation } from 'react-router'
import { useKashiPairs } from 'kashi/context'
import { LendCardHeader, BorrowCardHeader, Search } from '.'
import { BigNumber } from '@ethersproject/bignumber'
import { formattedNum } from 'utils'

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
          <Search term={term} search={search} />
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
