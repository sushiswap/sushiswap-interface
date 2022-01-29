import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Card from 'app/components/Card'
import Dots from 'app/components/Dots'
import Image from 'app/components/Image'
import QuestionHelper from 'app/components/QuestionHelper'
import { Feature } from 'app/enums'
import { useKashiPairAddresses, useKashiPairs } from 'app/features/kashi/hooks'
import ListHeaderWithSort from 'app/features/kashi/ListHeaderWithSort'
import MarketHeader from 'app/features/kashi/MarketHeader'
import { formatNumber, formatPercent } from 'app/functions/format'
import NetworkGuard from 'app/guards/Network'
import { useInfiniteScroll } from 'app/hooks/useInfiniteScroll'
import useSearchAndSort from 'app/hooks/useSearchAndSort'
import Layout from 'app/layouts/Kashi'
import Head from 'next/head'
import Link from 'next/link'
import React from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { RecoilRoot } from 'recoil'

export default function Lend() {
  const { i18n } = useLingui()

  const addresses = useKashiPairAddresses()

  // @ts-ignore TYPE NEEDS FIXING
  const pairs = useKashiPairs(addresses)

  console.log('KASHI pairs', pairs)

  const positions = useSearchAndSort(
    // @ts-ignore TYPE NEEDS FIXING
    pairs.filter((pair) => pair.userAssetFraction.gt(0)),
    { keys: ['search'], threshold: 0.1 },
    { key: 'currentUserAssetAmount.usdValue', direction: 'descending' }
  )
  const data = useSearchAndSort(
    pairs,
    { keys: ['search'], threshold: 0.1 },
    { key: 'currentSupplyAPR.valueWithStrategy', direction: 'descending' }
  )

  const [numDisplayed, setNumDisplayed] = useInfiniteScroll(data.items)

  return (
    <LendLayout>
      <Head>
        <title>Lend | Sushi</title>
        <meta
          key="description"
          name="description"
          content="Kashi is a lending and margin trading platform, built upon BentoBox, which allows for anyone to create customized and gas-efficient markets for lending, borrowing, and collateralizing a variety of DeFi tokens, stable coins, and synthetic assets."
        />
        <meta
          key="twitter:description"
          name="twitter:description"
          content="Kashi is a lending and margin trading platform, built upon BentoBox, which allows for anyone to create customized and gas-efficient markets for lending, borrowing, and collateralizing a variety of DeFi tokens, stable coins, and synthetic assets."
        />
        <meta
          key="og:description"
          property="og:description"
          content="Kashi is a lending and margin trading platform, built upon BentoBox, which allows for anyone to create customized and gas-efficient markets for lending, borrowing, and collateralizing a variety of DeFi tokens, stable coins, and synthetic assets."
        />
      </Head>
      <Card className="h-full bg-dark-900" header={<MarketHeader type="Lending" lists={[pairs, positions]} />}>
        {positions.items && positions.items.length > 0 && (
          <div className="pb-4">
            <div>
              <div className="grid grid-flow-col grid-cols-4 gap-4 px-4 pb-4 text-sm md:grid-cols-6 lg:grid-cols-7 text-secondary">
                <ListHeaderWithSort sort={positions} sortKey="search">
                  <>
                    <span className="hidden md:inline-block">{i18n._(t`Your`)}</span> {i18n._(t`Positions`)}
                  </>
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
                  sortKey="supplyAPR.valueWithStrategy"
                  direction="descending"
                >
                  {i18n._(t`APR`)}
                </ListHeaderWithSort>
              </div>
              <div className="flex-col space-y-2">
                {positions.items.map((pair) => {
                  return <LendEntry key={pair.address} pair={pair} userPosition={true} />
                })}
              </div>
            </div>
          </div>
        )}
        <div>
          <div className="grid grid-flow-col grid-cols-3 gap-4 px-4 pb-4 text-sm sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7 text-secondary">
            <ListHeaderWithSort sort={data} sortKey="search">
              {i18n._(t`Markets`)}
            </ListHeaderWithSort>
            <ListHeaderWithSort className="hidden md:flex" sort={data} sortKey="asset.tokenInfo.symbol">
              {i18n._(t`Lending`)}
            </ListHeaderWithSort>
            <ListHeaderWithSort className="hidden md:flex" sort={data} sortKey="collateral.tokenInfo.symbol">
              {i18n._(t`Collateral`)}
            </ListHeaderWithSort>
            <ListHeaderWithSort className="hidden lg:flex" sort={data} sortKey="oracle.name">
              {i18n._(t`Oracle`)}
              <QuestionHelper text={i18n._(t`The onchain oracle that tracks the pricing for this pair `)} />
            </ListHeaderWithSort>
            <ListHeaderWithSort
              className="justify-end"
              sort={data}
              sortKey="currentSupplyAPR.valueWithStrategy"
              direction="descending"
            >
              {i18n._(t`APR`)}
            </ListHeaderWithSort>
            <ListHeaderWithSort
              className="justify-end hidden sm:flex"
              sort={data}
              sortKey="utilization.value"
              direction="descending"
            >
              {i18n._(t`Borrowed`)}
            </ListHeaderWithSort>
            <ListHeaderWithSort
              className="justify-end"
              sort={data}
              sortKey="currentAllAssets.usdValue"
              direction="descending"
            >
              {i18n._(t`Total`)}
            </ListHeaderWithSort>
          </div>

          <InfiniteScroll
            dataLength={numDisplayed}
            next={() => setNumDisplayed(numDisplayed + 5)}
            hasMore={true}
            loader={
              <div className="mt-8 text-center">
                <Dots>Loading</Dots>
              </div>
            }
          >
            <div className="flex-col space-y-2">
              {data.items.slice(0, numDisplayed).map((pair) => (
                <LendEntry key={pair.address} pair={pair} userPosition={false} />
              ))}
            </div>
          </InfiniteScroll>
        </div>
      </Card>
    </LendLayout>
  )
}

