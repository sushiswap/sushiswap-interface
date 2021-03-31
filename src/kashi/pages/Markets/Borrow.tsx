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

export default function KashiPairs() {
  const theme = useContext(ThemeContext)
  const pairs = useKashiPairs()

  // setup search
  // console.log('pairs:', pairs)
  const options = { keys: ['symbol', 'name', 'address'], threshold: 0.4 }
  const { result, search, term } = useFuse({
    data: pairs && pairs.length > 0 ? pairs : [],
    options
  })
  const flattenSearchResults = result.map((a: { item: any }) => (a.item ? a.item : a))

  // Sorting Setup
  const { items, requestSort, sortConfig } = useSortableData(flattenSearchResults)
  //console.log('items:', items)
  //console.log('sortConfig:', sortConfig)

  return (
    <Layout
      left={
        <Card
          backgroundImage={DepositGraphic}
          title={'Borrow assets and leverage up'}
          description={
            'Borrowing allows you to obtain liquidity without selling. Your borrow limit depends on the amount of deposited collateral. You will be able to borrow up to 75% of your collateral and repay at any time with accrued interest.'
          }
        />
      }
    >
      <Card header={<SectionHeader search={search} term={term} />}>
        <div>
          <div className="pb-4 px-4 grid grid-flow-col grid-cols-5 md:grid-cols-6 lg:grid-cols-7 text-sm font-semibold text-gray-500">
            <div
              className="hover:text-gray-400 col-span-2 cursor-pointer flex items-center"
              onClick={() => requestSort('symbol')}
            >
              <div className="mr-2">Pair</div>
              {sortConfig &&
                sortConfig.key === 'symbol' &&
                ((sortConfig.direction === 'ascending' && <ChevronUp size={12} />) ||
                  (sortConfig.direction === 'descending' && <ChevronDown size={12} />))}
            </div>
            <div
              className="hidden md:block pl-4 hover:text-gray-400 cursor-pointer"
              onClick={() => requestSort('collateral.symbol')}
            >
              <div className="flex items-center float-right">
                <div className="mr-2">Collateral</div>
                {sortConfig &&
                  sortConfig.key === 'collateral.symbol' &&
                  ((sortConfig.direction === 'ascending' && <ChevronUp size={12} />) ||
                    (sortConfig.direction === 'descending' && <ChevronDown size={12} />))}
              </div>
            </div>
            <div
              className="hidden md:block pl-4 hover:text-gray-400 cursor-pointer"
              onClick={() => requestSort('asset.symbol')}
            >
              <div className="flex items-center float-right">
                <div className="mr-2">Borrow</div>
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
              <div className="flex items-center float-right justify-end">
                <div className="mr-2 flex">
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
              onClick={() => requestSort('details.totalBorrowAmount.string')}
            >
              <div className="flex items-center float-right text-right">
                <div className="mr-2">Loaned</div>
                {sortConfig &&
                  sortConfig.key === 'totalBorrowAmount.string' &&
                  ((sortConfig.direction === 'ascending' && <ChevronUp size={12} />) ||
                    (sortConfig.direction === 'descending' && <ChevronDown size={12} />))}
              </div>
            </div>
            <div className="hover:text-gray-400 cursor-pointer" onClick={() => requestSort('totalAssetAmount.usd')}>
              <div className="flex items-center float-right">
                <div className="mr-2">Available</div>
                {sortConfig &&
                  sortConfig.key === 'totalAssetAmount.usd' &&
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
                      className="block"
                      style={{ color: theme.highEmphesisText }}
                    >
                      <div
                        className="py-4 px-4 items-center align-center grid grid-cols-4 md:grid-cols-6 lg:grid-cols-7 text-sm font-semibold"
                        style={{ background: theme.mediumDarkPurple, borderRadius: '15px' }}
                      >
                        <div className="flex flex-col sm:flex-row col-span-2 items-start sm:items-center">
                          <div className="flex space-x-2">
                            <img
                              src={getTokenIcon(pair.collateral.address)}
                              className="block w-10 h-10 sm:w-12 sm:h-12 rounded-lg"
                            />
                            <img
                              src={getTokenIcon(pair.asset.address)}
                              className="block w-10 h-10 sm:w-12 sm:h-12 rounded-lg"
                            />
                          </div>
                          <div className="sm:items-end">
                            <div className="text-left hidden sm:block pl-4">{pair.collateral.symbol} /</div>
                            <div className="text-left hidden sm:block pl-4">{pair.asset.symbol}</div>
                            <div className="mt-2 sm:mt-0 text-left text-white-500 text-xs block lg:hidden sm:pl-4">
                              {pair.oracle.name}
                            </div>
                          </div>
                        </div>
                        <div className="text-right hidden md:block pl-4">{pair.collateral.symbol}</div>
                        <div className="text-right text-white hidden md:block">{pair.asset.symbol}</div>
                        <div className="text-right hidden lg:block">{pair.oracle.name}</div>
                        <div className="text-right">
                          <div>
                            {formattedNum(pair.totalBorrowAmount.string)} {pair.asset.symbol}
                          </div>
                          <div className="text-gray-500">≈ {formattedNum(pair.totalBorrowAmount.usd, true)}</div>
                        </div>
                        <div className="text-right">
                          <div>
                            {formattedNum(pair.totalAssetAmount.string)} {pair.asset.symbol}
                          </div>
                          <div className="text-gray-500">≈ {formattedNum(pair.totalAssetAmount.usd, true)}</div>
                        </div>
                      </div>
                    </Link>
                  </div>
                )
              })}
          </div>
        </div>
      </Card>
    </Layout>
  )
}
