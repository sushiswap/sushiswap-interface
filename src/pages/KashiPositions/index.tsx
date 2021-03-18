import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import styled, { ThemeContext } from 'styled-components'
import { transparentize } from 'polished'
import { DarkCard, BaseCard } from '../../components/Card'
//import QuestionHelper from '../../components/QuestionHelper'
import { BarChart, User } from 'react-feather'
import getTokenIcon from '../../sushi-hooks/queries/getTokenIcons'
import BentoBoxLogo from '../../assets/kashi/bento-symbol.svg'
import { formattedPercent, formattedNum } from '../../utils'
import { useKashiPairs, useKashiCounts } from 'contexts/kashi'

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

export default function Pool() {
  const counts = useKashiCounts()
  const pairs = useKashiPairs()

  const supplyPositions = pairs.filter(function(pair: any) {
    return pair.user.asset.value.gt(0)
  })
  const borrowPositions = pairs.filter(function(pair: any) {
    return pair.user.borrow.value.gt(0)
  })

  if (!supplyPositions.length || !borrowPositions.length) return null

  return (
    <>
      <PageWrapper>
        <div className="flex-col space-y-8">
          <Summary suppliedPairCount={counts.pairsSupplied} borrowedPairCount={counts.pairsBorrowed} />
          <Title count={counts.markets} />
          <PositionsDashboard supplyPositions={supplyPositions} borrowPositions={borrowPositions} />
        </div>
      </PageWrapper>
    </>
  )
}

interface SummaryProps {
  suppliedPairCount: any
  borrowedPairCount: any
}
const Summary = ({ suppliedPairCount, borrowedPairCount }: SummaryProps) => {
  return (
    <div className="w-full md:w-2/3 m-auto">
      <StyledBaseCard>
        {/* Mobile Layout Stats */}
        <div className="flex flex-col space-y-2 sm:hidden">
          <div className="flex-grow">
            <DarkCard style={{ position: 'relative', overflow: 'hidden' }} borderRadius="12px">
              <div className="items-center text-center">
                <div className="text-2xl font-semibold">$0.00</div>
                <div className="text-sm font-semibold" style={{ color: '#bfbfbf' }}>
                  Net Worth
                </div>
              </div>
            </DarkCard>
          </div>
          <div className="flex flex-row space-x-2">
            <DarkCard style={{ position: 'relative', overflow: 'hidden' }} borderRadius="12px">
              <div className="items-center text-center">
                <div className="text-2xl font-semibold">{suppliedPairCount || 0}</div>
                <div className="text-sm font-semibold" style={{ color: '#bfbfbf' }}>
                  Pairs Supplied
                </div>
              </div>
              <div className="absolute bottom-0 left-0 w-full h-2 flex">
                <div className="h-2 flex-1" style={{ background: '#6ca8ff' }} />
              </div>
            </DarkCard>
            <DarkCard style={{ position: 'relative', overflow: 'hidden' }} borderRadius="12px">
              <div className="items-center text-center">
                <div className="text-2xl font-semibold">{borrowedPairCount}</div>
                <div className="text-sm font-semibold" style={{ color: '#bfbfbf' }}>
                  Pairs Borrowed
                </div>
              </div>
              <div className="absolute bottom-0 left-0 w-full h-2 flex">
                <div className="h-2 flex-1" style={{ background: '#de5597' }} />
              </div>
            </DarkCard>
          </div>
        </div>
        {/* Desktop Layout Stats */}
        <div className="hidden sm:flex sm:flex-row sm:space-x-4">
          <div className="flex-none">
            <DarkCard style={{ position: 'relative', overflow: 'hidden' }} borderRadius="12px">
              <div className="items-center text-center">
                <div className="text-2xl font-semibold">{suppliedPairCount || 0}</div>
                <div className="text-sm font-semibold" style={{ color: '#bfbfbf' }}>
                  Pairs Supplied
                </div>
              </div>
              <div className="absolute bottom-0 left-0 w-full h-2 flex">
                <div className="h-2 flex-1" style={{ background: '#6ca8ff' }} />
              </div>
            </DarkCard>
          </div>
          <div className="flex-grow">
            <DarkCard style={{ position: 'relative', overflow: 'hidden' }} borderRadius="12px">
              <div className="items-center text-center">
                <div className="text-2xl font-semibold">$0.00</div>
                <div className="text-sm font-semibold" style={{ color: '#bfbfbf' }}>
                  Net Worth
                </div>
              </div>
            </DarkCard>
          </div>
          <div className="flex-none">
            <DarkCard style={{ position: 'relative', overflow: 'hidden' }} borderRadius="12px">
              <div className="items-center text-center">
                <div className="text-2xl font-semibold">{borrowedPairCount}</div>
                <div className="text-sm font-semibold" style={{ color: '#bfbfbf' }}>
                  Pairs Borrowed
                </div>
              </div>
              <div className="absolute bottom-0 left-0 w-full h-2 flex">
                <div className="h-2 flex-1" style={{ background: '#de5597' }} />
              </div>
            </DarkCard>
          </div>
        </div>
      </StyledBaseCard>
    </div>
  )
}

