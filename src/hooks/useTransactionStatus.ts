import { isTransactionRecent, useAllTransactions } from 'app/state/transactions/hooks'
import { TransactionDetails } from 'app/state/transactions/reducer'
import { useEffect, useMemo, useState } from 'react'

// we want the latest one to come first, so return negative if a is after b
function newTransactionsFirst(a: TransactionDetails, b: TransactionDetails) {
  return b.addedTime - a.addedTime
}

const useTransactionStatus = () => {
  const [pendingTXStatus, setPendingTXStatus] = useState<any>(false)

  // Determine if change in transactions, if so, run query again
  const allTransactions = useAllTransactions()
  const sortedRecentTransactions = useMemo(() => {
    const txs = Object.values(allTransactions)
    return txs.filter(isTransactionRecent).sort(newTransactionsFirst)
  }, [allTransactions])
  const pending = sortedRecentTransactions.filter((tx) => !tx.receipt).map((tx) => tx.hash)
  const hasPendingTransactions = !!pending.length

  useEffect(() => {
    setPendingTXStatus(hasPendingTransactions)
  }, [hasPendingTransactions])

  return pendingTXStatus
}

export const useTransactionStatusByHash = (txHash: string) => {
  const allTransactions = useAllTransactions()

  const tx = allTransactions?.[txHash]
  const pending = !tx?.receipt
  const success = !pending && tx && (tx.receipt?.status === 1 || typeof tx.receipt?.status === 'undefined')
  const cancelled = (tx?.receipt && tx.receipt.status === 1337) ?? false
  const failed = !pending && !success && !cancelled

  return useMemo(
    () => ({
      pending,
      success,
      cancelled,
      failed,
    }),
    [cancelled, failed, pending, success]
  )
}

export default useTransactionStatus
