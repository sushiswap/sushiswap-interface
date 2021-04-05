import React, { useState, useCallback } from 'react'
import { ChainId, WETH } from '@sushiswap/sdk'
import { RouteComponentProps } from 'react-router-dom'
import { useActiveWeb3React } from 'hooks'
import { useKashiPair } from 'kashi/context'
import { getTokenIcon } from 'kashi/functions'
import { formattedNum, formattedPercent } from 'utils'
import DepositGraphic from 'assets/kashi/deposit-graphic.png'
import { GradientDot, PinkButton, Card, Error, Layout, Paper, BorrowCardHeader, BackButton } from 'kashi/components'
import { BigNumber } from 'ethers'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import { useKashi } from 'kashi/hooks'
import Borrow from './Borrow'
import Repay from './Repay'

export default function BorrowPair({
  match: {
    params: { pairAddress }
  }
}: RouteComponentProps<{ pairAddress: string }>) {
  const [tabIndex, setTabIndex] = useState(0)

  const { chainId } = useActiveWeb3React()

  const pair = useKashiPair(pairAddress)
  const { updateExchangeRate } = useKashi()

  const onUpdateExchangeRate = useCallback(async () => {
    await updateExchangeRate(pair.address)
  }, [pair, updateExchangeRate])

  if (!pair) return null

  return (
    <Layout
      left={
        <Card
          className="h-full bg-dark-900"
          backgroundImage={DepositGraphic}
          title={'Add collateral in order to borrow assets'}
          description={
            'Gain exposure to tokens without reducing your assets. Leverage will enable you to take short positions against assets and earn from downside movements.'
          }
        />
      }
      right={
        <Card className="h-full bg-dark-900">
          <div className="flex-col space-y-2">
            <div className="flex justify-between">
              <div className="text-lg text-secondary">Total</div>
              <div className="flex items-center">
                <div className="text-lg text-high-emphesis">
                  {formattedNum(pair.totalAssetAmount.string)} {pair.asset.symbol}
                </div>
                <GradientDot percent={pair.totalAssetAmount.string} desc={false} />
              </div>
            </div>
            <div className="flex justify-between">
              <div className="text-lg text-secondary">Borrowed</div>
              <div className="flex items-center">
                <div className="text-lg text-high-emphesis">{formattedPercent(pair.utilization.string)}</div>
                <GradientDot percent={pair.utilization.string} />
              </div>
            </div>
            <div className="flex justify-between">
              <div className="text-lg text-secondary">Loan to Value</div>
              <div className="text-lg text-high-emphesis">75%</div>
            </div>
            <div className="flex justify-between">
              <div className="text-lg text-secondary">{pair.asset.symbol} Strategy</div>
              <div className="text-lg text-high-emphesis">Inactive</div>
            </div>
            <div className="flex justify-between">
              <div className="text-lg text-secondary">{pair.collateral.symbol} Strategy</div>
              <div className="text-lg text-high-emphesis">Inactive</div>
            </div>
          </div>
        </Card>
      }
    >
      <Card
        className="h-full bg-dark-900"
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
                  <div className="flex items-center">
                    <div className="text-sm text-low-emphesis mr-1">Oracle:</div>
                    <div className="text-sm text-high-emphesis">{pair && pair.oracle.name}</div>
                  </div>
                </div>
              </div>
            </div>
          </BorrowCardHeader>
        }
      >
        {pair.currentExchangeRate.isZero() ? (
          <div>
            <div className="mb-8 text-xl text-center">Oracle exchange rate not set!</div>
            <PinkButton onClick={onUpdateExchangeRate}>Set Exchange Rate</PinkButton>
          </div>
        ) : (
          <>
            {' '}
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
                  {formattedNum(pair.currentUserBorrowAmount.string)} {pair.asset.symbol}
                </div>
                <div className="text-high-emphesis text-lg">{formattedNum(pair.currentUserBorrowAmount.usd, true)}</div>
              </div>
              <div className="text-right">
                <div>
                  <div className="text-secondary text-lg">Borrow APR</div>
                  <div className="text-high-emphesis text-2xl">
                    {formattedPercent(pair.currentInterestPerYear.string)}
                  </div>
                </div>
              </div>
            </div>
            <Tabs forceRenderTabPanel selectedIndex={tabIndex} onSelect={(index: number) => setTabIndex(index)}>
              <TabList className="flex rounded bg-dark-800 p-1">
                <Tab
                  className="flex flex-1 justify-center items-center rounded text-lg text-secondary hover:text-primary cursor-pointer focus:outline-none select-none px-3 py-4"
                  selectedClassName="bg-dark-900 text-high-emphesis"
                >
                  Borrow
                </Tab>
                <Tab
                  className="flex flex-1 justify-center items-center rounded text-lg text-secondary hover:text-primary cursor-pointer focus:outline-none select-none px-3 py-4"
                  selectedClassName="bg-dark-900 text-high-emphesis"
                >
                  Repay
                </Tab>
              </TabList>
              <TabPanel>
                <Borrow pair={pair} />
              </TabPanel>
              <TabPanel>
                <Repay pair={pair} />
              </TabPanel>
            </Tabs>
          </>
        )}

        <div>
          <pre>
            {JSON.stringify(
              pair,
              (key, value) => {
                if (value?.type === 'BigNumber') {
                  return BigNumber.from(value.hex).toString()
                }
                if (key.startsWith('_')) {
                  return undefined
                }
                return value
              },
              2
            )}
          </pre>
        </div>
      </Card>
    </Layout>
  )
}
