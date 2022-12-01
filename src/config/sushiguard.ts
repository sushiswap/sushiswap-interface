import { ChainId } from '@figswap/core-sdk'

// Note (amiller68): We don't have SushiGuard on FEVM so we don't need to add it here. But removing this breaks stuff.
// Maybe we'll need to add it later.
export const SUSHIGUARD_RELAY: { [chainId in ChainId]?: string } = {
  // Note (amiller68): This is the SushiGuard relay for Ethereum Mainnet
  // [ChainId.ETHEREUM]: 'https://api.sushirelay.com/v1',
}
