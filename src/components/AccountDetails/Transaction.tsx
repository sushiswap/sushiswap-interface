import { CheckCircleIcon, ExclamationIcon, ShieldCheckIcon, XCircleIcon } from '@heroicons/react/outline'
import { BadgeCheckIcon, ChevronDoubleRightIcon, EmojiHappyIcon } from '@heroicons/react/solid'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import ExternalLink from 'app/components/ExternalLink'
import Loader from 'app/components/Loader'
import QuestionHelper from 'app/components/QuestionHelper'
import Typography from 'app/components/Typography'
import { PrivateTxState } from 'app/entities/SushiGuard'
import { classNames, getExplorerLink } from 'app/functions'
import { isTxPending } from 'app/functions/transactions'
import { useActiveWeb3React } from 'app/services/web3'
import { useAllTransactions } from 'app/state/transactions/hooks'
import React, { FC } from 'react'

const Transaction: FC<{ hash: string }> = ({ hash }) => {
  const { i18n } = useLingui()
  const { chainId } = useActiveWeb3React()
  const allTransactions = useAllTransactions()

  const tx = allTransactions?.[hash]
  const summary = tx?.summary
  const privateTx = tx?.privateTx
  const pending = isTxPending(tx)
  const indeterminate = tx?.privateTx?.state === PrivateTxState.INDETERMINATE ?? false
  const error = tx?.privateTx?.state === PrivateTxState.ERROR ?? false
  const success =
    !pending &&
    !indeterminate &&
    !error &&
    tx &&
    (tx.receipt?.status === 1 || typeof tx.receipt?.status === 'undefined')
  const cancelled = tx?.receipt && tx.receipt.status === 1337

  if (!chainId) return null

  return (
    <div className="flex flex-col w-full py-1">
      <div className="flex gap-1">
        <ExternalLink href={getExplorerLink(chainId, hash, 'transaction')} className="flex items-center gap-2">
          <div
            className={classNames(
              pending
                ? 'text-primary'
                : success
                ? 'text-green'
                : indeterminate
                ? 'text-yellow'
                : cancelled
                ? 'text-red'
                : 'text-red'
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
          <Typography variant="xs" weight={700} className="flex gap-1 items-center hover:underline py-0.5">
            {summary ?? hash}
          </Typography>
        </ExternalLink>

        {privateTx && (
          <>
            <QuestionHelper
              text={i18n._(t`This transaction has been sent using SushiGuard`)}
              icon={<ShieldCheckIcon className="text-green" width={14} />}
            />

            {privateTx.status && (
              <>
                {privateTx.status.receivedAt && (
                  <QuestionHelper
                    text={i18n._(t`Transaction successfully received by SushiGuard`)}
                    icon={<BadgeCheckIcon className="text-green" width={14} />}
                  />
                )}

                {privateTx.status.relayedAt && (
                  <>
                    <QuestionHelper
                      text={i18n._(t`Transaction relayed by SushiGuard to downstream miners`)}
                      icon={
                        <ChevronDoubleRightIcon
                          className={privateTx.status.relayFailure ? 'text-red' : 'text-green'}
                          width={14}
                        />
                      }
                    />
                  </>
                )}

                {privateTx.status.minedAt && (
                  <QuestionHelper
                    text={i18n._(t`Transaction mined sucessfully`)}
                    icon={<EmojiHappyIcon className="text-green" width={14} />}
                  />
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default Transaction
