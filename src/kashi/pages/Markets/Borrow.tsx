import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { ThemeContext } from 'styled-components'
import QuestionHelper from '../../../components/QuestionHelper'
import { getTokenIcon } from '../../functions'
import { formattedNum } from '../../../utils'
import { useKashiPairs } from '../../context'
import { Card, SectionHeader, Layout } from '../../components'
import DepositGraphic from 'assets/kashi/deposit-graphic.png'
import useFuse from 'sushi-hooks/useFuse'
import useSortableData from 'sushi-hooks/useSortableData'
import { ChevronUp, ChevronDown } from 'react-feather'

import BorrowPositions from './BorrowPositions'

export default function KashiPairs() {
  const theme = useContext(ThemeContext)
  const pairs = useKashiPairs()

  // setup search
  const options = { keys: ['symbol', 'name', 'address'], threshold: 0.4 }
  const { result, search, term } = useFuse({
    data: pairs && pairs.length > 0 ? pairs : [],
    options
  })
  const flattenSearchResults = result.map((a: { item: any }) => (a.item ? a.item : a))

  // Sorting Setup
  const { items, requestSort, sortConfig } = useSortableData(flattenSearchResults)

  return (
    <Layout
      left={
        <Card
          className="h-full bg-kashi-card"
          backgroundImage={DepositGraphic}
          title={'Borrow assets and leverage up'}
          description={
            'Borrowing allows you to obtain liquidity without selling. Your borrow limit depends on the amount of deposited collateral. You will be able to borrow up to 75% of your collateral and repay at any time with accrued interest.'
          }
        />
      }
    >
      <Card className="h-full bg-kashi-card" header={<SectionHeader search={search} term={term} />}>
        <div className="pb-4">
          <BorrowPositions />
        </div>
        <div className="grid grid-flow-col grid-cols-3 md:grid-cols-5 lg:grid-cols-6 pb-4 px-4 text-sm font-semibold text-gray-500">
          <div className="flex items-center cursor-pointer hover:text-gray-400" onClick={() => requestSort('symbol')}>
            <div>Markets</div>
            {sortConfig &&
              sortConfig.key === 'symbol' &&
              ((sortConfig.direction === 'ascending' && <ChevronUp size={12} />) ||
                (sortConfig.direction === 'descending' && <ChevronDown size={12} />))}
          </div>
          <div
            className="hidden md:block hover:text-gray-400 cursor-pointer"
            onClick={() => requestSort('collateral.symbol')}
          >
            <div className="flex items-center">
              <div>Collateral</div>
              {sortConfig &&
                sortConfig.key === 'collateral.symbol' &&
                ((sortConfig.direction === 'ascending' && <ChevronUp size={12} />) ||
                  (sortConfig.direction === 'descending' && <ChevronDown size={12} />))}
            </div>
          </div>
          <div
            className="hidden md:block hover:text-gray-400 cursor-pointer"
            onClick={() => requestSort('asset.symbol')}
          >
            <div className="flex items-center">
              <div>Borrow</div>
              {sortConfig &&
                sortConfig.key === 'asset.symbol' &&
                ((sortConfig.direction === 'ascending' && <ChevronUp size={12} />) ||
                  (sortConfig.direction === 'descending' && <ChevronDown size={12} />))}
            </div>
          </div>
          <div
            className="hidden lg:block hover:text-gray-400 cursor-pointer"
            onClick={() => requestSort('oracle.name')}
          >
            <div className="flex items-center">
              <div className="flex">
                Oracle <QuestionHelper text="The onchain oracle that tracks the pricing for this pair" />
              </div>
              {sortConfig &&
                sortConfig.key === 'oracle.name' &&
                ((sortConfig.direction === 'ascending' && <ChevronUp size={12} />) ||
                  (sortConfig.direction === 'descending' && <ChevronDown size={12} />))}
            </div>
          </div>
          <div
            className="hover:text-gray-400 cursor-pointer"
            onClick={() => requestSort('details.total.borrow.string')}
          >
            <div className="flex items-center justify-end">
              <div>Borrowed</div>
              {sortConfig &&
                sortConfig.key === 'details.total.borrow.string' &&
                ((sortConfig.direction === 'ascending' && <ChevronUp size={12} />) ||
                  (sortConfig.direction === 'descending' && <ChevronDown size={12} />))}
            </div>
          </div>
          <div
            className="hover:text-gray-400 cursor-pointer"
            onClick={() => requestSort('details.total.asset.usdString')}
          >
            <div className="flex items-center justify-end">
              <div>Available</div>
              {sortConfig &&
                sortConfig.key === 'details.total.asset.usdString' &&
                ((sortConfig.direction === 'ascending' && <ChevronUp size={12} />) ||
                  (sortConfig.direction === 'descending' && <ChevronDown size={12} />))}
            </div>
          </div>
        </div>
        <div className="flex-col space-y-2">
          {items &&
            items.length > 0 &&
            items.map(pair => {
              return (
                <div key={pair.address}>
                  <Link
                    to={'/bento/kashi/pair/' + String(pair.address).toLowerCase() + '/borrow'}
                    className="block text-high-emphesis"
                  >
                    <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-6 py-4 px-4 items-center align-center text-sm font-semibold rounded bg-kashi-card-inner">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center">
                        <div className="hidden space-x-2 md:flex">
                          <img
                            src={getTokenIcon(pair.collateral.address)}
                            className="block w-5 h-5 md:w-10 md:h-10 lg:w-12 lg:h-12 rounded-lg"
                            alt=""
                          />
                          <img
                            src={getTokenIcon(pair.asset.address)}
                            className="block w-5 h-5 md:w-10 md:h-10 lg:w-12 lg:h-12 rounded-lg"
                            alt=""
                          />
                        </div>
                        <div className="sm:items-end md:hidden">
                          <div>{pair.collateral.symbol} /</div>
                          <div>{pair.asset.symbol}</div>
                          <div className="mt-0 text-left text-white-500 text-xs block lg:hidden">
                            {pair.oracle.name}
                          </div>
                        </div>
                      </div>
                      <div className="hidden md:block">{pair.collateral.symbol}</div>
                      <div className="text-white hidden md:block">{pair.asset.symbol}</div>
                      <div className="hidden lg:block">{pair.oracle.name}</div>
                      <div className="text-right">
                        <div>
                          {formattedNum(pair.totalBorrowAmount.string)} {pair.asset.symbol}
                        </div>
                        <div className="text-gray-500">{formattedNum(pair.totalBorrowAmount.usd, true)}</div>
                      </div>
                      <div className="text-right">
                        <div>
                          {formattedNum(pair.totalAssetAmount.string)} {pair.asset.symbol}
                        </div>
                        <div className="text-gray-500">{formattedNum(pair.totalAssetAmount.usd, true)}</div>
                      </div>
                    </div>
                  </Link>
                </div>
              )
            })}
        </div>
      </Card>
    </Layout>
  )
}
