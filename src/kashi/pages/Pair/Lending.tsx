import React, { useState } from 'react'
import { ChainId, WETH } from '@sushiswap/sdk'
import { RouteComponentProps } from 'react-router-dom'
import { useActiveWeb3React } from 'hooks'
import useTheme from 'hooks/useTheme'
import { useKashiPair } from 'kashi/context'
import { getTokenIcon } from 'kashi/functions'
import { KashiAction, CardHeader, PrimaryTabs } from '../../components'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import { TYPE } from 'theme'
import { AutoRow, RowBetween } from 'components/Row'
import { formattedNum, formattedPercent } from 'utils'
import { Card, Layout } from '../../components'
import DepositGraphic from 'assets/kashi/deposit-graphic.png'
import { GradientDot } from '../../components'

export default function LendingPair({
  match: {
    params: { pairAddress }
  }
}: RouteComponentProps<{ pairAddress: string }>) {
  const [tabIndex, setTabIndex] = useState(0)

  const { chainId } = useActiveWeb3React()

  const pair = useKashiPair(pairAddress)

  const theme = useTheme()

  if (!pair) return null

  return (
    <Layout
      left={
        <Card
          backgroundImage={DepositGraphic}
          title={'Lend assets for interest from borrowers.'}
          description={
            "Have assets you want to earn additional interest on? Lend them in isolated markets and earn interest from borrowers. It's as easy as deposit and withdraw whenever you want."
          }
        />
      }
      right={
        <Card>
          <TYPE.mediumHeader color="highEmphesisText">Net Worth in this Market</TYPE.mediumHeader>
          <TYPE.largeHeader color="extraHighEmphesisText" marginBottom={18}>
            ≈ {formattedNum(pair.userNetWorth, true)}
          </TYPE.largeHeader>
          <Card backgroundColor={theme.extraDarkPurple} p="p-4">
            <RowBetween>
              <TYPE.body color="mediumEmphesisText">Debt Ceiling:</TYPE.body>
              <TYPE.body color="highEmphesisText">
                {formattedNum(pair.totalBorrowAmount.string)} {pair.asset.symbol}
              </TYPE.body>
            </RowBetween>
            <RowBetween>
              <TYPE.body color="mediumEmphesisText">Utilization:</TYPE.body>
              <div className="flex items-center">
                <TYPE.body color="highEmphesisText">{formattedPercent(pair.utilization.string)}</TYPE.body>
                <GradientDot percent={pair.utilization.string} desc={false} />
              </div>
            </RowBetween>
          </Card>
        </Card>
      }
    >
      <Card
        header={
          <CardHeader market={'Supply'} border>
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
                    <span>Lend {pair && pair.asset.symbol}</span>
                  </TYPE.largeHeader>
                  <TYPE.subHeader color="mediumEmphesisText">with {pair && pair.collateral.symbol} as collateral</TYPE.subHeader>
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
        }
      >
        <div className="flex justify-between mb-8">
          <div>
            <TYPE.mediumHeader color="mediumEmphesisText">Supply Balance</TYPE.mediumHeader>
            <TYPE.largeHeader color="primaryBlue">
              {formattedNum(pair.userTotalSupply.string)} {pair.asset.symbol}
            </TYPE.largeHeader>
            <TYPE.body color="highEmphesisText">≈ {formattedNum(pair.userTotalSupply.usd, true)}</TYPE.body>
          </div>
          <div>
            <TYPE.mediumHeader color="mediumEmphesisText">Market Supply</TYPE.mediumHeader>
            <TYPE.largeHeader color="highEmphesisText">
              {formattedNum(pair.liquidity.string)} {pair.asset.symbol}
            </TYPE.largeHeader>
            <TYPE.body color="highEmphesisText">≈ {formattedNum(pair.liquidity.usd, true)}</TYPE.body>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div>
              <TYPE.mediumHeader color="mediumEmphesisText">Supply APR</TYPE.mediumHeader>
              <TYPE.largeHeader color="highEmphesisText">{formattedPercent(pair.currentSupplyAPR)}</TYPE.largeHeader>
            </div>
          </div>
        </div>

        <PrimaryTabs
          forceRenderTabPanel
          defaultIndex={0}
          selectedIndex={tabIndex}
          onSelect={index => setTabIndex(index)}
        >
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
        </PrimaryTabs>
      </Card>
    </Layout>
  )
}
