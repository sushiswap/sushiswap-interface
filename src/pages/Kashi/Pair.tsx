import React, { useState } from 'react'
import { ChainId } from '@sushiswap/sdk'
import { RouteComponentProps } from 'react-router-dom'
import styled from 'styled-components'
import { useActiveWeb3React } from 'hooks'
import { AutoColumn } from 'components/Column'
import { Debugger } from 'components/Debugger'
import { useKashiPair } from 'kashi/context'
import getTokenIcon from 'sushi-hooks/queries/getTokenIcons'
import { KashiAction, Navigation, TeardropCard, CardHeader, PrimaryTabs, SecondaryTabs } from './components'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import { TYPE } from 'theme'
import { AutoRow, RowBetween } from 'components/Row'
import { formattedNum, formattedPercent } from 'utils'
import KashiLogo from 'assets/images/kashi-kanji-wires.png'
import Layout from './components/Layout'

const PageWrapper = styled.div`
  height: 100%;
  width: 100%;
  max-width: 1280px;
`

export default function KashiPair({
  match: {
    params: { pairAddress }
  }
}: RouteComponentProps<{ pairAddress: string }>) {
  const [tabIndex, setTabIndex] = useState(0)

  const { chainId } = useActiveWeb3React()

  const pair = useKashiPair(pairAddress)

  if (!pair) return null

  console.log({ pair })

  return (
    <PageWrapper>
      {/* <RowBetween padding="0 16px 8px" align="flex-end">
        <div style={{ display: 'flex', alignItems: 'center', paddingBottom: '8px' }}>
          <img src={KashiLogo} style={{ width: '116px', marginRight: '12px' }} />
          <TYPE.extraLargeHeader color="extraHighEmphesisText" fontSize={36} fontWeight={700}>
            Kashi
          </TYPE.extraLargeHeader>
        </div>
        <Navigation />
      </RowBetween> */}
      <Layout
        right={
          <>
            <TYPE.body color="highEmphesisText" fontWeight={700} fontSize={18}>
              Net Worth in this Pair
            </TYPE.body>
            <TYPE.body color="extraHighEmphesisText" fontWeight={700} fontSize={28}>
              {formattedNum(pair.user.pairNetWorth.usdString, true)} USD
            </TYPE.body>
            {tabIndex === 0 ? (
              <>
                <RowBetween>
                  <TYPE.body color="mediumEmphesisText" fontWeight={700} fontSize={18}>
                    Debt Ceiling:
                  </TYPE.body>
                  <TYPE.body color="highEmphesisText" fontWeight={700} fontSize={18}>
                    ???
                  </TYPE.body>
                </RowBetween>
                <RowBetween>
                  <TYPE.body color="mediumEmphesisText" fontWeight={700} fontSize={18}>
                    Utilization rate:
                  </TYPE.body>
                  <TYPE.body color="highEmphesisText" fontWeight={700} fontSize={18}>
                    {formattedPercent(pair.details.total.utilization.string)}
                  </TYPE.body>
                </RowBetween>
              </>
            ) : (
              <>
                <RowBetween>
                  <TYPE.body color="mediumEmphesisText" fontWeight={700} fontSize={18}>
                    Borrow Limit Rate:
                  </TYPE.body>
                  <TYPE.body color="highEmphesisText" fontWeight={700} fontSize={18}>
                    {formattedPercent(pair.user.health.percentage)}
                  </TYPE.body>
                </RowBetween>
                <RowBetween>
                  <TYPE.body color="mediumEmphesisText" fontWeight={700} fontSize={18}>
                    Left to borrow:
                  </TYPE.body>
                  <TYPE.body color="highEmphesisText" fontWeight={700} fontSize={18}>
                    {formattedNum(pair.user.borrow.max.string, true)} {pair.asset.symbol}
                  </TYPE.body>
                </RowBetween>
                <RowBetween>
                  <TYPE.body color="mediumEmphesisText" fontWeight={700} fontSize={18}>
                    Liquidation price:
                  </TYPE.body>
                  <TYPE.body color="highEmphesisText" fontWeight={700} fontSize={18}>
                    ???
                  </TYPE.body>
                </RowBetween>
                <RowBetween>
                  <TYPE.body color="mediumEmphesisText" fontWeight={700} fontSize={18}>
                    Loan to Value:
                  </TYPE.body>
                  <TYPE.body color="highEmphesisText" fontWeight={700} fontSize={18}>
                    75%
                  </TYPE.body>
                </RowBetween>
                <RowBetween>
                  <TYPE.body color="mediumEmphesisText" fontWeight={700} fontSize={18}>
                    Utilization rate:
                  </TYPE.body>
                  <TYPE.body color="highEmphesisText" fontWeight={700} fontSize={18}>
                    {formattedPercent(pair.details.total.utilization.string)}
                  </TYPE.body>
                </RowBetween>
              </>
            )}
          </>
        }
      >
        <CardHeader market={!tabIndex ? 'Supply' : 'Borrow'} border>
          <div className="flex items-center">
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
                <img src={pair && getTokenIcon(pair?.asset.address)} className="w-10 y-10 sm:w-12 sm:y-12 rounded-lg" />
              </a>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <TYPE.extraLargeHeader color="highEmphesisText" fontSize={36} lineHeight={1} fontWeight={700}>
                  {pair && `${pair.collateral.symbol + ' / ' + pair.asset.symbol}`}
                </TYPE.extraLargeHeader>
                <AutoRow>
                  <TYPE.small color="mediumEmphesisText" fontSize={12} fontWeight={700} style={{ marginRight: 4 }}>
                    Oracle:
                  </TYPE.small>
                  <TYPE.small color="highEmphesisText" fontSize={12} fontWeight={700}>
                    {pair && pair.oracle.name}
                  </TYPE.small>
                  {/* <QuestionHelper text="" /> */}
                </AutoRow>
              </div>
            </div>
          </div>
        </CardHeader>

        <Stats tabIndex={tabIndex} pair={pair} />

        <PrimaryTabs
          forceRenderTabPanel
          defaultIndex={0}
          selectedIndex={tabIndex}
          onSelect={index => setTabIndex(index)}
        >
          <TabList>
            <Tab>Supply</Tab>
            <Tab>Collateral</Tab>
            <Tab>Borrow</Tab>
            <Tab>Leverage</Tab>
          </TabList>
          <TabPanel>
            <SecondaryTabs forceRenderTabPanel>
              <TabList>
                <Tab>Deposit {pair.asset.symbol}</Tab>
                <Tab>Withdraw {pair.asset.symbol}</Tab>
              </TabList>
              <TabPanel>
                <KashiAction pair={pair} action="Deposit" direction="From" label="Balance" />
              </TabPanel>
              <TabPanel>
                <KashiAction pair={pair} action="Withdraw" direction="Into" label="Balance" />
              </TabPanel>
            </SecondaryTabs>
          </TabPanel>
          <TabPanel>
            <SecondaryTabs forceRenderTabPanel>
              <TabList>
                <Tab>Add {pair.collateral.symbol}</Tab>
                <Tab>Remove {pair.collateral.symbol}</Tab>
              </TabList>
              <TabPanel>
                <KashiAction pair={pair} action="Add Collateral" direction="From" label="Balance" />
              </TabPanel>
              <TabPanel>
                <KashiAction pair={pair} action="Remove Collateral" direction="Into" label="Max" />
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
                <KashiAction pair={pair} action="Borrow" direction="To" label="Limit" />
              </TabPanel>
              <TabPanel>
                <KashiAction pair={pair} action="Repay" direction="From" label="Outstanding" />
              </TabPanel>
            </SecondaryTabs>
          </TabPanel>
          <TabPanel></TabPanel>
        </PrimaryTabs>
      </Layout>
    </PageWrapper>
  )
}

