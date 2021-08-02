import { BigNumber } from '@ethersproject/bignumber'
import { ChainId } from '@sushiswap/sdk'

// Functions that need accrue to be called
export const ACTION_ADD_ASSET = 1
export const ACTION_REPAY = 2
export const ACTION_REMOVE_ASSET = 3
export const ACTION_REMOVE_COLLATERAL = 4
export const ACTION_BORROW = 5
export const ACTION_GET_REPAY_SHARE = 6
export const ACTION_GET_REPAY_PART = 7
export const ACTION_ACCRUE = 8

// Functions that don't need accrue to be called
export const ACTION_ADD_COLLATERAL = 10
export const ACTION_UPDATE_EXCHANGE_RATE = 11

// Function on BentoBox
export const ACTION_BENTO_DEPOSIT = 20
export const ACTION_BENTO_WITHDRAW = 21
export const ACTION_BENTO_TRANSFER = 22
export const ACTION_BENTO_TRANSFER_MULTIPLE = 23
export const ACTION_BENTO_SETAPPROVAL = 24

// Any external call (except to BentoBox)
export const ACTION_CALL = 30

export const MINIMUM_TARGET_UTILIZATION = BigNumber.from('700000000000000000') // 70%

export const MAXIMUM_TARGET_UTILIZATION = BigNumber.from('800000000000000000') // 80%

export const UTILIZATION_PRECISION = BigNumber.from('1000000000000000000')

export const FULL_UTILIZATION = BigNumber.from('1000000000000000000')

export const FULL_UTILIZATION_MINUS_MAX = FULL_UTILIZATION.sub(MAXIMUM_TARGET_UTILIZATION)

export const STARTING_INTEREST_PER_YEAR = BigNumber.from(317097920)
  .mul(BigNumber.from(60))
  .mul(BigNumber.from(60))
  .mul(BigNumber.from(24))
  .mul(BigNumber.from(365)) // approx 1% APR

export const MINIMUM_INTEREST_PER_YEAR = BigNumber.from(79274480)
  .mul(BigNumber.from(60))
  .mul(BigNumber.from(60))
  .mul(BigNumber.from(24))
  .mul(BigNumber.from(365)) // approx 0.25% APR

export const MAXIMUM_INTEREST_PER_YEAR = BigNumber.from(317097920000)
  .mul(BigNumber.from(60))
  .mul(BigNumber.from(60))
  .mul(BigNumber.from(24))
  .mul(BigNumber.from(365)) // approx 1000% APR

export const INTEREST_ELASTICITY = BigNumber.from('28800000000000000000000000000000000000000') // Half or double in 28800 seconds (8 hours) if linear

export const FACTOR_PRECISION = BigNumber.from('1000000000000000000')

export const PROTOCOL_FEE = BigNumber.from('10000') // 10%

export const PROTOCOL_FEE_DIVISOR = BigNumber.from('100000')

// export const BENTOBOX_ADDRESS = '0xF5BCE5077908a1b7370B9ae04AdC565EBd643966'

export const BENTOBOX_ADDRESS: {
  [chainId in ChainId]: string
} = {
  [ChainId.MAINNET]: '0xF5BCE5077908a1b7370B9ae04AdC565EBd643966',
  [ChainId.ROPSTEN]: '0xF5BCE5077908a1b7370B9ae04AdC565EBd643966',
  [ChainId.RINKEBY]: '0xF5BCE5077908a1b7370B9ae04AdC565EBd643966',
  [ChainId.GÖRLI]: '0xF5BCE5077908a1b7370B9ae04AdC565EBd643966',
  [ChainId.KOVAN]: '0xF5BCE5077908a1b7370B9ae04AdC565EBd643966',
  [ChainId.FANTOM]: '0xF5BCE5077908a1b7370B9ae04AdC565EBd643966',
  [ChainId.FANTOM_TESTNET]: '',
  [ChainId.MATIC]: '0x0319000133d3AdA02600f0875d2cf03D442C3367',
  [ChainId.MATIC_TESTNET]: '0xF5BCE5077908a1b7370B9ae04AdC565EBd643966',
  [ChainId.XDAI]: '0xE2d7F5dd869Fc7c126D21b13a9080e75a4bDb324',
  [ChainId.BSC]: '0xF5BCE5077908a1b7370B9ae04AdC565EBd643966',
  [ChainId.BSC_TESTNET]: '0xF5BCE5077908a1b7370B9ae04AdC565EBd643966',
  [ChainId.ARBITRUM]: '',
  [ChainId.ARBITRUM_TESTNET]: '',
  [ChainId.MOONBEAM_TESTNET]: '',
  [ChainId.AVALANCHE]: '',
  [ChainId.AVALANCHE_TESTNET]: '',
  [ChainId.HECO]: '0xF5BCE5077908a1b7370B9ae04AdC565EBd643966',
  [ChainId.HECO_TESTNET]: '',
  [ChainId.HARMONY]: '',
  [ChainId.HARMONY_TESTNET]: '',
  [ChainId.OKEX]: '',
  [ChainId.OKEX_TESTNET]: '',
  [ChainId.CELO]: '',
  [ChainId.PALM]: '',
  [ChainId.PALM_TESTNET]: '',
}

