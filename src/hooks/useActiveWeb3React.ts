import { ChainId } from '@sushiswap/sdk'
import { NetworkContextName } from '../constants'
import { Web3Provider } from '@ethersproject/providers'
import { Web3ReactContextInterface } from '@web3-react/core/dist/types'
import { useWeb3React as useWeb3ReactCore } from '@web3-react/core'

export function useActiveWeb3React(): Web3ReactContextInterface<Web3Provider> & {
    chainId?: ChainId
} {
    // replace with address to impersonate
    const impersonate = false
    const context = useWeb3ReactCore<Web3Provider>()
    const contextNetwork = useWeb3ReactCore<Web3Provider>(NetworkContextName)
    return context.active
        ? { ...context, account: impersonate || context.account }
        : { ...contextNetwork, account: impersonate || contextNetwork.account }
}

export default useActiveWeb3React
