import Davatar from '@davatar/react'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { HeadlessUiModal } from 'app/components/Modal'
import { injected, SUPPORTED_WALLETS } from 'app/config/wallets'
import { getExplorerLink } from 'app/functions/explorer'
import { shortenAddress } from 'app/functions/format'
import { useActiveWeb3React } from 'app/services/web3'
import { AppDispatch } from 'app/state'
import { clearAllTransactions } from 'app/state/transactions/actions'
import Image from 'next/image'
import React, { FC, useCallback, useMemo } from 'react'
import { ExternalLink as LinkIcon } from 'react-feather'
import { useDispatch } from 'react-redux'

import Button from '../Button'
import ExternalLink from '../ExternalLink'
import Typography from '../Typography'
import Copy from './Copy'
import Transaction from './Transaction'

const WalletIcon: FC<{ size?: number; src: string; alt: string }> = ({ size, src, alt, children }) => {
  return (
    <div className="flex flex-row items-end justify-center mr-2 flex-nowrap md:items-center">
      <Image src={src} alt={alt} width={size} height={size} />
      {children}
    </div>
  )
}

interface AccountDetailsProps {
  toggleWalletModal: () => void
  pendingTransactions: string[]
  confirmedTransactions: string[]
  ENSName?: string
  openOptions: () => void
}

const AccountDetails: FC<AccountDetailsProps> = ({
  toggleWalletModal,
  pendingTransactions,
  confirmedTransactions,
  ENSName,
  openOptions,
}) => {
  const { i18n } = useLingui()
  const { chainId, account, connector, deactivate, library } = useActiveWeb3React()
  const dispatch = useDispatch<AppDispatch>()

  const connectorName = useMemo(() => {
    const { ethereum } = window
    const isMetaMask = !!(ethereum && ethereum.isMetaMask)
    const name = Object.keys(SUPPORTED_WALLETS)
      .filter(
        (k) =>
          SUPPORTED_WALLETS[k].connector === connector && (connector !== injected || isMetaMask === (k === 'METAMASK'))
      )
      .map((k) => SUPPORTED_WALLETS[k].name)[0]
    return (
      <Typography variant="xs" weight={700} className="text-secondary">
        Connected with {name}
      </Typography>
    )
  }, [connector])

  const clearAllTransactionsCallback = useCallback(() => {
    if (chainId) dispatch(clearAllTransactions({ chainId }))
  }, [dispatch, chainId])

  return (
    <div className="space-y-3">
      <div className="space-y-3">
        <HeadlessUiModal.Header header={i18n._(t`Account`)} onClose={toggleWalletModal} />
        <HeadlessUiModal.BorderedContent className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            {connectorName}
            <Button variant="outlined" color="blue" size="xs" onClick={deactivate}>
              {i18n._(t`Disconnect`)}
            </Button>
          </div>
          <div id="web3-account-identifier-row" className="flex flex-col justify-center gap-4">
            <div className="flex items-center gap-4">
              <div className="overflow-hidden rounded-full">
                <Davatar
                  size={48}
                  address={account}
                  defaultComponent={<Image src="/images/chef.svg" alt="Sushi Chef" width={48} height={48} />}
                  provider={library}
                />
              </div>
              <Typography weight={700} variant="lg" className="text-white">
                {ENSName ? ENSName : account && shortenAddress(account)}
              </Typography>
            </div>
            <div className="flex items-center gap-2 space-x-3">
              {chainId && account && (
                <ExternalLink
                  color="blue"
                  startIcon={<LinkIcon size={16} />}
                  href={chainId && getExplorerLink(chainId, ENSName || account, 'address')}
                >
                  <Typography variant="xs" weight={700}>
                    {i18n._(t`View on explorer`)}
                  </Typography>
                </ExternalLink>
              )}
              {account && (
                <Copy toCopy={account}>
                  <Typography variant="xs" weight={700}>
                    {i18n._(t`Copy Address`)}
                  </Typography>
                </Copy>
              )}
            </div>
          </div>
        </HeadlessUiModal.BorderedContent>
        <HeadlessUiModal.BorderedContent className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <Typography variant="xs" weight={700} className="text-secondary">
              {i18n._(t`Recent Transactions`)}
            </Typography>
            <Button variant="outlined" color="blue" size="xs" onClick={clearAllTransactionsCallback}>
              {i18n._(t`Clear all`)}
            </Button>
          </div>
          <div className="flex flex-col divide-y divide-dark-800">
            {!!pendingTransactions.length || !!confirmedTransactions.length ? (
              <>
                {pendingTransactions.map((el, index) => (
                  <Transaction key={index} hash={el} />
                ))}
                {confirmedTransactions.map((el, index) => (
                  <Transaction key={index} hash={el} />
                ))}
              </>
            ) : (
              <Typography variant="xs" weight={700} className="text-secondary">
                {i18n._(t`Your transactions will appear here...`)}
              </Typography>
            )}
          </div>
        </HeadlessUiModal.BorderedContent>
      </div>
    </div>
  )
}

export default AccountDetails
