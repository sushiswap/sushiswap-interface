import { useRouter } from 'next/router'
import React, { useEffect, useMemo, useState } from 'react'
import CurrencyLogo from '../../../components/CurrencyLogo'
import AnalyticsContainer from '../../../features/analytics/AnalyticsContainer'
import ColoredNumber from '../../../features/analytics/ColoredNumber'
import PairList from '../../../features/analytics/Pairs/PairList'
import InfoCard from '../../../features/analytics/InfoCard'
import TokenChartCard from '../../../features/analytics/Tokens/Token/TokenChartCard'
import TransactionList from '../../../features/analytics/Tokens/Token/TransactionList'
import { formatNumber, shortenAddress } from '../../../functions'
import { useCurrency } from '../../../hooks/Tokens'
import { useBlock, useNativePrice, useTokenPairs, useTokens, useTransactions } from '../../../services/graph'
import { ExternalLink as LinkIcon } from 'react-feather'
import Background from '../../../features/analytics/Background'
import Link from 'next/link'
import { CheckIcon, DuplicateIcon } from '@heroicons/react/outline'
import useCopyClipboard from '../../../hooks/useCopyClipboard'
import { useTokenContract } from '../../../hooks'

export default function Token() {
  const router = useRouter()
  const id = (router.query.id as string).toLowerCase()

  const [isCopied, setCopied] = useCopyClipboard()

  const [totalSupply, setTotalSupply] = useState(0)
  const tokenContract = useTokenContract(id)

  useEffect(() => {
    const fetch = async () => {
      setTotalSupply(await tokenContract.totalSupply())
    }
    fetch()
  }, [tokenContract])

  const block1d = useBlock({ daysAgo: 1 })
  const block2d = useBlock({ daysAgo: 2 })
  const block1w = useBlock({ daysAgo: 7 })

  // General data (volume, liquidity)
  const nativePrice = useNativePrice()
  const nativePrice1d = useNativePrice({ block: block1d })

  const token = useTokens({ subset: [id] })?.[0]
  const token1d = useTokens({ subset: [id], block: block1d, shouldFetch: !!block1d })?.[0]
  const token2d = useTokens({ subset: [id], block: block2d, shouldFetch: !!block2d })?.[0]

  // Token Pairs
  const tokenPairs = useTokenPairs({ token: id })
  const tokenPairs1d = useTokenPairs({ token: id, block: block1d, shouldFetch: !!block1d })
  const tokenPairs1w = useTokenPairs({ token: id, block: block1w, shouldFetch: !!block1w })
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

  // For Transactions
  const transactions = useTransactions({ pairs: tokenPairs?.map((pair) => pair.id), shouldFetch: !!tokenPairs })
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

  // For the logo
  const currency = useCurrency(token?.id)

  // For the Info Cards
  const price = useMemo(() => token?.derivedETH * nativePrice, [token, nativePrice])
  const priceChange = useMemo(
    () => ((token?.derivedETH * nativePrice) / (token1d?.derivedETH * nativePrice1d)) * 100 - 100,
    [token, token1d, nativePrice, nativePrice1d]
  )

  const liquidityUSD = useMemo(() => token?.liquidity * token?.derivedETH * nativePrice, [token, nativePrice])
  const liquidityUSDChange = useMemo(
    () =>
      ((token?.liquidity * token?.derivedETH * nativePrice) /
        (token1d?.liquidity * token1d?.derivedETH * nativePrice1d)) *
        100 -
      100,
    [token, token1d, nativePrice, nativePrice1d]
  )

  const volumeUSD1d = useMemo(() => token?.volumeUSD - token1d?.volumeUSD, [token, token1d])
  const volumeUSD2d = useMemo(() => token1d?.volumeUSD - token2d?.volumeUSD, [token1d, token2d])
  const volumeUSD1dChange = useMemo(() => (volumeUSD1d / volumeUSD2d) * 100 - 100, [volumeUSD1d, volumeUSD2d])

  return (
    <AnalyticsContainer>
      <div className="relative h-8">
        <div className="absolute w-full h-full bg-gradient-to-r from-blue to-pink opacity-5" />
        <div className="absolute flex items-center w-full p-2 lg:pl-14">
          <div className="text-xs font-medium text-secondary">
            <Link href="/analytics/dashboard">Analytics</Link>&nbsp;
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
      <div className="pt-4 space-y-4 lg:px-14">
        <div className="text-3xl font-bold text-high-emphesis">Overview</div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <TokenChartCard type="liquidity" name={token?.symbol} token={id} />
          <TokenChartCard type="volume" name={token?.symbol} token={id} />
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
                    href={`https://etherscan.io/address/${id}`}
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
        <div>
          <div className="text-2xl font-bold text-high-emphesis">Transactions</div>
          <div className="px-4">
            <TransactionList transactions={transactionsFormatted} />
          </div>
        </div>
      </div>
    </AnalyticsContainer>
  )
}
