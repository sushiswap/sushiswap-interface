import React, { useState } from 'react'
import { ChainId, WETH } from '@sushiswap/sdk'
import { RouteComponentProps } from 'react-router-dom'
import { useActiveWeb3React } from 'hooks'
import useTheme from 'hooks/useTheme'
import { useKashiPair } from 'kashi/context'
import { getTokenIcon } from 'kashi/functions'
import { KashiAction, LendCardHeader, PrimaryTabs } from '../../components'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import { AutoRow, RowBetween } from 'components/Row'
import { formattedNum, formattedPercent } from 'utils'
import { Card, Layout, Paper } from '../../components'
import DepositGraphic from 'assets/kashi/deposit-graphic.png'
import { GradientDot, BackButton } from '../../components'

export default function LendingPair({
  match: {
    params: { pairAddress }
  }
}: RouteComponentProps<{ pairAddress: string }>) {
  const [tabIndex, setTabIndex] = useState(0)

  const { chainId } = useActiveWeb3React()

  const pair = useKashiPair(pairAddress)

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
          <div className="text-lg text-high-emphesis">Net Worth in this Market</div>
          <div className="text-2xl text-high-emphesis mb-4">{formattedNum(pair.userNetWorth, true)}</div>
          <Paper className="bg-kashi-card-inner p-4">
            <RowBetween>
              <div className="text-lg text-secondary">Available:</div>
              <div className="text-lg text-high-emphesis">
                {formattedNum(pair.totalBorrowAmount.string)} {pair.asset.symbol}
              </div>
            </RowBetween>
            <RowBetween>
              <div className="text-lg text-secondary">Utilization:</div>
              <div className="flex items-center">
                <div className="text-lg text-high-emphesis">{formattedPercent(pair.utilization.string)}</div>
                <GradientDot percent={pair.utilization.string} desc={false} />
              </div>
            </RowBetween>
            <RowBetween>
              <div className="text-lg text-secondary">Lending APR:</div>
              <div className="flex items-center">
                <div className="text-lg text-high-emphesis">-</div>
              </div>
            </RowBetween>
            <RowBetween>
              <div className="text-lg text-secondary">Market Supply:</div>
              <div className="flex items-center">
                <div className="text-lg text-high-emphesis">-</div>
              </div>
            </RowBetween>
          </Paper>
        </Card>
      }
    >
      <Card
        header={
          <LendCardHeader>
            <div className="flex items-center">
              <div className="flex space-x-2 mr-4">
                <BackButton defaultRoute={'/bento/kashi/lend'} marginRight={0} backgroundColor={'#172948'} />
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
                  <div className="text-3xl text-high-emphesis">Lend {pair && pair.asset.symbol}</div>

                  <AutoRow>
                    <div className="text-sm text-low-emphesis mr-1">Oracle:</div>
                    <div className="text-sm text-high-emphesis mr-2">{pair && pair.oracle.name}</div>
                    <div className="text-sm text-secondary mr-1">Collateral:</div>
                    <div className="text-sm text-high-emphesis">{pair && pair.collateral.symbol}</div>
                  </AutoRow>
                </div>
              </div>
            </div>
          </LendCardHeader>
        }
      >
        <div className="flex justify-between mb-8">
          <div>
            <div className="text-secondary text-lg">Supply Balance</div>
            <div className="text-blue text-2xl">
              {formattedNum(pair.userTotalSupply.string)} {pair.asset.symbol}
            </div>
            <div className="text-high-emphesis text-lg">≈ {formattedNum(pair.userTotalSupply.usd, true)}</div>
          </div>
          <div>
            <div className="text-secondary text-lg">Market Supply</div>
            <div className="text-high-emphesis text-2xl">
              {formattedNum(pair.liquidity.string)} {pair.asset.symbol}
            </div>
            <div className="text-high-emphesis text-lg">≈ {formattedNum(pair.liquidity.usd, true)}</div>
          </div>
          <div className="text-right">
            <div>
              <div className="text-secondary text-lg">Supply APR</div>
              <div className="text-high-emphesis text-2xl">{formattedPercent(pair.currentSupplyAPR)}</div>
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
