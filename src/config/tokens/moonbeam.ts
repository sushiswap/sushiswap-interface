import { ChainId, Token } from '@sushiswap/core-sdk'

export const USDC = new Token(ChainId.MOONBEAM, '0x8f552a71EFE5eeFc207Bf75485b356A0b3f01eC9', 6, 'USDC', 'USD Coin')
export const USDT = new Token(ChainId.MOONBEAM, '0x8e70cD5B4Ff3f62659049e74b6649c6603A0E594', 6, 'USDT', 'Tether USD')
export const WETH = new Token(
  ChainId.MOONBEAM,
  '0x30D2a9F5FDf90ACe8c17952cbb4eE48a55D916A7',
  18,
  'WETH',
  'Wrapped Ether'
)
// export const FRAX = new Token(ChainId.MOONBEAM, '', 18, 'FRAX', 'Frax')
// export const MIM = new Token(
//   ChainId.MOONBEAM,
//   '',
//   18,
//   'MIM',
//   'Magic Internet Money'
// )
export const WBTC = new Token(
  ChainId.MOONBEAM,
  '0x1DC78Acda13a8BC4408B207c9E48CDBc096D95e0',
  8,
  'WBTC',
  'Wrapped Bitcoin'
)
export const DAI = new Token(
  ChainId.MOONBEAM,
  '0xc234A67a4F840E61adE794be47de455361b52413',
  18,
  'DAI',
  'Dai Stablecoin'
)
export const UST = new Token(ChainId.MOONBEAM, '0x085416975fe14C2A731a97eC38B9bF8135231F62', 18, 'UST', 'TerraUSD')
