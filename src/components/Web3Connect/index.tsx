import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
// import { SUPPORTED_WALLETS } from 'app/config/wallets'
// import { classNames } from 'app/functions'
// import { switchToNetwork } from 'app/functions/network'
import { useWalletModalToggle } from 'app/state/application/hooks'
import React, { useCallback, useMemo } from 'react'
import { Activity } from 'react-feather'
import { UnsupportedChainIdError, useWeb3React } from 'web3-react-core'

import Button, { ButtonProps } from '../Button'

export default function Web3Connect({ color = 'gray', size, className = '', ...rest }: ButtonProps) {
  const { i18n } = useLingui()
  const toggleWalletModal = useWalletModalToggle()
  const { error, activate } = useWeb3React()
  const isMetamask = useMemo(() => {
    return window.ethereum?.isMetaMask
  }, [])

  // Note (amiller68) - #MetamaskOnly - Just need a callback to connect to metamask
  const tryActivateMetamask = useCallback(async () => {
    // Jankily double-check the user hasn't disabled / uninstalled metamask or something
    if (!isMetamask) {
      window.open('https://metamask.io/', '_blank')
      return
    }
    let name = 'METAMASK'
    let connector = SUPPORTED_WALLETS[name].connector
    let conn = typeof connector === 'function' ? await connector() : connector

    console.debug('Attempting activation of', name)

    // log selected wallet

    gtag('event', 'Change Wallet', {
      event_category: 'Wallet',
      event_label: name,
    })

    // If we have a valid connector, activate it
    if (conn) {
      console.debug('About to activate')
      activate(
        conn,
        (error) => {
          console.debug('Error activating connector ', name, error)
        },
        true
      )
        .then(async () => {
          console.debug('Activated, get provider')
        })

        .catch(async (error) => {
          console.debug('Error activating', error)
          if (error instanceof UnsupportedChainIdError) {
            // TODO / Note (al): #WallabyOnly #FilecoinMainnet
            // We only support Wallaby for now, so we can knowingly switch users to the correct network
            // This is different from the commented out code above, which just disconnects the providers
            console.log('UnsupportedChainIdError, Attempting to switch to Wallaby')

            // Get the provider from the connector
            const provider = await conn?.getProvider()
            // Try to switch to the correct network
            switchToNetwork({
              provider,
              //  TODO (amiller68) - #FilecoinMainnet figure out how to get config.defaultChainId to work with this
              chainId: 31415,
            }).catch((error) => {
              console.log('Error switching to Wallaby', error)
              return
            })
            // Attempt to connect one more time
            // @ts-ignore TYPE NEEDS FIXING
            activate(conn, (error1) => {
              console.log('Error activating again', error1)
            })
              .then(() => {
                console.log('Activated properly on correct Network')
              })
              .catch((error2) => {
                console.log('Error activating again', error2)
              })
          }
        })
    }
  }, [activate, isMetamask])

  return error ? (
    <div
      className="flex items-center justify-center px-4 py-2 font-semibold text-white border rounded bg-opacity-80 border-red bg-red hover:bg-opacity-100"
      onClick={toggleWalletModal}
    >
      <div className="mr-1">
        <Activity className="w-4 h-4" />
      </div>
      {error instanceof UnsupportedChainIdError ? i18n._(t`You are on the wrong network`) : i18n._(t`Error`)}
    </div>
  ) : isMetamask ? (
    <Button
      id="connect-wallet"
      // Note (amiller68) - #MetamaskOnly - Just need a callback to connect to metamask, don't need to show the wallet modal
      // onClick={toggleWalletModal}
      onClick={tryActivateMetamask}
      variant="filled"
      color="blue"
      size="md"
      {...rest}
      className=""
    >
      {/* TODO / Note (amiller68) - #NewWallets / #MetamaskOnly - For now the button will read this unitl we start supporting more wallets */}
      {i18n._(t`Connect to MetaMask`)}
    </Button>
  ) : (
    <Button
      id="connect-wallet"
      // Open a link to install Metamask
      onClick={() => window.open('https://metamask.io/', '_blank')}
      variant="outlined"
      color={color}
      className={classNames(className, '!border-none')}
      size={size}
      {...rest}
    >
      {i18n._(t`Install MetaMask`)}
    </Button>
  )
}
