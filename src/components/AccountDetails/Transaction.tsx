import { CheckCircleIcon, ExclamationIcon, XCircleIcon } from '@heroicons/react/outline'
import ExternalLink from 'app/components/ExternalLink'
import Loader from 'app/components/Loader'
import Typography from 'app/components/Typography'
import { classNames, getExplorerLink } from 'app/functions'
import { useActiveWeb3React } from 'app/services/web3'
import { useAllTransactions } from 'app/state/transactions/hooks'
import React, { FC } from 'react'

const Transaction: FC<{ hash: string }> = ({ hash }) => {
  const { chainId } = useActiveWeb3React()
  const allTransactions = useAllTransactions()

  const tx = allTransactions?.[hash]
  const summary = tx?.summary
  const pending = !tx?.receipt
  const success = !pending && tx && (tx.receipt?.status === 1 || typeof tx.receipt?.status === 'undefined')
  const cancelled = tx?.receipt && tx.receipt.status === 1337

  if (!chainId) return null

  return (
    <div className="flex flex-col w-full py-1">
      <ExternalLink href={getExplorerLink(chainId, hash, 'transaction')} className="flex items-center gap-2">
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
        <Typography variant="xs" weight={700} className="flex items-center hover:underline py-0.5">
          {summary ?? hash}
        </Typography>
      </ExternalLink>
    </div>
  )
}

export default Transaction
