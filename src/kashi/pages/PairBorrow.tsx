import React, { useState } from 'react'
import { ChainId } from '@sushiswap/sdk'
import { Link, RouteComponentProps } from 'react-router-dom'
import styled from 'styled-components'
import { useActiveWeb3React } from 'hooks'
import useTheme from 'hooks/useTheme'
import { AutoColumn } from 'components/Column'
import Card from 'components/Card'
import { Debugger } from 'components/Debugger'
import { useKashiPair } from 'kashi/context'
import getTokenIcon from 'sushi-hooks/queries/getTokenIcons'
import { KashiAction, Navigation, TeardropCard, CardHeader, PrimaryTabs, SecondaryTabs } from '../../kashi/components'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import { TYPE } from 'theme'
import { AutoRow, RowBetween } from 'components/Row'
import { formattedNum, formattedPercent } from 'utils'
import KashiLogo from 'assets/images/kashi-kanji-wires.png'
import { InfoCard, Layout } from '../../kashi/components'
import DepositGraphic from '../../assets/kashi/deposit-graphic.png'

import { GradientDot } from '../components'

export const LabelRow = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  color: ${({ theme }) => theme.mediumEmphesisText};
  font-size: 0.75rem;
  line-height: 1rem;
  padding: 0.75rem 0;
