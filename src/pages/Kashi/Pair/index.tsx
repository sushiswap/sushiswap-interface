import React, { useState } from 'react'
import { ChainId } from '@sushiswap/sdk'
import { Link, RouteComponentProps, useLocation } from 'react-router-dom'
import styled from 'styled-components'
import { transparentize } from 'polished'
import { useActiveWeb3React } from 'hooks'
import { BaseCard } from 'components/Card'
import { AutoColumn } from 'components/Column'
import { Debugger } from 'components/Debugger'
import Supply from './Supply'
import Borrow from './Borrow'
import { useKashiPair } from 'context/kashi'
import getTokenIcon from 'sushi-hooks/queries/getTokenIcons'
import { BarChart, User, ArrowLeft } from 'react-feather'
import BentoBoxLogo from 'assets/kashi/bento-symbol.svg'
import { KashiActions } from '../components'
//import Charts from './Charts'

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import { PrimaryTabs, SecondaryTabs } from '../components'
import QuestionHelper from 'components/QuestionHelper'
import { TYPE } from 'theme'
import { RowBetween } from 'components/Row'

const StyledArrowLeft = styled(ArrowLeft)`
  color: ${({ theme }) => theme.text1};
`

const PageWrapper = styled(AutoColumn)`
  max-width: 720px; /* 480px */
  width: 100%;
`

const StyledBaseCard = styled(BaseCard)`
  border: none
  position: relative;
  overflow: hidden;
  padding: 0;
  border-radius: 35px 20px 35px 20px;
`

const StyledCardHeader = styled.div`
  display: flex;
  align-items: center;
  background: ${({ theme }) => theme.mediumDarkPurple};
  border-radius: 30px 20px 0px 0px;
  padding: 32px;
  border-bottom: 7px solid ${({ theme }) => theme.primaryPink};
`

interface TokenProps {
  address: string
  symbol: string
}

