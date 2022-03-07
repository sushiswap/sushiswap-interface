import { Web3Provider } from '@ethersproject/providers'
import { useWeb3React } from '@web3-react/core'
import { Web3ReactContextInterface } from '@web3-react/core/dist/types'
import { NetworkContextName } from 'app/constants'

export function useActiveWeb3React(): Web3ReactContextInterface<Web3Provider> {
  // replace with address to impersonate
  const impersonate = false
  const context = useWeb3React<Web3Provider>()
  const contextNetwork = useWeb3React<Web3Provider>(NetworkContextName)
  return context.active
    ? { ...context, account: impersonate || context.account }
    : { ...contextNetwork, account: impersonate || contextNetwork.account }
}
