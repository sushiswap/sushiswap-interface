import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import styled, { ThemeContext } from 'styled-components'
import { transparentize } from 'polished'
import { DarkCard, BaseCard } from '../../components/Card'
import QuestionHelper from '../../components/QuestionHelper'
import { BarChart, User, Search } from 'react-feather'
import getTokenIcon from '../../sushi-hooks/queries/getTokenIcons'
import BentoBoxLogo from '../../assets/kashi/bento-symbol.svg'
import { formattedPercent } from '../../utils'
import { useKashiPairs, useKashiCounts } from '../../contexts/kashi'

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

export default function KashiPairs() {
  const theme = useContext(ThemeContext)
  const counts = useKashiCounts()
  const pairs = useKashiPairs()

  if (!pairs) return null
  return (
    <PageWrapper>
      <div className="flex-col space-y-8">
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
                    <div className="text-2xl font-semibold">{counts.pairsSupplied || 0}</div>
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
                    <div className="text-2xl font-semibold">{counts.pairsBorrowed}</div>
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
                    <div className="text-2xl font-semibold">{counts.pairsSupplied || 0}</div>
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
                    <div className="text-2xl font-semibold">{counts.pairsBorrowed}</div>
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
        <div className="text-2xl md:text-3xl font-semibold text-center">{counts.markets} Kashi Markets</div>
        <div>
          <div className="flex flex-col md:flex-row justify-between pb-2 px-2 md:px-7">
            <div className="block px-4">
              <nav className="-mb-px flex space-x-4">
                <Link to="/bento/kashi" className="border-transparent py-2 px-1 border-b-2">
                  <div className="flex items-center text-gray-500 font-medium">
                    <div className="whitespace-nowrap text-base mr-2 text-white">Markets</div>
                    <BarChart size={16} />
                  </div>
                </Link>
                <Link to="/bento/kashi/positions" className="border-transparent py-2 px-1 border-b-2">
                  <div className="flex items-center text-gray-500 hover:text-gray-400 font-medium">
                    <div className="whitespace-nowrap text-base mr-2">Positions</div>
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
            <div className="w-full md:w-1/2">
              <div className="relative">
                <input
                  className="py-3 px-4 rounded-full w-full focus:outline-none"
                  style={{ background: `${transparentize(0.6, theme.bg1)}` }}
                  //onChange={e => search(e.target.value)}
                  //value={term}
                  placeholder="Search by name, symbol, address"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <Search size={16} />
                </div>
              </div>
            </div>
          </div>
          <StyledBaseCard>
            <div className="pb-4 px-4 grid grid-flow-col grid-cols-5 md:grid-cols-6 text-sm font-semibold text-gray-500">
              <div className="hover:text-gray-400 col-span-2 md:col-span-1">Market</div>
              <div className="text-right hidden md:block pl-4 hover:text-gray-400">Collateral</div>
              <div className="text-right hidden md:block hover:text-gray-400">Asset</div>
              <div className="flex text-right hover:text-gray-400 item-center justify-end">
                Oracle
                <QuestionHelper text="The onchain oracle that tracks the pricing for this pair" />
              </div>
              <div className="text-right hover:text-gray-400">Supply APY</div>
              <div className="text-right hover:text-gray-400">Borrow APY</div>
            </div>
            <div className="flex-col space-y-2">
              {pairs.length > 0 &&
                pairs.map(pair => {
                  return (
                    <div key={pair.address}>
                      <Link to={'/bento/kashi/' + String(pair.address).toLowerCase()} className="block">
                        <div
                          className="py-4 px-4 items-center align-center grid grid-cols-5 md:grid-cols-6 text-sm font-semibold"
                          style={{ background: '#19212e', borderRadius: '12px' }}
                        >
                          <div className="flex space-x-2 col-span-2 md:col-span-1">
                            <img
                              src={getTokenIcon(pair.collateral.address)}
                              className="w-10 y-10 sm:w-12 sm:y-12 rounded-lg"
                            />
                            <img
                              src={getTokenIcon(pair.asset.address)}
                              className="w-10 y-10 sm:w-12 sm:y-12 rounded-lg"
                            />
                          </div>
                          <div className="text-right hidden md:block pl-4">{pair.collateral.symbol}</div>
                          <div className="text-right hidden md:block">{pair.asset.symbol}</div>
                          <div className="text-right">{pair.oracle.name}</div>
                          <div className="text-right">{formattedPercent(pair.details.apr.currentSupplyAPR)}</div>
                          <div className="text-right">{formattedPercent(pair.details.apr.currentInterestPerYear)}</div>
                        </div>
                      </Link>
                      {process.env.NODE_ENV !== 'production' && (
                        <div
                          style={{
                            background: '#19212e',
                            borderRadius: '12px',
                            marginTop: '10px',
                            padding: '16px',
                            width: '100%',
                            overflowX: 'scroll',
                            fontSize: '10px'
                          }}
                        >
                          <pre>
                            <code>{JSON.stringify(pair, null, 2)}</code>
                          </pre>
                        </div>
                      )}
                    </div>
                  )
                })}
            </div>
          </StyledBaseCard>
        </div>
      </div>
    </PageWrapper>
  )
}
