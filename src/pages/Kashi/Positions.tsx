import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import styled, { ThemeContext } from 'styled-components'
import { transparentize } from 'polished'
import { BaseCard } from 'components/Card'
//import QuestionHelper from '../../components/QuestionHelper'
import { BarChart, User } from 'react-feather'
import getTokenIcon from 'sushi-hooks/queries/getTokenIcons'
import BentoBoxLogo from '../../../assets/kashi/bento-symbol.svg'
import { formattedPercent, formattedNum } from '../../utils'
import { useKashiCounts, useKashiPairs } from 'kashi/context'

import { Header, Navigation, SplitPane } from './components'

const PageWrapper = styled.div`
  max-width: 800px;
  width: 100%;
`

const StyledBaseCard = styled(BaseCard)`
  border: none
  background: ${({ theme }) => transparentize(0.6, theme.bg1)};
  position: relative;
  overflow: hidden;
`

export default function Positions() {
  const pairs = useKashiPairs()

  const supplyPositions = pairs.filter(function(pair: any) {
    return pair.user.asset.value.gt(0)
  })
  const borrowPositions = pairs.filter(function(pair: any) {
    return pair.user.borrow.value.gt(0)
  })

  const [selected, setSelected] = useState<'supply' | 'borrow'>('supply')

  if (!supplyPositions.length || !borrowPositions.length) return null

  return (
    <>
      <PageWrapper>
        <div className="flex-col space-y-8">
          <Header />
          <div>
            <SplitPane
              left={<Navigation />}
              right={<PositionsToggle selected={selected} setSelected={setSelected} />}
            />
            {selected && selected === 'supply' && <SupplyPositions supplyPositions={supplyPositions} />}
            {selected && selected === 'borrow' && <BorrowPositions borrowPositions={borrowPositions} />}
          </div>
        </div>
      </PageWrapper>
    </>
  )
}

type Selected = 'supply' | 'borrow'

interface PositionsToggle {
  selected: Selected
  setSelected: (selected: Selected) => void
}

function PositionsToggle({ selected, setSelected }: PositionsToggle) {
  const counts = useKashiCounts()
  const theme = useContext(ThemeContext)
  return (
    <div>
      {/* Desktop Styles */}
      <div className="hidden w-full px-4 md:flex items-center md:justify-end">
        <div className="py-3 md:py-0 flex items-center space-x-2 mr-4">
          <div
            className="px-2 py-1 font-semibold rounded"
            style={{ background: transparentize(0.6, theme.bg1), color: '#6ca8ff' }}
          >
            {counts.pairsSupplied}
          </div>
          <button
            className={
              selected === 'supply' ? 'text-white cursor-pointer' : 'text-gray-500 hover:text-gray-400 cursor-pointer'
            }
            onClick={() => setSelected('supply')}
          >
            Supply Pairs
          </button>
        </div>
        <div className="flex items-center space-x-2">
          <div
            className="px-2 py-1 font-semibold rounded"
            style={{ background: transparentize(0.6, theme.bg1), color: '#de5597' }}
          >
            {counts.pairsBorrowed}
          </div>
          <button
            className={
              selected === 'borrow' ? 'text-white cursor-pointer' : 'text-gray-500 hover:text-gray-400 cursor-pointer'
            }
            onClick={() => setSelected('borrow')}
          >
            Borrow Pairs
          </button>
        </div>
      </div>
      {/* Mobile Styles */}
      <div className="md:hidden w-full grid grid-cols-2 gap-4">
        <button
          className="px-4 py-3 md:py-0 flex justify-between items-center space-x-2 rounded-lg"
          style={{ background: `${selected === 'supply' ? transparentize(0.6, theme.bg1) : ''}` }}
          onClick={() => setSelected('supply')}
        >
          <div className="px-3 py-1 font-semibold rounded text-white" style={{ background: '#6ca8ff' }}>
            {counts.pairsSupplied}
          </div>
          <div
            className={
              `${selected === 'supply' ? 'text-white cursor-pointer' : 'text-gray-500 hover:text-gray-400'}` +
              ' text-sm cursor-pointer'
            }
          >
            Supplying
          </div>
        </button>
        <button
          className="px-4 py-3 sm:py-0 flex justify-between items-center space-x-2 rounded-lg"
          style={{ background: `${selected === 'borrow' ? transparentize(0.6, theme.bg1) : ''}` }}
          onClick={() => setSelected('borrow')}
        >
          <div className="px-3 py-1 font-semibold rounded text-white" style={{ background: '#de5597' }}>
            {counts.pairsBorrowed}
          </div>
          <div
            className={
              `${selected === 'borrow' ? 'text-white cursor-pointer' : 'text-gray-500 hover:text-gray-400'}` +
              ' text-sm cursor-pointer'
            }
          >
            Borrowing
          </div>
        </button>
      </div>
    </div>
  )
}

