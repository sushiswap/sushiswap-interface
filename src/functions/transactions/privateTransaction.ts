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
import { TransactionDetails } from 'app/state/transactions/reducer'

/**
 * @summary
 * Basic explanation of the tx state types:
 * UNCHECKED -> Tx status has not been checked and there's no information about it.
 * PROCESSING -> Tx checks are in place until a resolution happens: OK, INDETERMINATE, ERROR.
 * OK -> Relay received the Tx && all downstream miners accepted without complains && tx mined successfully
 * INDETERMINATE -> Relay received correctly the Tx && at least one miner accepted the TX && TX potentially mineable
 * ERROR -> Relay haven't received the TX || none of the miners accepted the Tx || Tx was not mined successfully
 */

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

export function privateTx(tx?: TransactionDetails): boolean {
  return !!tx && (tx.receipt?.status === 1 || typeof tx.receipt?.status === 'undefined')
}

enum privateTxStatus {
  isTxPending,
  isTxSuccessful,
  isTxIndeterminate,
  txMinutesPending,
  isTxExpired,
}
