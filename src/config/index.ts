import { CHAINLINK_PRICE_FEED_MAP } from './chainlink'
import rpc from './rpc'

const config = {
  rpc,
  chainlink: CHAINLINK_PRICE_FEED_MAP,
}

export default config
