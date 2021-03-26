import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import styled, { ThemeContext } from 'styled-components'
import { BaseCard } from '../../components/Card'
import QuestionHelper from '../../components/QuestionHelper'
import getTokenIcon from '../../sushi-hooks/queries/getTokenIcons'
import { formattedNum } from '../../utils'
import { useKashiPairs } from '../context'
import { InfoCard, SectionHeader, Layout } from '../components'
import DepositGraphic from '../../assets/kashi/deposit-graphic.png'
import useFuse from 'sushi-hooks/useFuse'
import useSortableData from 'sushi-hooks/useSortableData'
import { ChevronUp, ChevronDown } from 'react-feather'

const StyledBaseCard = styled(BaseCard)<{ cornerRadiusTopNone: boolean }>`
  border: none
  background: ${({ theme }) => theme.baseCard};
  position: relative;
  overflow: hidden;
  border-radius: 0 0 15px 15px;
`

export default function KashiPairs() {
  const theme = useContext(ThemeContext)
  const pairs = useKashiPairs()

  // setup search
  // console.log('pairs:', pairs)
  const options = { keys: ['symbol', 'name', 'address'] }
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
        <InfoCard
          backgroundImage={DepositGraphic}
          title={'Deposit tokens into BentoBox for all the yields.'}
          description={
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
          }
        />
      }
    >
      <div className="flex-col space-y-8" style={{ minHeight: '35rem' }}>
        <div>
          <SectionHeader search={search} term={term} />
          {/* TODO: Use table component */}
          <StyledBaseCard cornerRadiusTopNone={true}>
            <div className="pb-4 px-4 grid grid-flow-col grid-cols-5 md:grid-cols-6 text-sm font-semibold text-gray-500">
              <div
                className="hover:text-gray-400 col-span-2 md:col-span-1 cursor-pointer flex items-center"
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
                onClick={() => requestSort('borrow.symbol')}
              >
                <div className="flex items-center float-right">
                  <div className="mr-2">Borrow</div>
                  {sortConfig &&
                    sortConfig.key === 'borrow.symbol' &&
                    ((sortConfig.direction === 'ascending' && <ChevronUp size={12} />) ||
                      (sortConfig.direction === 'descending' && <ChevronDown size={12} />))}
                </div>
              </div>
              <div className="hover:text-gray-400 cursor-pointer" onClick={() => requestSort('oracle.name')}>
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
                onClick={() => requestSort('details.total.borrow.string')}
              >
                <div className="flex items-center float-right">
                  <div className="mr-2">Total Borrowed</div>
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
                        className="block"
                        style={{ color: theme.highEmphesisText }}
                      >
                        <div
                          className="py-4 px-4 items-center align-center grid grid-cols-5 md:grid-cols-6 text-sm font-semibold"
                          style={{ background: theme.mediumDarkPurple, borderRadius: '15px' }}
                        >
                          <div className="flex col-span-2 md:col-span-1 items-center">
                            <div className="flex space-x-2">
                              <img
                                src={getTokenIcon(pair.collateral.address)}
                                className="w-10 y-10 sm:w-12 sm:y-12 rounded-lg"
                              />
                              <img
                                src={getTokenIcon(pair.asset.address)}
                                className="w-10 y-10 sm:w-12 sm:y-12 rounded-lg"
                              />
                            </div>
                            <div className="items-end">
                              <div className="text-left hidden md:block pl-4">{pair.collateral.symbol} /</div>
                              <div className="text-left hidden md:block pl-4">{pair.asset.symbol}</div>
                            </div>
                          </div>
                          <div className="text-right hidden md:block pl-4">{pair.collateral.symbol}</div>
                          <div className="text-right text-white hidden md:block">{pair.asset.symbol}</div>
                          <div className="text-right">{pair.oracle.name}</div>
                          <div className="text-right">
                            <div>
                              {formattedNum(pair.details.total.borrow.string)} {pair.asset.symbol}
                            </div>
                            <div className="text-gray-500">
                              ≈ {formattedNum(pair.details.total.borrow.usdString, true)}
                            </div>
                          </div>
                          <div className="text-right">
                            <div>
                              {formattedNum(pair.details.total.asset.string)} {pair.asset.symbol}
                            </div>
                            <div className="text-gray-500">
                              ≈ {formattedNum(pair.details.total.asset.usdString, true)}
                            </div>
                          </div>
                        </div>
                      </Link>
                      {/* <Debugger data={pair} /> */}
                    </div>
                  )
                })}
            </div>
          </StyledBaseCard>
        </div>
      </div>
    </Layout>
  )
}
