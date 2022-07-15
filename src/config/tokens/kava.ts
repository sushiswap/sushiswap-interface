import { ChainId, Token } from '@sushiswap/core-sdk'

export const DAI = new Token(ChainId.KAVA, '0x765277EebeCA2e31912C9946eAe1021199B39C61', 18, 'DAI', 'Dai Stablecoin')
export const USDC = new Token(ChainId.KAVA, '0xfA9343C3897324496A05fC75abeD6bAC29f8A40f', 6, 'USDC', 'USD Coin')
export const USDT = new Token(ChainId.KAVA, '0xB44a9B6905aF7c801311e8F4E76932ee959c663C', 6, 'USDT', 'Tether USD')
export const WBTC = new Token(ChainId.KAVA, '0x818ec0A7Fe18Ff94269904fCED6AE3DaE6d6dC0b', 8, 'WBTC', 'Wrapped Bitcoin')
export const WETH = new Token(ChainId.KAVA, '0xE3F5a90F9cb311505cd691a46596599aA1A0AD7D', 18, 'WETH', 'Wrapped Ether')
