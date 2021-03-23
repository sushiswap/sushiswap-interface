import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import styled, { ThemeContext } from 'styled-components'
import { transparentize } from 'polished'
//import { Debugger } from 'components/Debugger'
import { BaseCard } from '../../components/Card'
import QuestionHelper from '../../components/QuestionHelper'
import getTokenIcon from '../../sushi-hooks/queries/getTokenIcons'
import { formattedPercent } from '../../utils'
import { useKashiPairs } from '../context'

import { InfoCard, SectionHeader, Layout } from '../components'

import DepositGraphic from '../../assets/kashi/deposit-graphic.png'

const PageWrapper = styled.div`
  max-width: 1200px;
  width: 100%;
`

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

  if (!pairs) return null

  return (
    <PageWrapper>
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
            <SectionHeader />
            {/* TODO: Use table component */}
            <StyledBaseCard cornerRadiusTopNone={true}>
              <div className="pb-4 px-4 grid grid-flow-col grid-cols-5 md:grid-cols-6 text-sm font-semibold text-gray-500">
                <div className="hover:text-gray-400 col-span-2 md:col-span-1">Borrowing</div>
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
                        <Link
                          to={'/bento/kashi/pair/' + String(pair.address).toLowerCase() + '?tab=borrow'}
                          className="block"
                          style={{ color: theme.highEmphesisText }}
                        >
                          <div
                            className="py-4 px-4 items-center align-center grid grid-cols-5 md:grid-cols-6 text-sm font-semibold"
                            style={{ background: theme.mediumDarkPurple, borderRadius: '15px' }}
                          >
                            <div className="flex space-x-2 col-span-2 md:col-span-1">
                              <img
                                src={getTokenIcon(pair.asset.address)}
                                className="w-10 y-10 sm:w-12 sm:y-12 rounded-lg"
                              />
                            </div>
                            <div className="text-right hidden md:block pl-4">{pair.collateral.symbol}</div>
                            <div className="text-right hidden md:block">{pair.asset.symbol}</div>
                            <div className="text-right">{pair.oracle.name}</div>
                            <div className="text-right">{formattedPercent(pair.details.apr.currentSupplyAPR)}</div>
                            <div className="text-right">
                              {formattedPercent(pair.details.apr.currentInterestPerYear)}
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
    </PageWrapper>
  )
}
