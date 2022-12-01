import { ChainId } from '@figswap/core-sdk'
import { DEFAULT_TXN_DISMISS_MS } from 'app/constants'
import LibUpdater from 'lib/hooks/transactions/updater'
import { useCallback, useMemo } from 'react'
import { useActiveWeb3React } from 'services/web3'
import { useAppDispatch, useAppSelector } from 'state/hooks'

import { useAddPopup } from '../application/hooks'
import { checkedTransaction, finalizeTransaction, updatePrivateTxStatus } from './actions'
import { sendRevertTransactionLog } from './sentryLogger'

export default function Updater() {
  const { chainId } = useActiveWeb3React()
  const addPopup = useAddPopup()
  const dispatch = useAppDispatch()

  const state = useAppSelector((state) => state.transactions)
  const transactions = useMemo(() => (chainId ? state[chainId as ChainId] ?? {} : {}), [chainId, state])
  const pendingTransactions = useMemo(() => (chainId ? state[chainId] ?? {} : {}), [chainId, state])

  const onCheck = useCallback(
    ({ chainId, hash, blockNumber }) => dispatch(checkedTransaction({ chainId, hash, blockNumber })),
    [dispatch]
  )

  const onPrivateTxStatusCheck = useCallback(
    ({ chainId, hash, blockNumber, status }) => {
      dispatch(
        updatePrivateTxStatus({
          chainId,
          hash,
          blockNumber,
          status,
        })
      )
    },
    [dispatch]
  )

  const onReceipt = useCallback(
    ({ chainId, hash, receipt }) => {
      dispatch(
        finalizeTransaction({
          chainId,
          hash,
          receipt: {
            blockHash: receipt.blockHash,
            blockNumber: receipt.blockNumber,
            contractAddress: receipt.contractAddress,
            from: receipt.from,
            status: receipt.status,
            to: receipt.to,
            transactionHash: receipt.transactionHash,
            transactionIndex: receipt.transactionIndex,
          },
        })
      )

      if (receipt.status === 0) {
        sendRevertTransactionLog(hash, state.lastRouteInfo.payload.info)
      }

      addPopup(
        {
          txn: { hash, success: receipt.status === 1, summary: transactions[hash]?.summary },
        },
        hash,
        DEFAULT_TXN_DISMISS_MS
      )
    },
    [addPopup, dispatch, transactions, state.lastRouteInfo]
  )

  return (
    <LibUpdater
      pendingTransactions={pendingTransactions}
      onCheck={onCheck}
      onPrivateTxStatusCheck={onPrivateTxStatusCheck}
      onReceipt={onReceipt}
    />
  )
}
