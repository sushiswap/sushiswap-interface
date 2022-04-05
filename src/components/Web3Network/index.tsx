import { NETWORK_ICON } from 'app/config/networks'
import { logEvent } from 'app/functions/analytics'
import usePrevious from 'app/hooks/usePrevious'
import NetworkModel, { SUPPORTED_NETWORKS } from 'app/modals/NetworkModal'
import { useActiveWeb3React } from 'app/services/web3'
import { useNetworkModalToggle } from 'app/state/application/hooks'
import Image from 'next/image'
import { useRouter } from 'next/router'
import React, { useCallback, useEffect } from 'react'

const switchToNetwork = async ({ provider, chainId }: any) => {
  if (!provider.request) {
    return
  }
  console.debug(`Switching to chain ${chainId}`)
  const params = SUPPORTED_NETWORKS[chainId]
  try {
    await provider.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: `0x${chainId.toString(16)}` }],
    })
    logEvent('Chain', 'switch', params.chainName, chainId)
  } catch (error) {
    // @ts-ignore TYPE NEEDS FIXING
    // This error code indicates that the chain has not been added to MetaMask.
    if (error.code === 4902) {
      await provider.request({
        method: 'wallet_addEthereumChain',
        params,
      })
      // metamask (only known implementer) automatically switches after a network is added
      // the second call is done here because that behavior is not a part of the spec and cannot be relied upon in the future
      // metamask's behavior when switching to the current network is just to return null (a no-op)
      try {
        await provider.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: `0x${chainId.toString(16)}` }],
        })
      } catch (error) {
        console.debug('Added network but could not switch chains', error)
      }
    } else {
      console.debug('Switch chain error', error)
      throw error
    }
  }
}

function Web3Network(): JSX.Element | null {
  const { chainId, library } = useActiveWeb3React()

  const router = useRouter()
  const toggleNetworkModal = useNetworkModalToggle()

  const prevChainId = usePrevious(chainId)

  const urlChainId = router.query.chainId

  const handleChainSwitch = useCallback(
    (targetChain: number) => {
      if (!library?.provider) return
      switchToNetwork({ provider: library.provider, chainId: targetChain })
        .then(() => router.replace({ query: { ...router.query, chainId: targetChain } }))
        .catch(() => {
          if (chainId) {
            router.replace({ query: { ...router.query, chainId } })
          }
        })
    },
    [library?.provider, router, chainId]
  )

  useEffect(() => {
    if (!chainId || !prevChainId || !urlChainId) return

    // when network change originates from wallet or dropdown selector, just update URL
    if (chainId !== prevChainId) {
      console.debug('network change from wallet or network modal', { urlChainId, chainId })

      router.replace({ query: { ...router.query, chainId } })

      console.debug('after network change from wallet or network modal', { urlChainId: router.query.chainId, chainId })

      // otherwise assume network change originates from URL
    } else if (urlChainId && chainId && Number(urlChainId) !== chainId) {
      console.debug('network change from URL', { urlChainId, chainId })
      handleChainSwitch(Number(urlChainId))
    }
  }, [chainId, urlChainId, prevChainId, router, handleChainSwitch])

  // set chainId on initial load if not present
  useEffect(() => {
    if (chainId && !urlChainId) {
      console.debug('Setting chain id on initial load because not present')
      router.replace({ query: { ...router.query, chainId } })
    }
  }, [chainId, urlChainId, router])

  if (!chainId) return null

  return (
    <div
      className="flex items-center text-sm font-bold cursor-pointer pointer-events-auto select-none whitespace-nowrap"
      onClick={() => toggleNetworkModal()}
    >
      <div className="grid items-center grid-flow-col justify-center h-[36px] w-[36px] text-sm rounded pointer-events-auto auto-cols-max text-secondary">
        {/*@ts-ignore TYPE NEEDS FIXING*/}
        <Image src={NETWORK_ICON[chainId]} alt="Switch Network" className="rounded-full" width="24px" height="24px" />
      </div>
      <NetworkModel />
    </div>
  )
}

export default Web3Network
