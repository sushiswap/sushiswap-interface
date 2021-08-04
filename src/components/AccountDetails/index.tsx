import React, { FC, useCallback } from 'react'
import { binance, fortmatic, injected, portis, torus, walletconnect, walletlink } from '../../connectors'

import { AppDispatch } from '../../state'
import Button from '../Button'
import Copy from './Copy'
import ExternalLink from '../ExternalLink'
import Image from 'next/image'
import { ExternalLink as LinkIcon } from 'react-feather'
import ModalHeader from '../ModalHeader'
import { SUPPORTED_WALLETS } from '../../constants'
import Transaction from './Transaction'
import { clearAllTransactions } from '../../state/transactions/actions'
import { getExplorerLink } from '../../functions/explorer'
import { shortenAddress } from '../../functions'
import { useActiveWeb3React } from '../../hooks/useActiveWeb3React'
import { useDispatch } from 'react-redux'
import Typography from '../Typography'
import { useLingui } from '@lingui/react'
import { t } from '@lingui/macro'

const WalletIcon: FC<{ size?: number; src: string; alt: string }> = ({ size, src, alt, children }) => {
  return (
    <div className="flex flex-row flex-nowrap items-end md:items-center justify-center mr-2">
      <Image src={src} alt={alt} width={size} height={size} />
      {children}
    </div>
  )
}

function renderTransactions(transactions: string[]) {
  return (
    <div className="flex flex-col flex-nowrap gap-2">
      {transactions.map((hash, i) => {
        return <Transaction key={i} hash={hash} />
      })}
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
  const { chainId, account, connector } = useActiveWeb3React()
  const dispatch = useDispatch<AppDispatch>()

  function formatConnectorName() {
    const { ethereum } = window
    const isMetaMask = !!(ethereum && ethereum.isMetaMask)
    const name = Object.keys(SUPPORTED_WALLETS)
      .filter(
        (k) =>
          SUPPORTED_WALLETS[k].connector === connector && (connector !== injected || isMetaMask === (k === 'METAMASK'))
      )
      .map((k) => SUPPORTED_WALLETS[k].name)[0]
    return <div className="font-medium text-baseline text-secondary">Connected with {name}</div>
  }

  function getStatusIcon() {
    if (connector === injected) {
      return null
      // return <IconWrapper size={16}>{/* <Identicon /> */}</IconWrapper>
    } else if (connector === walletconnect) {
      return <WalletIcon src="/wallet-connect.png" alt="Wallet Connect" size={16} />
    } else if (connector === walletlink) {
      return <WalletIcon src="/coinbase.svg" alt="Coinbase" size={16} />
    } else if (connector === fortmatic) {
      return <WalletIcon src="/formatic.png" alt="Fortmatic" size={16} />
    } else if (connector === portis) {
      return (
        <WalletIcon src="/portnis.png" alt="Portis" size={16}>
          <Button
            onClick={() => {
              portis.portis.showPortis()
            }}
          >
            Show Portis
          </Button>
        </WalletIcon>
      )
    } else if (connector === torus) {
      return <WalletIcon src="/torus.png" alt="Torus" size={16} />
    }
    return null
  }

  const clearAllTransactionsCallback = useCallback(() => {
    if (chainId) dispatch(clearAllTransactions({ chainId }))
  }, [dispatch, chainId])

  return (
    <div className="space-y-3">
      <div className="space-y-3">
        <ModalHeader title="Account" onClose={toggleWalletModal} />
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            {formatConnectorName()}
            <div className="flex space-x-3">
              {connector !== injected &&
                connector !== walletlink &&
                connector !== binance &&
                connector.constructor.name !== 'KeystoneConnector' && (
                  <Button
                    variant="outlined"
                    color="gray"
                    size="xs"
                    onClick={() => {
                      ;(connector as any).close()
                    }}
                  >
                    {i18n._(t`Disconnect`)}
                  </Button>
                )}
              <Button
                variant="outlined"
                color="gray"
                size="xs"
                onClick={() => {
                  openOptions()
                }}
              >
                {i18n._(t`Change`)}
              </Button>
            </div>
          </div>
          <div id="web3-account-identifier-row" className="flex flex-col justify-center space-y-3">
            {ENSName ? (
              <div className="bg-dark-800">
                {getStatusIcon()}
                <Typography>{ENSName}</Typography>
              </div>
            ) : (
              <div className="bg-dark-800 py-2 px-3 rounded">
                {getStatusIcon()}
                <Typography>{account && shortenAddress(account)}</Typography>
              </div>
            )}
            <div className="flex items-center space-x-3 gap-2">
              {chainId && account && (
                <ExternalLink
                  color="blue"
                  startIcon={<LinkIcon size={16} />}
                  href={chainId && getExplorerLink(chainId, ENSName || account, 'address')}
                >
                  <Typography variant="sm">{i18n._(t`View on explorer`)}</Typography>
                </ExternalLink>
              )}
              {account && (
                <Copy toCopy={account}>
                  <Typography variant="sm">{i18n._(t`Copy Address`)}</Typography>
                </Copy>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Typography weight={700}>{i18n._(t`Recent Transactions`)}</Typography>
          <div>
            <Button variant="outlined" color="gray" size="xs" onClick={clearAllTransactionsCallback}>
              {i18n._(t`Clear all`)}
            </Button>
          </div>
        </div>
        {!!pendingTransactions.length || !!confirmedTransactions.length ? (
          <>
            {renderTransactions(pendingTransactions)}
            {renderTransactions(confirmedTransactions)}
          </>
        ) : (
          <Typography variant="sm" className="text-secondary">
            {i18n._(t`Your transactions will appear here...`)}
          </Typography>
        )}
      </div>
    </div>
  )
}

export default AccountDetails
