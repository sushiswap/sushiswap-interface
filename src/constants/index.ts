import { ChainId, JSBI, Percent } from '@figswap/core-sdk'

// TODO: Move some of this to config level...

// TODO: update weekly with new constant
export const WEEKLY_MERKLE_ROOT =
  'https://raw.githubusercontent.com/sushiswap/sushi-vesting/master/merkle/week-28/merkle.json'

export const PROTOCOL_MERKLE_ROOT =
  'https://raw.githubusercontent.com/sushiswap/sushi-vesting/master/merkle/protocol-02/merkle-10959148-12171394.json'

export const NetworkContextName = 'NETWORK'

// 30 minutes, denominated in seconds
export const DEFAULT_DEADLINE_FROM_NOW = 60 * 30

// used for rewards deadlines
export const BIG_INT_SECONDS_IN_WEEK = JSBI.BigInt(60 * 60 * 24 * 7)

export const BIG_INT_ZERO = JSBI.BigInt(0)

// one basis point
export const ONE_BIPS = new Percent(JSBI.BigInt(1), JSBI.BigInt(10000))
export const BIPS_BASE = JSBI.BigInt(10000)

// used for warning states
export const ALLOWED_PRICE_IMPACT_LOW: Percent = new Percent(JSBI.BigInt(100), BIPS_BASE) // 1%
export const ALLOWED_PRICE_IMPACT_MEDIUM: Percent = new Percent(JSBI.BigInt(300), BIPS_BASE) // 3%
export const ALLOWED_PRICE_IMPACT_HIGH: Percent = new Percent(JSBI.BigInt(500), BIPS_BASE) // 5%

// if the price slippage exceeds this number, force the user to type 'confirm' to execute
export const PRICE_IMPACT_WITHOUT_FEE_CONFIRM_MIN: Percent = new Percent(JSBI.BigInt(1000), BIPS_BASE) // 10%

// for non expert mode disable swaps above this
export const BLOCKED_PRICE_IMPACT_NON_EXPERT: Percent = new Percent(JSBI.BigInt(1500), BIPS_BASE) // 15%

// used to ensure the user doesn't send so much ETH so they end up with <.01
export const MIN_ETH: JSBI = JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(16)) // .01 ETH
export const ONE_ETH: JSBI = JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(18))

export const BETTER_TRADE_LESS_HOPS_THRESHOLD = new Percent(JSBI.BigInt(50), JSBI.BigInt(10000))

export const ZERO_PERCENT = new Percent('0')

export const ONE_HUNDRED_PERCENT = new Percent('1')

export const ANALYTICS_URL: { [chainId in ChainId]?: string } = {
  // Note (amiller68): We don't have a separate analytics page on FigSwap, keeping this here for now for reference.
  // [ChainId.ETHEREUM]: 'https://analytics.sushi.com',
}

// TODO (amiller68): #Research - What is the Activation Block for each chain?
export const EIP_1559_ACTIVATION_BLOCK: { [chainId in ChainId]?: number } = {
  // This is the block number for the EIP-1559 activation on Ethereum Mainnet
  // [ChainId.ETHEREUM]: 12965000,
}

export const DEFAULT_TXN_DISMISS_MS = 25000

export const IS_IN_IFRAME = typeof window !== 'undefined' && window.parent !== window
