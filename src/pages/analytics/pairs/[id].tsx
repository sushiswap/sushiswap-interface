import { DuplicateIcon } from '@heroicons/react/outline'
import { CheckIcon } from '@heroicons/react/solid'
import { CurrencyLogo } from 'app/components/CurrencyLogo'
import DoubleCurrencyLogo from 'app/components/DoubleLogo'
import AnalyticsContainer from 'app/features/analytics/AnalyticsContainer'
import Background from 'app/features/analytics/Background'
import ChartCard from 'app/features/analytics/ChartCard'
import InfoCard from 'app/features/analytics/InfoCard'
import { LegacyTransactions } from 'app/features/transactions/Transactions'
import { getExplorerLink } from 'app/functions/explorer'
import { formatNumber, shortenAddress } from 'app/functions/format'
import { useCurrency } from 'app/hooks/Tokens'
import useCopyClipboard from 'app/hooks/useCopyClipboard'
import { useNativePrice, useOneDayBlock, usePairDayData, useSushiPairs, useTwoDayBlock } from 'app/services/graph'
import { useActiveWeb3React } from 'app/services/web3'
import { times } from 'lodash'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useMemo } from 'react'
import { ExternalLink as LinkIcon } from 'react-feather'

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

export default function Pair() {
  const router = useRouter()
  const id = (router.query.id as string).toLowerCase()

  const { chainId } = useActiveWeb3React()

  const [isCopied, setCopied] = useCopyClipboard()

  const block1d = useOneDayBlock({ chainId, shouldFetch: !!chainId })
  const block2d = useTwoDayBlock({ chainId, shouldFetch: !!chainId })

  const pair = useSushiPairs({ chainId, variables: { where: { id } }, shouldFetch: !!chainId })?.[0]
  const pair1d = useSushiPairs({
    chainId,
    variables: { block: block1d, where: { id } },
    shouldFetch: !!chainId && !!block1d,
  })?.[0]
  const pair2d = useSushiPairs({
    chainId,
    variables: { block: block2d, where: { id } },
    shouldFetch: !!chainId && !!block2d,
  })?.[0]

  const pairDayData = usePairDayData({
    chainId,
    variables: { where: { pair: id?.toLowerCase() } },
    shouldFetch: !!chainId && !!id,
  })

  const nativePrice = useNativePrice({ chainId, shouldFetch: !!chainId })

  // For the charts
  const chartData = useMemo(
    () => ({
      liquidity: pair?.reserveUSD,
      liquidityChange: (pair?.reserveUSD / pair1d?.reserveUSD) * 100 - 100,
      liquidityChart: pairDayData
        ?.sort((a, b) => a.date - b.date)
        .map((day) => ({ x: new Date(day.date * 1000), y: Number(day.reserveUSD) })),

      volume1d: pair?.volumeUSD - pair1d?.volumeUSD,
      volume1dChange: ((pair?.volumeUSD - pair1d?.volumeUSD) / (pair1d?.volumeUSD - pair2d?.volumeUSD)) * 100 - 100,
      volumeChart: pairDayData
        ?.sort((a, b) => a.date - b.date)
        .map((day) => ({ x: new Date(day.date * 1000), y: Number(day.volumeUSD) })),
    }),
    [pair, pair1d, pair2d, pairDayData]
  )

  // For the logos
  const currency0 = useCurrency(pair?.token0?.id)
  const currency1 = useCurrency(pair?.token1?.id)

  // For the Info Cards
  const liquidityUSDChange = pair?.reserveUSD / pair1d?.reserveUSD

  const volumeUSD1d = pair?.volumeUSD - pair1d?.volumeUSD
  const volumeUSD2d = pair1d?.volumeUSD - pair2d?.volumeUSD
  const volumeUSD1dChange = (volumeUSD1d / volumeUSD2d) * 100 - 100

  const tx1d = pair?.txCount - pair1d?.txCount
  const tx2d = pair1d?.txCount - pair2d?.txCount
  const tx1dChange = (tx1d / tx2d) * 100 - 100

  const avgTrade1d = volumeUSD1d / tx1d
  const avgTrade2d = volumeUSD2d / tx2d
  const avgTrade1dChange = (avgTrade1d / avgTrade2d) * 100 - 100

  const utilisation1d = (volumeUSD1d / pair?.reserveUSD) * 100
  const utilisation2d = (volumeUSD2d / pair1d?.reserveUSD) * 100
  const utilisation1dChange = (utilisation1d / utilisation2d) * 100 - 100

  return (
    <AnalyticsContainer>
      <div className="relative h-8">
        <div className="absolute w-full h-full bg-gradient-to-r from-blue to-pink opacity-5" />
        <div className="absolute flex items-center w-full p-2 lg:pl-14">
          <div className="text-xs font-medium text-secondary">
            <Link href="/analytics">Analytics</Link>&nbsp;
            {'>'}&nbsp;
            <Link href="/analytics/pairs">Pairs</Link>&nbsp;
            {'> '}&nbsp;
          </div>
          <div className="text-xs font-bold text-high-emphesis">
            {pair?.token0?.symbol}-{pair?.token1?.symbol}
          </div>
        </div>
      </div>
      <Background background="pool">
        <div className="items-center -mt-4 space-y-6">
          <button onClick={() => router.back()} className="text-sm text-blue">
            {'<'} Go Back
          </button>
          <div className="flex items-center space-x-4">
            <DoubleCurrencyLogo
              className="-space-x-3"
              logoClassName="rounded-full"
              currency0={currency0}
              currency1={currency1}
              size={54}
            />
            <div>
              <div className="text-lg font-bold text-high-emphesis">
                {pair?.token0?.symbol}-{pair?.token1?.symbol}
              </div>
              <div className="text-xs text-secondary">Sushi Liquidity Pool</div>
            </div>
            <div className="rounded-3xl text-sm bg-[#414a6c] py-px px-2 flex items-center space-x-1">
              <div>{shortenAddress(id)}</div>
              <div className="cursor-pointer" onClick={() => setCopied(id)}>
                {isCopied ? <CheckIcon height={16} /> : <DuplicateIcon height={16} className="scale-x-[-1]" />}
              </div>
            </div>
          </div>
        </div>
      </Background>
      <div className="px-4 pt-4 space-y-4 lg:px-14">
        <div className="relative h-12">
          <div className="absolute w-full h-full">
            <div className="h-1/3" />
            <div className="opacity-50 w-[210px] h-1/3 bg-gradient-to-r from-blue to-pink" />
          </div>
          <div className="absolute text-3xl font-bold text-high-emphesis">Pool Overview</div>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <ChartCard
            header="Liquidity"
            subheader={`${pair?.token0?.symbol}-${pair?.token1?.symbol}`}
            figure={chartData.liquidity}
            change={chartData.liquidityChange}
            chart={chartData.liquidityChart}
            defaultTimespan="1W"
            timespans={chartTimespans}
          />
          <ChartCard
            header="Volume"
            subheader={`${pair?.token0?.symbol}-${pair?.token1?.symbol}`}
            figure={chartData.volume1d}
            change={chartData.volume1dChange}
            chart={chartData.volumeChart}
            defaultTimespan="1W"
            timespans={chartTimespans}
          />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {times(2).map((i) => (
            <div key={i} className="w-full p-6 space-y-2 border rounded bg-dark-900 border-dark-700">
              <div className="flex flex-row items-center space-x-2">
                <CurrencyLogo size={32} currency={[currency0, currency1][i]} />
                <div className="text-2xl font-bold">{formatNumber([pair?.reserve0, pair?.reserve1][i])}</div>
                <div className="text-lg text-secondary">{[pair?.token0, pair?.token1][i]?.symbol}</div>
              </div>
              <div className="font-bold">
                1 {[pair?.token0, pair?.token1][i]?.symbol} = {formatNumber([pair?.token1Price, pair?.token0Price][i])}{' '}
                {[pair?.token1, pair?.token0][i]?.symbol} (
                {formatNumber([pair?.token1, pair?.token0][i]?.derivedETH * nativePrice, true)})
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-row justify-between flex-grow space-x-4 overflow-x-auto">
          <InfoCard text="Liquidity (24h)" number={pair?.reserveUSD} percent={liquidityUSDChange} />
          <InfoCard text="Volume (24h)" number={volumeUSD1d} percent={volumeUSD1dChange} />
          <InfoCard text="Fees (24h)" number={volumeUSD1d * 0.003} percent={volumeUSD1dChange} />
        </div>
        <div className="flex flex-row justify-between flex-grow space-x-4 overflow-x-auto">
          <InfoCard text="Tx (24h)" number={!isNaN(tx1d) ? tx1d : ''} numberType="text" percent={tx1dChange} />
          <InfoCard text="Avg. Trade (24h)" number={avgTrade1d} percent={avgTrade1dChange} />
          <InfoCard
            text="Utilisation (24h)"
            number={utilisation1d}
            numberType="percent"
            percent={utilisation1dChange}
          />
        </div>
        <div className="text-2xl font-bold text-high-emphesis">Information</div>
        <div>
          <div className="px-4 text-sm leading-48px text-high-emphesis">
            <table className="w-full table-fixed">
              <thead className="border-b border-gray-900">
                <tr>
                  <td>
                    {pair?.token0?.symbol}-{pair?.token1?.symbol} Address
                  </td>
                  <td>{pair?.token0?.symbol} Address</td>
                  <td>{pair?.token1?.symbol} Address</td>
                </tr>
              </thead>
              <tbody className="border-b border-gray-900 ">
                <tr>
                  <td>
                    <div className="flex items-center justify-center w-11/12 space-x-1">
                      <div className="overflow-hidden overflow-ellipsis whitespace-nowrap">{pair?.id}</div>
                      <a href={getExplorerLink(chainId, pair?.id, 'token')} target="_blank" rel="noreferrer">
                        <LinkIcon size={16} />
                      </a>
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center w-11/12 space-x-1">
                      <Link href={`/analytics/tokens/${pair?.token0?.id}`} passHref>
                        <div className="overflow-hidden cursor-pointer overflow-ellipsis whitespace-nowrap text-purple">
                          {pair?.token0?.id}
                        </div>
                      </Link>
                      <a href={getExplorerLink(chainId, pair?.token0?.id, 'token')} target="_blank" rel="noreferrer">
                        <LinkIcon size={16} />
                      </a>
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center w-11/12 space-x-1">
                      <Link href={`/analytics/tokens/${pair?.token1?.id}`} passHref>
                        <div className="overflow-hidden cursor-pointer overflow-ellipsis whitespace-nowrap text-purple">
                          {pair?.token1?.id}
                        </div>
                      </Link>
                      <a href={getExplorerLink(chainId, pair?.token1?.id, 'token')} target="_blank" rel="noreferrer">
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
    </AnalyticsContainer>
  )
}