// @ts-ignore TYPE NEEDS FIXING
const LendEntry = ({ pair, userPosition = false }) => {
  return (
    <Link href={'/lend/' + pair.address}>
      <a className="block text-high-emphesis">
        <div className="grid items-center grid-flow-col grid-cols-4 gap-4 px-4 py-4 text-sm rounded md:grid-cols-6 lg:grid-cols-7 align-center bg-dark-800 hover:bg-dark-blue">
          <div className="flex flex-col items-start sm:flex-row sm:items-center">
            <div className="hidden space-x-2 md:flex">
              <Image
                height={48}
                width={48}
                src={pair.asset.tokenInfo.logoURI}
                className="w-5 h-5 rounded-lg md:w-10 md:h-10 lg:w-12 lg:h-12"
                alt={pair.asset.tokenInfo.symbol}
              />

              <Image
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
              <div className="block mt-0 text-xs text-left text-white-500 lg:hidden">{pair.oracle.name}</div>
            </div>
          </div>
          <div className="hidden text-white md:block">
            <strong>{pair.asset.tokenInfo.symbol}</strong>
          </div>
          <div className="hidden md:block">{pair.collateral.tokenInfo.symbol}</div>
          <div className="hidden lg:block">{pair.oracle.name}</div>
          {userPosition ? (
            <>
              <div className="text-right">
                <div>
                  {formatNumber(pair.currentUserAssetAmount.string, false)} {pair.asset.tokenInfo.symbol}
                </div>
                <div className="text-sm text-secondary">{formatNumber(pair.currentUserAssetAmount.usd, true)}</div>
              </div>
              <div className="text-right">
                <div>{formatPercent(pair.utilization.string)}</div>
                <div className="text-secondary">{formatNumber(pair.currentUserLentAmount.usd, true)}</div>
              </div>
              <div className="text-right">{formatPercent(pair.supplyAPR.stringWithStrategy)}</div>{' '}
            </>
          ) : (
            <>
              <div className="text-center sm:text-right">{formatPercent(pair.currentSupplyAPR.stringWithStrategy)}</div>
              <div className="hidden text-right sm:block">{formatPercent(pair.utilization.string)}</div>
              <div className="text-right">
                <div>
                  {formatNumber(pair.currentAllAssets.string)} {pair.asset.tokenInfo.symbol}
                </div>
                <div className="text-secondary">{formatNumber(pair.currentAllAssets.usd, true)}</div>
              </div>
            </>
          )}
        </div>
      </a>
    </Link>
  )
}

Lend.Provider = RecoilRoot

// @ts-ignore TYPE NEEDS FIXING
const LendLayout = ({ children }) => {
  const { i18n } = useLingui()
  return (
    <Layout
      left={
        <Card
          className="h-full bg-dark-900"
          backgroundImage="/images/kashi/deposit.png"
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

Lend.Guard = NetworkGuard(Feature.KASHI)
