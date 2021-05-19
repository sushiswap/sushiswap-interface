import { ChainId } from '@sushiswap/sdk'
import { NetworkContextName } from '../constants'
import { Web3Provider } from '@ethersproject/providers'
import { Web3ReactContextInterface } from '@web3-react/core/dist/types'
import { useWeb3React as useWeb3ReactCore } from '@web3-react/core'

export function useActiveWeb3React(): Web3ReactContextInterface<Web3Provider> & {
    chainId?: ChainId
} {
    const context = useWeb3ReactCore<Web3Provider>()
    const contextNetwork = useWeb3ReactCore<Web3Provider>(NetworkContextName)
    return context.active ? context : contextNetwork
}

export default useActiveWeb3React
