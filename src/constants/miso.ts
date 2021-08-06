import { ChainId } from '@sushiswap/sdk'

export const MISO_HELPER_ADDRESS: {
  [chainId in ChainId]: string
} = {
  [ChainId.MAINNET]: '0xAea50fa0a2aB411807131ADC10016FE0FfB506b4',
  [ChainId.ROPSTEN]: '0xAea50fa0a2aB411807131ADC10016FE0FfB506b4',
  [ChainId.RINKEBY]: '0xAea50fa0a2aB411807131ADC10016FE0FfB506b4',
  [ChainId.GÖRLI]: '0xAea50fa0a2aB411807131ADC10016FE0FfB506b4',
  [ChainId.KOVAN]: '0xAea50fa0a2aB411807131ADC10016FE0FfB506b4',
  [ChainId.FANTOM]: '',
  [ChainId.FANTOM_TESTNET]: '',
  [ChainId.MATIC]: '',
  [ChainId.MATIC_TESTNET]: '0xAea50fa0a2aB411807131ADC10016FE0FfB506b4',
  [ChainId.XDAI]: '',
  [ChainId.BSC]: '',
  [ChainId.BSC_TESTNET]: '0xc075F6CA73A7cE819bb925cCFC727209f0B21eA7',
  [ChainId.ARBITRUM]: '',
  [ChainId.ARBITRUM_TESTNET]: '',
  [ChainId.MOONBEAM_TESTNET]: '',
  [ChainId.AVALANCHE]: '',
  [ChainId.AVALANCHE_TESTNET]: '',
  [ChainId.HECO]: '',
  [ChainId.HECO_TESTNET]: '',
  [ChainId.HARMONY]: '',
  [ChainId.HARMONY_TESTNET]: '',
  [ChainId.OKEX]: '',
  [ChainId.OKEX_TESTNET]: '',
  [ChainId.CELO]: '',
  [ChainId.PALM]: '',
  [ChainId.PALM_TESTNET]: '',
}

export const BAD_AUCTIONS: string[] = [
  '0xEd4A285845f19945b0EbC04a3165e3DCAf62fEeD',
  '0x595Ff4d3Cebb8Bf652C198481A82F6A4440f551c',
]

export const TOKEN_FACTORY_ADDRESS: {
  [chainId in ChainId]: string
} = {
  [ChainId.MAINNET]: '0x1eC9e6f1aDF139A41B94d2590078103f7b8a09DD',
  [ChainId.ROPSTEN]: '0x1eC9e6f1aDF139A41B94d2590078103f7b8a09DD',
  [ChainId.RINKEBY]: '0x1eC9e6f1aDF139A41B94d2590078103f7b8a09DD',
  [ChainId.GÖRLI]: '0x1eC9e6f1aDF139A41B94d2590078103f7b8a09DD',
  [ChainId.KOVAN]: '0x1eC9e6f1aDF139A41B94d2590078103f7b8a09DD',
  [ChainId.FANTOM]: '',
  [ChainId.FANTOM_TESTNET]: '',
  [ChainId.MATIC]: '',
  [ChainId.MATIC_TESTNET]: '0x1eC9e6f1aDF139A41B94d2590078103f7b8a09DD',
  [ChainId.XDAI]: '',
  [ChainId.BSC]: '',
  [ChainId.BSC_TESTNET]: '0xc16F721fc5d8E17D99deE8F9758a389F1fb85E91',
  [ChainId.ARBITRUM]: '',
  [ChainId.ARBITRUM_TESTNET]: '',
  [ChainId.MOONBEAM_TESTNET]: '',
  [ChainId.AVALANCHE]: '',
  [ChainId.AVALANCHE_TESTNET]: '',
  [ChainId.HECO]: '',
  [ChainId.HECO_TESTNET]: '',
  [ChainId.HARMONY]: '',
  [ChainId.HARMONY_TESTNET]: '',
  [ChainId.OKEX]: '',
  [ChainId.OKEX_TESTNET]: '',
  [ChainId.CELO]: '',
  [ChainId.PALM]: '',
  [ChainId.PALM_TESTNET]: '',
}

export const MISO_MARKET_ADDRESS: {
  [chainId in ChainId]: string
} = {
  [ChainId.MAINNET]: '0x9d6c60d26B8f776B85d5731AD56b88973C3D370b',
  [ChainId.ROPSTEN]: '0x9d6c60d26B8f776B85d5731AD56b88973C3D370b',
  [ChainId.RINKEBY]: '0x9d6c60d26B8f776B85d5731AD56b88973C3D370b',
  [ChainId.GÖRLI]: '0x9d6c60d26B8f776B85d5731AD56b88973C3D370b',
  [ChainId.KOVAN]: '0x9d6c60d26B8f776B85d5731AD56b88973C3D370b',
  [ChainId.FANTOM]: '',
  [ChainId.FANTOM_TESTNET]: '',
  [ChainId.MATIC]: '',
  [ChainId.MATIC_TESTNET]: '0x9d6c60d26B8f776B85d5731AD56b88973C3D370b',
  [ChainId.XDAI]: '',
  [ChainId.BSC]: '',
  [ChainId.BSC_TESTNET]: '0xdBD0Cb28F6e436Fd35c584409aFe9CdA0ffa4b81',
  [ChainId.ARBITRUM]: '',
  [ChainId.ARBITRUM_TESTNET]: '',
  [ChainId.MOONBEAM_TESTNET]: '',
  [ChainId.AVALANCHE]: '',
  [ChainId.AVALANCHE_TESTNET]: '',
  [ChainId.HECO]: '',
  [ChainId.HECO_TESTNET]: '',
  [ChainId.HARMONY]: '',
  [ChainId.HARMONY_TESTNET]: '',
  [ChainId.OKEX]: '',
  [ChainId.OKEX_TESTNET]: '',
  [ChainId.CELO]: '',
  [ChainId.PALM]: '',
  [ChainId.PALM_TESTNET]: '',
}

export const DAI_ADDRESS: {
  [chainId in ChainId]: string
} = {
  [ChainId.MAINNET]: '0x6b175474e89094c44da98b954eedeac495271d0f',
  [ChainId.ROPSTEN]: '',
  [ChainId.RINKEBY]: '',
  [ChainId.GÖRLI]: '0xF2D1F94310823FE26cFa9c9B6fD152834b8E7849',
  [ChainId.KOVAN]: '',
  [ChainId.FANTOM]: '',
  [ChainId.FANTOM_TESTNET]: '',
  [ChainId.MATIC]: '',
  [ChainId.MATIC_TESTNET]: '',
  [ChainId.XDAI]: '',
  [ChainId.BSC]: '0x1af3f329e8be154074d8769d1ffa4ee058b1dbc3',
  [ChainId.BSC_TESTNET]: '',
  [ChainId.ARBITRUM]: '',
  [ChainId.ARBITRUM_TESTNET]: '',
  [ChainId.MOONBEAM_TESTNET]: '',
  [ChainId.AVALANCHE]: '',
  [ChainId.AVALANCHE_TESTNET]: '',
  [ChainId.HECO]: '',
  [ChainId.HECO_TESTNET]: '',
  [ChainId.HARMONY]: '',
  [ChainId.HARMONY_TESTNET]: '',
  [ChainId.OKEX]: '',
  [ChainId.OKEX_TESTNET]: '',
  [ChainId.CELO]: '',
  [ChainId.PALM]: '',
  [ChainId.PALM_TESTNET]: '',
}

export const DAI_MISO_FEE_ACCT = '0x2a3070d384f2871c4fddf05f4c5dd9b6272fb54c'

export const ETH_TOKEN_ADDRESS = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'
