import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import styled, { ThemeContext } from 'styled-components'
import { transparentize } from 'polished'
//import { Debugger } from 'components/Debugger'
import { BaseCard } from '../../components/Card'
import QuestionHelper from '../../components/QuestionHelper'
import getTokenIcon from '../../sushi-hooks/queries/getTokenIcons'
import { formattedPercent, formattedNum } from '../../utils'
import { useKashiPairs } from '../../kashi/context'
import { InfoCard, SectionHeader, Layout } from '../../kashi/components'

import DepositGraphic from '../../assets/kashi/deposit-graphic.png'
import useFuse from 'sushi-hooks/useFuse'
import useSortableData from 'sushi-hooks/useSortableData'

import { Debugger } from 'components/Debugger'

const PageWrapper = styled.div`
  max-width: 1280px;
  width: 100%;
`

const StyledBaseCard = styled(BaseCard)<{ cornerRadiusTopNone: boolean }>`
  border: none;
  background: ${({ theme }) => theme.baseCard};
  position: relative;
  overflow: hidden;
  border-radius: 0 0 15px 15px;
`

export default function KashiPairs() {
  const theme = useContext(ThemeContext)
  const pairs = useKashiPairs()

  // setup search
  console.log('pairs:', pairs)
  const options = { keys: ['symbol', 'name', 'address'] }
  const { result, search, term } = useFuse({
    data: pairs && pairs.length > 0 ? pairs : [],
    options
  })
  const flattenSearchResults = result.map((a: { item: any }) => (a.item ? a.item : a))

  // Sorting Setup
  const { items, requestSort, sortConfig } = useSortableData(flattenSearchResults)

  console.log('items:', items)

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
                className="hover:text-gray-400 col-span-2 md:col-span-1 cursor-pointer"
                onClick={() => requestSort('symbol')}
              >
                Pair
              </div>
              <div
                className="text-right hidden md:block pl-4 hover:text-gray-400 cursor-pointer"
                onClick={() => requestSort('asset.symbol')}
              >
                Lending
              </div>
              <div
                className="flex text-right hover:text-gray-400 item-center justify-end cursor-pointer"
                onClick={() => requestSort('oracle.name')}
              >
                Oracle
                <QuestionHelper text="The onchain oracle that tracks the pricing for this pair" />
              </div>
              <div
                className="text-right hover:text-gray-400 cursor-pointer"
                onClick={() => requestSort('details.apr.currentSupplyAPR')}
              >
                Lending APR
              </div>
              <div
                className="text-right hover:text-gray-400 cursor-pointer"
                onClick={() => requestSort('details.total.utilization.string')}
              >
                Utilization
              </div>
              <div
                className="text-right hover:text-gray-400 cursor-pointer"
                onClick={() => requestSort('details.total.supply.usdString')}
              >
                Total Supplied
              </div>
            </div>
            <div className="flex-col space-y-2">
              {items &&
                items.length > 0 &&
                items.map(pair => {
                  return (
                    <div key={pair.address}>
                      <Link
                        to={'/bento/kashi/pair/' + String(pair.address).toLowerCase() + '/supply'}
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
                          <div className="text-right hidden md:block pl-4">{pair.asset.symbol}</div>
                          <div className="text-right">{pair.oracle.name}</div>
                          <div className="text-right">{formattedPercent(pair.details.apr.currentSupplyAPR)}</div>
                          <div className="text-right">{formattedPercent(pair.details.total.utilization.string)}</div>
                          <div className="text-right">
                            <div>
                              {formattedNum(pair.details.total.supply.string)} {pair.asset.symbol}
                            </div>
                            <div className="text-gray-500">
                              ≈ {formattedNum(pair.details.total.supply.usdString, true)}
                            </div>
                          </div>
                        </div>
                      </Link>
                      {/* {process.env.NODE_ENV === 'development' && <Debugger data={pair} />} */}
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
