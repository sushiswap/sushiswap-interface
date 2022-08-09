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
  '0x52484E1ab2e2B22420a25c20FA49E173a26202Cd',
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
