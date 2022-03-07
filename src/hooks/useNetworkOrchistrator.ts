import { ChainId } from '@sushiswap/core-sdk'
import { ChainSubdomain } from 'app/enums'
import { SUPPORTED_NETWORKS } from 'app/modals/NetworkModal'
import { useActiveWeb3React } from 'app/services/web3'
import Cookies from 'js-cookie'
import { useEffect } from 'react'

const CHAIN_ID_SUBDOMAIN: { [chainId: number]: string } = {
  [ChainId.ETHEREUM]: ChainSubdomain.ETHEREUM,
  [ChainId.ROPSTEN]: ChainSubdomain.ROPSTEN,
  [ChainId.RINKEBY]: ChainSubdomain.RINKEBY,
  [ChainId.GÖRLI]: ChainSubdomain.GÖRLI,
  [ChainId.KOVAN]: ChainSubdomain.KOVAN,
  [ChainId.MATIC]: ChainSubdomain.POLYGON,
  [ChainId.FANTOM]: ChainSubdomain.FANTOM,
  [ChainId.XDAI]: ChainSubdomain.GNOSIS,
  [ChainId.BSC]: ChainSubdomain.BSC,
  [ChainId.ARBITRUM]: ChainSubdomain.ARBITRUM,
  [ChainId.AVALANCHE]: ChainSubdomain.AVALANCHE,
  [ChainId.HECO]: ChainSubdomain.HECO,
  [ChainId.HARMONY]: ChainSubdomain.HARMONY,
  [ChainId.OKEX]: ChainSubdomain.OKEX,
  [ChainId.CELO]: ChainSubdomain.CELO,
  [ChainId.PALM]: ChainSubdomain.PALM,
  [ChainId.MOONRIVER]: ChainSubdomain.MOONRIVER,
  [ChainId.FUSE]: ChainSubdomain.FUSE,
  [ChainId.TELOS]: ChainSubdomain.TELOS,
}

function useNetworkOrchistrator() {
  useEffect(() => {
    const { ethereum } = window
    if (ethereum && ethereum.on) {
      const handleChainChanged = (chainIdHex: string) => {
        const chainId = Number(chainIdHex)
        const chainIdFromCookie = Number(Cookies.get('chain-id'))
        // If chainId does not equal chainIdFromCookie, and we have a chain id subdomain mapping, replace location...
        if (chainId !== chainIdFromCookie && chainId in CHAIN_ID_SUBDOMAIN) {
          // Remove the cookie to prevent wallet prompt from running while location is reassigned
          Cookies.remove('chain-id')
          window.location.assign(window.location.href.replace(/(:\/\/\w+\.)/, `://${CHAIN_ID_SUBDOMAIN[chainId]}.`))
        }
      }
      ethereum.on('chainChanged', handleChainChanged)
      return () => {
        if (ethereum.removeListener) {
          ethereum.removeListener('chainChanged', handleChainChanged)
        }
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const { chainId, library, account, active } = useActiveWeb3React()
  useEffect(() => {
    const chainIdFromCookie = Number(Cookies.get('chain-id'))

    if (!chainId || !chainIdFromCookie || !account || chainId === chainIdFromCookie) {
      return
    }

    const promptWalletSwitch = async () => {
      const params = SUPPORTED_NETWORKS[chainIdFromCookie]
      try {
        await library?.send('wallet_switchEthereumChain', [{ chainId: `0x${chainIdFromCookie.toString(16)}` }, account])
      } catch (switchError) {
        // This error code indicates that the chain has not been added to MetaMask.
        // @ts-ignore TYPE NEEDS FIXING
        if (switchError.code === 4902) {
          try {
            await library?.send('wallet_addEthereumChain', [params, account])
          } catch (addError) {
            // handle "add" error
            console.error(`Add chain error ${addError}`)
          }
        }
        console.error(`Switch chain error ${switchError}`)
        // handle other "switch" errors
      }
    }
    promptWalletSwitch()
  }, [account, chainId, library])
}

export default useNetworkOrchistrator
