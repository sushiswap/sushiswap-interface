import { TransactionData } from '../../services/graph'
import { formatDateAgo, formatNumber } from '../../functions'

export const generateSummaryString = (
  pageIndex: number,
  pageSize: number,
  totalTransactions: number,
  noTransactionsString: string,
  isLoading: boolean,
  loadingString: string
): string => {
  if (totalTransactions === 0) {
    if (isLoading) return loadingString
    return noTransactionsString
  } else {
    const startingNumber = pageIndex * pageSize + 1
    const endingNumber = pageIndex * pageSize + pageSize
    return `${startingNumber}-${
      endingNumber < totalTransactions ? endingNumber : totalTransactions
    } of ${totalTransactions}`
  }
}

export const shortenAddress = (address: string): string => {
  const start = address.substring(0, 6)
  const end = address.substring(address.length - 4)
  return `${start}...${end}`
}

interface FormattedTransactions {
  address: string
  incomingAmt: string
  outgoingAmt: string
  time: string
  value: string
  type: string
}

export const transactionDataFormatter = (rawData: TransactionData[]): FormattedTransactions[] => {
  return rawData.map((tx) => {
    const props =
      tx.amount0In === '0'
        ? {
            type: `Swap ${tx.pair.token1.symbol} for ${tx.pair.token0.symbol}`,
            incomingAmt: `${formatNumber(tx.amount1In)} ${tx.pair.token1.symbol}`,
            outgoingAmt: `${formatNumber(tx.amount0Out)} ${tx.pair.token0.symbol}`,
          }
        : {
            type: `Swap ${tx.pair.token0.symbol} for ${tx.pair.token1.symbol}`,
            incomingAmt: `${formatNumber(tx.amount0In)} ${tx.pair.token0.symbol}`,
            outgoingAmt: `${formatNumber(tx.amount1Out)} ${tx.pair.token1.symbol}`,
          }
    return {
      value: formatNumber(tx.amountUSD, true),
      address: tx.to,
      time: formatDateAgo(new Date(Number(tx.timestamp) * 1000)),
      ...props,
    }
  })
}
