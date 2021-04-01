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
        <div className="pb-4 px-4 grid grid-flow-col grid-cols-4 md:grid-cols-5 lg:grid-cols-6 text-sm font-semibold text-gray-500">
          <div
            className="hover:text-gray-400 col-span-2 md:col-span-1 cursor-pointer flex items-center"
            onClick={() => requestSort('symbol')}
          >
            <div>Available Markets</div>
            {sortConfig &&
              sortConfig.key === 'symbol' &&
              ((sortConfig.direction === 'ascending' && <ChevronUp size={12} />) ||
                (sortConfig.direction === 'descending' && <ChevronDown size={12} />))}
          </div>
          <div
            className="hidden md:block hover:text-gray-400 cursor-pointer"
            onClick={() => requestSort('collateral.symbol')}
          >
            <div className="flex items-center float-left">
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
            <div className="flex items-center float-left">
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
            <div className="flex items-center float-left justify-end">
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
            <div className="flex items-center float-right text-right">
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
            <div className="flex items-center float-right">
              <div className="mr-2">Available</div>
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
                    <div className="py-4 px-4 items-center align-center grid grid-cols-4 md:grid-cols-5 lg:grid-cols-6 text-sm font-semibold rounded bg-kashi-card-inner">
                      <div className="flex flex-col sm:flex-row col-span-2 md:col-span-1 items-start sm:items-center">
                        <div className="flex space-x-2">
                          <img
                            src={getTokenIcon(pair.collateral.address)}
                            className="block w-10 h-10 sm:w-12 sm:h-12 rounded-lg"
                            alt=""
                          />
                          <img
                            src={getTokenIcon(pair.asset.address)}
                            className="block w-10 h-10 sm:w-12 sm:h-12 rounded-lg"
                            alt=""
                          />
                          <div className="text-left pl-4 md:hidden">
                            {pair.collateral.symbol} /<br></br>
                            {pair.asset.symbol}
                            <br></br>
                            <span className="text-white-500 text-xs">{pair.oracle.name}</span>
                          </div>
                        </div>
                        <div className="sm:items-end md:hidden"></div>
                      </div>
                      <div className="text-left hidden md:block">{pair.collateral.symbol}</div>
                      <div className="text-left text-white hidden md:block">{pair.asset.symbol}</div>
                      <div className="text-left hidden lg:block">{pair.oracle.name}</div>
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
                  {/* <Debugger data={pair} /> */}
                </div>
              )
            })}
        </div>
      </Card>
    </Layout>
  )
}
