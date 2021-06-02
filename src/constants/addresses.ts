import { ChainId } from '@sushiswap/sdk'

// TODO: Should be a simple mapping ZAPPER_ADDRESS[chainId]
export const getZapperAddress = (chainId: ChainId | undefined) => {
    let address: string | undefined
    if (chainId) {
        switch (chainId) {
            case ChainId.MAINNET:
                address = '0xcff6eF0B9916682B37D80c19cFF8949bc1886bC2'
                break
            case ChainId.ROPSTEN:
                address = '0x169c54a9826caf9f14bd30688296021533fe23ae'
                break
        }
    }
    return address
}
