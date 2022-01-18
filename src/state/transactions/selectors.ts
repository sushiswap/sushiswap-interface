import { createSelector } from '@reduxjs/toolkit'
import { AppState } from 'app/state'
import { selectWeb3Context, Web3ReactContext } from 'app/state/global/web3ContextSlice'
import { TransactionState } from 'app/state/transactions/reducer'

type TransactionStatus = 'PENDING' | 'SUCCESS' | 'CANCELLED' | 'FAILED'
type TxHash = string

export const selectTransactions = (state: AppState) => state.transactions
const filterByTx = (state: AppState, tx: TxHash) => tx

const _selectTxStatus = createSelector(
  [selectTransactions, selectWeb3Context, filterByTx],
  (transactions: TransactionState, web3Context: Web3ReactContext, txHash): TransactionStatus => {
    const tx = web3Context.chainId ? transactions[web3Context.chainId]?.[txHash] : undefined
    return !tx?.receipt
      ? 'PENDING'
      : tx && (tx.receipt?.status === 1 || typeof tx.receipt?.status === 'undefined')
      ? 'SUCCESS'
      : tx.receipt.status === 1337
      ? 'CANCELLED'
      : 'FAILED'
  },
  {
    memoizeOptions: {
      /* By default the cache contains 1 value. Increasing this makes a number of tx statuses being cached. */
      maxSize: 10,
    },
  }
)

export const selectTxStatus = (txHash: string) => (state: AppState) => _selectTxStatus(state, txHash)
