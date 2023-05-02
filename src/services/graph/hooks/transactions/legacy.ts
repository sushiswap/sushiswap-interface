import { ChainId } from '@sushiswap/core-sdk'
import { Transactions } from 'app/features/transactions/types'
import { formatNumber } from 'app/functions'
import { getTransactions } from 'app/services/graph/fetchers'
import stringify from 'fast-json-stable-stringify'
import { useMemo } from 'react'
import useSWR from 'swr'

export interface LegacyTransactions {
  amountIn: string
  amountOut: string
  amountUSD: string
  id: string
  tokenIn: {
    symbol: string
  }
  tokenOut: {
    symbol: string
  }
  sender: string
  timestamp: string
  to: string
  txHash: string
}

export const legacyTransactionDataFormatter = (rawData: LegacyTransactions[]): Transactions[] => {
  return rawData.map((tx) => {
    const props = {
      type: `Swap ${tx.tokenIn.symbol} for ${tx.tokenOut.symbol}`,
      incomingAmt: `${formatNumber(tx.amountIn)} ${tx.tokenIn.symbol}`,
      outgoingAmt: `${formatNumber(tx.amountOut)} ${tx.tokenOut.symbol}`,
    }
    return {
      value: formatNumber(tx.amountUSD, true),
      address: tx.to,
      time: tx.timestamp,
      txHash: tx.id,
      ...props,
    }
  })
}
export const useLegacyTransactions = (chainId?: ChainId, pairs?: string[]) => {
  const variables = { where: { pair_in: pairs } }
  const { data, error, isValidating } = useSWR<LegacyTransactions[]>(
    !!chainId && !!pairs ? ['legacyTransactions', chainId, stringify(variables)] : null,
    // @ts-ignore TYPE NEEDS FIXING
    () => getTransactions(chainId, variables)
  )
  const transactions = useMemo(() => legacyTransactionDataFormatter(data || []), [data])
  return { transactions, error, loading: isValidating }
}
