import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { useWalletModalToggle } from 'app/state/application/hooks'
import React from 'react'
import { Activity } from 'react-feather'
import { UnsupportedChainIdError, useWeb3React } from 'web3-react-core'

import Button, { ButtonProps } from '../Button'

export default function Web3Connect({ color = 'gray', size, className = '', ...rest }: ButtonProps) {
  const { i18n } = useLingui()
  const toggleWalletModal = useWalletModalToggle()
  const { error } = useWeb3React()
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
  ) : (
    //  Note (amiller68)
    <Button
      id="connect-wallet"
      onClick={toggleWalletModal}
      variant="filled"
      color="blue"
      size="md"
      {...rest}
      className=""
    >
      {/* TODO / Note (amiller68) - #NewWallets / #MetamaskOnly - For now the button will read this unitl we start supporting more wallets */}
      {i18n._(t`Connect Wallet`)}
    </Button>
  )
}
