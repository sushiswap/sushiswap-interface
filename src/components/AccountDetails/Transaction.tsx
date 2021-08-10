import { ChainId, CurrencyAmount, Ether } from '@sushiswap/sdk'
import { CheckCircleIcon, ExclamationIcon, XCircleIcon } from '@heroicons/react/outline'
import React, { FC, useCallback, useMemo } from 'react'

import { ARCHER_RELAY_URI } from '../../constants'
import { AppDispatch } from '../../state'
import ExternalLink from '../ExternalLink'
import Loader from '../Loader'
import { TransactionDetails } from '../../state/transactions/reducer'
import { finalizeTransaction } from '../../state/transactions/actions'
import { getExplorerLink } from '../../functions/explorer'
import { useActiveWeb3React } from '../../hooks/useActiveWeb3React'
import { useAllTransactions } from '../../state/transactions/hooks'
import { useDispatch } from 'react-redux'
import { classNames } from '../../functions'
import Typography from '../Typography'
import { useLingui } from '@lingui/react'
import { t } from '@lingui/macro'

const calculateSecondsUntilDeadline = (tx: TransactionDetails): number => {
  if (tx?.archer?.deadline && tx?.addedTime) {
    const millisecondsUntilUntilDeadline = tx.archer.deadline * 1000 - Date.now()
    return millisecondsUntilUntilDeadline < 0 ? -1 : Math.ceil(millisecondsUntilUntilDeadline / 1000)
  }
  return -1
}

const Transaction: FC<{ hash: string }> = ({ hash }) => {
  const { i18n } = useLingui()
  const { chainId } = useActiveWeb3React()
  const allTransactions = useAllTransactions()
  const dispatch = useDispatch<AppDispatch>()

  const tx = allTransactions?.[hash]
  const summary = tx?.summary
  const pending = !tx?.receipt
  const success = !pending && tx && (tx.receipt?.status === 1 || typeof tx.receipt?.status === 'undefined')
  const archer = tx?.archer
  const secondsUntilDeadline = useMemo(() => calculateSecondsUntilDeadline(tx), [tx])
  const mined = tx?.receipt && tx.receipt.status !== 1337
  const cancelled = tx?.receipt && tx.receipt.status === 1337
  const expired = secondsUntilDeadline === -1

  const cancelPending = useCallback(() => {
    const relayURI = ARCHER_RELAY_URI[chainId]
    if (!relayURI) return

    const body = JSON.stringify({
      method: 'archer_cancelTx',
      tx: archer?.rawTransaction,
    })
    fetch(relayURI, {
      method: 'POST',
      body,
      headers: {
        Authorization: process.env.NEXT_PUBLIC_ARCHER_API_KEY ?? '',
        'Content-Type': 'application/json',
      },
    })
      .then(() => {
        dispatch(
          finalizeTransaction({
            chainId,
            hash,
            receipt: {
              blockHash: '',
              blockNumber: 0,
              contractAddress: '',
              from: '',
              status: 1337,
              to: '',
              transactionHash: '',
              transactionIndex: 0,
            },
          })
        )
      })
      .catch((err) => console.error(err))
  }, [dispatch, chainId, archer, hash])

  if (!chainId) return null

  return (
    <div className="flex flex-col w-full gap-2 px-3 py-1 rounded bg-dark-800">
      <ExternalLink href={getExplorerLink(chainId, hash, 'transaction')} className="flex items-center gap-2">
        <Typography variant="sm" className="flex items-center hover:underline py-0.5">
          {summary ?? hash} ↗
        </Typography>
        <div
          className={classNames(
            pending ? 'text-primary' : success ? 'text-green' : cancelled ? 'text-red' : 'text-red'
          )}
        >
          {pending ? (
            <Loader />
          ) : success ? (
            <CheckCircleIcon width={16} height={16} />
          ) : cancelled ? (
            <XCircleIcon width={16} height={16} />
          ) : (
            <ExclamationIcon width={16} height={16} />
          )}
        </div>
      </ExternalLink>
      {archer && (
        <Typography variant="sm" weight={400} className="flex items-center justify-between pb-1 text-decoration-none">
          {`#${archer.nonce} - Tip ${CurrencyAmount.fromRawAmount(
            Ether.onChain(ChainId.MAINNET),
            archer.ethTip
          ).toSignificant(6)} ETH`}
          {pending ? (
            <>
              {secondsUntilDeadline >= 60 ? (
                <span className="text-high-emphesis">&#128337; {`${Math.ceil(secondsUntilDeadline / 60)} mins`} </span>
              ) : (
                <span className="text-high-emphesis">&#128337; {`<1 min`} </span>
              )}
              <div className="flex items-center cursor-pointer" onClick={cancelPending}>
                {i18n._(t`Cancel`)}
              </div>
            </>
          ) : cancelled ? (
            <span className="text-red">{i18n._(t`Cancelled`)}</span>
          ) : (
            !mined && expired && <span className="text-red">{i18n._(t`Expired`)}</span>
          )}
        </Typography>
      )}
    </div>
  )
}

export default Transaction
