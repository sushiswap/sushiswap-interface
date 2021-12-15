import { ChainId, JSBI, Percent } from '@sushiswap/core-sdk'

export const POOL_DENY = ['14', '29', '45', '30']

// Block time here is slightly higher (~1s) than average in order to avoid ongoing proposals past the displayed time
export const AVERAGE_BLOCK_TIME_IN_SECS = 13

// TODO: update weekly with new constant
export const WEEKLY_MERKLE_ROOT =
  //'https://raw.githubusercontent.com/sushiswap/sushi-vesting/master/merkle/week-13/merkle-10959148-11550728.json'
  //'https://raw.githubusercontent.com/sushiswap/sushi-vesting/master/merkle/week-14/merkle-10959148-11596364.json'
  //'https://raw.githubusercontent.com/sushiswap/sushi-vesting/master/merkle/week-15/merkle-10959148-11641996.json'
  //'https://raw.githubusercontent.com/sushiswap/sushi-vesting/master/merkle/week-16/merkle-10959148-11687577.json'
  //'https://raw.githubusercontent.com/sushiswap/sushi-vesting/master/merkle/week-17/merkle-10959148-11733182.json'
  //'https://raw.githubusercontent.com/sushiswap/sushi-vesting/master/merkle/week-18/merkle-10959148-11778625.json'
  //'https://raw.githubusercontent.com/sushiswap/sushi-vesting/master/merkle/week-19/merkle-10959148-11824101.json'
  //'https://raw.githubusercontent.com/sushiswap/sushi-vesting/master/merkle/week-20/merkle-10959148-11869658.json'
  //'https://raw.githubusercontent.com/sushiswap/sushi-vesting/master/merkle/week-21/merkle-10959148-11915191.json'
  //'https://raw.githubusercontent.com/sushiswap/sushi-vesting/master/merkle/week-22/merkle-10959148-11960663.json'
  //'https://raw.githubusercontent.com/sushiswap/sushi-vesting/master/merkle/week-23/merkle-10959148-12006121.json'
  //'https://raw.githubusercontent.com/sushiswap/sushi-vesting/master/merkle/week-24/merkle-10959148-12051484.json'
  //'https://raw.githubusercontent.com/sushiswap/sushi-vesting/master/merkle/week-24/protocol-claim.json'
  //'https://raw.githubusercontent.com/sushiswap/sushi-vesting/master/merkle/week-24/merkle-10959148-12051484-2.json'
  //'https://raw.githubusercontent.com/sushiswap/sushi-vesting/master/merkle/week-25/merkle-10959148-12096934.json'
  //'https://raw.githubusercontent.com/sushiswap/sushi-vesting/master/merkle/week-26/merkle-10959148-12142433.json'
  'https://raw.githubusercontent.com/sushiswap/sushi-vesting/master/merkle/week-27/merkle-10959148-12171394.json'

export const PROTOCOL_MERKLE_ROOT =
  //'https://raw.githubusercontent.com/sushiswap/sushi-vesting/master/merkle/protocol/merkle-10959148-12171394.json'
  'https://raw.githubusercontent.com/sushiswap/sushi-vesting/master/merkle/protocol-02/merkle-10959148-12171394.json'

export const NetworkContextName = 'NETWORK'

// default allowed slippage, in bips
export const INITIAL_ALLOWED_SLIPPAGE = 50
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

export const BETTER_TRADE_LESS_HOPS_THRESHOLD = new Percent(JSBI.BigInt(50), JSBI.BigInt(10000))

export const ZERO_PERCENT = new Percent('0')
export const ONE_HUNDRED_PERCENT = new Percent('1')

// SDN OFAC addresses
export const BLOCKED_ADDRESSES: string[] = [
  '0x7F367cC41522cE07553e823bf3be79A889DEbe1B',
  '0xd882cFc20F52f2599D84b8e8D58C7FB62cfE344b',
  '0x901bb9583b24D97e995513C6778dc6888AB6870e',
  '0xA7e5d5A720f06526557c513402f2e6B5fA20b008',
]

export const ANALYTICS_URL: { [chainId in ChainId]?: string } = {
  [ChainId.ETHEREUM]: 'https://analytics.sushi.com',
  [ChainId.MATIC]: 'https://analytics-polygon.sushi.com',
  [ChainId.FANTOM]: 'https://analytics-ftm.sushi.com',
  [ChainId.BSC]: 'https://analytics-bsc.sushi.com',
  [ChainId.XDAI]: 'https://analytics-xdai.sushi.com',
  [ChainId.HARMONY]: 'https://analytics-harmony.sushi.com',
  [ChainId.ARBITRUM]: 'https://analytics-arbitrum.sushi.com',
}

export const EIP_1559_ACTIVATION_BLOCK: { [chainId in ChainId]?: number } = {
  [ChainId.ETHEREUM]: 12965000,
  [ChainId.ROPSTEN]: 10499401,
  [ChainId.GÖRLI]: 5062605,
  [ChainId.RINKEBY]: 8897988,
}
