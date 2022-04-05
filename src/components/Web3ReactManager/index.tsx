import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { useWeb3React } from '@web3-react/core'
import { network } from 'app/config/wallets'
import { NetworkContextName } from 'app/constants'
import { Feature } from 'app/enums'
import { featureEnabled } from 'app/functions'
import useEagerConnect from 'app/hooks/useEagerConnect'
import useInactiveListener from 'app/hooks/useInactiveListener'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import React, { FC, useEffect } from 'react'

const GnosisManagerNoSSR = dynamic(() => import('./GnosisManager'), {
  ssr: false,
})

export const Web3ReactManager: FC = ({ children }) => {
  const { i18n } = useLingui()
  const { active, chainId } = useWeb3React()
  const { active: networkActive, error: networkError, activate: activateNetwork } = useWeb3React(NetworkContextName)

  // try to eagerly connect to an injected provider, if it exists and has granted access already
  const triedEager = useEagerConnect()

  const router = useRouter()

  // after eagerly trying injected, if the network connect ever isn't active or in an error state, activate itd
  useEffect(() => {
    if (triedEager && !networkActive && !networkError && !active) {
      activateNetwork(network)
    }
  }, [triedEager, networkActive, networkError, activateNetwork, active])

  // when there's no account connected, react to logins (broadly speaking) on the injected provider, if it exists
  useInactiveListener(!triedEager)

  useEffect(() => {
    if (chainId && featureEnabled(Feature.TRIDENT, chainId) && router.asPath === '/swap') {
      router.push('/trident/swap')
    }
  }, [chainId, router])

  // if the account context isn't active, and there's an error on the network context, it's an irrecoverable error
  if (triedEager && !active && networkError) {
    return (
      <div className="flex items-center justify-center h-80">
        <div className="text-secondary">
          {i18n._(t`Oops! An unknown error occurred. Please refresh the page, or visit from another browser or device`)}
        </div>
      </div>
    )
  }

  return (
    <>
      <GnosisManagerNoSSR />
      {children}
    </>
  )
}

export default Web3ReactManager
