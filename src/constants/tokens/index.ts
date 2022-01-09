import { ChainId, SUSHI_ADDRESS, Token } from '@sushiswap/sdk'

type ChainTokenMap = {
  readonly [chainId in ChainId]?: Token
}

// SUSHI
export const SUSHI: ChainTokenMap = {
  [ChainId.MAINNET]: new Token(ChainId.MAINNET, SUSHI_ADDRESS[ChainId.MAINNET], 18, 'SUSHI', 'SushiToken'),
  [ChainId.ROPSTEN]: new Token(ChainId.ROPSTEN, SUSHI_ADDRESS[ChainId.ROPSTEN], 18, 'SUSHI', 'SushiToken'),
  [ChainId.RINKEBY]: new Token(ChainId.RINKEBY, SUSHI_ADDRESS[ChainId.RINKEBY], 18, 'SUSHI', 'SushiToken'),
  [ChainId.GÖRLI]: new Token(ChainId.GÖRLI, SUSHI_ADDRESS[ChainId.GÖRLI], 18, 'SUSHI', 'SushiToken'),
  [ChainId.KOVAN]: new Token(ChainId.KOVAN, SUSHI_ADDRESS[ChainId.KOVAN], 18, 'SUSHI', 'SushiToken'),
  [ChainId.MATIC]: new Token(ChainId.MATIC, SUSHI_ADDRESS[ChainId.MATIC], 18, 'SUSHI', 'SushiToken'),
  [ChainId.FANTOM]: new Token(ChainId.FANTOM, SUSHI_ADDRESS[ChainId.FANTOM], 18, 'SUSHI', 'SushiToken'),
  [ChainId.XDAI]: new Token(ChainId.XDAI, SUSHI_ADDRESS[ChainId.XDAI], 18, 'SUSHI', 'SushiToken'),
  [ChainId.BSC]: new Token(ChainId.BSC, SUSHI_ADDRESS[ChainId.BSC], 18, 'SUSHI', 'SushiToken'),
  [ChainId.ARBITRUM]: new Token(ChainId.ARBITRUM, SUSHI_ADDRESS[ChainId.ARBITRUM], 18, 'SUSHI', 'SushiToken'),
  [ChainId.AVALANCHE]: new Token(ChainId.AVALANCHE, SUSHI_ADDRESS[ChainId.AVALANCHE], 18, 'SUSHI', 'SushiToken'),
  [ChainId.OKEX]: new Token(ChainId.OKEX, SUSHI_ADDRESS[ChainId.OKEX], 18, 'SUSHI', 'SushiToken'),
  [ChainId.HARMONY]: new Token(ChainId.HARMONY, SUSHI_ADDRESS[ChainId.HARMONY], 18, 'SUSHI', 'SushiToken'),
  [ChainId.HECO]: new Token(ChainId.HECO, SUSHI_ADDRESS[ChainId.HECO], 18, 'SUSHI', 'SushiToken'),
  [ChainId.CELO]: new Token(ChainId.CELO, SUSHI_ADDRESS[ChainId.CELO], 18, 'SUSHI', 'SushiToken'),
  [ChainId.MOONRIVER]: new Token(ChainId.MOONRIVER, SUSHI_ADDRESS[ChainId.MOONRIVER], 18, 'SUSHI', 'SushiToken'),
  [ChainId.TELOS]: new Token(ChainId.TELOS, SUSHI_ADDRESS[ChainId.TELOS], 18, 'SUSHI', 'SushiToken'),
  [ChainId.FUSE]: new Token(ChainId.FUSE, SUSHI_ADDRESS[ChainId.FUSE], 18, 'SUSHI', 'SushiToken'),
}

export const XSUSHI = new Token(ChainId.MAINNET, '0x8798249c2E607446EfB7Ad49eC89dD1865Ff4272', 18, 'xSUSHI', 'SushiBar')
export const USDC = new Token(ChainId.MAINNET, '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', 6, 'USDC', 'USD Coin')
export const DAI = new Token(ChainId.MAINNET, '0x6B175474E89094C44Da98b954EedeAC495271d0F', 18, 'DAI', 'Dai Stablecoin')
export const MEOW = new Token(ChainId.MAINNET, '0x650F44eD6F1FE0E1417cb4b3115d52494B4D9b6D', 18, 'MEOW', 'Meowshi')
export const CRXSUSHI = new Token(
  ChainId.MAINNET,
  '0x228619cca194fbe3ebeb2f835ec1ea5080dafbb2',
  8,
  'crXSUSHI',
  'Cream SushiBar'
)
export const AXSUSHI = new Token(
  ChainId.MAINNET,
  '0xf256cc7847e919fac9b808cc216cac87ccf2f47a',
  18,
  'aXSUSHI',
  'Aave interest bearing XSUSHI'
)
