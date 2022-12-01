import { getAddress } from '@ethersproject/address'
import { Token } from '@figswap/core-sdk'
import { CurrencyLogo } from 'app/components/CurrencyLogo'
import DoubleCurrencyLogo from 'app/components/DoubleLogo'
import ExternalLink from 'app/components/ExternalLink'
import Typography from 'app/components/Typography'
import ChartCard from 'app/features/analytics/ChartCard'
import InfoCard from 'app/features/analytics/InfoCard'
import getAnalyticsPair, { AnalyticsPair } from 'app/features/analytics/pools/getAnalyticsPair'
import { LegacyTransactions } from 'app/features/transactions/Transactions'
import { getExplorerLink } from 'app/functions/explorer'
import { formatNumber } from 'app/functions/format'
import { TridentBody, TridentHeader } from 'app/layouts/Trident'
import { times } from 'lodash'
import { GetServerSideProps } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'
import React from 'react'
import { ExternalLink as LinkIcon } from 'react-feather'
import useSWR, { SWRConfig } from 'swr'

const chartTimespans = [
  {
    text: '1W',
    length: 604800,
  },
  {
    text: '1M',
    length: 2629746,
  },
  {
    text: '1Y',
    length: 31556952,
  },
  {
    text: 'ALL',
    length: Infinity,
  },
]

export default function Pool({ fallback }: { fallback: any }) {
  return (
    <SWRConfig value={{ fallback }}>
      <_Pool />
    </SWRConfig>
  )
}

