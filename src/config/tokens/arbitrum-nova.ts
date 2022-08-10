import { ChainId, Token } from '@sushiswap/core-sdk'

export const USDC = new Token(
  ChainId.ARBITRUM_NOVA,
  '0x750ba8b76187092B0D1E87E28daaf484d1b5273b',
  6,
  'USDC',
  'USD Coin'
)
export const WBTC = new Token(
  ChainId.ARBITRUM_NOVA,
  '0x1d05e4e72cD994cdF976181CfB0707345763564d',
  8,
  'WBTC',
  'Wrapped Bitcoin'
)
export const USDT = new Token(
  ChainId.ARBITRUM_NOVA,
  '0xeD9d63a96c27f87B07115b56b2e3572827f21646',
  8,
  'USDT',
  'Tether USD'
)
export const DAI = new Token(
  ChainId.ARBITRUM_NOVA,
  '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1',
  18,
  'DAI',
  'Dai Stablecoin'
)

export const MOON = new Token(ChainId.ARBITRUM_NOVA, '0x0057Ac2d777797d31CD3f8f13bF5e927571D6Ad0', 18, 'MOON', 'Moons')

export const BRICK = new Token(
  ChainId.ARBITRUM_NOVA,
  '0x6DcB98f460457fe4952e12779Ba852F82eCC62C1',
  18,
  'BRICK',
  'Bricks'
)
