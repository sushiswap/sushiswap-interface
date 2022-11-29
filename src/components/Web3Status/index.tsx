import Davatar from '@davatar/react'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { NetworkContextName } from 'app/constants'
import { shortenAddress } from 'app/functions'
import { isTxConfirmed, isTxPending } from 'app/functions/transactions'
import useENSName from 'app/hooks/useENSName'
import WalletModal from 'app/modals/WalletModal'
import { useWalletModalToggle } from 'app/state/application/hooks'
import { isTransactionRecent, useAllTransactions } from 'app/state/transactions/hooks'
import { TransactionDetails } from 'app/state/transactions/reducer'
import React, { useMemo } from 'react'
import { useWeb3React } from 'web3-react-core'

import Loader from '../Loader'
import Typography from '../Typography'
import Web3Connect from '../Web3Connect'

// we want the latest one to come first, so return negative if a is after b
function newTransactionsFirst(a: TransactionDetails, b: TransactionDetails) {
  return b.addedTime - a.addedTime
}

// TODO (amiller68): #AccountButtons make Web 3 Status look like design
function Web3StatusInner() {
  const { i18n } = useLingui()
  const { account, library } = useWeb3React()
  const { ENSName, loading } = useENSName(account ?? undefined)
  const allTransactions = useAllTransactions()
  const sortedRecentTransactions = useMemo(() => {
    const txs = Object.values(allTransactions)
    return txs.filter(isTransactionRecent).sort(newTransactionsFirst)
  }, [allTransactions])
  const pending = sortedRecentTransactions.filter(isTxPending).map((tx) => tx.hash)
  const hasPendingTransactions = !!pending.length
  const toggleWalletModal = useWalletModalToggle()

  if (account) {
    return (
      <div
        id="web3-status-connected"
        className="flex items-center gap-2 text-sm rounded-lg hover:bg-[#2E2E2E] hover:text-white p-4"
        onClick={toggleWalletModal}
      >
        {hasPendingTransactions ? (
          <div className="flex items-center justify-between gap-2">
            <div>
              {pending?.length} {i18n._(t`Pending`)}
            </div>{' '}
            <Loader stroke="white" />
          </div>
        ) : (
          <>
            <Davatar
              size={24}
              address={account}
              defaultComponent={
                // TODO (amiller68): #reference smiley.svg
                <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M10 20.0662C15.5228 20.0662 20 15.589 20 10.0662C20 4.54331 15.5228 0.0661621 10 0.0661621C4.47715 0.0661621 0 4.54331 0 10.0662C0 15.589 4.47715 20.0662 10 20.0662ZM5.625 10.0662C6.66053 10.0662 7.5 9.2267 7.5 8.19116C7.5 7.15563 6.66053 6.31616 5.625 6.31616C4.58947 6.31616 3.75 7.15563 3.75 8.19116C3.75 9.2267 4.58947 10.0662 5.625 10.0662ZM16.25 8.19116C16.25 9.2267 15.4105 10.0662 14.375 10.0662C13.3395 10.0662 12.5 9.2267 12.5 8.19116C12.5 7.15563 13.3395 6.31616 14.375 6.31616C15.4105 6.31616 16.25 7.15563 16.25 8.19116ZM6.75095 13.1903C6.40527 12.5927 5.64061 12.3885 5.04304 12.7342C4.44546 13.0798 4.24126 13.8445 4.58694 14.4421C5.66571 16.3069 7.68508 17.5662 10 17.5662C12.315 17.5662 14.3344 16.3069 15.4131 14.4421C15.7588 13.8445 15.5546 13.0798 14.957 12.7342C14.3595 12.3885 13.5948 12.5927 13.2491 13.1903C12.5988 14.3144 11.3865 15.0662 10 15.0662C8.61358 15.0662 7.40123 14.3144 6.75095 13.1903Z"
                    fill="#E8DB31"
                  />
                </svg>
              }
              provider={library}
            />
            <div className="relative flex items-center gap-2 cursor-pointer pointer-events-auto">
              <Typography
                weight={700}
                variant="sm"
                className="font-mono px-1 uppercase tracking-tighter font-medium rounded-full text-xl"
              >
                {ENSName ? ENSName.toUpperCase() : shortenAddress(account)}
              </Typography>
            </div>
          </>
        )}
      </div>
    )
  } else {
    return (
      <Web3Connect
        size="sm"
        className="!bg-dark-900 bg-gradient-to-r from-pink/80 hover:from-pink to-purple/80 hover:to-purple text-white h-[38px]"
      />
    )
  }
}

export default function Web3Status() {
  const { active, account } = useWeb3React()
  const contextNetwork = useWeb3React(NetworkContextName)

  const { ENSName } = useENSName(account ?? undefined)

  const allTransactions = useAllTransactions()

  const sortedRecentTransactions = useMemo(() => {
    const txs = Object.values(allTransactions)
    return txs.filter(isTransactionRecent).sort(newTransactionsFirst)
  }, [allTransactions])

  const pending = sortedRecentTransactions.filter(isTxPending).map((tx) => tx.hash)
  const confirmed = sortedRecentTransactions.filter(isTxConfirmed).map((tx) => tx.hash)

  if (!contextNetwork.active && !active) {
    return null
  }

  return (
    <>
      <Web3StatusInner />
      <WalletModal ENSName={ENSName ?? undefined} pendingTransactions={pending} confirmedTransactions={confirmed} />
    </>
  )
}
