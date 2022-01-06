import { ChainId, Token } from '@sushiswap/core-sdk'

export const DAI = new Token(ChainId.BSC, '0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3', 18, 'DAI', 'Dai Stablecoin')
export const USD = new Token(ChainId.BSC, '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56', 18, 'BUSD', 'Binance USD')
export const USDC = new Token(ChainId.BSC, '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d', 18, 'USDC', 'USD Coin')
export const USDT = new Token(ChainId.BSC, '0x55d398326f99059fF775485246999027B3197955', 18, 'USDT', 'Tether USD')
export const BTCB = new Token(ChainId.BSC, '0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c', 18, 'BTCB', 'Bitcoin')
export const WETH = new Token(ChainId.BSC, '0x2170Ed0880ac9A755fd29B2688956BD959F933F8', 18, 'WETH', 'Wrapped Ether')
export const MIM = new Token(
  ChainId.BSC,
  '0xfE19F0B51438fd612f6FD59C1dbB3eA319f433Ba',
  18,
  'MIM',
  'Magic Internet Money'
)
export const ICE = new Token(ChainId.BSC, '0xf16e81dce15B08F326220742020379B855B87DF9', 18, 'ICE', 'IceToken')
export const SPELL = new Token(ChainId.BSC, '0x9Fe28D11ce29E340B7124C493F59607cbAB9ce48', 18, 'SPELL', 'SpellToken')
