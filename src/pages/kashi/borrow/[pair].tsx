import { Borrow, Repay } from '../../../features/lending'
import Provider, { useKashiInfo, useKashiPair } from '../../../features/lending/context'
import React, { useCallback, useState } from 'react'
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs'
import { formatNumber, formatPercent } from '../../../functions/format'

import { BorrowCardHeader } from '../../../components/CardHeader'
import Card from '../../../components/Card'
import Dots from '../../../components/Dots'
import GradientDot from '../../../components/GradientDot'
import Head from 'next/head'
import Image from '../../../components/Image'
import { KashiCooker } from '../../../entities'
import Layout from '../../../layouts/Kashi'
import QuestionHelper from '../../../components/QuestionHelper'
import { cloudinaryLoader } from '../../../functions/cloudinary'
import { t } from '@lingui/macro'
import { useActiveWeb3React } from '../../../hooks/useActiveWeb3React'
import { useLingui } from '@lingui/react'
import { useRouter } from 'next/router'
import { useToken } from '../../../hooks/Tokens'
import { useTransactionAdder } from '../../../state/transactions/hooks'
import { useUSDCPrice } from '../../../hooks'
import { useV2Pair } from '../../../hooks/useV2Pairs'

function Pair() {
  const router = useRouter()
  const { i18n } = useLingui()
  const [tabIndex, setTabIndex] = useState(0)

  const { account, library, chainId } = useActiveWeb3React()

  const pair = useKashiPair(router.query.pair as string)
  const asset = useToken(pair?.asset.address)
  const collateral = useToken(pair?.collateral.address)
  const [pairState, liquidityPair] = useV2Pair(asset, collateral)

  const info = useKashiInfo()

  const addTransaction = useTransactionAdder()
  const onUpdateExchangeRate = useCallback(async () => {
    const cooker = new KashiCooker(pair, account, library, chainId)
    const result = await cooker.updateExchangeRate().cook()
    addTransaction(result.tx, {
      summary: `Update ${pair.collateral.tokenInfo.symbol}/${pair.asset.tokenInfo.symbol} exchange rate`,
    })
  }, [account, addTransaction, chainId, library, pair])

  if (!pair) return info && info.blockTimeStamp.isZero() ? null : router.push('/borrow')

  return (
    <>
      <Head>
        <title>{i18n._(t`Borrow ${pair?.asset?.symbol}-${pair?.collateral?.symbol}`)} | Sushi</title>
        <meta
          name="description"
          content={`Borrow ${pair?.asset?.symbol} against ${pair?.collateral?.symbol} collateral on Kashi by Sushi`}
        />
      </Head>
      <Card
        className="h-full bg-dark-900"
        header={
          <BorrowCardHeader>
            <div className="flex items-center">
              <div className="flex items-center mr-4 space-x-2">
                {pair && (
                  <>
                    <Image
                      loader={cloudinaryLoader}
                      height={48}
                      width={48}
                      src={pair.asset.tokenInfo.logoURI}
                      className="block w-10 h-10 rounded-lg sm:w-12 sm:h-12"
                      alt={pair.asset.tokenInfo.symbol}
                    />

                    <Image
                      loader={cloudinaryLoader}
                      height={48}
                      width={48}
                      src={pair.collateral.tokenInfo.logoURI}
                      className="block w-10 h-10 rounded-lg sm:w-12 sm:h-12"
                      alt={pair.collateral.tokenInfo.symbol}
                    />
                  </>
                )}
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl text-high-emphesis">{i18n._(t`Borrow ${pair.asset.tokenInfo.symbol}`)}</div>
                  <div className="flex items-center">
                    <div className="mr-1 text-sm text-secondary">{i18n._(t`Collateral`)}:</div>
                    <div className="mr-2 text-sm text-high-emphesis">{pair.collateral.tokenInfo.symbol}</div>
                    <div className="mr-1 text-sm text-secondary">{i18n._(t`Oracle`)}:</div>
                    <div className="text-sm text-high-emphesis">{pair.oracle.name}</div>
                  </div>
                </div>
              </div>
            </div>
          </BorrowCardHeader>
        }
      >
        <div className="flex justify-between mb-8">
          <div>
            <div className="text-lg text-secondary">{i18n._(t`Collateral`)}</div>
            <div className="text-2xl text-blue">
              {formatNumber(pair.userCollateralAmount.string)} {pair.collateral.tokenInfo.symbol}
            </div>
            <div className="text-lg text-high-emphesis">{formatNumber(pair.userCollateralAmount.usd, true)}</div>
          </div>
          <div>
            <div className="text-lg text-secondary">{i18n._(t`Borrowed`)}</div>
            <div className="text-2xl text-pink">
              {formatNumber(pair.currentUserBorrowAmount.string)} {pair.asset.tokenInfo.symbol}
            </div>
            <div className="flex items-center text-lg text-high-emphesis">
              {formatPercent(pair.health.string)}
              <GradientDot percent={pair.health.string}></GradientDot>
            </div>
          </div>
          <div className="text-right">
            <div>
              <div className="text-lg text-secondary">{i18n._(t`APR`)}</div>
              <div className="text-2xl text-high-emphesis">{formatPercent(pair.interestPerYear.string)}</div>
            </div>
          </div>
        </div>
        <Tabs forceRenderTabPanel selectedIndex={tabIndex} onSelect={(index: number) => setTabIndex(index)}>
          <TabList className="flex p-1 rounded bg-dark-800">
            <Tab
              className="flex items-center justify-center flex-1 px-3 py-4 text-lg rounded cursor-pointer select-none text-secondary hover:text-primary focus:outline-none"
              selectedClassName="bg-dark-900 text-high-emphesis"
            >
              {i18n._(t`Borrow`)}
            </Tab>
            <Tab
              className="flex items-center justify-center flex-1 px-3 py-4 text-lg rounded cursor-pointer select-none text-secondary hover:text-primary focus:outline-none"
              selectedClassName="bg-dark-900 text-high-emphesis"
            >
              {i18n._(t`Repay`)}
            </Tab>
          </TabList>
          <TabPanel>
            <Borrow pair={pair} />
          </TabPanel>
          <TabPanel>
            <Repay pair={pair} />
          </TabPanel>
        </Tabs>
      </Card>
    </>
  )
}

