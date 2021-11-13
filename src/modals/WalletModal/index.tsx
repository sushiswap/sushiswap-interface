import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { AbstractConnector } from '@web3-react/abstract-connector'
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import HeadlessUiModal from 'app/components/Modal/HeadlessUIModal'
import AccountDetails from 'components/AccountDetails'
import { ButtonError } from 'components/Button'
import ExternalLink from 'components/ExternalLink'
import ModalHeader from 'components/ModalHeader'
import { injected, SUPPORTED_WALLETS } from 'config/wallets'
import { OVERLAY_READY } from 'entities/connectors/FortmaticConnector'
import usePrevious from 'hooks/usePrevious'
import React, { useEffect, useState } from 'react'
import { isMobile } from 'react-device-detect'
import ReactGA from 'react-ga'
import { ApplicationModal } from 'state/application/actions'
import { useModalOpen, useWalletModalToggle } from 'state/application/hooks'

import Option from './Option'
import PendingView from './PendingView'

const WALLET_VIEWS = {
  OPTIONS: 'options',
  OPTIONS_SECONDARY: 'options_secondary',
  ACCOUNT: 'account',
  PENDING: 'pending',
}

export default function WalletModal({
  pendingTransactions,
  confirmedTransactions,
  ENSName,
}: {
  pendingTransactions: string[] // hashes of pending
  confirmedTransactions: string[] // hashes of confirmed
  ENSName?: string
}) {
  // console.log({ ENSName })
  // important that these are destructed from the account-specific web3-react context
  const { active, account, connector, activate, error, deactivate } = useWeb3React()

  const { i18n } = useLingui()

  const [walletView, setWalletView] = useState(WALLET_VIEWS.ACCOUNT)

  const [pendingWallet, setPendingWallet] = useState<AbstractConnector | undefined>()

  const [pendingError, setPendingError] = useState<boolean>()

  const walletModalOpen = useModalOpen(ApplicationModal.WALLET)

  const toggleWalletModal = useWalletModalToggle()

  const previousAccount = usePrevious(account)

  // close on connection, when logged out before
  useEffect(() => {
    if (account && !previousAccount && walletModalOpen) {
      toggleWalletModal()
    }
  }, [account, previousAccount, toggleWalletModal, walletModalOpen])

  // always reset to account view
  useEffect(() => {
    if (walletModalOpen) {
      setPendingError(false)
      setWalletView(WALLET_VIEWS.ACCOUNT)
    }
  }, [walletModalOpen])

  // close modal when a connection is successful
  const activePrevious = usePrevious(active)
  const connectorPrevious = usePrevious(connector)
  useEffect(() => {
    if (walletModalOpen && ((active && !activePrevious) || (connector && connector !== connectorPrevious && !error))) {
      setWalletView(WALLET_VIEWS.ACCOUNT)
    }
  }, [setWalletView, active, error, connector, walletModalOpen, activePrevious, connectorPrevious])

  const tryActivation = async (connector: (() => Promise<AbstractConnector>) | AbstractConnector | undefined) => {
    let name = ''
    let conn = typeof connector === 'function' ? await connector() : connector

    Object.keys(SUPPORTED_WALLETS).map((key) => {
      if (connector === SUPPORTED_WALLETS[key].connector) {
        return (name = SUPPORTED_WALLETS[key].name)
      }
      return true
    })
    // log selected wallet
    ReactGA.event({
      category: 'Wallet',
      action: 'Change Wallet',
      label: name,
    })
    setPendingWallet(conn) // set wallet for pending view
    setWalletView(WALLET_VIEWS.PENDING)

    // if the connector is walletconnect and the user has already tried to connect, manually reset the connector
    if (conn instanceof WalletConnectConnector && conn.walletConnectProvider?.wc?.uri) {
      conn.walletConnectProvider = undefined
    }

    conn &&
      activate(conn, undefined, true).catch((error) => {
        if (error instanceof UnsupportedChainIdError) {
          activate(conn) // a little janky...can't use setError because the connector isn't set
        } else {
          setPendingError(true)
        }
      })
  }

  // close wallet modal if fortmatic modal is active
  useEffect(() => {
    if (connector?.constructor?.name === 'FormaticConnector') {
      connector.on(OVERLAY_READY, () => {
        toggleWalletModal()
      })
    }
  }, [toggleWalletModal, connector])

  // get wallets user can switch too, depending on device/browser
  function getOptions() {
    const isMetamask = window.ethereum && window.ethereum.isMetaMask
    return Object.keys(SUPPORTED_WALLETS).map((key) => {
      const option = SUPPORTED_WALLETS[key]

      // check for mobile options
      if (isMobile) {
        // disable portis on mobile for now
        if (option.name === 'Portis') {
          return null
        }

        if (!window.web3 && !window.ethereum && option.mobile) {
          return (
            <Option
              onClick={() => {
                tryActivation(option.connector)
              }}
              id={`connect-${key}`}
              key={key}
              active={option.connector && option.connector === connector}
              color={option.color}
              link={option.href}
              header={option.name}
              subheader={null}
              icon={'/images/wallets/' + option.iconName}
            />
          )
        }
        return null
      }

      // overwrite injected when needed
      if (option.connector === injected) {
        // don't show injected if there's no injected provider
        if (!(window.web3 || window.ethereum)) {
          if (option.name === 'MetaMask') {
            return (
              <Option
                id={`connect-${key}`}
                key={key}
                color={'#E8831D'}
                header={'Install Metamask'}
                subheader={null}
                link={'https://metamask.io/'}
                icon="/images/wallets/metamask.png"
              />
            )
          } else {
            return null // dont want to return install twice
          }
        }
        // don't return metamask if injected provider isn't metamask
        else if (option.name === 'MetaMask' && !isMetamask) {
          return null
        }
        // likewise for generic
        else if (option.name === 'Injected' && isMetamask) {
          return null
        }
      }

      // return rest of options
      return (
        !isMobile &&
        !option.mobileOnly && (
          <Option
            id={`connect-${key}`}
            onClick={() => {
              option.connector === connector
                ? setWalletView(WALLET_VIEWS.ACCOUNT)
                : !option.href && tryActivation(option.connector)
            }}
            key={key}
            active={option.connector === connector}
            color={option.color}
            link={option.href}
            header={option.name}
            subheader={null} // use option.descriptio to bring back multi-line
            icon={'/images/wallets/' + option.iconName}
          />
        )
      )
    })
  }

  function getModalContent() {
    if (error) {
      return (
        <div className="p-6">
          <ModalHeader
            title={error instanceof UnsupportedChainIdError ? i18n._(t`Wrong Network`) : i18n._(t`Error connecting`)}
            onClose={toggleWalletModal}
          />
          <div>
            {error instanceof UnsupportedChainIdError ? (
              <h5>{i18n._(t`Please connect to the appropriate Ethereum network.`)}</h5>
            ) : (
              i18n._(t`Error connecting. Try refreshing the page.`)
            )}
            <div style={{ marginTop: '1rem' }} />
            <ButtonError error={true} size="sm" onClick={deactivate}>
              {i18n._(t`Disconnect`)}
            </ButtonError>
          </div>
        </div>
      )
    }
    if (account && walletView === WALLET_VIEWS.ACCOUNT) {
      return (
        <AccountDetails
          toggleWalletModal={toggleWalletModal}
          pendingTransactions={pendingTransactions}
          confirmedTransactions={confirmedTransactions}
          ENSName={ENSName}
          openOptions={() => setWalletView(WALLET_VIEWS.OPTIONS)}
        />
      )
    }
    return (
      <div className="flex flex-col space-y-4 p-6">
        <ModalHeader title="Select a Wallet" onClose={toggleWalletModal} />
        <div className="flex flex-col space-y-6">
          {walletView === WALLET_VIEWS.PENDING ? (
            <PendingView
              connector={pendingWallet}
              error={pendingError}
              setPendingError={setPendingError}
              tryActivation={tryActivation}
            />
          ) : (
            <div className="flex flex-col space-y-5 overflow-y-auto">{getOptions()}</div>
          )}
          {walletView !== WALLET_VIEWS.PENDING && (
            <div className="flex flex-col text-center">
              <div className="text-secondary">{i18n._(t`New to Ethereum?`)}</div>
              <ExternalLink href="https://ethereum.org/wallets/" color="blue">
                {i18n._(t`Learn more about wallets`)}
              </ExternalLink>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <HeadlessUiModal.Controlled isOpen={walletModalOpen} onDismiss={toggleWalletModal}>
      {getModalContent()}
    </HeadlessUiModal.Controlled>
  )
}
