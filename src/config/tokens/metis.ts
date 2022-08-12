import { ChainId, Token } from '@sushiswap/core-sdk'

export const DAI = new Token(ChainId.METIS, '0x4c078361FC9BbB78DF910800A991C7c3DD2F6ce0', 18, 'DAI', 'Dai Stablecoin')
export const USDC = new Token(ChainId.METIS, '0xEA32A96608495e54156Ae48931A7c20f0dcc1a21', 6, 'USDC', 'USD Coin')
export const USDT = new Token(ChainId.METIS, '0xbB06DCA3AE6887fAbF931640f67cab3e3a16F4dC', 6, 'USDT', 'Tether USD')
export const WETH = new Token(ChainId.METIS, '0x420000000000000000000000000000000000000A', 18, 'WETH', 'Wrapped Ether')
export const WBTC = new Token(ChainId.METIS, '0xa5B55ab1dAF0F8e1EFc0eB1931a957fd89B918f4', 8, 'WBTC', 'Wrapped Bitcoin')
