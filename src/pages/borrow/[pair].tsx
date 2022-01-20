import { Tab } from '@headlessui/react'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Card from 'app/components/Card'
import Dots from 'app/components/Dots'
import GradientDot from 'app/components/GradientDot'
import Image from 'app/components/Image'
import QuestionHelper from 'app/components/QuestionHelper'
import { Feature } from 'app/enums'
import { Borrow, PairTools, Repay, Strategy } from 'app/features/kashi'
import { useKashiPair } from 'app/features/kashi/hooks'
import { formatNumber, formatPercent } from 'app/functions/format'
import NetworkGuard from 'app/guards/Network'
import { useUSDCPrice } from 'app/hooks'
import { useToken } from 'app/hooks/Tokens'
import { useRedirectOnChainId } from 'app/hooks/useRedirectOnChainId'
import { useV2Pair } from 'app/hooks/useV2Pairs'
import Layout from 'app/layouts/Kashi'
import Head from 'next/head'
import { useRouter } from 'next/router'
import React from 'react'
import { RecoilRoot } from 'recoil'

export default function Pair() {
  useRedirectOnChainId('/borrow')

  const router = useRouter()
  const { i18n } = useLingui()

  const pair = useKashiPair(router.query.pair as string)

  if (!pair) return <div />

  return (
    <PairLayout>
      <Head>
        {/*@ts-ignore TYPE NEEDS FIXING*/}
        <title>{i18n._(t`Borrow ${pair?.asset?.symbol}-${pair?.collateral?.symbol}`)} | Sushi</title>
        <meta
          key="description"
          name="description"
          /* @ts-ignore TYPE NEEDS FIXING */
          content={`Borrow ${pair?.asset?.symbol} against ${pair?.collateral?.symbol} collateral on Kashi by Sushi`}
        />
        <meta
          key="twitter:description"
          name="twitter:description"
          /* @ts-ignore TYPE NEEDS FIXING */
          content={`Borrow ${pair?.asset?.symbol} against ${pair?.collateral?.symbol} collateral on Kashi by Sushi`}
        />
        <meta
          key="og:description"
          property="og:description"
          /* @ts-ignore TYPE NEEDS FIXING */
          content={`Borrow ${pair?.asset?.symbol} against ${pair?.collateral?.symbol} collateral on Kashi by Sushi`}
        />
      </Head>
      <Card
        className="h-full bg-dark-900"
        header={
          <Card.Header className="border-b-8 bg-dark-pink border-pink">
            <div className="flex items-center">
              <div className="flex items-center mr-4 space-x-2">
                {pair && (
                  <>
                    <Image
                      height={48}
                      width={48}
                      /* @ts-ignore TYPE NEEDS FIXING */
                      src={pair.asset.tokenInfo.logoURI}
                      className="block w-10 h-10 rounded-lg sm:w-12 sm:h-12"
                      /* @ts-ignore TYPE NEEDS FIXING */
                      alt={pair.asset.tokenInfo.symbol}
                    />

                    <Image
                      height={48}
                      width={48}
                      /* @ts-ignore TYPE NEEDS FIXING */
                      src={pair.collateral.tokenInfo.logoURI}
                      className="block w-10 h-10 rounded-lg sm:w-12 sm:h-12"
                      /* @ts-ignore TYPE NEEDS FIXING */
                      alt={pair.collateral.tokenInfo.symbol}
                    />
                  </>
                )}
              </div>
              <div className="flex items-center justify-between">
                <div>
                  {/*@ts-ignore TYPE NEEDS FIXING*/}
                  <div className="text-3xl text-high-emphesis">{i18n._(t`Borrow ${pair.asset.tokenInfo.symbol}`)}</div>
                  <div className="flex items-center">
                    <div className="mr-1 text-sm text-secondary">{i18n._(t`Collateral`)}:</div>
                    {/*@ts-ignore TYPE NEEDS FIXING*/}
                    <div className="mr-2 text-sm text-high-emphesis">{pair.collateral.tokenInfo.symbol}</div>
                    <div className="mr-1 text-sm text-secondary">{i18n._(t`Oracle`)}:</div>
                    {/*@ts-ignore TYPE NEEDS FIXING*/}
                    <div className="text-sm text-high-emphesis">{pair.oracle.name}</div>
                  </div>
                </div>
              </div>
            </div>
          </Card.Header>
        }
      >
        <div className="flex justify-between p-4 mb-8 xl:p-0">
          <div>
            <div className="text-lg text-secondary">{i18n._(t`Collateral`)}</div>
            <div className="text-2xl text-blue">
              {/*@ts-ignore TYPE NEEDS FIXING*/}
              {formatNumber(pair.userCollateralAmount.string)} {pair.collateral.tokenInfo.symbol}
            </div>
            {/*@ts-ignore TYPE NEEDS FIXING*/}
            <div className="text-lg text-high-emphesis">{formatNumber(pair.userCollateralAmount.usd, true)}</div>
          </div>
          <div>
            <div className="text-lg text-secondary">{i18n._(t`Borrowed`)}</div>
            <div className="text-2xl text-pink">
              {/*@ts-ignore TYPE NEEDS FIXING*/}
              {formatNumber(pair.currentUserBorrowAmount.string)} {pair.asset.tokenInfo.symbol}
            </div>
            <div className="flex items-center text-lg text-high-emphesis">
              {/*@ts-ignore TYPE NEEDS FIXING*/}
              {formatPercent(pair.health.string)}
              {/*@ts-ignore TYPE NEEDS FIXING*/}
              <GradientDot percent={pair.health.string}></GradientDot>
            </div>
          </div>
          <div className="text-right">
            <div>
              <div className="text-lg text-secondary">{i18n._(t`APR`)}</div>
              {/*@ts-ignore TYPE NEEDS FIXING*/}
              <div className="text-2xl text-high-emphesis">{formatPercent(pair.interestPerYear.string)}</div>
            </div>
          </div>
        </div>
        <Tab.Group>
          <Tab.List className="flex p-1 rounded bg-dark-800">
            <Tab
              className={({ selected }) =>
                `${
                  selected ? 'bg-dark-900 text-high-emphesis' : ''
                } flex items-center justify-center flex-1 px-3 py-4 text-lg rounded cursor-pointer select-none text-secondary hover:text-primary focus:outline-none`
              }
            >
              {i18n._(t`Borrow`)}
            </Tab>
            <Tab
              className={({ selected }) =>
                `${
                  selected ? 'bg-dark-900 text-high-emphesis' : ''
                } flex items-center justify-center flex-1 px-3 py-4 text-lg rounded cursor-pointer select-none text-secondary hover:text-primary focus:outline-none`
              }
            >
              {i18n._(t`Repay`)}
            </Tab>
          </Tab.List>
          <Tab.Panel>
            <Borrow pair={pair} />
          </Tab.Panel>
          <Tab.Panel>
            <Repay pair={pair} />
          </Tab.Panel>
        </Tab.Group>
      </Card>
    </PairLayout>
  )
}