export const KASHI_ADDRESS: {
  [chainId in ChainId]: string
} = {
  [ChainId.MAINNET]: '0x2cBA6Ab6574646Badc84F0544d05059e57a5dc42',
  [ChainId.ROPSTEN]: '',
  [ChainId.RINKEBY]: '',
  [ChainId.GÖRLI]: '',
  [ChainId.KOVAN]: '0x2cBA6Ab6574646Badc84F0544d05059e57a5dc42',
  [ChainId.FANTOM]: '',
  [ChainId.FANTOM_TESTNET]: '',
  [ChainId.MATIC]: '0xB527C5295c4Bc348cBb3a2E96B2494fD292075a7',
  [ChainId.MATIC_TESTNET]: '',
  [ChainId.XDAI]: '0x7a6DA9903d0a481F40b8336c1463487BC8C0407e',
  [ChainId.BSC]: '0x2cBA6Ab6574646Badc84F0544d05059e57a5dc42',
  [ChainId.BSC_TESTNET]: '',
  [ChainId.ARBITRUM]: '',
  [ChainId.ARBITRUM_TESTNET]: '',
  [ChainId.MOONBEAM_TESTNET]: '',
  [ChainId.AVALANCHE]: '',
  [ChainId.AVALANCHE_TESTNET]: '',
  [ChainId.HECO]: '0x2cBA6Ab6574646Badc84F0544d05059e57a5dc42',
  [ChainId.HECO_TESTNET]: '',
  [ChainId.HARMONY]: '',
  [ChainId.HARMONY_TESTNET]: '',
  [ChainId.OKEX]: '',
  [ChainId.OKEX_TESTNET]: '',
  [ChainId.CELO]: '',
  [ChainId.PALM]: '',
  [ChainId.PALM_TESTNET]: '',
}

// export const KASHI_ADDRESS = '0x2cBA6Ab6574646Badc84F0544d05059e57a5dc42'

export const SUSHISWAP_SWAPPER_ADDRESS: {
  [chainId in ChainId]: string
} = {
  [ChainId.MAINNET]: '0x1766733112408b95239aD1951925567CB1203084',
  [ChainId.ROPSTEN]: '',
  [ChainId.RINKEBY]: '',
  [ChainId.GÖRLI]: '',
  [ChainId.KOVAN]: '',
  [ChainId.FANTOM]: '',
  [ChainId.FANTOM_TESTNET]: '',
  [ChainId.MATIC]: '0xe9589382130Ded5DF2397E2fD7A3E9b41DD2701D',
  [ChainId.MATIC_TESTNET]: '',
  [ChainId.XDAI]: '0xE02BDb31C353CE95A1D74F81C93eEa70Bf7371B9',
  [ChainId.BSC]: '0x1766733112408b95239aD1951925567CB1203084',
  [ChainId.BSC_TESTNET]: '',
  [ChainId.ARBITRUM]: '',
  [ChainId.ARBITRUM_TESTNET]: '',
  [ChainId.MOONBEAM_TESTNET]: '',
  [ChainId.AVALANCHE]: '',
  [ChainId.AVALANCHE_TESTNET]: '',
  [ChainId.HECO]: '0x1766733112408b95239aD1951925567CB1203084',
  [ChainId.HECO_TESTNET]: '',
  [ChainId.HARMONY]: '',
  [ChainId.HARMONY_TESTNET]: '',
  [ChainId.OKEX]: '',
  [ChainId.OKEX_TESTNET]: '',
  [ChainId.CELO]: '',
  [ChainId.PALM]: '',
  [ChainId.PALM_TESTNET]: '',
}