Pair.Provider = Provider

const PairLayout = ({ children }) => {
  const { i18n } = useLingui()
  const router = useRouter()
  const pair = useKashiPair(router.query.pair as string)
  const asset = useToken(pair?.asset.address)
  const collateral = useToken(pair?.collateral.address)
  const [pairState, liquidityPair] = useV2Pair(asset, collateral)
  const assetPrice = useUSDCPrice(asset)
  const collateralPrice = useUSDCPrice(collateral)
  console.log('render borrow pair layout', { pair })

  return pair ? (
    <Layout
      left={
        <Card
          className="h-full bg-dark-900"
          backgroundImage="/borrow-graphic.png"
          title={i18n._(t`Add collateral in order to borrow assets`)}
          description={i18n._(
            t`Gain exposure to tokens without reducing your assets. Leverage will enable you to take short positions against assets and earn from downside movements.`
          )}
        />
      }
      right={
        <Card className="h-full bg-dark-900">
          <div className="flex-col space-y-2">
            <div className="flex justify-between">
              <div className="text-xl text-high-emphesis">{i18n._(t`Market Info`)}</div>
            </div>
            <div className="flex justify-between">
              <div className="text-lg text-secondary">{i18n._(t`Available`)}</div>
              <div className="flex items-center">
                <div className="text-lg text-high-emphesis">
                  {formatNumber(pair?.totalAssetAmount.string)} {pair?.asset.symbol}
                </div>
              </div>
            </div>
            <div className="flex justify-between">
              <div className="text-lg text-secondary">{i18n._(t`Borrowed`)}</div>
              <div className="flex items-center">
                <div className="text-lg text-high-emphesis">{formatPercent(pair?.utilization.string)}</div>
              </div>
            </div>
            <div className="flex justify-between">
              <div className="text-lg text-secondary">{i18n._(t`Supply APR`)}</div>
              <div className="flex items-center">
                <div className="text-lg text-high-emphesis">{formatPercent(pair?.currentSupplyAPR.string)}</div>
              </div>
            </div>
            <div className="flex justify-between">
              <div className="text-lg text-secondary">{i18n._(t`Borrow APR`)}</div>
              <div className="flex items-center">
                <div className="text-lg text-high-emphesis">{formatPercent(pair?.currentInterestPerYear.string)}</div>
              </div>
            </div>
            <div className="flex justify-between">
              <div className="text-lg text-secondary">{i18n._(t`Loan to Value`)}</div>
              <div className="text-lg text-high-emphesis">75%</div>
            </div>
            <div className="flex justify-between pt-3">
              <div className="text-xl text-high-emphesis">{i18n._(t`BentoBox`)}</div>
            </div>
            <div className="flex justify-between">
              <div className="text-lg text-secondary">{i18n._(t`${pair?.collateral.symbol} Strategy`)}</div>
              <div className="text-lg text-high-emphesis">
                {i18n._(t`None`)}
                <QuestionHelper
                  text={i18n._(
                    t`BentoBox strategies can create yield for your collateral tokens. This token does not yet have a strategy in the BentoBox.`
                  )}
                />
              </div>
            </div>
            {pair && pair.oracle.name === 'SushiSwap' && (
              <>
                <div className="flex justify-between pt-3">
                  <div className="text-xl text-high-emphesis">{i18n._(t`SLP`)}</div>
                </div>
                {liquidityPair ? (
                  <>
                    <div className="flex justify-between">
                      <div className="text-lg text-secondary">{liquidityPair?.token0.symbol}</div>
                      <div className="text-lg text-high-emphesis">{liquidityPair?.reserve0.toSignificant(4)}</div>
                    </div>

                    <div className="flex justify-between">
                      <div className="text-lg text-secondary">{liquidityPair?.token1.symbol}</div>
                      <div className="text-lg text-high-emphesis">{liquidityPair?.reserve1.toSignificant(4)}</div>
                    </div>

                    <div className="flex justify-between">
                      <div className="text-lg text-secondary">TVL</div>
                      <div className="text-lg text-high-emphesis">
                        {formatNumber(
                          liquidityPair?.reserve1
                            .multiply(assetPrice?.quotient)
                            .add(liquidityPair?.reserve1.multiply(collateralPrice?.quotient))
                            .toSignificant(4),
                          true
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  <Dots className="text-lg text-secondary">Loading</Dots>
                )}
              </>
            )}
          </div>
        </Card>
      }
    >
      {children}
    </Layout>
  ) : null
}

Pair.Layout = PairLayout

export default Pair