export default function KashiPair({
  match: {
    params: { pairAddress }
  }
}: RouteComponentProps<{ pairAddress: string }>) {
  const location = useLocation()

  const [section, setSection] = useState(new URLSearchParams(location.search).get('tab') || 'supply')

  const { chainId } = useActiveWeb3React()

  const pair = useKashiPair(pairAddress)

  if (!pair) return null

  return (
    <>
      <PageWrapper>
        <div className="flex-col space-y-8">
          <div>
            <div className="block flex justify-between items-center">
              {/* <StyledArrowLeft /> */}
              <div></div>
              <nav className="-mb-px flex space-x-4">
                <Link to="/bento/kashi" className="border-transparent py-2 px-1 border-b-2">
                  <div className="flex items-center text-gray-500 hover:text-gray-400 font-medium">
                    <div className="whitespace-nowrap text-base mr-2">Markets</div>
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
            <StyledBaseCard>
              <StyledCardHeader>
                <div className="grid grid-cols-3 gap-2 items-center">
                  <div className="flex space-x-2 mr-4">
                    <a
                      href={
                        `${
                          chainId === ChainId.MAINNET
                            ? 'https://www.etherscan.io/address/'
                            : chainId === ChainId.ROPSTEN
                            ? 'https://ropsten.etherscan.io/address/'
                            : null
                        }` + pair?.collateral.address
                      }
                      target="_blank"
                      rel="noreferrer"
                    >
                      <img
                        src={pair && getTokenIcon(pair?.collateral.address)}
                        className="w-10 y-10 sm:w-12 sm:y-12 rounded-lg"
                      />
                    </a>
                    <a
                      href={
                        `${
                          chainId === ChainId.MAINNET
                            ? 'https://www.etherscan.io/address/'
                            : chainId === ChainId.ROPSTEN
                            ? 'https://ropsten.etherscan.io/address/'
                            : null
                        }` + pair?.asset.address
                      }
                      target="_blank"
                      rel="noreferrer"
                    >
                      <img
                        src={pair && getTokenIcon(pair?.asset.address)}
                        className="w-10 y-10 sm:w-12 sm:y-12 rounded-lg"
                      />
                    </a>
                  </div>
                  <div className="col-span-2 sm:col-span-1 flex justify-between items-center">
                    <div>
                      <TYPE.extraLargeHeader color="highEmphesisText" fontSize={36} lineHeight={1} fontWeight={700}>
                        {pair && `${pair.collateral.symbol + '/' + pair.asset.symbol}`}
                      </TYPE.extraLargeHeader>
                      <div style={{ display: 'flex' }}>
                        <TYPE.body color="mediumEmphesisText" fontSize={14} fontWeight={700}>
                          Oracle: {pair && pair.oracle.name}
                        </TYPE.body>
                        {/* <QuestionHelper text="" /> */}
                      </div>

                      {/* <div className="flex">
                        <div className="text-xs sm:text-base font-semibold text-gray-400 mr-2">Net APY:</div>
                        <div className="text-xs sm:text-base font-semibold" style={{ color: '#de5597' }}>
                          {/* -3.25% */}
                      {/* </div>
                      </div> */}
                    </div>
                  </div>
                  {/* <div className="hidden sm:block">
                    <div>
                      <div className="text-base sm:text-lg font-bold">{pair && 'Chainlink'}</div>
                      <div className="text-xs sm:text-base font-semibold text-gray-400">Oracle ↗</div>
                    </div>
                  </div> */}
                </div>
              </StyledCardHeader>
              {/* Tabs */}

              <PrimaryTabs forceRenderTabPanel defaultIndex={0}>
                <TabList>
                  <Tab>Supply</Tab>
                  <Tab>Borrow</Tab>
                  <Tab>Leverage</Tab>
                </TabList>
                <TabPanel>
                  <SecondaryTabs forceRenderTabPanel>
                    <TabList>
                      <Tab>Deposit {pair.collateral.symbol}</Tab>
                      <Tab>Withdraw {pair.collateral.symbol}</Tab>
                    </TabList>
                    <TabPanel>
                      <KashiActions
                        tokenAddress={pair.collateral.address}
                        tokenSymbol={pair.collateral.symbol}
                        pairAddress={pairAddress}
                        action="Deposit"
                        direction="From"
                        label="Balance"
                        value="0"
                      />
                    </TabPanel>
                    <TabPanel>
                      <KashiActions
                        tokenAddress={pair.collateral.address}
                        tokenSymbol={pair.collateral.symbol}
                        pairAddress={pairAddress}
                        action="Withdraw"
                        direction="Into"
                        label="Balance"
                        value="0"
                      />
                    </TabPanel>
                  </SecondaryTabs>
                </TabPanel>
                <TabPanel>
                  <SecondaryTabs forceRenderTabPanel>
                    <TabList>
                      <Tab>Borrow {pair.asset.symbol}</Tab>
                      <Tab>Payback {pair.asset.symbol}</Tab>
                    </TabList>
                    <TabPanel>
                      <p>
                        Protagonist, from the 20th Century. Delivery boy. Many times great-uncle to Professor Hubert
                        Farnsworth. Suitor of Leela.
                      </p>
                      <img
                        src="https://upload.wikimedia.org/wikipedia/en/thumb/2/28/Philip_Fry.png/175px-Philip_Fry.png"
                        alt="Philip J. Fry"
                      />
                    </TabPanel>
                    <TabPanel>
                      <p>Mutant cyclops. Captain of the Planet Express Ship. Love interest of Fry.</p>
                      <img
                        src="https://upload.wikimedia.org/wikipedia/en/thumb/d/d4/Turanga_Leela.png/150px-Turanga_Leela.png"
                        alt="Turanga Leela"
                      />
                    </TabPanel>
                  </SecondaryTabs>
                </TabPanel>
              </PrimaryTabs>

              <div
                className="py-2 px-6"
                style={{
                  borderBottom: '2px solid rgba(0, 0, 0, 0.1)'
                }}
              >
                {/* <Tabs tabs={tabs} selected={section} setSelected={setSection} /> */}
              </div>
              <div
                className="py-4 px-6"
                style={{
                  borderBottom: '2px solid rgba(0, 0, 0, 0.1)'
                }}
              >
                {pair && section === 'supply' && (
                  <Supply tokenAddress={pair.asset.address} tokenSymbol={pair.asset.symbol} pairAddress={pairAddress} />
                )}
                {pair && section === 'borrow' && (
                  <Borrow
                    collateral={pair.collateral}
                    asset={pair.asset}
                    pairAddress={pairAddress}
                    healthPercentage={pair.user.health.percentage}
                    collateralUSD={pair.user.collateral.usdString}
                    borrowUSD={pair.user.borrow.usdString}
                    maxRemove={pair.user.collateral.max}
                    maxBorrow={pair.user.borrow.max}
                  />
                )}
                {/* {pair && section === 'leverage' && <Leverage />} */}
              </div>
            </StyledBaseCard>
          </div>
        </div>
      </PageWrapper>
      <div>
        <Debugger data={pair} />
      </div>
    </>
  )
}
