import { CheckIcon, DuplicateIcon } from '@heroicons/react/outline'
import CurrencyLogo from 'app/components/CurrencyLogo'
import AnalyticsContainer from 'app/features/analytics/AnalyticsContainer'
import Background from 'app/features/analytics/Background'
import ChartCard from 'app/features/analytics/ChartCard'
import ColoredNumber from 'app/features/analytics/ColoredNumber'
import InfoCard from 'app/features/analytics/InfoCard'
import PairList from 'app/features/analytics/Pairs/PairList'
import { getExplorerLink } from 'app/functions/explorer'
import { formatNumber, shortenAddress } from 'app/functions/format'
import { useCurrency } from 'app/hooks/Tokens'
import { useTokenContract } from 'app/hooks/useContract'
import useCopyClipboard from 'app/hooks/useCopyClipboard'
import { useBlock, useNativePrice, useTokenDayData, useTokenPairs, useTokens } from 'app/services/graph'
import { useActiveWeb3React } from 'app/services/web3'
import { LegacyTransactions } from 'features/transactions/Transactions'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useEffect, useMemo, useState } from 'react'
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

export default function Token() {
  const router = useRouter()
  const id = (router.query.id as string).toLowerCase()

  const { chainId } = useActiveWeb3React()

  const [isCopied, setCopied] = useCopyClipboard()

  const [totalSupply, setTotalSupply] = useState(0)
  const tokenContract = useTokenContract(id)

  useEffect(() => {
    const fetch = async () => {
      setTotalSupply(await tokenContract.totalSupply())
    }
    fetch()
  }, [tokenContract])

  const block1d = useBlock({ daysAgo: 1, chainId })
  const block2d = useBlock({ daysAgo: 2, chainId })
  const block1w = useBlock({ daysAgo: 7, chainId })

  // General data (volume, liquidity)
  const nativePrice = useNativePrice({ chainId })
  const nativePrice1d = useNativePrice({ block: block1d, chainId })

  const token = useTokens({ subset: [id], chainId })?.[0]
  const token1d = useTokens({ subset: [id], block: block1d, shouldFetch: !!block1d, chainId })?.[0]
  const token2d = useTokens({ subset: [id], block: block2d, shouldFetch: !!block2d, chainId })?.[0]

  // Token Pairs
  const tokenPairs = useTokenPairs({ token: id, chainId })
  const tokenPairs1d = useTokenPairs({ token: id, block: block1d, shouldFetch: !!block1d, chainId })
  const tokenPairs1w = useTokenPairs({ token: id, block: block1w, shouldFetch: !!block1w, chainId })
  const tokenPairsFormatted = useMemo(
    () =>
      tokenPairs?.map((pair) => {
        const pair1d = tokenPairs1d?.find((p) => pair.id === p.id) ?? pair
        const pair1w = tokenPairs1w?.find((p) => pair.id === p.id) ?? pair1d

        return {
          pair: {
            token0: pair.token0,
            token1: pair.token1,
            address: pair.id,
          },
          liquidity: pair.reserveUSD,
          volume1d: pair.volumeUSD - pair1d.volumeUSD,
          volume1w: pair.volumeUSD - pair1w.volumeUSD,
        }
      }),
    [tokenPairs, tokenPairs1d, tokenPairs1w]
  )

  // For the logo
  const currency = useCurrency(token?.id)

  // For the Info Cards
  const price = token?.derivedETH * nativePrice
  const priceChange = ((token?.derivedETH * nativePrice) / (token1d?.derivedETH * nativePrice1d)) * 100 - 100

  const liquidityUSD = token?.liquidity * token?.derivedETH * nativePrice
  const liquidityUSDChange =
    ((token?.liquidity * price) / (token1d?.liquidity * token1d?.derivedETH * nativePrice1d)) * 100 - 100

  const volumeUSD1d = token?.volumeUSD - token1d?.volumeUSD
  const volumeUSD2d = token1d?.volumeUSD - token2d?.volumeUSD
  const volumeUSD1dChange = (volumeUSD1d / volumeUSD2d) * 100 - 100

  // The Chart
  const tokenDayData = useTokenDayData({ token: id, chainId, shouldFetch: !!id })

  const chartData = useMemo(
    () => ({
      liquidityChart: tokenDayData
        ?.sort((a, b) => a.date - b.date)
        .map((day) => ({ x: new Date(day.date * 1000), y: Number(day.liquidityUSD) })),

      volumeChart: tokenDayData
        ?.sort((a, b) => a.date - b.date)
        .map((day) => ({ x: new Date(day.date * 1000), y: Number(day.volumeUSD) })),
    }),
    [tokenDayData]
  )

  return (
    <AnalyticsContainer>
      <div className="relative h-8">
        <div className="absolute w-full h-full bg-gradient-to-r from-blue to-pink opacity-5" />
        <div className="absolute flex items-center w-full p-2 lg:pl-14">
          <div className="text-xs font-medium text-secondary">
            <Link href="/analytics">Analytics</Link>&nbsp;
            {'>'}&nbsp;
            <Link href="/analytics/tokens">Tokens</Link>&nbsp;
            {'> '}&nbsp;
          </div>
          <div className="text-xs font-bold text-high-emphesis">{token?.symbol}</div>
        </div>
      </div>
      <Background background="token">
        <div className="grid items-center justify-between grid-cols-1 gap-x-4 gap-y-2 md:grid-cols-2">
          <div className="items-center -mt-4 space-y-6">
            <button onClick={() => router.back()} className="text-sm text-blue">
              {'<'} Go Back
            </button>
            <div className="flex items-center space-x-4">
              <CurrencyLogo className="rounded-full" currency={currency} size={60} />
              <div>
                <div className="text-sm font-medium text-secondary">{token?.symbol}</div>
                <div className="text-lg font-bold text-high-emphesis">{token?.name}</div>
              </div>
              <div className="rounded-3xl text-sm bg-[#414a6c] py-px px-2 flex items-center space-x-1">
                <div>{shortenAddress(id)}</div>
                <div className="cursor-pointer" onClick={() => setCopied(id)}>
                  {isCopied ? <CheckIcon height={16} /> : <DuplicateIcon height={16} className="scale-x-[-1]" />}
                </div>
              </div>
            </div>
          </div>
          <div className="flex space-x-12">
            <div className="flex flex-col">
              <div>Price</div>
              <div className="flex items-center space-x-2">
                <div className="text-lg font-medium text-high-emphesis">{formatNumber(price ?? 0, true)}</div>
                <ColoredNumber number={priceChange} percent={true} />
              </div>
            </div>
            <div className="flex flex-col">
              <div>Market Cap</div>
              <div className="flex items-center space-x-2">
                <div className="text-lg font-medium text-high-emphesis">
                  {formatNumber(price * (totalSupply / 10 ** token?.decimals) ?? 0, true, false)}
                </div>
                <ColoredNumber number={priceChange} percent={true} />
              </div>
            </div>
          </div>
        </div>
      </Background>
      <div className="px-4 pt-4 space-y-4 lg:px-14">
        <div className="text-3xl font-bold text-high-emphesis">Overview</div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <ChartCard
            header="Liquidity"
            subheader={token?.symbol}
            figure={liquidityUSD}
            change={liquidityUSDChange}
            chart={chartData.liquidityChart}
            defaultTimespan="1W"
            timespans={chartTimespans}
          />
          <ChartCard
            header="Volume"
            subheader={token?.symbol}
            figure={volumeUSD1d}
            change={volumeUSD1dChange}
            chart={chartData.volumeChart}
            defaultTimespan="1W"
            timespans={chartTimespans}
          />
        </div>
        <div className="flex flex-row justify-between flex-grow space-x-4 overflow-x-auto">
          <InfoCard text="Liquidity (24H)" number={liquidityUSD} percent={liquidityUSDChange} />
          <InfoCard text="Volume (24H)" number={volumeUSD1d} percent={volumeUSD1dChange} />
          <InfoCard text="Fees (24H)" number={volumeUSD1d * 0.003} percent={volumeUSD1dChange} />
        </div>
        <div className="text-2xl font-bold text-high-emphesis">Information</div>
        <div className="px-4 text-sm leading-48px text-high-emphesis">
          <table className="w-full table-fixed">
            <thead className="border-b border-gray-900">
              <tr>
                <td>Name</td>
                <td>Symbol</td>
                <td>Address</td>
                <td className="flex justify-end w-full">Etherscan</td>
              </tr>
            </thead>
            <tbody className="border-b border-gray-900">
              <tr>
                <td>{token?.name}</td>
                <td>{token?.symbol}</td>
                <td>
                  <div className="w-11/12 overflow-hidden cursor-pointer overflow-ellipsis whitespace-nowrap">{id}</div>
                </td>
                <td>
                  <a
                    className="flex flex-row items-center justify-end space-x-1 text-purple"
                    href={getExplorerLink(chainId, id, 'token')}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <div>View</div>
                    <LinkIcon size={16} />
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div>
          <div className="text-2xl font-bold text-high-emphesis">Top Pairs</div>
          <PairList pairs={tokenPairsFormatted} type="all" />
        </div>
        <LegacyTransactions pairs={tokenPairs ? tokenPairs.map((pair) => pair.id) : []} />
      </div>
    </AnalyticsContainer>
  )
}
