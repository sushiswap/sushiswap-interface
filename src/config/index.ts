import { ChainId } from '@sushiswap/core-sdk'

const config = {
  // Global configuration
  defaultChainId: ChainId.ETHEREUM,
  blockedAddresses: [
    // SDN OFAC addresses
    '0x7F367cC41522cE07553e823bf3be79A889DEbe1B',
    '0xd882cFc20F52f2599D84b8e8D58C7FB62cfE344b',
    '0x901bb9583b24D97e995513C6778dc6888AB6870e',
    '0xA7e5d5A720f06526557c513402f2e6B5fA20b008',
  ],
  // Network specific configuration
  [ChainId.ETHEREUM]: {
    averageBlockTimeInSeconds: 13,
    kashi: { blacklistedTokens: [], blacklistedOracles: [] },
  },
}

export default config
