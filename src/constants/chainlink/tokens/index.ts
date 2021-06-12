import BSC from './bsc'
import { ChainId } from '@sushiswap/sdk'
import HECO from './heco'
import KOVAN from './kovan'
import MAINNET from './mainnet'
import MATIC from './matic'

export type ChainlinkToken = {
    symbol: string
    name: string
    address: string
    decimals: number
}

export const CHAINLINK_TOKENS: { [chainId in ChainId]?: ChainlinkToken[] } = {
    [ChainId.MAINNET]: MAINNET,
    [ChainId.KOVAN]: KOVAN,
    [ChainId.BSC]: BSC,
    [ChainId.HECO]: HECO,
    [ChainId.MATIC]: MATIC,
}