Pair.Provider = RecoilRoot

// @ts-ignore TYPE NEEDS FIXING
const PairLayout = ({ children }) => {
  const { i18n } = useLingui()
  const router = useRouter()
  const pair = useKashiPair(router.query.pair as string)
  // @ts-ignore TYPE NEEDS FIXING
  const asset = useToken(pair?.asset.address)
  // @ts-ignore TYPE NEEDS FIXING
  const collateral = useToken(pair?.collateral.address)
  // @ts-ignore TYPE NEEDS FIXING
  const [pairState, liquidityPair] = useV2Pair(asset, collateral)
  // @ts-ignore TYPE NEEDS FIXING
  const assetPrice = useUSDCPrice(asset)
  // @ts-ignore TYPE NEEDS FIXING
  const collateralPrice = useUSDCPrice(collateral)

  return pair ? (
    <Layout
      left={
        <Card
          className="h-full bg-dark-900"
          backgroundImage="/images/kashi/borrow.png"
          title={i18n._(t`Add collateral in order to borrow assets`)}
          description={i18n._(
            t`Gain exposure to tokens without reducing your assets. Leverage will enable you to take short positions against assets and earn from downside movements.`
          )}
        />
      }
      right={
        <Card className="h-full p-4 bg-dark-900 xl:p-0">
          <div className="flex-col space-y-2">
            <div className="flex justify-between">
              <div className="text-xl text-high-emphesis">{i18n._(t`Market`)}</div>
            </div>
            <div className="flex justify-between">
              <div className="text-lg text-secondary">{i18n._(t`APR`)}</div>
              <div className="flex items-center">
                {/*@ts-ignore TYPE NEEDS FIXING*/}
                <div className="text-lg text-high-emphesis">{formatPercent(pair?.currentInterestPerYear.string)}</div>
              </div>
            </div>
            <div className="flex justify-between">
              <div className="text-lg text-secondary">{i18n._(t`LTV`)}</div>
              <div className="text-lg text-high-emphesis">75%</div>
            </div>
            <div className="flex justify-between">
              <div className="text-lg text-secondary">{i18n._(t`Total`)}</div>
              <div className="text-lg text-high-emphesis">
                {/*@ts-ignore TYPE NEEDS FIXING*/}
                {formatNumber(pair?.currentAllAssets.string)} {pair?.asset.tokenInfo.symbol}
              </div>
            </div>
            <div className="flex justify-between">
              <div className="text-lg text-secondary">{i18n._(t`Available`)}</div>
              <div className="flex items-center">
                <div className="text-lg text-high-emphesis">
                  {/*@ts-ignore TYPE NEEDS FIXING*/}
                  {formatNumber(pair?.totalAssetAmount.string)} {pair?.asset.tokenInfo.symbol}
                </div>
              </div>
            </div>
            <div className="flex justify-between">
              <div className="text-lg text-secondary">{i18n._(t`Borrowed`)}</div>
              <div className="flex items-center">
                {/*@ts-ignore TYPE NEEDS FIXING*/}
                <div className="text-lg text-high-emphesis">{formatPercent(pair?.utilization.string)}</div>
              </div>
            </div>

            <PairTools pair={pair} />

            <div className="flex justify-between pt-3">
              <div className="text-xl text-high-emphesis">{i18n._(t`Oracle`)}</div>
            </div>

            <div className="flex justify-between">
              <div className="text-lg text-secondary">Name</div>
              {/*@ts-ignore TYPE NEEDS FIXING*/}
              <div className="text-lg text-high-emphesis">{pair?.oracle.name}</div>
            </div>

            <div className="flex justify-between pt-3">
              <div className="text-xl text-high-emphesis">{i18n._(t`BentoBox`)}</div>
            </div>
            <div className="flex justify-between">
              {/*@ts-ignore TYPE NEEDS FIXING*/}
              <div className="text-lg text-secondary">{i18n._(t`${pair?.collateral.tokenInfo.symbol} Strategy`)}</div>
              <div className="flex flex-row text-lg text-high-emphesis">
                {/*@ts-ignore TYPE NEEDS FIXING*/}
                {pair.collateral.strategy ? (
                  i18n._(t`Active`)
                ) : (
                  <>
                    {i18n._(t`None`)}
                    <QuestionHelper
                      text={i18n._(
                        t`BentoBox strategies can create yield for your liquidity while it is not lent out. This token does not yet have a strategy in the BentoBox.`
                      )}
                    />{' '}
                  </>
                )}
              </div>
            </div>

            {/*@ts-ignore TYPE NEEDS FIXING*/}
            <Strategy token={pair.collateral} />

            {/*@ts-ignore TYPE NEEDS FIXING*/}
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
                            // @ts-ignore TYPE NEEDS FIXING
                            .multiply(assetPrice?.quotient)
                            // @ts-ignore TYPE NEEDS FIXING
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

Pair.Guard = NetworkGuard(Feature.KASHI)
