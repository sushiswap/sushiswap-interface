import { ARCHER_RELAY_URI, ExtendedEther } from '../../constants'
import { ChainId, CurrencyAmount, Ether } from '@sushiswap/sdk'
import { CheckCircle, Triangle, X } from 'react-feather'
import React, { useCallback, useMemo } from 'react'

import { AppDispatch } from '../../state'
import ExternalLink from '../ExternalLink'
import Loader from '../Loader'
import { RowFixed } from '../Row'
import { TransactionDetails } from '../../state/transactions/reducer'
import { finalizeTransaction } from '../../state/transactions/actions'
import { getExplorerLink } from '../../functions/explorer'
import styled from 'styled-components'
import { useActiveWeb3React } from '../../hooks/useActiveWeb3React'
import { useAllTransactions } from '../../state/transactions/hooks'
import { useDispatch } from 'react-redux'

const TransactionWrapper = styled.div``

const TransactionStatusText = styled.div`
  margin-right: 0.5rem;
  display: flex;
  align-items: center;
  :hover {
    text-decoration: underline;
  }
`

const TransactionState = styled(ExternalLink)<{
  pending: boolean
  success?: boolean
}>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-decoration: none !important;
  // border-radius: ${({ theme }) => theme.borderRadius};
  padding: 0.25rem 0rem;
  font-weight: 500;
  font-size: 0.825rem;
  // color: ${({ theme }) => theme.primary1};
`

const TransactionStateNoLink = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-decoration: none !important;
  padding-bottom: 0.25rem;
  font-weight: 500;
  font-size: 0.825rem;
  // color: ${({ theme }) => theme.primary1};
`

const TransactionCancel = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  :hover {
    text-decoration: underline;
  }
`

const TransactionExpiredBadge = styled.span`
  // color:  ${({ theme }) => theme.red1};
`

const TransactionCancelledBadge = styled.span`
  // color:  ${({ theme }) => theme.red3};
`

const TransactionRemainingTimeBadge = styled.span`
  // color:  ${({ theme }) => theme.primary1};
`

const IconWrapper = styled.div<{
  pending: boolean
  success?: boolean
  cancelled?: boolean
}>`
  // color: ${({ pending, success, cancelled, theme }) =>
    pending ? theme.primary1 : success ? theme.green1 : cancelled ? theme.red3 : theme.red1};
`

const calculateSecondsUntilDeadline = (tx: TransactionDetails): number => {
  if (tx?.archer?.deadline && tx?.addedTime) {
    const millisecondsUntilUntilDeadline = tx.archer.deadline * 1000 - Date.now()
    return millisecondsUntilUntilDeadline < 0 ? -1 : Math.ceil(millisecondsUntilUntilDeadline / 1000)
  }
  return -1
}

export default function Transaction({ hash }: { hash: string }): any {
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
    <TransactionWrapper>
      <TransactionState href={getExplorerLink(chainId, hash, 'transaction')} pending={pending} success={success}>
        <RowFixed>
          <TransactionStatusText>{summary ?? hash} ↗</TransactionStatusText>
        </RowFixed>
        <IconWrapper pending={pending} success={success} cancelled={cancelled}>
          {pending ? (
            <Loader />
          ) : success ? (
            <CheckCircle size="16" />
          ) : cancelled ? (
            <X size="16" />
          ) : (
            <Triangle size="16" />
          )}
        </IconWrapper>
      </TransactionState>
      {archer && (
        <TransactionStateNoLink>
          {`...#${archer.nonce} - Tip ${CurrencyAmount.fromRawAmount(
            Ether.onChain[ChainId.MAINNET],
            archer.ethTip
          ).toSignificant(6)} ETH`}
          {pending ? (
            <>
              {secondsUntilDeadline >= 60 ? (
                <TransactionRemainingTimeBadge>
                  &#128337; {`${Math.ceil(secondsUntilDeadline / 60)} mins`}{' '}
                </TransactionRemainingTimeBadge>
              ) : (
                <TransactionRemainingTimeBadge>&#128337; {`<1 min`} </TransactionRemainingTimeBadge>
              )}
              <TransactionCancel onClick={cancelPending}>Cancel</TransactionCancel>
            </>
          ) : cancelled ? (
            <TransactionCancelledBadge>Cancelled</TransactionCancelledBadge>
          ) : (
            !mined && expired && <TransactionExpiredBadge>Expired</TransactionExpiredBadge>
          )}
        </TransactionStateNoLink>
      )}
    </TransactionWrapper>
  )
}
