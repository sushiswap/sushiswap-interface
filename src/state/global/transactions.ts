import { TransactionDetails } from 'app/state/transactions/reducer'
import { atom, selectorFamily } from 'recoil'

export const initializedTransactionsAtom = atom<{ [txHash: string]: TransactionDetails }>({
  key: 'initializedTransactionsAtom',
  default: {},
})

interface TransactionState {
  pending: boolean
  success: boolean
  cancelled: boolean
  failed: boolean
}

type TxHash = string

export const transactionStateSelector = selectorFamily<TransactionState, TxHash>({
  key: 'initializedTransactionStateSelectorFamily',
  get:
    (txHash) =>
    ({ get }) => {
      const initializedTransactions = get(initializedTransactionsAtom)
      const tx = txHash && initializedTransactions ? initializedTransactions[txHash] : undefined
      const pending = !tx?.receipt
      const success = !pending && tx && (tx.receipt?.status === 1 || typeof tx.receipt?.status === 'undefined')
      const cancelled = (tx?.receipt && tx.receipt.status === 1337) ?? false
      const failed = !pending && !success && !cancelled

      return { pending, success, cancelled, failed }
    },
})
