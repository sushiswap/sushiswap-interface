import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Card from 'app/components/Card'
import Dots from 'app/components/Dots'
import GradientDot from 'app/components/GradientDot'
import Image from 'app/components/Image'
import { Feature } from 'app/enums/Feature'
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

export default function Borrow() {
  const { i18n } = useLingui()
  const addresses = useKashiPairAddresses()
  const pairs = useKashiPairs(addresses)

  const positions = useSearchAndSort(
    pairs.filter((pair: any) => pair.userCollateralShare.gt(0) || pair.userBorrowPart.gt(0)),
    { keys: ['search'], threshold: 0.1 },
    { key: 'health.value', direction: 'descending' }
  )

  const data = useSearchAndSort(
    pairs,
    { keys: ['search'], threshold: 0.1 },
    { key: 'totalAssetAmount.usdValue', direction: 'descending' }
  )

  const [numDisplayed, setNumDisplayed] = useInfiniteScroll(data.items)

  return (
    <BorrowLayout>
      <Head>
        <title>{i18n._(t`Borrow`)} | Sushi</title>
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
      <Card className="h-full bg-dark-900" header={<MarketHeader type="Borrow" lists={[pairs, positions]} />}>
        {positions.items && positions.items.length > 0 && (
          <div className="pb-4">
            <div>
              <div className="grid grid-cols-4 gap-4 px-4 pb-4 text-sm md:grid-cols-6 lg:grid-cols-7 text-secondary">
                <ListHeaderWithSort
                  className="col-span-1 md:col-span-2 lg:col-span-3"
                  sort={positions}
                  sortKey="search"
                >
                  <>
                    <span className="hidden md:inline-block">{i18n._(t`Your`)}</span> {i18n._(t`Positions`)}
                  </>
                </ListHeaderWithSort>
                <ListHeaderWithSort
                  className="justify-end"
                  sort={positions}
                  sortKey="currentUserBorrowAmount.usdValue"
                  direction="descending"
                >
                  {i18n._(t`Borrowed`)}
                </ListHeaderWithSort>
                <ListHeaderWithSort
                  className="justify-end hidden md:flex"
                  sort={positions}
                  sortKey="userCollateralAmount.usdValue"
                  direction="descending"
                >
                  {i18n._(t`Collateral`)}
                </ListHeaderWithSort>
                <ListHeaderWithSort
                  className="justify-end hidden lg:flex"
                  sort={positions}
                  sortKey="health.value"
                  direction="descending"
                >
                  <>
                    {i18n._(t`Limit`)} <span className="hidden md:inline-block">{i18n._(t`Used`)}</span>
                  </>
                </ListHeaderWithSort>
                <ListHeaderWithSort
                  className="justify-end"
                  sort={positions}
                  sortKey="interestPerYear.value"
                  direction="descending"
                >
                  {i18n._(t`APR`)}
                </ListHeaderWithSort>
              </div>
              <div className="flex-col space-y-2">
                {positions.items.map((pair: any) => {
                  return (
                    <div key={pair.address}>
                      <Link href={'/borrow/' + pair.address}>
                        <a className="block text-high-emphesis">
                          <div className="grid items-center grid-cols-4 gap-4 px-4 py-4 text-sm rounded md:grid-cols-6 lg:grid-cols-7 align-center bg-dark-800 hover:bg-dark-pink">
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
                            <div className="sm:block md:col-span-1 lg:col-span-2">
                              <div>
                                <strong>{pair.asset.tokenInfo.symbol}</strong> / {pair.collateral.tokenInfo.symbol}
                              </div>
                              <div>{pair.oracle.name}</div>
                            </div>
                            <div className="text-right">
                              <div>
                                {formatNumber(pair.currentUserBorrowAmount.string, false)} {pair.asset.tokenInfo.symbol}
                              </div>
                              <div className="text-sm text-secondary">
                                {formatNumber(pair.currentUserBorrowAmount.usd, true)}
                              </div>
                            </div>
                            <div className="hidden text-right md:block">
                              <div>
                                {formatNumber(pair.userCollateralAmount.string, false)}{' '}
                                {pair.collateral.tokenInfo.symbol}
                              </div>
                              <div className="text-sm text-secondary">
                                {formatNumber(pair.userCollateralAmount.usd, true)}
                              </div>
                            </div>
                            <div className="flex items-center justify-end">
                              {formatPercent(pair.health.string)}
                              <GradientDot percent={pair.health.string} />
                            </div>
                            <div className="text-right">{formatPercent(pair.interestPerYear.string)}</div>
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

        <div className="grid grid-flow-col grid-cols-4 gap-4 px-4 pb-4 text-sm md:grid-cols-6 lg:grid-cols-7 text-secondary">
          <ListHeaderWithSort sort={data} sortKey="search">
            {i18n._(t`Markets`)}
          </ListHeaderWithSort>
          <ListHeaderWithSort className="hidden md:flex" sort={data} sortKey="asset.tokenInfo.symbol">
            {i18n._(t`Borrow`)}
          </ListHeaderWithSort>
          <ListHeaderWithSort className="hidden md:flex" sort={data} sortKey="collateral.tokenInfo.symbol">
            {i18n._(t`Collateral`)}
          </ListHeaderWithSort>
          <ListHeaderWithSort className="hidden lg:flex" sort={data} sortKey="oracle.name">
            {i18n._(t`Oracle`)}
          </ListHeaderWithSort>
          <ListHeaderWithSort
            className="justify-end"
            sort={data}
            sortKey="currentBorrowAmount.usdValue"
            direction="descending"
          >
            {i18n._(t`Borrowed`)}
          </ListHeaderWithSort>
          <ListHeaderWithSort
            className="justify-end"
            sort={data}
            sortKey="totalAssetAmount.usdValue"
            direction="descending"
          >
            {i18n._(t`Available`)}
          </ListHeaderWithSort>
          <ListHeaderWithSort
            className="justify-end"
            sort={data}
            sortKey="currentInterestPerYear.value"
            direction="descending"
          >
            {i18n._(t`APR`)}
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
              <div key={pair.address}>
                <Link href={'/borrow/' + String(pair.address).toLowerCase()}>
                  <a className="block text-high-emphesis">
                    <div className="grid items-center grid-cols-4 gap-4 px-4 py-4 text-sm rounded md:grid-cols-6 lg:grid-cols-7 align-center bg-dark-800 hover:bg-dark-pink">
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
                          <div className="flex flex-col md:flex-row">
                            <div className="font-semibold">{pair.asset.tokenInfo.symbol} / </div>
                            <div>{pair.collateral.tokenInfo.symbol}</div>
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
                      <div className="text-left md:text-right">
                        <div className="md:hidden">
                          <div className="flex flex-col">
                            <div>{formatNumber(pair.currentBorrowAmount.string)}</div>
                            <div>{pair.asset.tokenInfo.symbol}</div>
                          </div>
                          <div className="text-secondary">{formatNumber(pair.currentBorrowAmount.usd, true)}</div>
                        </div>
                        <div className="hidden md:block">
                          {formatNumber(pair.currentBorrowAmount.string)} {pair.asset.tokenInfo.symbol}
                          <div className="text-secondary">{formatNumber(pair.currentBorrowAmount.usd, true)}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="md:hidden">
                          <div className="flex flex-col">
                            <div>{formatNumber(pair.totalAssetAmount.string)}</div>
                            <div>{pair.asset.tokenInfo.symbol}</div>
                          </div>
                          <div className="text-secondary">{formatNumber(pair.totalAssetAmount.usd, true)}</div>
                        </div>
                        <div className="hidden md:block">
                          {formatNumber(pair.totalAssetAmount.string)} {pair.asset.tokenInfo.symbol}
                          <div className="text-secondary">{formatNumber(pair.totalAssetAmount.usd, true)}</div>
                        </div>
                      </div>
                      <div className="text-right">{formatPercent(pair.currentInterestPerYear.string)}</div>
                    </div>
                  </a>
                </Link>
              </div>
            ))}
          </div>
        </InfiniteScroll>
      </Card>
    </BorrowLayout>
  )
}

Borrow.Provider = RecoilRoot

const BorrowLayout = ({ children }) => {
  const { i18n } = useLingui()
  return (
    <Layout
      left={
        <Card
          className="h-full bg-dark-900"
          backgroundImage="/images/kashi/borrow.png"
          title={i18n._(t`Borrow assets and leverage up`)}
          description={i18n._(
            t`Borrowing allows you to obtain liquidity without selling. Your borrow limit depends on the amount of deposited collateral. You will be able to borrow up to 75% of your collateral and repay at any time with accrued interest.`
          )}
        />
      }
    >
      {children}
    </Layout>
  )
}

Borrow.Guard = NetworkGuard(Feature.KASHI)
