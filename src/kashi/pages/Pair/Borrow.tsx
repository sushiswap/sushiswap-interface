import React, { useState } from 'react'
import { ChainId, WETH } from '@sushiswap/sdk'
import { Link, RouteComponentProps } from 'react-router-dom'
import styled from 'styled-components'
import { useActiveWeb3React } from 'hooks'
import useTheme from 'hooks/useTheme'
import { useKashiPair } from 'kashi/context'
import { getTokenIcon } from 'kashi/functions'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import { AutoRow, RowBetween } from 'components/Row'
import { formattedNum, formattedPercent } from 'utils'
import KashiLogo from 'assets/images/kashi-kanji-wires.png'
import DepositGraphic from 'assets/kashi/deposit-graphic.png'
import { GradientDot, Card, Layout, Paper, BorrowCardHeader, PrimaryTabs, BackButton } from '../../components'

export const LabelRow = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  color: ${({ theme }) => theme.mediumEmphesisText};
  font-size: 0.75rem;
  line-height: 1rem;
  padding: 0.75rem 0;
`

export default function BorrowPair({
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
          title={'Add collateral in order to borrow assets'}
          description={
            'Gain exposure to tokens without reducing your assets. Leverage will enable you to take short positions against assets and earn from downside movements.'
          }
        />
      }
      right={
        <Card>
          <div className="text-lg text-high-emphesis">Net Worth in this Market</div>
          <div className="text-2xl text-high-emphesis mb-4">{formattedNum(pair.userNetWorth, true)}</div>
          <Paper className="bg-kashi-card-inner p-4">
            <RowBetween>
              <div className="text-lg text-secondary">Borrow Limit Used:</div>
              <div className="flex items-center">
                <div className="text-lg text-high-emphesis">{formattedPercent(pair.health.string)}</div>
                <GradientDot percent={pair.health.string} />
              </div>
            </RowBetween>
            <RowBetween>
              <div className="text-lg text-secondary">Left to borrow:</div>
              <div className="text-lg text-high-emphesis">
                {formattedNum(pair.safeMaxBorrowableLeft.string)} {pair.asset.symbol}
              </div>
            </RowBetween>
          </Paper>
          <Card backgroundColor="transparent" padding="p-4">
            <RowBetween>
              <div className="text-lg text-secondary">Loan to Value:</div>
              <div className="text-lg text-high-emphesis">75%</div>
            </RowBetween>
            <RowBetween>
              <div className="text-lg text-secondary">Market Available:</div>
              <div className="flex items-center">
                <div className="text-lg text-high-emphesis">
                  {formattedNum(pair.totalAssetAmount.string)} {pair.asset.symbol}
                </div>
                <GradientDot percent={pair.totalAssetAmount.string} desc={false} />
              </div>
            </RowBetween>
            <RowBetween>
              <div className="text-lg text-secondary">Utilization rate:</div>
              <div className="flex items-center">
                <div className="text-lg text-high-emphesis">{formattedPercent(pair.utilization.string)}</div>
                <GradientDot percent={pair.utilization.string} />
              </div>
            </RowBetween>
          </Card>
        </Card>
      }
    >
      <Card
        header={
          <BorrowCardHeader>
            <div className="flex items-center">
              <div className="flex items-center space-x-2 mr-4">
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
                    alt=""
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
                    alt=""
                  />
                </a>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-3xl text-high-emphesis">
                    {pair && `${pair.collateral.symbol + ' / ' + pair.asset.symbol}`}
                  </div>
                  <AutoRow>
                    <div className="text-sm text-low-emphesis mr-1">Oracle:</div>
                    <div className="text-sm text-high-emphesis">{pair && pair.oracle.name}</div>
                  </AutoRow>
                </div>
              </div>
            </div>
          </BorrowCardHeader>
        }
      >
        <div className="flex justify-between mb-8">
          <div>
            <div className="text-secondary text-lg">Collateral Balance</div>
            <div className="text-blue text-2xl">
              {formattedNum(pair.userCollateralAmount.string)} {pair.collateral.symbol}
            </div>
            <div className="text-high-emphesis text-lg">{formattedNum(pair.userCollateralAmount.usd, true)}</div>
          </div>
          <div>
            <div className="text-secondary text-lg">Borrow Balance</div>
            <div className="text-pink text-2xl">
              {formattedNum(pair.userBorrowAmount.string)} {pair.asset.symbol}
            </div>
            <div className="text-high-emphesis text-lg">{formattedNum(pair.userBorrowAmount.usd, true)}</div>
          </div>
          <div className="text-right">
            <div>
              <div className="text-secondary text-lg">Borrow APR</div>
              <div className="text-high-emphesis text-2xl">{formattedPercent(pair.currentInterestPerYear.string)}</div>
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
            <Tab>Borrow</Tab>
            <Tab>Repay</Tab>
          </TabList>
        </PrimaryTabs>
      </Card>
    </Layout>
  )
}
