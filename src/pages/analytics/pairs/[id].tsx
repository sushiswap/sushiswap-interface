import React, { useMemo } from 'react'
import AnalyticsContainer from '../../../features/analytics/AnalyticsContainer'
import { useRouter } from 'next/router'
import DoubleCurrencyLogo from '../../../components/DoubleLogo'
import { useBlock, useNativePrice, useSushiPairs, useTransactions } from '../../../services/graph'
import { useCurrency } from '../../../hooks/Tokens'
import { times } from 'lodash'
import CurrencyLogo from '../../../components/CurrencyLogo'
import { formatNumber, shortenAddress } from '../../../functions'
import PairChartCard from '../../../features/analytics/Pairs/Pair/PairChartCard'
import InfoCard from '../../../features/analytics/InfoCard'
import { ExternalLink as LinkIcon } from 'react-feather'
import Link from 'next/link'
import TransactionList from '../../../features/analytics/Tokens/Token/TransactionList'
import Background from '../../../features/analytics/Background'
import useCopyClipboard from '../../../hooks/useCopyClipboard'
import { DuplicateIcon } from '@heroicons/react/outline'
import { CheckIcon } from '@heroicons/react/solid'
import { useActiveWeb3React } from '../../../hooks'

export default function Pair() {
  const router = useRouter()
  const id = (router.query.id as string).toLowerCase()

  const { chainId } = useActiveWeb3React()

  const [isCopied, setCopied] = useCopyClipboard()

  const block1d = useBlock({ daysAgo: 1, chainId })
  const block2d = useBlock({ daysAgo: 2, chainId })

  const pair = useSushiPairs({ subset: [id], chainId })?.[0]
  const pair1d = useSushiPairs({ subset: [id], block: block1d, shouldFetch: !!block1d, chainId })?.[0]
  const pair2d = useSushiPairs({ subset: [id], block: block2d, shouldFetch: !!block2d, chainId })?.[0]

  const nativePrice = useNativePrice({ chainId })

  // For Transactions
  const transactions = useTransactions({ pairs: [id], chainId })
  const transactionsFormatted = useMemo(
    () =>
      transactions?.map((tx) => {
        const base = {
          value: tx.amountUSD,
          address: tx.to,
          time: new Date(Number(tx.timestamp) * 1000),
        }

        if (tx.amount0In === '0') {
          return {
            symbols: {
              incoming: tx.pair.token1.symbol,
              outgoing: tx.pair.token0.symbol,
            },
            incomingAmt: `${formatNumber(tx.amount1In)} ${tx.pair.token1.symbol}`,
            outgoingAmt: `${formatNumber(tx.amount0Out)} ${tx.pair.token0.symbol}`,
            ...base,
          }
        } else {
          return {
            symbols: {
              incoming: tx.pair.token0.symbol,
              outgoing: tx.pair.token1.symbol,
            },
            incomingAmt: `${formatNumber(tx.amount0In)} ${tx.pair.token0.symbol}`,
            outgoingAmt: `${formatNumber(tx.amount1Out)} ${tx.pair.token1.symbol}`,
            ...base,
          }
        }
      }),
    [transactions]
  )

  // For the logos
  const currency0 = useCurrency(pair?.token0?.id)
  const currency1 = useCurrency(pair?.token1?.id)

  // For the Info Cards
  const liquidityUSDChange = useMemo(() => (pair?.reserveUSD / pair1d?.reserveUSD) * 100 - 100, [pair, pair1d])

  const volumeUSD1d = useMemo(() => pair?.volumeUSD - pair1d?.volumeUSD, [pair, pair1d])
  const volumeUSD2d = useMemo(() => pair1d?.volumeUSD - pair2d?.volumeUSD, [pair1d, pair2d])
  const volumeUSD1dChange = useMemo(() => (volumeUSD1d / volumeUSD2d) * 100 - 100, [volumeUSD1d, volumeUSD2d])

  const tx1d = useMemo(() => pair?.txCount - pair1d?.txCount, [pair, pair1d])
  const tx2d = useMemo(() => pair1d?.txCount - pair2d?.txCount, [pair1d, pair2d])
  const tx1dChange = useMemo(() => (tx1d / tx2d) * 100 - 100, [tx1d, tx2d])

  const avgTrade1d = useMemo(() => volumeUSD1d / tx1d, [volumeUSD1d, tx1d])
  const avgTrade2d = useMemo(() => volumeUSD2d / tx2d, [volumeUSD2d, tx2d])
  const avgTrade1dChange = useMemo(() => (avgTrade1d / avgTrade2d) * 100 - 100, [avgTrade1d, avgTrade2d])

  const utilisation1d = useMemo(() => (volumeUSD1d / pair?.reserveUSD) * 100, [volumeUSD1d, pair])
  const utilisation2d = useMemo(() => (volumeUSD2d / pair1d?.reserveUSD) * 100, [volumeUSD2d, pair1d])
  const utilisation1dChange = useMemo(() => (utilisation1d / utilisation2d) * 100 - 100, [utilisation1d, utilisation2d])

  return (
    <AnalyticsContainer>
      <div className="relative h-8">
        <div className="absolute w-full h-full bg-gradient-to-r from-blue to-pink opacity-5" />
        <div className="absolute flex items-center w-full p-2 lg:pl-14">
          <div className="text-xs font-medium text-secondary">
            <Link href="/analytics/dashboard">Analytics</Link>&nbsp;
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
      <div className="pt-4 space-y-4 lg:px-14">
        <div className="relative h-12">
          <div className="absolute w-full h-full">
            <div className="h-1/3" />
            <div className="opacity-50 w-[210px] h-1/3 bg-gradient-to-r from-blue to-pink" />
          </div>
          <div className="absolute text-3xl font-bold text-high-emphesis">Pool Overview</div>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <PairChartCard type="liquidity" name={`${pair?.token0?.symbol}-${pair?.token1?.symbol}`} pair={id} />
          <PairChartCard type="volume" name={`${pair?.token0?.symbol}-${pair?.token1?.symbol}`} pair={id} />
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
                      <Link href={`/analytics/tokens/${pair?.id}`} passHref>
                        <div className="overflow-hidden cursor-pointer overflow-ellipsis whitespace-nowrap">
                          {pair?.id}
                        </div>
                      </Link>
                      <a href={`https://etherscan.io/address/${pair?.id}`} target="_blank" rel="noreferrer">
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
                      <a href={`https://etherscan.io/address/${pair?.token0?.id}`} target="_blank" rel="noreferrer">
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
                      <a href={`https://etherscan.io/address/${pair?.token1?.id}`} target="_blank" rel="noreferrer">
                        <LinkIcon size={16} />
                      </a>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="text-2xl font-bold text-high-emphesis">Transactions</div>
        <div className="px-4">
          <TransactionList transactions={transactionsFormatted} />
        </div>
      </div>
    </AnalyticsContainer>
  )
}
