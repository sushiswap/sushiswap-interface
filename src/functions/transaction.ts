/**
 *
 * @class PrivateTransaction
 * @license GPL-3.0-Only
 * @see {@link https://docs.manifoldfinance.com}
 * @since 2022.03
 * @version 0.1.0
 *
 */

import { PrivateTxState } from 'app/entities/SushiGuard'
import {} from 'app/functions/transaction'
import { TransactionDetails } from 'app/state/transactions/reducer'

/**
 *
 * @export
 * @param {TransactionDetails} [tx]
 * @return {boolean}
 */
export function isTxPending(tx?: TransactionDetails): boolean {
  if (!tx?.privateTx) return !tx?.receipt
  return tx?.privateTx?.state === PrivateTxState.UNCHECKED || tx?.privateTx?.state === PrivateTxState.PROCESSING
}

/**
 *
 * @export
 * @param {TransactionDetails} [tx]
 * @return {boolean}
 */
export function isTxSuccessful(tx?: TransactionDetails): boolean {
  if (!tx?.privateTx) return !!tx && (tx.receipt?.status === 1 || typeof tx.receipt?.status === 'undefined')
  return (
    tx?.privateTx?.state === PrivateTxState.OK &&
    !!tx &&
    (tx.receipt?.status === 1 || typeof tx.receipt?.status === 'undefined')
  )
}

/**
 *
 * @export
 * @param {TransactionDetails} [tx]
 * @return {boolean}
 */
export function isTxIndeterminate(tx?: TransactionDetails): boolean {
  if (!tx?.privateTx) return false
  return tx?.privateTx?.state === PrivateTxState.INDETERMINATE
}

/**
 *
 * @export
 * @param {TransactionDetails} [tx]
 * @return {number}
 */
export function txMinutesPending(tx?: TransactionDetails): number {
  if (!tx) return 0
  return (new Date().getTime() - tx.addedTime) / 1000 / 60
}

/**
 *
 *
 * @export
 * @param {TransactionDetails} [tx]
 * @return {boolean}
 */
export function isTxExpired(tx?: TransactionDetails): boolean {
  if (!tx) return false
  return txMinutesPending(tx) > 60
}
