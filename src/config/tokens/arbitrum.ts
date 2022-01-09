import { ChainId, Token } from '@sushiswap/core-sdk'

export const USDC = new Token(ChainId.ARBITRUM, '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8', 6, 'USDC', 'USD Coin')

export const WBTC = new Token(
  ChainId.ARBITRUM,
  '0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f',
  8,
  'WBTC',
  'Wrapped Bitcoin'
)

export const USDT = new Token(ChainId.ARBITRUM, '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9', 8, 'USDT', 'Tether USD')

export const MIM = new Token(
  ChainId.ARBITRUM,
  '0xFEa7a6a0B346362BF88A9e4A88416B77a57D6c2A',
  18,
  'MIM',
  'Magic Internet Money'
)

export const SPELL = new Token(
  ChainId.ARBITRUM,
  '0x3E6648C5a70A150A88bCE65F4aD4d506Fe15d2AF',
  18,
  'SPELL',
  'Spell Token'
)

export const ICE = new Token(ChainId.ARBITRUM, '0xCB58418Aa51Ba525aEF0FE474109C0354d844b7c', 18, 'ICE', 'ICEToken')

export const gOHM = new Token(
  ChainId.ARBITRUM,
  '0x8D9bA570D6cb60C7e3e0F31343Efe75AB8E65FB1',
  18,
  'gOHM',
  'Governance OHM'
)

export const MAGIC = new Token(ChainId.ARBITRUM, '0x539bdE0d7Dbd336b79148AA742883198BBF60342', 18, 'MAGIC', 'MAGIC')
