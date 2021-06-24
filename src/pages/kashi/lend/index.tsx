import Provider, { useKashiPairs } from '../../../features/lending/context'
import { Trans, t } from '@lingui/macro'
import { formatNumber, formatPercent } from '../../../functions/format'

import Card from '../../../components/Card'
import DoubleCurrencyLogo from '../../../components/DoubleLogo'
import Head from 'next/head'
import Image from '../../../components/Image'
import Layout from '../../../layouts/Kashi'
import Link from 'next/link'
import ListHeaderWithSort from '../../../components/ListHeaderWithSort'
import MarketHeader from '../../../components/MarketHeader'
import QuestionHelper from '../../../components/QuestionHelper'
import React from 'react'
import { cloudinaryLoader } from '../../../functions/cloudinary'
import { useLingui } from '@lingui/react'
import useSearchAndSort from '../../../hooks/useSearchAndSort'

function Lend() {
  const { i18n } = useLingui()
  const fullPairs = useKashiPairs()
  const positions = useSearchAndSort(
    fullPairs.filter((pair: any) => pair.userAssetFraction.gt(0)),
    { keys: ['search'], threshold: 0.1 },
    { key: 'currentUserAssetAmount.usdValue', direction: 'descending' }
  )
  const pairs = useSearchAndSort(
    fullPairs,
    { keys: ['search'], threshold: 0.1 },
    { key: 'currentSupplyAPR.value', direction: 'descending' }
  )

  return fullPairs ? (
    <>
      <Head>
        <title>Lend | Sushi</title>
        <meta
          name="description"
          content="Kashi is a lending and margin trading platform, built upon BentoBox, which allows for anyone to create customized and gas-efficient markets for lending, borrowing, and collateralizing a variety of DeFi tokens, stable coins, and synthetic assets."
        />
      </Head>
      <Card className="bg-dark-900" header={<MarketHeader type="Lending" lists={[pairs, positions]} />}>
        {positions.items && positions.items.length > 0 && (
          <div className="pb-4">
            <div>
              <div className="grid grid-flow-col grid-cols-4 gap-4 px-4 pb-4 text-sm md:grid-cols-6 lg:grid-cols-7 text-secondary">
                <ListHeaderWithSort sort={positions} sortKey="search">
                  <Trans>
                    <span className="hidden md:inline-block">Your</span> Positions
                  </Trans>
                </ListHeaderWithSort>
                <ListHeaderWithSort className="hidden md:flex" sort={positions} sortKey="asset.tokenInfo.symbol">
                  {i18n._(t`Lending`)}
                </ListHeaderWithSort>
                <ListHeaderWithSort className="hidden md:flex" sort={positions} sortKey="collateral.tokenInfo.symbol">
                  {i18n._(t`Collateral`)}
                </ListHeaderWithSort>
                <ListHeaderWithSort className="hidden lg:flex" sort={positions} sortKey="oracle.name">
                  {i18n._(t`Oracle`)}
                </ListHeaderWithSort>
                <ListHeaderWithSort
                  className="justify-end"
                  sort={positions}
                  sortKey="currentUserAssetAmount.usdValue"
                  direction="descending"
                >
                  {i18n._(t`Lent`)}
                </ListHeaderWithSort>
                <ListHeaderWithSort
                  className="justify-end"
                  sort={positions}
                  sortKey="currentUserLentAmount.usdValue"
                  direction="descending"
                >
                  {i18n._(t`Borrowed`)}
                </ListHeaderWithSort>
                <ListHeaderWithSort
                  className="justify-end"
                  sort={positions}
                  sortKey="supplyAPR.value"
                  direction="descending"
                >
                  {i18n._(t`APR`)}
                </ListHeaderWithSort>
              </div>
              <div className="flex-col space-y-2">
                {positions.items.map((pair: any) => {
                  return (
                    <div key={pair.address}>
                      <Link href={'/lend/' + pair.address}>
                        <a className="block text-high-emphesis">
                          <div className="grid items-center grid-flow-col grid-cols-4 gap-4 px-4 py-4 text-sm rounded md:grid-cols-6 lg:grid-cols-7 align-center bg-dark-800 hover:bg-dark-blue">
                            <div className="flex flex-col items-start sm:flex-row sm:items-center">
                              <div className="hidden space-x-2 md:flex">
                                <Image
                                  loader={cloudinaryLoader}
                                  height={48}
                                  width={48}
                                  src={pair.asset.tokenInfo.logoURI}
                                  className="w-5 h-5 rounded-lg md:w-10 md:h-10 lg:w-12 lg:h-12"
                                  alt={pair.asset.tokenInfo.symbol}
                                />

                                <Image
                                  loader={cloudinaryLoader}
                                  height={48}
                                  width={48}
                                  src={pair.collateral.tokenInfo.logoURI}
                                  className="w-5 h-5 rounded-lg md:w-10 md:h-10 lg:w-12 lg:h-12"
                                  alt={pair.collateral.tokenInfo.symbol}
                                />
                              </div>
                              <div className="sm:items-end md:hidden">
                                <div>
                                  <strong>{pair.asset.tokenInfo.symbol}</strong> / {pair.collateral.tokenInfo.symbol}
                                </div>
                                <div className="block mt-0 text-xs text-left text-white-500 lg:hidden">
                                  {pair.oracle.name}
                                </div>
                              </div>
                            </div>
                            <div className="hidden text-white md:block">
                              <strong>{pair.asset.tokenInfo.symbol}</strong>
                            </div>
                            <div className="hidden md:block">{pair.collateral.tokenInfo.symbol}</div>
                            <div className="hidden lg:block">{pair.oracle.name}</div>
                            <div className="text-right">
                              <div>
                                {formatNumber(pair.currentUserAssetAmount.string, false)} {pair.asset.tokenInfo.symbol}
                              </div>
                              <div className="text-sm text-secondary">
                                {formatNumber(pair.currentUserAssetAmount.usd, true)}
                              </div>
                            </div>
                            <div className="text-right">
                              <div>{formatPercent(pair.utilization.string)}</div>
                              <div className="text-secondary">{formatNumber(pair.currentUserLentAmount.usd, true)}</div>
                            </div>
                            <div className="text-right">{formatPercent(pair.supplyAPR.string)}</div>
                          </div>
                        </a>
                      </Link>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}
        <div>
          <div className="grid grid-flow-col grid-cols-3 gap-4 px-4 pb-4 text-sm sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7 text-secondary">
            <ListHeaderWithSort sort={pairs} sortKey="search">
              {i18n._(t`Markets`)}
            </ListHeaderWithSort>
            <ListHeaderWithSort className="hidden md:flex" sort={pairs} sortKey="asset.tokenInfo.symbol">
              {i18n._(t`Lending`)}
            </ListHeaderWithSort>
            <ListHeaderWithSort className="hidden md:flex" sort={pairs} sortKey="collateral.tokenInfo.symbol">
              {i18n._(t`Collateral`)}
            </ListHeaderWithSort>
            <ListHeaderWithSort className="hidden lg:flex" sort={pairs} sortKey="oracle.name">
              {i18n._(t`Oracle`)}
              <QuestionHelper text={i18n._(t`The onchain oracle that tracks the pricing for this pair `)} />
            </ListHeaderWithSort>
            <ListHeaderWithSort
              className="justify-end"
              sort={pairs}
              sortKey="currentSupplyAPR.value"
              direction="descending"
            >
              {i18n._(t`APR`)}
            </ListHeaderWithSort>
            <ListHeaderWithSort
              className="justify-end hidden sm:flex"
              sort={pairs}
              sortKey="utilization.value"
              direction="descending"
            >
              {i18n._(t`Borrowed`)}
            </ListHeaderWithSort>
            <ListHeaderWithSort
              className="justify-end"
              sort={pairs}
              sortKey="currentAllAssets.usdValue"
              direction="descending"
            >
              {i18n._(t`Total`)}
            </ListHeaderWithSort>
          </div>
          <div className="flex-col space-y-2">
            {pairs.items &&
              pairs.items.map((pair) => {
                return (
                  <div key={pair.address}>
                    <Link href={'/lend/' + String(pair.address).toLowerCase()}>
                      <a className="block text-high-emphesis">
                        <div className="grid items-center grid-flow-col grid-cols-3 gap-4 px-4 py-4 text-sm rounded sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7 align-center bg-dark-800 hover:bg-dark-blue">
                          <div className="flex flex-col items-start sm:flex-row sm:items-center">
                            <div className="hidden space-x-2 md:flex">
                              <Image
                                loader={cloudinaryLoader}
                                height={48}
                                width={48}
                                src={pair.asset.tokenInfo.logoURI}
                                className="w-5 h-5 rounded-lg md:w-10 md:h-10 lg:w-12 lg:h-12"
                                alt={pair.asset.tokenInfo.symbol}
                              />

                              <Image
                                loader={cloudinaryLoader}
                                height={48}
                                width={48}
                                src={pair.collateral.tokenInfo.logoURI}
                                className="w-5 h-5 rounded-lg md:w-10 md:h-10 lg:w-12 lg:h-12"
                                alt={pair.collateral.tokenInfo.symbol}
                              />
                            </div>
                            <div className="sm:items-end md:hidden">
                              <div className="flex flex-col md:flex-row">
                                <div className="font-semibold">{pair.asset.tokenInfo.symbol} / </div>
                                <div>{pair.collateral.tokenInfo.symbol}</div>
                              </div>
                              <div className="block mt-0 text-xs text-left text-white-500 lg:hidden">
                                {pair.oracle.name}
                              </div>
                            </div>
                          </div>
                          <div className="hidden text-left md:block">
                            <strong>{pair.asset.tokenInfo.symbol}</strong>
                          </div>
                          <div className="hidden text-left md:block">{pair.collateral.tokenInfo.symbol}</div>
                          <div className="hidden text-left lg:block">{pair.oracle.name}</div>
                          <div className="text-center sm:text-right">{formatPercent(pair.currentSupplyAPR.string)}</div>
                          <div className="hidden text-right sm:block">{formatPercent(pair.utilization.string)}</div>
                          <div className="text-right">
                            <div>
                              {formatNumber(pair.currentAllAssets.string)} {pair.asset.tokenInfo.symbol}
                            </div>
                            <div className="text-secondary">{formatNumber(pair.currentAllAssets.usd, true)}</div>
                          </div>
                        </div>
                      </a>
                    </Link>
                  </div>
                )
              })}
          </div>
        </div>
      </Card>
    </>
  ) : null
}

Lend.Provider = Provider

const LendLayout = ({ children }) => {
  const { i18n } = useLingui()
  return (
    <Layout
      left={
        <Card
          className="h-full bg-dark-900"
          backgroundImage="/deposit-graphic.png"
          title={i18n._(t`Lend your assets, earn yield with no impermanent loss`)}
          description={i18n._(
            t`Isolated lending markets mitigate your risks as an asset lender. Know exactly what collateral is available to you in the event of counter party insolvency.`
          )}
        />
      }
    >
      {children}
    </Layout>
  )
}

Lend.Layout = LendLayout

export default Lend
