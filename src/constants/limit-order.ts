import { ChainId } from '@sushiswap/sdk'

export const LIMIT_ORDER_ADDRESS: {
    [chainId in ChainId]: string
} = {
    [ChainId.MAINNET]: '',
    [ChainId.ROPSTEN]: '',
    [ChainId.RINKEBY]: '',
    [ChainId.GÖRLI]: '',
    [ChainId.KOVAN]: '0xce9365dB1C99897f04B3923C03ba9a5f80E8DB87',
    [ChainId.FANTOM]: '',
    [ChainId.FANTOM_TESTNET]: '',
    [ChainId.MATIC]: '0x1aDb3Bd86bb01797667eC382a0BC6A9854b4005f',
    [ChainId.MATIC_TESTNET]: '',
    [ChainId.XDAI]: '',
    [ChainId.BSC]: '',
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
}
