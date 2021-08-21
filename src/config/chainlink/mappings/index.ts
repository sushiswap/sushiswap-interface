import BSC from './bsc'
import { ChainId } from '@sushiswap/sdk'
import HECO from './heco'
import KOVAN from './kovan'
import MAINNET from './mainnet'
import MATIC from './matic'
import XDAI from './xdai'

export type ChainlinkPriceFeedMap = {
  readonly [address: string]: {
    from: string
    to: string
    decimals: number
    fromDecimals: number
    toDecimals: number
    warning?: string
    address?: string
  }
}

export const CHAINLINK_PRICE_FEED_MAP: {
  [chainId in ChainId]?: ChainlinkPriceFeedMap
} = {
  [ChainId.MAINNET]: MAINNET,
  [ChainId.KOVAN]: KOVAN,
  [ChainId.BSC]: BSC,
  [ChainId.HECO]: HECO,
  [ChainId.MATIC]: MATIC,
  [ChainId.XDAI]: XDAI,
}
