import { ChainId } from '@figswap/core-sdk'

import MAINNET from './mappings/mainnet'

export type ChainlinkPriceFeedEntry = {
  from: string
  to: string
  decimals: number
  fromDecimals: number
  toDecimals: number
  warning?: string
  address?: string
}

export type ChainlinkPriceFeedMap = {
  readonly [address: string]: ChainlinkPriceFeedEntry
}

export const CHAINLINK_PRICE_FEED_MAP: {
  [key: number]: ChainlinkPriceFeedMap
} = {
  [ChainId.ETHEREUM]: MAINNET,
}
