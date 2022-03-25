import { createReducer } from '@reduxjs/toolkit'
import { ChainId } from '@sushiswap/core-sdk'
import { PrivateTxState, PrivateTxStatus } from 'app/entities/SushiGuard'
import { txMinutesPending } from 'app/functions/transactions'

import {
  addTransaction,
  checkedTransaction,
  clearAllTransactions,
  finalizeTransaction,
  SerializableTransactionReceipt,
  updatePrivateTxStatus,
} from './actions'

const now = () => new Date().getTime()

export interface TransactionDetails {
  hash: string
  approval?: { tokenAddress: string; spender: string }
  summary?: string
  claim?: { recipient: string }
  receipt?: SerializableTransactionReceipt
  lastCheckedBlockNumber?: number
  addedTime: number
  confirmedTime?: number
  from: string
  privateTx?: {
    state: PrivateTxState
    status?: PrivateTxStatus
  }
}

type txHash = string

export type TransactionState = { [key in ChainId]?: Record<txHash, TransactionDetails> }

export const initialState: TransactionState = {}

export default createReducer(initialState, (builder) =>
  builder
    .addCase(
      addTransaction,
      // @ts-expect-error
      (transactions, { payload: { chainId, from, hash, approval, summary, claim, privateTx = false } }) => {
        if (transactions[chainId]?.[hash]) {
          throw Error('Attempted to add existing transaction.')
        }
        const txs = transactions[chainId] ?? {}
        txs[hash] = {
          hash,
          approval,
          summary,
          claim,
          from,
          addedTime: now(),
          ...(privateTx ? { privateTx: { state: PrivateTxState.UNCHECKED, status: undefined } } : {}),
        }
        transactions[chainId] = txs
      }
    )
    .addCase(clearAllTransactions, (transactions, { payload: { chainId } }) => {
      if (!transactions[chainId]) return
      transactions[chainId] = {}
    })
    .addCase(checkedTransaction, (transactions, { payload: { chainId, hash, blockNumber } }) => {
      const tx = transactions[chainId]?.[hash]
      if (!tx) {
        return
      }
      if (!tx.lastCheckedBlockNumber) {
        tx.lastCheckedBlockNumber = blockNumber
      } else {
        tx.lastCheckedBlockNumber = Math.max(blockNumber, tx.lastCheckedBlockNumber)
      }
    })
    .addCase(finalizeTransaction, (transactions, { payload: { hash, chainId, receipt } }) => {
      const tx = transactions[chainId]?.[hash]
      if (!tx) {
        return
      }
      tx.receipt = receipt
      tx.confirmedTime = now()
    })
    .addCase(updatePrivateTxStatus, (transactions, { payload: { chainId, hash, status } }) => {
      const tx = transactions[chainId]?.[hash]
      if (!tx) return
      if (!tx.privateTx) throw new Error('Invalid update private tx call to a non private tx')

      const prevState = tx.privateTx?.state
      const prevStatus = tx.privateTx?.status
      const minutesElapsed = txMinutesPending(tx)

      // If previous state was a definitive one, we skip processing new events
      if (
        prevState &&
        (prevState === PrivateTxState.ERROR ||
          prevState === PrivateTxState.INDETERMINATE ||
          prevState === PrivateTxState.OK)
      )
        return

      // derive new private tx state from latest received status
      let state = PrivateTxState.PROCESSING

      // OK - Relay received the Tx && all downstream miners accepted without complains && tx mined successfully
      if (status.receivedAt && status.relayedAt && !status.relayFailure && status.minedAt) state = PrivateTxState.OK

      // ERROR
      if (
        status.receivedAt &&
        status.relayFailure &&
        status.relayResponses &&
        Object.values(status.relayResponses).reduceRight((prev, current) => {
          if (prev) return prev
          if (current.error || current.response.error) return true
          return false
        }, false)
      )
        state = PrivateTxState.ERROR

      // INDETERMINATE
      if (status.receivedAt && status.relayedAt && status.relayFailure && status.minedAt)
        state = PrivateTxState.INDETERMINATE

      // If more than 20 minutes has passed, better to mark this TX as indeterminate
      if (minutesElapsed > 3) state = PrivateTxState.INDETERMINATE

      // update new state
      tx.privateTx.state = state ?? PrivateTxState.UNCHECKED
      tx.privateTx.status = status
    })
)