function Stats({ tabIndex, pair }: { tabIndex: number; pair: any }) {
  return tabIndex === 0 ? (
    <RowBetween style={{ padding: '32px 48px 0' }} align="top">
      <div>
        <TYPE.mediumHeader color="mediumEmphesisText" fontSize={18} fontWeight={700}>
          Supply Balance
        </TYPE.mediumHeader>
        <TYPE.extraLargeHeader color="primaryBlue" fontSize={28} fontWeight={700}>
          {formattedNum(pair.user.supply.string)} {pair.asset.symbol}
        </TYPE.extraLargeHeader>
        <TYPE.small color="highEmphesisText" fontSize={18} fontWeight={700}>
          ≈ {formattedNum(pair.user.supply.usdString, true)}
        </TYPE.small>
      </div>
      <div>
        <TYPE.mediumHeader color="mediumEmphesisText" fontSize={18} fontWeight={700}>
          Market Supply
        </TYPE.mediumHeader>
        <TYPE.extraLargeHeader color="highEmphesisText" fontSize={28} fontWeight={700}>
          {formattedNum(pair.details.total.supply.string)} {pair.asset.symbol}
        </TYPE.extraLargeHeader>
        <TYPE.small color="highEmphesisText" fontSize={18} fontWeight={700}>
          ≈ {formattedNum(pair.details.total.supply.usdString, true)}
        </TYPE.small>
      </div>
      <div style={{ textAlign: 'right' }}>
        <div>
          <TYPE.mediumHeader color="mediumEmphesisText" fontSize={18} fontWeight={700}>
            Supply APR
          </TYPE.mediumHeader>
          <TYPE.extraLargeHeader color="highEmphesisText" fontSize={28} fontWeight={700}>
            {formattedPercent(pair.details.apr.currentSupplyAPR)}
          </TYPE.extraLargeHeader>
        </div>
      </div>
    </RowBetween>
  ) : (
    <RowBetween style={{ padding: '32px 48px 0' }} align="top">
      <div>
        <TYPE.mediumHeader color="mediumEmphesisText" fontSize={18} fontWeight={700}>
          Collateral Balance
        </TYPE.mediumHeader>
        <TYPE.extraLargeHeader color="primaryBlue" fontSize={28} fontWeight={700}>
          {formattedNum(pair.user.collateral.string)} {pair.collateral.symbol}
        </TYPE.extraLargeHeader>
        <TYPE.small color="highEmphesisText" fontSize={18} fontWeight={700}>
          ≈ {formattedNum(pair.user.collateral.usdString, true)}
        </TYPE.small>
      </div>
      <div>
        <TYPE.mediumHeader color="mediumEmphesisText" fontSize={18} fontWeight={700}>
          Borrow Balance
        </TYPE.mediumHeader>
        <TYPE.extraLargeHeader color="primaryPink" fontSize={28} fontWeight={700}>
          {formattedNum(pair.user.borrow.string)} {pair.asset.symbol}
        </TYPE.extraLargeHeader>
        <TYPE.small color="highEmphesisText" fontSize={18} fontWeight={700}>
          ≈ {formattedNum(pair.user.borrow.usdString, true)}
        </TYPE.small>
      </div>
      <div style={{ textAlign: 'right' }}>
        <div>
          <TYPE.mediumHeader color="mediumEmphesisText" fontSize={18} fontWeight={700}>
            Borrow APR
          </TYPE.mediumHeader>
          <TYPE.extraLargeHeader color="highEmphesisText" fontSize={28} fontWeight={700}>
            {formattedPercent(pair.details.apr.currentInterestPerYear)}
          </TYPE.extraLargeHeader>
        </div>
      </div>
    </RowBetween>
  )
}