export const SUSHISWAP_MULTISWAPPER_ADDRESS: {
  [chainId in ChainId]: string
} = {
  [ChainId.MAINNET]: '0x545820d5Cc05248da112419fEfb18522c63C8e12',
  [ChainId.ROPSTEN]: '',
  [ChainId.RINKEBY]: '',
  [ChainId.GÖRLI]: '',
  [ChainId.KOVAN]: '0xc0c1649b2c67f1a9f5ff1dd618188165e2555bcf',
  [ChainId.FANTOM]: '',
  [ChainId.FANTOM_TESTNET]: '',
  [ChainId.MATIC]: '0x73BE093B84c773fe8eE0f76DDc0829E45c215415',
  [ChainId.MATIC_TESTNET]: '',
  [ChainId.XDAI]: '0x735f0FbEb3b6389986BcaAf073Af07D2F8be2b93',
  [ChainId.BSC]: '0x86c655cAc122e9A2fd9Ae1f79Df27b30E357968c',
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

export const SUSHISWAP_MULTI_EXACT_SWAPPER_ADDRESS = {
  [ChainId.MAINNET]: '0xB527C5295c4Bc348cBb3a2E96B2494fD292075a7',
  [ChainId.ROPSTEN]: '',
  [ChainId.RINKEBY]: '',
  [ChainId.GÖRLI]: '',
  [ChainId.KOVAN]: '0x75AE0Aa596D39b20addC921DeB5EE3c96279dABE',
  [ChainId.FANTOM]: '',
  [ChainId.FANTOM_TESTNET]: '',
  [ChainId.MATIC]: '0xDB6C4EDd9545d3b815dA85E6429B699c418886f9',
  [ChainId.MATIC_TESTNET]: '',
  [ChainId.XDAI]: '0x07b6e34EeCF38B02e83b6B4702699717e298967E',
  [ChainId.BSC]: '0x1B16149Edaf1EFa6ADE6aEEF33e63C6e08c9bB1B',
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

export const PEGGED_ORACLE_ADDRESS = '0x6cbfbB38498Df0E1e7A4506593cDB02db9001564'

export const SUSHISWAP_TWAP_0_ORACLE_ADDRESS = '0x66F03B0d30838A3fee971928627ea6F59B236065'

export const SUSHISWAP_TWAP_1_ORACLE_ADDRESS = '0x0D51b575591F8f74a2763Ade75D3CDCf6789266f'

export const CHAINLINK_ORACLE_ADDRESS = '0x00632CFe43d8F9f8E6cD0d39Ffa3D4fa7ec73CFB'

export const BORING_HELPER_ADDRESS = {
  [ChainId.MAINNET]: '0x11Ca5375AdAfd6205E41131A4409f182677996E6',
  [ChainId.ROPSTEN]: '',
  [ChainId.RINKEBY]: '',
  [ChainId.GÖRLI]: '',
  [ChainId.KOVAN]: '0x11Ca5375AdAfd6205E41131A4409f182677996E6',
  [ChainId.FANTOM]: '',
  [ChainId.FANTOM_TESTNET]: '',
  [ChainId.MATIC]: '0xA77a7fD5a16237B85E0FAd02C51f459D18AE93Cd',
  [ChainId.MATIC_TESTNET]: '',
  [ChainId.XDAI]: '0x97e4a0fb71243A83A6FbaEF7Cf73617594e4cF2F',
  [ChainId.BSC]: '0x11Ca5375AdAfd6205E41131A4409f182677996E6',
  [ChainId.BSC_TESTNET]: '',
  [ChainId.ARBITRUM]: '',
  [ChainId.ARBITRUM_TESTNET]: '',
  [ChainId.MOONBEAM_TESTNET]: '',
  [ChainId.AVALANCHE]: '',
  [ChainId.AVALANCHE_TESTNET]: '',
  [ChainId.HECO]: '0x11Ca5375AdAfd6205E41131A4409f182677996E6',
  [ChainId.HECO_TESTNET]: '',
  [ChainId.HARMONY]: '',
  [ChainId.HARMONY_TESTNET]: '',
  [ChainId.OKEX]: '',
  [ChainId.OKEX_TESTNET]: '',
  [ChainId.CELO]: '',
}
