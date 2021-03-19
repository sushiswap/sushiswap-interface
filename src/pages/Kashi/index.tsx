import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import styled, { ThemeContext } from 'styled-components'
import { transparentize } from 'polished'
import { Debugger } from 'components/Debugger'
import { BaseCard } from '../../components/Card'
import QuestionHelper from '../../components/QuestionHelper'
import getTokenIcon from '../../sushi-hooks/queries/getTokenIcons'
import { formattedPercent } from '../../utils'
import { useKashiPairs, KashiPair } from '../../context/kashi'

import { Header, SplitPane, Navigation, Search } from './components'

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
  const pairs = useKashiPairs()

  if (!pairs) return null

  return (
    <PageWrapper>
      <div className="flex-col space-y-8">
        <Header />
        <div>
          <SplitPane left={<Navigation />} right={<Search />} />

          {/* TODO: Use table component */}
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
                      <Debugger data={pair} />
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
