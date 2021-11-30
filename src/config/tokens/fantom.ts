import { ChainId, Token } from '@sushiswap/core-sdk'

export const USDC = new Token(ChainId.FANTOM, '0x04068DA6C83AFCFA0e13ba15A6696662335D5B75', 6, 'USDC', 'USD Coin')
export const WBTC = new Token(
  ChainId.FANTOM,
  '0x321162Cd933E2Be498Cd2267a90534A804051b11',
  8,
  'WBTC',
  'Wrapped Bitcoin'
)
export const DAI = new Token(ChainId.FANTOM, '0x8D11eC38a3EB5E956B052f67Da8Bdc9bef8Abf3E', 18, 'DAI', 'Dai Stablecoin')
export const WETH = new Token(ChainId.FANTOM, '0x74b23882a30290451A17c44f4F05243b6b58C76d', 18, 'WETH', 'Wrapped Ether')
