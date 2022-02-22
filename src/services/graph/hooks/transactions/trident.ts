import { Transactions } from 'app/features/transactions/types'
import { formatDateAgo, formatNumber } from 'app/functions'

export interface TridentTransactionRawData {
  amountIn: string
  amountOut: string
  // amountUSD: string // - Waiting on subgraph support
  transaction: {
    timestamp: string
  }
  recipient: string
  tokenIn: {
    symbol: string
    price: {
      derivedUSD: string
    }
  }
  tokenOut: {
    symbol: string
  }
}

export function tridentTransactionsRawDataFormatter(rawData: TridentTransactionRawData[]): Transactions[] {
  return rawData.map((tx) => {
    return {
      address: tx.recipient,
      incomingAmt: `${formatNumber(tx.amountIn)} ${tx.tokenIn.symbol}`,
      outgoingAmt: `${formatNumber(tx.amountOut)} ${tx.tokenOut.symbol}`,
      time: formatDateAgo(new Date(Number(tx.transaction.timestamp) * 1000)),
      value: formatNumber(Number(tx.amountIn) * Number(tx.tokenIn.price.derivedUSD), true),
      type: `Swap ${tx.tokenOut.symbol} for ${tx.tokenIn.symbol}`,
    }
  })
}
