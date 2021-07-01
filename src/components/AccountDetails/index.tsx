import React, { useCallback } from 'react'
import { fortmatic, injected, portis, torus, walletconnect, binance, walletlink } from '../../connectors'
import styled from 'styled-components'

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
import { shortenAddress } from '../../functions/format'
import { useActiveWeb3React } from '../../hooks/useActiveWeb3React'
import { useDispatch } from 'react-redux'

const IconWrapper = styled.div<{ size?: number }>`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: center;
  margin-right: 8px;
  & > img,
  span {
    height: ${({ size }) => (size ? size + 'px' : '32px')};
    width: ${({ size }) => (size ? size + 'px' : '32px')};
  }
  // ${({ theme }) => theme.mediaWidth.upToMedium`
    align-items: flex-end;
  `};
`

function renderTransactions(transactions: string[]) {
  return (
    <div className="flex flex-col flex-nowrap">
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

export default function AccountDetails({
  toggleWalletModal,
  pendingTransactions,
  confirmedTransactions,
  ENSName,
  openOptions,
}: AccountDetailsProps): any {
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
      return (
        <IconWrapper size={16}>
          <Image src="/wallet-connect.png" alt={'Wallet Connect'} width="16px" height="16px" />
        </IconWrapper>
      )
    } else if (connector === walletlink) {
      return (
        <IconWrapper size={16}>
          <Image src="/coinbase.svg" alt={'Coinbase Wallet'} width="16px" height="16px" />
        </IconWrapper>
      )
    } else if (connector === fortmatic) {
      return (
        <IconWrapper size={16}>
          <Image src="/fortmatic.png" alt={'Fortmatic'} width="16px" height="16px" />
        </IconWrapper>
      )
    } else if (connector === portis) {
      return (
        <>
          <IconWrapper size={16}>
            <Image src="/portis.png" alt={'Portis'} width="16px" height="16px" />
            <Button
              onClick={() => {
                portis.portis.showPortis()
              }}
            >
              Show Portis
            </Button>
          </IconWrapper>
        </>
      )
    } else if (connector === torus) {
      return (
        <IconWrapper size={16}>
          <Image src="/torus.png" alt={'Coinbase Wallet'} width="16px" height="16px" />
        </IconWrapper>
      )
    }
    return null
  }

  const clearAllTransactionsCallback = useCallback(() => {
    if (chainId) dispatch(clearAllTransactions({ chainId }))
  }, [dispatch, chainId])

  return (
    <div className="space-y-3">
      <div className="space-y-3">
        <ModalHeader title="Account" onClose={toggleWalletModal}></ModalHeader>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            {formatConnectorName()}
            <div className="flex space-x-3">
              {connector !== injected && connector !== walletlink && connector !== binance && (
                <Button
                  variant="filled"
                  color="gray"
                  size="xs"
                  onClick={() => {
                    ;(connector as any).close()
                  }}
                >
                  Disconnect
                </Button>
              )}
              <Button
                variant="filled"
                color="gray"
                size="xs"
                onClick={() => {
                  openOptions()
                }}
              >
                Change
              </Button>
            </div>
          </div>
          <div id="web3-account-identifier-row" className="flex flex-col justify-center space-y-3">
            {ENSName ? (
              <>
                {getStatusIcon()}
                <p className=" text-primary"> {ENSName}</p>
              </>
            ) : (
              <>
                {getStatusIcon()}
                <p className="text-primary"> {account && shortenAddress(account)}</p>
              </>
            )}

            {ENSName ? (
              <div className="flex items-center space-x-3">
                {chainId && account && (
                  <ExternalLink
                    color="blue"
                    startIcon={<LinkIcon size={16} />}
                    href={chainId && getExplorerLink(chainId, ENSName, 'address')}
                  >
                    <span>View on explorer</span>
                  </ExternalLink>
                )}
                {account && (
                  <Copy toCopy={account}>
                    <span className="ml-1">Copy Address</span>
                  </Copy>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                {chainId && account && (
                  <ExternalLink
                    color="blue"
                    endIcon={<LinkIcon size={16} />}
                    href={chainId && getExplorerLink(chainId, account, 'address')}
                  >
                    View on explorer
                  </ExternalLink>
                )}
                {account && (
                  <Copy toCopy={account}>
                    <span className="ml-1">Copy Address</span>
                  </Copy>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      {!!pendingTransactions.length || !!confirmedTransactions.length ? (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div>Recent Transactions</div>
            <div>
              <Button variant="filled" color="gray" size="xs" onClick={clearAllTransactionsCallback}>
                Clear all
              </Button>
            </div>
          </div>
          {renderTransactions(pendingTransactions)}
          {renderTransactions(confirmedTransactions)}
        </div>
      ) : (
        <div className="text-baseline text-secondary">Your transactions will appear here...</div>
      )}
    </div>
  )
}
