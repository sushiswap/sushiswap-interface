import { useRouter } from 'next/router'
import React, { useMemo } from 'react'
import CurrencyLogo from '../../../components/CurrencyLogo'
import AnalyticsContainer from '../../../features/analytics/AnalyticsContainer'
import ColoredNumber from '../../../features/analytics/ColoredNumber'
import PairList from '../../../features/analytics/Pairs/PairList'
import InfoCard from '../../../features/analytics/InfoCard'
import TokenChartCard from '../../../features/analytics/Tokens/Token/TokenChartCard'
import TransactionList from '../../../features/analytics/Tokens/Token/TransactionList'
import { formatNumber } from '../../../functions'
import { useCurrency } from '../../../hooks/Tokens'
import { useBlock, useNativePrice, useToken, useTokenPairs, useTransactions } from '../../../services/graph'
import { ExternalLink as LinkIcon } from 'react-feather'

export default function Token() {
  const router = useRouter()
  const id = (router.query.id as string).toLowerCase()

  const block1d = useBlock({ daysAgo: 1 })
  const block2d = useBlock({ daysAgo: 1 })
  const block1w = useBlock({ daysAgo: 7 })

  // General data (volume, liquidity)
  const nativePrice = useNativePrice()
  const nativePrice1d = useNativePrice({ block: { number: block1d } })

  const token = useToken({ id: id })
  const token1d = useToken({ id: id, block: { number: block1d } })
  const token2d = useToken({ id: id, block: { number: block2d } })

  // Token Pairs
  const tokenPairs = useTokenPairs({ id: id })
  const tokenPairs1d = useTokenPairs({ id: id, block: { number: block1d } })
  const tokenPairs1w = useTokenPairs({ id: id, block: { number: block1w } })
  const tokenPairsFormatted = useMemo(
    () =>
      tokenPairs?.map((pair) => {
        const pair1d = tokenPairs1d?.find((p) => pair.id === p.id) ?? pair
        const pair1w = tokenPairs1w?.find((p) => pair.id === p.id) ?? pair1d

        return {
          pair: {
            token0: pair.token0,
            token1: pair.token1,
          },
          liquidity: pair.reserveUSD,
          volume1d: pair.volumeUSD - pair1d.volumeUSD,
          volume1w: pair.volumeUSD - pair1w.volumeUSD,
        }
      }),
    [tokenPairs, tokenPairs1d, tokenPairs1w]
  )

  // For Transactions
  const transactions = useTransactions({ pairAddresses: tokenPairs?.map((pair) => pair.id) })
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
  const volumeUSD1dChange = useMemo(
    () => ((token?.volumeUSD - token1d?.volumeUSD) / (token1d?.volumeUSD - token2d?.volumeUSD)) * 100 - 100,
    [token, token1d, token2d]
  )

  return (
    <AnalyticsContainer>
      <div>
        <button onClick={() => router.back()} className="font-bold">
          {'<'} Go Back
        </button>
      </div>
      <div className="flex flex-row justify-between">
        <div className="flex flex-row items-center space-x-4">
          <CurrencyLogo currency={currency} size={53} />
          {token?.symbol.length <= 6 ? (
            <div className="text-4xl font-bold">{token?.symbol}</div>
          ) : (
            <div className="hidden text-4xl font-bold sm:block">{token?.symbol}</div>
          )}
        </div>
        <div className="flex flex-row items-center space-x-4">
          <div className="text-4xl font-bold">{formatNumber(price, true)}</div>
          <div>
            <ColoredNumber number={priceChange} percent={true} />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <TokenChartCard type="liquidity" token={id} />
        <TokenChartCard type="volume" token={id} />
      </div>
      <div className="flex flex-row justify-between flex-grow space-x-4 overflow-x-auto">
        <InfoCard text="Liquidity (24H)" number={liquidityUSD} percent={liquidityUSDChange} />
        <InfoCard text="Volume (24H)" number={volumeUSD1d} percent={volumeUSD1dChange} />
        <InfoCard text="Fees (24H)" number={volumeUSD1d * 0.003} percent={volumeUSD1dChange} />
      </div>
      <div>
        <div className="text-2xl font-bold text-high-emphesis">Information</div>
        <div className="px-4 text-sm leading-48px text-high-emphesis">
          <table className="w-full table-fixed">
            <thead className="border-b border-gray-900">
              <tr>
                <td>Name</td>
                <td>Symbol</td>
                <td>Address</td>
                <td>Etherscan</td>
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
                    className="flex flex-row items-center space-x-1 text-purple"
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
      </div>
      <div>
        <div className="text-2xl font-bold text-high-emphesis">Pairs</div>
        <PairList pairs={tokenPairsFormatted} type="all" />
      </div>
      <div>
        <div className="text-2xl font-bold text-high-emphesis">Transactions</div>
        <div className="px-4">
          <TransactionList transactions={transactionsFormatted} />
        </div>
      </div>
    </AnalyticsContainer>
  )
}
