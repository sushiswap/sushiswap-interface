import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { AbstractConnector } from '@web3-react/abstract-connector'
import { useWeb3React } from '@web3-react/core'
import { injected } from 'app/config/wallets'
import { NetworkContextName } from 'app/constants'
import { shortenAddress } from 'app/functions'
import useENSName from 'app/hooks/useENSName'
import WalletModal from 'app/modals/WalletModal'
import { useWalletModalToggle } from 'app/state/application/hooks'
import { isTransactionRecent, useAllTransactions } from 'app/state/transactions/hooks'
import { TransactionDetails } from 'app/state/transactions/reducer'
import Image from 'next/image'
import React, { useMemo } from 'react'

import Loader from '../Loader'
import Web3Connect from '../Web3Connect'

// we want the latest one to come first, so return negative if a is after b
function newTransactionsFirst(a: TransactionDetails, b: TransactionDetails) {
  return b.addedTime - a.addedTime
}

const SOCK = (
  <span role="img" aria-label="has socks emoji" style={{ marginTop: -4, marginBottom: -4 }}>
    🧦
  </span>
)

// eslint-disable-next-line react/prop-types
function StatusIcon({ connector }: { connector: AbstractConnector }) {
  if (connector === injected) {
    return <Image src="/chef.svg" alt="Injected (MetaMask etc...)" width={20} height={20} />
    // return <Identicon />
  } else if (connector.constructor.name === 'WalletConnectConnector') {
    return (
      <div className="flex flex-col items-center justify-center w-4 h-4 flex-nowrap">
        <Image src="/images/wallets/wallet-connect.png" alt={'Wallet Connect'} width="16px" height="16px" />
      </div>
    )
  } else if (connector.constructor.name === 'LatticeConnector') {
    return (
      <div className="flex flex-col items-center justify-center w-4 h-4 flex-nowrap">
        <Image src="/images/wallets/lattice.png" alt={'Lattice'} width="16px" height="16px" />
      </div>
    )
  } else if (connector.constructor.name === 'WalletLinkConnector') {
    return (
      <div className="flex flex-col items-center justify-center w-4 h-4 flex-nowrap">
        <Image src="/images/wallets/coinbase.svg" alt={'Coinbase Wallet'} width="16px" height="16px" />
      </div>
    )
  } else if (connector.constructor.name === 'FortmaticConnector') {
    return (
      <div className="flex flex-col items-center justify-center w-4 h-4 flex-nowrap">
        <Image src="/images/wallets/fortmatic.png" alt={'Fortmatic'} width="16px" height="16px" />
      </div>
    )
  } else if (connector.constructor.name === 'PortisConnector') {
    return (
      <div className="flex flex-col items-center justify-center w-4 h-4 flex-nowrap">
        <Image src="/images/wallets/portis.png" alt={'Portis'} width="16px" height="16px" />
      </div>
    )
  } else if (connector.constructor.name === 'KeystoneConnector') {
    return (
      <div className="flex flex-col items-center justify-center w-4 h-4 flex-nowrap">
        <Image src="/images/wallets/keystone.png" alt={'Keystone'} width="16px" height="16px" />
      </div>
    )
  } else if (connector.constructor.name === 'CloverConnector') {
    return (
      <div className="flex flex-col items-center justify-center w-4 h-4 flex-nowrap">
        <Image src="/images/wallets/clover.svg" alt={'Clover'} width="16px" height="16px" />
      </div>
    )
  }
  return null
}

function Web3StatusInner() {
  const { i18n } = useLingui()
  const { account, connector } = useWeb3React()

  const { ENSName } = useENSName(account ?? undefined)

  const allTransactions = useAllTransactions()

  const sortedRecentTransactions = useMemo(() => {
    const txs = Object.values(allTransactions)
    return txs.filter(isTransactionRecent).sort(newTransactionsFirst)
  }, [allTransactions])

  const pending = sortedRecentTransactions
    .filter((tx) => {
      if (tx.receipt) {
        return false
      } else {
        return true
      }
    })
    .map((tx) => tx.hash)

  const hasPendingTransactions = !!pending.length

  const toggleWalletModal = useWalletModalToggle()

  if (account) {
    return (
      <div
        id="web3-status-connected"
        className="flex items-center px-3 py-2 text-sm rounded-lg bg-dark-1000 text-primary"
        onClick={toggleWalletModal}
      >
        {hasPendingTransactions ? (
          <div className="flex items-center justify-between">
            <div className="pr-2">
              {pending?.length} {i18n._(t`Pending`)}
            </div>{' '}
            <Loader stroke="white" />
          </div>
        ) : (
          <div className="mr-2">{ENSName || shortenAddress(account)}</div>
        )}
        {!hasPendingTransactions && connector && <StatusIcon connector={connector} />}
      </div>
    )
  } else {
    return <Web3Connect className="!bg-dark-1000 border border-dark-900 h-[38px]" />
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

  const pending = sortedRecentTransactions.filter((tx) => !tx.receipt).map((tx) => tx.hash)
  const confirmed = sortedRecentTransactions.filter((tx) => tx.receipt).map((tx) => tx.hash)

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