// TODO: Use table component
const SupplyPositions = ({ supplyPositions }: any) => {
  return (
    <>
      <StyledBaseCard>
        <div className="pb-4 px-4 grid grid-cols-4 sm:grid-cols-4 text-sm font-semibold text-gray-500">
          <div className="hover:text-gray-400 col-span-2 sm:col-span-1">Market</div>
          <div className="hidden sm:block"></div>
          <div className="text-right pl-4 hover:text-gray-400">Supplying</div>
          <div className="text-right hover:text-gray-400">APY</div>
        </div>
        <div className="flex-col space-y-2">
          {supplyPositions &&
            supplyPositions.length > 0 &&
            supplyPositions.map((pair: any) => {
              return (
                <>
                  <Link to={'/bento/kashi/' + pair.address} className="block" key={pair.address}>
                    <div
                      className="py-4 px-4 items-center align-center grid grid-cols-4 sm:grid-cols-4 text-sm font-semibold"
                      style={{ background: '#19212e', borderRadius: '12px' }}
                    >
                      <div className="flex space-x-2 col-span-2 sm:col-span-1">
                        <img
                          src={getTokenIcon(pair.collateral.address)}
                          className="w-10 y-10 sm:w-12 sm:y-12 rounded-lg"
                        />
                        <img src={getTokenIcon(pair.asset.address)} className="w-10 y-10 sm:w-12 sm:y-12 rounded-lg" />
                      </div>
                      <div className="text-left hidden sm:block pl-4">
                        <div>
                          {pair.collateral.symbol} / {pair.asset.symbol}
                        </div>
                        <div>{pair.oracle.name}</div>
                      </div>
                      <div className="text-right">
                        <div>
                          {formattedNum(pair.user.asset.string, false)} {pair.asset.symbol}
                        </div>
                        <div className="text-gray-500 text-sm">≈ {formattedNum(pair.user.asset.usdString, true)}</div>
                      </div>
                      <div className="text-right">{formattedPercent(pair.details.apr.asset)}</div>
                    </div>
                  </Link>
                </>
              )
            })}
        </div>
      </StyledBaseCard>
    </>
  )
}

// TODO: Use table component
const BorrowPositions = ({ borrowPositions }: any) => {
  return (
    <>
      <StyledBaseCard>
        <div className="pb-4 px-4 grid grid-cols-3 sm:grid-cols-6 text-sm font-semibold text-gray-500">
          <div className="hover:text-gray-400 col-span-1 md:col-span-1">Market</div>
          <div className="hidden sm:block"></div>
          <div className="text-right pl-4 hover:text-gray-400">Borrowing</div>
          <div className="text-right hover:text-gray-400">Collateral</div>
          <div className="hidden sm:block text-right hover:text-gray-400">Limit Used</div>
          <div className="hidden sm:block text-right hover:text-gray-400">Borrow APR</div>
        </div>
        <div className="flex-col space-y-2">
          {borrowPositions &&
            borrowPositions.length > 0 &&
            borrowPositions.map((pair: any) => {
              return (
                <>
                  <Link to={'/bento/kashi/pair/' + pair.address} className="block" key={pair.address}>
                    <div
                      className="py-4 px-4 items-center align-center grid grid-cols-3 sm:grid-cols-6 text-sm font-semibold"
                      style={{ background: '#19212e', borderRadius: '12px' }}
                    >
                      <div className="flex space-x-2 col-span-1">
                        <img
                          src={getTokenIcon(pair.collateral.address)}
                          className="w-10 y-10 sm:w-12 sm:y-12 rounded-lg"
                        />
                        <img src={getTokenIcon(pair.asset.address)} className="w-10 y-10 sm:w-12 sm:y-12 rounded-lg" />
                      </div>
                      <div className="text-left hidden sm:block pl-4">
                        <div>
                          {pair.collateral.symbol} / {pair.asset.symbol}
                        </div>
                        <div>{pair.oracle.name}</div>
                      </div>
                      <div className="text-right">
                        <div>
                          {formattedNum(pair.user.borrow.string, false)} {pair.asset.symbol}
                        </div>
                        <div className="text-gray-500 text-sm">≈ {formattedNum(pair.user.borrow.usdString, true)}</div>
                      </div>
                      <div className="text-right">
                        <div>
                          {formattedNum(pair.user.collateral.string, false)} {pair.collateral.symbol}
                        </div>
                        <div className="text-gray-500 text-sm">
                          ≈ {formattedNum(pair.user.collateral.usdString, true)}
                        </div>
                      </div>
                      <div className="hidden sm:block text-right">{formattedPercent(pair.user.health.percentage)}</div>
                      <div className="hidden sm:block text-right">{formattedPercent(pair.details.apr.borrow)}</div>
                      <div className="sm:hidden text-right col-span-3">
                        <div className="flex justify-between px-2 py-2 mt-4 bg-gray-800 rounded-lg">
                          <div className="flex">
                            <div className="text-gray-500 mr-2">Limit Used: </div>
                            <div>{formattedPercent(pair.user.health.percentage)}</div>
                          </div>
                          <div className="flex">
                            <div className="text-gray-500 mr-2">Borrow APY: </div>
                            <div>{formattedPercent(pair.details.apr.borrow)}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </>
              )
            })}
        </div>
      </StyledBaseCard>
    </>
  )
}
