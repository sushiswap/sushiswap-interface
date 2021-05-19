import { ExternalProvider, JsonRpcFetchFunc, Web3Provider } from '@ethersproject/providers'

export default function getLibrary(provider: ExternalProvider | JsonRpcFetchFunc): Web3Provider {
    const rpc = new Web3Provider(provider, 'any')
    rpc.pollingInterval = 15000
    return rpc
}