const Title = ({ count }: any) => {
  return <div className="text-2xl md:text-3xl font-semibold text-center">{count} Kashi Markets</div>
}

interface PositionsDashboardProps {
  supplyPositions: any
  borrowPositions: any
}

const PositionsDashboard = ({ supplyPositions, borrowPositions }: PositionsDashboardProps) => {
  const [selected, setSelected] = useState<string>('supply')
  return (
    <div>
      <Options
        supplyPositionsCount={supplyPositions?.length}
        borrowPositionsCount={borrowPositions?.length}
        selected={selected}
        setSelected={setSelected}
      />
      {selected && selected === 'supply' && <SupplyPositions supplyPositions={supplyPositions} />}
      {selected && selected === 'borrow' && <BorrowPositions borrowPositions={supplyPositions} />}
    </div>
  )
}

interface OptionsProps {
  supplyPositionsCount: number
  borrowPositionsCount: number
  selected?: string
  setSelected?: any
}

const Options = ({ supplyPositionsCount, borrowPositionsCount, selected, setSelected }: OptionsProps) => {
  const theme = useContext(ThemeContext)
  return (
    <div className="flex flex-col md:flex-row justify-between pb-2 px-2 md:px-7">
      <div className="block px-4">
        <nav className="-mb-px flex space-x-4">
          <Link to="/bento/kashi" className="border-transparent py-2 px-1 border-b-2">
            <div className="flex items-center text-gray-500 hover:text-gray-400 font-medium">
              <div className="whitespace-nowrap text-base mr-2">Markets</div>
              <BarChart size={16} />
            </div>
          </Link>
          <Link to="/bento/kashi/positions" className="border-transparent py-2 px-1 border-b-2">
            <div className="flex items-center text-gray-500 font-medium">
              <div className="whitespace-nowrap text-base mr-2 text-white">Positions</div>
              <User size={16} />
            </div>
          </Link>
          <Link to="/bento/balances" className="border-transparent py-2 px-1 border-b-2">
            <div className="flex items-center text-gray-500 hover:text-gray-400 font-medium">
              <div className="whitespace-nowrap text-base mr-2">My Bento</div>
              <img src={BentoBoxLogo} className="w-6" />
            </div>
          </Link>
        </nav>
      </div>
      <div className="w-full flex md:w-1/2 md:justify-end">
        {/* Desktop Styles */}
        <div className="hidden w-full px-4 md:flex items-center md:justify-end">
          <div className="py-3 md:py-0 flex items-center space-x-2 mr-4">
            <div
              className="px-2 py-1 font-semibold rounded"
              style={{ background: transparentize(0.6, theme.bg1), color: '#6ca8ff' }}
            >
              {supplyPositionsCount}
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
              {borrowPositionsCount}
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
              {supplyPositionsCount}
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
              {borrowPositionsCount}
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
    </div>
  )
}

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
