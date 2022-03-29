import { PrivateTxState } from 'app/entities/SushiGuard'
import { TransactionDetails } from 'app/state/transactions/reducer'

export function isTxPending(tx?: TransactionDetails): boolean {
  if (!tx?.privateTx) return !tx?.receipt
  return tx?.privateTx?.state === PrivateTxState.UNCHECKED || tx?.privateTx?.state === PrivateTxState.PROCESSING
}

export function isTxSuccessful(tx?: TransactionDetails): boolean {
  if (!tx?.privateTx) return !!tx && (tx.receipt?.status === 1 || typeof tx.receipt?.status === 'undefined')
  return (
    tx?.privateTx?.state === PrivateTxState.OK &&
    !!tx &&
    (tx.receipt?.status === 1 || typeof tx.receipt?.status === 'undefined')
  )
}

export function isTxIndeterminate(tx?: TransactionDetails): boolean {
  if (!tx?.privateTx) return false
  return tx?.privateTx?.state === PrivateTxState.INDETERMINATE
}

export function txMinutesPending(tx?: TransactionDetails): number {
  if (!tx) return 0
  return (new Date().getTime() - tx.addedTime) / 1000 / 60
}