`

export default function KashiPair({
  match: {
    params: { pairAddress }
  }
}: RouteComponentProps<{ pairAddress: string }>) {
  const [tabIndex, setTabIndex] = useState(0)

  const { chainId } = useActiveWeb3React()

  const pair = useKashiPair(pairAddress)
  const theme = useTheme()

  if (!pair) return null

  // console.log({ pair })

  return (
    <Layout
      left={
        <InfoCard
          backgroundImage={DepositGraphic}
          title={'Add collateral in order to borrow assets'}
          description={
            'Gain exposure to tokens without reducing your assets. Leverage will enable you to take short positions against assets and earn from downside movements.'
          }
        />
      }
      right={
        <>
          <TYPE.mediumHeader color="highEmphesisText">Net Worth in this Pair</TYPE.mediumHeader>
          <TYPE.largeHeader color="extraHighEmphesisText" marginBottom={18}>
            ≈ {formattedNum(pair.user.pairNetWorth.usdString, true)}
          </TYPE.largeHeader>
          <div>
            <Card backgroundColor={theme.extraDarkPurple}>
              <RowBetween>
                <TYPE.body color="mediumEmphesisText">Borrow Limit Used:</TYPE.body>
                <div className="flex items-center">
                  <TYPE.body color="highEmphesisText">{formattedPercent(pair.user.health.percentage)}</TYPE.body>
                  <GradientDot percent={pair.user.health.percentage} />
                </div>
              </RowBetween>
              <RowBetween>
                <TYPE.body color="mediumEmphesisText">Left to borrow:</TYPE.body>
                <TYPE.body color="highEmphesisText">
                  {formattedNum(pair.user.borrow.max.string)} {pair.asset.symbol}
                </TYPE.body>
              </RowBetween>
              {/* <RowBetween>
                <TYPE.body color="mediumEmphesisText">Liquidation price:</TYPE.body>
                <TYPE.body color="highEmphesisText">???</TYPE.body>
              </RowBetween> */}
            </Card>
            <Card backgroundColor="transparent">
              <RowBetween>
                <TYPE.body color="mediumEmphesisText">Loan to Value:</TYPE.body>
                <TYPE.body color="highEmphesisText">75%</TYPE.body>
              </RowBetween>
              <RowBetween>
                <TYPE.body color="mediumEmphesisText">Market Available:</TYPE.body>
                <div className="flex items-center">
                  <TYPE.body color="highEmphesisText">
                    {formattedNum(pair.details.total.asset.string)} {pair.asset.symbol}
                  </TYPE.body>
                  <GradientDot percent={pair.details.total.asset.string} desc={false} />
                </div>
              </RowBetween>
              <RowBetween>
                <TYPE.body color="mediumEmphesisText">Utilization rate:</TYPE.body>
                <div className="flex items-center">
                  <TYPE.body color="highEmphesisText">
                    {formattedPercent(pair.details.total.utilization.string)}
                  </TYPE.body>
                  <GradientDot percent={pair.details.total.utilization.string} />
                </div>
              </RowBetween>
            </Card>
          </div>
        </>
      }
    >
      <CardHeader market="Borrow" border>
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
                className="block w-10 h-10 sm:w-12 sm:h-12 rounded-lg"
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
                className="block w-10 h-10 sm:w-12 sm:h-12 rounded-lg"
              />
            </a>
          </div>
          <div className="flex justify-between items-center">
            <div>
              <TYPE.largeHeader color="highEmphesisText" lineHeight={1}>
                {pair && `${pair.collateral.symbol + ' / ' + pair.asset.symbol}`}
              </TYPE.largeHeader>
              <AutoRow>
                <TYPE.subHeader color="mediumEmphesisText" style={{ marginRight: 4 }}>
                  Oracle:
                </TYPE.subHeader>
                <TYPE.subHeader color="highEmphesisText">{pair && pair.oracle.name}</TYPE.subHeader>
                {/* <QuestionHelper text="" /> */}
              </AutoRow>
            </div>
          </div>
        </div>
      </CardHeader>

      <RowBetween style={{ padding: '32px 48px 0' }} align="top">
        <div>
          <TYPE.mediumHeader color="mediumEmphesisText">Collateral Balance</TYPE.mediumHeader>
          <TYPE.largeHeader color="primaryBlue">
            {formattedNum(pair.user.collateral.string)} {pair.collateral.symbol}
          </TYPE.largeHeader>
          <TYPE.body color="highEmphesisText">≈ {formattedNum(pair.user.collateral.usdString, true)}</TYPE.body>
        </div>
        <div>
          <TYPE.mediumHeader color="mediumEmphesisText">Borrow Balance</TYPE.mediumHeader>
          <TYPE.largeHeader color="primaryPink">
            {formattedNum(pair.user.borrow.string)} {pair.asset.symbol}
          </TYPE.largeHeader>
          <TYPE.body color="highEmphesisText">≈ {formattedNum(pair.user.borrow.usdString, true)}</TYPE.body>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div>
            <TYPE.mediumHeader color="mediumEmphesisText">Borrow APR</TYPE.mediumHeader>
            <TYPE.largeHeader color="highEmphesisText">
              {formattedPercent(pair.details.apr.currentInterestPerYear)}
            </TYPE.largeHeader>
          </div>
        </div>
      </RowBetween>

      <PrimaryTabs forceRenderTabPanel defaultIndex={0} selectedIndex={tabIndex} onSelect={index => setTabIndex(index)}>
        <TabList>
          <Tab>Collateral</Tab>
          <Tab>Borrow</Tab>
          <Tab>Leverage</Tab>
        </TabList>
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
              <Tab>Repay {pair.asset.symbol}</Tab>
            </TabList>
            <TabPanel>
              <KashiAction pair={pair} action="Borrow" direction="To" label="Limit" />
            </TabPanel>
            <TabPanel>
              <KashiAction pair={pair} action="Repay" direction="From" label="Max" />
            </TabPanel>
          </SecondaryTabs>
        </TabPanel>
        <TabPanel>
          <div className="relative pt-10">
            <div className="sm:text-center">
              <TYPE.extraLargeHeader color="highEmphesisText" lineHeight={1}>
                Coming Soon
              </TYPE.extraLargeHeader>
              <p className="mt-6 mx-auto max-w-2xl text-lg text-gray-500">
                We're working on refining the leverage experience to give our users the largest selection of long short
                positions on various tokens. Stay tuned.
              </p>
            </div>
            <div className="mt-12 mx-auto ">
              <div className="mt-4 sm:mt-0 sm:ml-3 flex space-x-4">
                <Link
                  to={'/bento/kashi/pair/' + pairAddress + '/supply'}
                  style={{ background: theme.primaryBlue }}
                  className="block w-full text-center rounded-md border border-transparent px-5 py-3 text-base font-medium text-white shadow focus:outline-none sm:px-10"
                >
                  Explore Lending
                </Link>
                <Link
                  to={'/bento/kashi/borrow'}
                  style={{ background: theme.primaryPink }}
                  className="block w-full text-center rounded-md border border-transparent px-5 py-3  text-base font-medium text-white shadow focus:outline-none sm:px-10"
                >
                  Borrow Markets
                </Link>
              </div>
            </div>
          </div>
        </TabPanel>
      </PrimaryTabs>
    </Layout>
  )
}
