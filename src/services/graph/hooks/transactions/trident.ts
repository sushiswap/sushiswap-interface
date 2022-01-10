import { Transactions } from 'app/features/transactions/types'
import { formatDateAgo, formatNumber } from 'app/functions'
import { getTridentPoolTransactions } from 'app/services/graph/fetchers/pools'
import { useMemo } from 'react'
import useSWR from 'swr'

export interface TridentTransactionRawData {
  amountIn: string
  amountOut: string
  // amountUSD: string // - Waiting on subgraph support
  transaction: {
    timestamp: string
  }
  recipient: string
  tokenIn: {
    metaData: {
      symbol: string
    }
  }
  tokenOut: {
    metaData: {
      symbol: string
    }
  }
}

const tridentRawDataFormatter = (rawData: TridentTransactionRawData[]): Transactions[] => {
  return rawData.map((tx) => {
    return {
      address: tx.recipient,
      incomingAmt: `${formatNumber(tx.amountIn)} ${tx.tokenIn.metaData.symbol}`,
      outgoingAmt: `${formatNumber(tx.amountOut)} ${tx.tokenOut.metaData.symbol}`,
      time: formatDateAgo(new Date(Number(tx.transaction.timestamp) * 1000)),
      value: formatNumber('1000', true), // waiting on subgraph support
      type: `Swap ${tx.tokenOut.metaData.symbol} for ${tx.tokenIn.metaData.symbol}`,
    }
  })
}

export const useTridentTransactions = (poolAddress?: string) => {
  const { data, error, isValidating } = useSWR<{ swaps: TridentTransactionRawData[] }>(
    !!poolAddress ? ['tridentTransactions', poolAddress] : null,
    () => getTridentPoolTransactions(poolAddress)
  )
  const transactions = useMemo(() => tridentRawDataFormatter(data?.swaps || []), [data])
  return { transactions, error, loading: isValidating }
}
