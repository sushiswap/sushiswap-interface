import { ChainId } from '@sushiswap/sdk'

export const TIMELOCK_ADDRESS = '0x1a9C8182C09F50C8318d769245beA52c32BE35BC'

export const ARCHER_ROUTER_ADDRESS: { [chainId in ChainId]?: string } = {
    [ChainId.MAINNET]: '0x87535b160E251167FB7abE239d2467d1127219E4',
    [ChainId.RINKEBY]: '0x21323080D91dD77c420be7775Bf5C33d21Dcc8Fc',
}

export const ZAPPER_ADDRESS: { [chainId in ChainId]?: string } = {
    [ChainId.MAINNET]: '0xcff6eF0B9916682B37D80c19cFF8949bc1886bC2',
    [ChainId.ROPSTEN]: '0xcff6eF0B9916682B37D80c19cFF8949bc1886bC2',
}

// TODO: specify merkle distributor for mainnet
export const MERKLE_DISTRIBUTOR_ADDRESS: { [chainId in ChainId]?: string } = {
    [ChainId.MAINNET]: '0xcBE6B83e77cdc011Cc18F6f0Df8444E5783ed982',
    [ChainId.ROPSTEN]: '0x84d1f7202e0e7dac211617017ca72a2cb5e2b955',
}
