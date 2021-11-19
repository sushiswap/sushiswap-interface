import { ChainId, Token } from '@sushiswap/sdk'

export const USDC = new Token(ChainId.MOONRIVER, '0xE3F5a90F9cb311505cd691a46596599aA1A0AD7D', 6, 'USDC', 'USD Coin')
export const USDT = new Token(ChainId.MOONRIVER, '0xB44a9B6905aF7c801311e8F4E76932ee959c663C', 6, 'USDT', 'Tether USD')
export const WETH = new Token(
  ChainId.MOONRIVER,
  '0x639A647fbe20b6c8ac19E48E2de44ea792c62c5C',
  18,
  'WETH',
  'Wrapped Ether'
)
export const FRAX = new Token(ChainId.MOONRIVER, '0x965f84D915a9eFa2dD81b653e3AE736555d945f4', 18, 'FRAX', 'Frax')
export const MIM = new Token(
  ChainId.MOONRIVER,
  '0x0caE51e1032e8461f4806e26332c030E34De3aDb',
  18,
  'MIM',
  'Magic Internet Money'
)
export const BTC = new Token(
  ChainId.MOONRIVER,
  '0xE6a991Ffa8CfE62B0bf6BF72959A3d4f11B2E0f5',
  8,
  'WBTC',
  'Wrapped Bitcoin'
)
export const aROME = new Token(
  ChainId.MOONRIVER,
  '0x3D2D044E8C6dAd46b4F7896418d3d4DFaAD902bE',
  9,
  'aROME',
  'Alpha Rome'
)
