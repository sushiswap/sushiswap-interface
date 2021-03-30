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

export const BENTOBOX_ADDRESS = '0xF5BCE5077908a1b7370B9ae04AdC565EBd643966'

export const KASHI_ADDRESS = '0x74A81CB5b6996d9347b864b9a1492a6509e51e65'

export const SUSHISWAP_SWAPPER_ADDRESS = '0x1766733112408b95239aD1951925567CB1203084'

export const PEGGED_ORACLE_ADDRESS = '0x6cbfbB38498Df0E1e7A4506593cDB02db9001564'

export const SUSHISWAP_TWAP_0_ORACLE_ADDRESS = '0x66F03B0d30838A3fee971928627ea6F59B236065'

export const SUSHISWAP_TWAP_1_ORACLE_ADDRESS = '0x0D51b575591F8f74a2763Ade75D3CDCf6789266f'

export const CHAINLINK_ORACLE_ADDRESS = '0xD766147Bc5A0044a6b4f4323561B162870FcBb48'

export const BORING_HELPER_ADDRESS = '0x11Ca5375AdAfd6205E41131A4409f182677996E6'

export const KASHI_HELPER_ADDRESS: {
  [chainId in ChainId]?: string
} = {
  [ChainId.MAINNET]: '0xE935d1d2c5EaeDA6Ac08dC855e5DB28a11436813',
  [ChainId.ROPSTEN]: '0xAe338e484372e4487B5438421c48342c100c9E16'
}

type ChainKashiList = {
  readonly [chainId in ChainId]?: string[]
}

export const CLONE_ADDRESSES: ChainKashiList = {
  [ChainId.MAINNET]: [
    '0xE20C1Bdf43ea332b1D0517A95e556Dfe93634bbA',
    '0x859F2bbb3d3F612A2D5FA0F2cDB17C6a0CDB8Fe0',
    '0xd739a8d665a949fdd97556c293e08CDC26BA20Dd',
    '0x80Ba427111ddF915d9d754Df3FbA8C07c6367A08',
    '0x4DdbDb04940E11D16822D058DFb6A90Bf126EeE2',
    '0xae8b79Da9c23eC6F3870aCCdDef4B38A709E54fF',
    '0xC237770b1a11518F54471B1A65DEA3D7703ad131',
    '0xD698Fd157DF3E864A152B030F5cbEB8618a8771e',
    '0x4f34e97526a01b6Cd6aD90567F52afa1C3F2B2De',
    '0x5EBb3D71557bEA688Af94be80551d3B394121DED',
    '0xb7D969Ebdd36C2d75A24ff4F4176186a424F01bE',
    '0x36BCE45aC596288602bDc0F6e75270D354BF53B3',
    '0xae28cBCDA74D5f8fB024a8134E7b1d5129082De3',
    '0xa323eAf0Ba4D7BbF440782C0324062a0BB28B474'
  ],
  // [ChainId.MAINNET]: [
  //   '0x1f85F0aCd9022A3686ed4E7C6bf2F61fEF8c5009',
  //   '0x557A0B09ca7f7F7bD0C3d9ddD9FdF2663F787231',
  //   '0xb533b92d6F100AdbB081fE6EfCdE644fc9D58fF3',
  //   '0xd233a09177144ba2873497Dc67694818bb6902eb',
  //   '0x46AaBF31A40da7848bacfB91D53B9157eB21545E',
  //   '0xB774d6711844DAbAf5CeeFc51dc392508c920aC3',
  //   '0xE551ff7E013d8d7bECB1fEb18D0173AB5E58415c'
  // ],
  [ChainId.ROPSTEN]: [
    '0x1e03b8e17080d84b7143039f4518dE60e379ef9a',
    '0x8A960F49b66984dfB31CBAB175EeDedC8ddebD09',
    '0x0313E8D3F3C57Dda47d4d2DcE4A7ecb619bb23Fc'
  ]
}

// TODO: Remove, this is redundant, use WETH map from SDK which supports all networks
export const WETH: {
  [chainId in ChainId]?: string
} = {
  [ChainId.MAINNET]: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'
}