function _Pool() {
  const router = useRouter()

  const chainId = Number(router.query.chainId)

  const id = (router.query.id as string).toLowerCase()

  const { data } = useSWR<AnalyticsPair>(chainId && id ? `/api/analytics/pair/${chainId}/${id}` : null, (url: string) =>
    fetch(url).then((response) => response.json())
  )

  if (!data) return <></>

  const chartDataWithDates = {
    liquidity: data.chartData.liquidity.map((day: any) => ({ ...day, x: new Date(day.x * 1000) })),
    volume: data.chartData.volume.map((day: any) => ({ ...day, x: new Date(day.x * 1000) })),
  }

  const currency0 = new Token(
    chainId,
    getAddress(data.token0.id),
    Number(data.token0.decimals),
    data.token0.symbol,
    data.token0.name
  )
  const currency1 = new Token(
    chainId,
    getAddress(data.token1.id),
    Number(data.token1.decimals),
    data.token1.symbol,
    data.token1.name
  )

  return (
    <>
      <NextSeo title={`${currency0.symbol}-${currency1.symbol} Analytics`} />
      <TridentHeader className="sm:!flex-row justify-between items-center" pattern="bg-bubble">
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <DoubleCurrencyLogo
              className="-space-x-3"
              logoClassName="rounded-full"
              currency0={currency0}
              currency1={currency1}
              size={54}
            />
            <Typography variant="h2" className="text-high-emphesis" weight={700}>
              {data.token0?.symbol}-{data.token1?.symbol}
            </Typography>
          </div>

          <Typography variant="sm" weight={400}>
            Dive deeper in the analytics of the {currency0.symbol}-{currency1.symbol} liquidity pool.
          </Typography>
        </div>
      </TridentHeader>
      <TridentBody>
        <div className="flex flex-col w-full gap-10">
          <div className="text-2xl font-bold text-high-emphesis">Overview</div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <ChartCard
              header="Liquidity"
              subheader={`${currency0.symbol}-${currency1.symbol}`}
              figure={data.liquidityUSD}
              change={data.liquidityUSD1dChange}
              chart={chartDataWithDates.liquidity}
              defaultTimespan="1W"
              timespans={chartTimespans}
            />
            <ChartCard
              header="Volume"
              subheader={`${currency0.symbol}-${currency1.symbol}`}
              figure={data.volumeUSD1d}
              change={data.volumeUSD1dChange}
              chart={chartDataWithDates.volume}
              defaultTimespan="1W"
              timespans={chartTimespans}
            />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {times(2).map((i) => (
              <div
                key={i}
                className="w-full p-6 space-y-2 border border-dark-900 rounded shadow-md bg-[rgba(0,0,0,0.12)]"
              >
                <div className="flex flex-row items-center space-x-2">
                  {/*@ts-ignore TYPE NEEDS FIXING*/}
                  <CurrencyLogo size={32} currency={[currency0, currency1][i]} />
                  <div className="text-2xl font-bold">
                    {formatNumber([data.token0.reserve, data.token1.reserve][i])}
                  </div>
                  <div className="text-lg text-secondary">{[currency0, currency1][i]?.symbol}</div>
                </div>
                <div className="font-bold">
                  1 {[currency0, currency1][i]?.symbol} = {formatNumber([data.token0.price, data.token1.price][i])}{' '}
                  {[currency1, currency0][i]?.symbol} ({formatNumber([data.token0, data.token1][i]?.derivedUSD, true)})
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-row justify-between flex-grow space-x-4 overflow-x-auto">
            <InfoCard text="Liquidity (24h)" number={data.liquidityUSD} percent={data.liquidityUSD1dChange} />
            <InfoCard text="Volume (24h)" number={data.volumeUSD1d} percent={data.volumeUSD1dChange} />
            <InfoCard text="Fees (24h)" number={data.volumeUSD1d * 0.003} percent={data.volumeUSD1dChange} />
          </div>
          <div className="flex flex-row justify-between flex-grow space-x-4 overflow-x-auto">
            <InfoCard
              text="Tx (24h)"
              number={!isNaN(data.tx1d) ? data.tx1d : ''}
              numberType="text"
              percent={data.tx1dChange}
            />
            <InfoCard text="Avg. Trade (24h)" number={data.avgTrade1d} percent={data.avgTrade1dChange} />
            <InfoCard
              text="Utilisation (24h)"
              number={data.utilisation1d}
              numberType="percent"
              percent={data.utilisation1dChange}
            />
          </div>
          <div className="text-2xl font-bold text-high-emphesis">Information</div>
          <div>
            <div className="text-sm leading-48px overflow-x-auto border border-dark-900 rounded shadow-md bg-[rgba(0,0,0,0.12)]">
              <table className="w-full table-fixed">
                <thead>
                  <tr>
                    <th className="py-3 pl-4 text-sm text-left text-secondary">
                      {currency0.symbol}-{currency1.symbol} Address
                    </th>
                    <th className="py-3 pl-4 text-sm text-left text-secondary">{currency0.symbol} Address</th>
                    <th className="py-3 pl-4 text-sm text-left text-secondary">{currency1.symbol} Address</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="pl-4 border-t border-dark-900">
                      <div className="flex items-center w-11/12">
                        <ExternalLink
                          href={getExplorerLink(chainId, id, 'token')}
                          className="flex items-center space-x-1"
                        >
                          <div className="overflow-hidden cursor-pointer overflow-ellipsis whitespace-nowrap text-purple">
                            {id}
                          </div>
                          <LinkIcon size={16} />
                        </ExternalLink>
                      </div>
                    </td>
                    <td className="pl-4 border-t border-dark-900">
                      <div className="flex items-center w-11/12 space-x-1">
                        <Link href={`/analytics/tokens/${currency0.address}`} passHref>
                          <div className="overflow-hidden cursor-pointer overflow-ellipsis whitespace-nowrap text-purple">
                            {currency0.address.toLowerCase()}
                          </div>
                        </Link>
                        <a href={getExplorerLink(chainId, currency0.address, 'token')} target="_blank" rel="noreferrer">
                          <LinkIcon size={16} />
                        </a>
                      </div>
                    </td>
                    <td className="pl-4 border-t border-dark-900">
                      <div className="flex items-center w-11/12 space-x-1">
                        <Link href={`/analytics/tokens/${currency1.address}`} passHref>
                          <div className="overflow-hidden cursor-pointer overflow-ellipsis whitespace-nowrap text-purple">
                            {currency1.address.toLowerCase()}
                          </div>
                        </Link>
                        <a href={getExplorerLink(chainId, currency1.address, 'token')} target="_blank" rel="noreferrer">
                          <LinkIcon size={16} />
                        </a>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <LegacyTransactions pairs={[id]} />
        </div>
      </TridentBody>
    </>
  )
}

export const getServerSideProps: GetServerSideProps<any> = async ({ query, res }) => {
  if (typeof query.chainId !== 'string' || typeof query.id !== 'string') return { props: { fallback: {} } }

  res.setHeader('Cache-Control', 'public, s-maxage=30, stale-while-revalidate=300')

  return {
    props: {
      fallback: {
        [`/api/analytics/pair/${query.chainId}/${query.id}`]: await getAnalyticsPair(Number(query.chainId), query.id),
      },
    },
  }
}
