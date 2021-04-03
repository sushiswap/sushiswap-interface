import { BigNumber } from '@ethersproject/bignumber'
import { ChainId } from '@sushiswap/sdk'
import { ethers } from 'ethers'

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

export const KASHI_ADDRESS = '0x2cBA6Ab6574646Badc84F0544d05059e57a5dc42'

export const SUSHISWAP_SWAPPER_ADDRESS = '0x1766733112408b95239aD1951925567CB1203084'

export const PEGGED_ORACLE_ADDRESS = '0x6cbfbB38498Df0E1e7A4506593cDB02db9001564'

export const SUSHISWAP_TWAP_0_ORACLE_ADDRESS = '0x66F03B0d30838A3fee971928627ea6F59B236065'

export const SUSHISWAP_TWAP_1_ORACLE_ADDRESS = '0x0D51b575591F8f74a2763Ade75D3CDCf6789266f'

export const CHAINLINK_ORACLE_ADDRESS = '0x00632CFe43d8F9f8E6cD0d39Ffa3D4fa7ec73CFB'

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

type Currency = { "address": string, "decimals": number }

// Pricing currency
// TODO: Check decimals and finish table
export const USD_CURRENCY: { [chainId in ChainId]?: Currency } = {
  [ChainId.MAINNET]: { "address": '0xdAC17F958D2ee523a2206206994597C13D831ec7', "decimals": 6 },
  [ChainId.ROPSTEN]: { "address": '0x516de3a7A567d81737e3a46ec4FF9cFD1fcb0136', "decimals": 6 },
  [ChainId.KOVAN]: { "address": '0x07de306FF27a2B630B1141956844eB1552B956B5', "decimals": 6 },
  [ChainId.RINKEBY]: { "address": '0xD9BA894E0097f8cC2BBc9D24D308b98e36dc6D02', "decimals": 6 },
  [ChainId.GÖRLI]: { "address": '0xD87Ba7A50B2E7E660f678A895E4B72E7CB4CCd9C', "decimals": 6 },
  [ChainId.BSC]: { "address": '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56', "decimals": 6 },
  [ChainId.BSC_TESTNET]: { "address": '0x337610d27c682E347C9cD60BD4b3b107C9d34dDd', "decimals": 6 },
  [ChainId.HECO]: { "address": '0x0298c2b32eaE4da002a15f36fdf7615BEa3DA047', "decimals": 6 },
  [ChainId.HECO_TESTNET]: { "address": '', "decimals": 6 },
  [ChainId.MATIC]: { "address": '', "decimals": 6 },
  [ChainId.MATIC_TESTNET]: { "address": '', "decimals": 6 },
  [ChainId.XDAI]: { "address": '', "decimals": 6 },
}

export function getCurrency(chainId: ChainId | void): Currency {
  return USD_CURRENCY[chainId || 1] || { "address": ethers.constants.AddressZero, "decimals": 18 }
}

// TODO: Remove, this is redundant, use WETH map from SDK which supports all networks
export const WETH: {
  [chainId in ChainId]?: string
} = {
  [ChainId.MAINNET]: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'
}

export type ChainlinkToken = {
  symbol: string,
  name: string,
  address: string,
  decimals: number
}

export const CHAINLINK_TOKENS: { [chainId in ChainId]?: ChainlinkToken[] } = {
  [ChainId.MAINNET]: [
    { "symbol": "1INCH", "name": "1INCH Token", "address": "0x111111111117dC0aa78b770fA6A738034120C302", "decimals": 18 },
    { "symbol": "AAVE", "name": "Aave Token", "address": "0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9", "decimals": 18 },
    { "symbol": "ADX", "name": "AdEx Network", "address": "0xADE00C28244d5CE17D72E40330B1c318cD12B7c3", "decimals": 18 },
    { "symbol": "ALPHA", "name": "AlphaToken", "address": "0xa1faa113cbE53436Df28FF0aEe54275c13B40975", "decimals": 18 },
    { "symbol": "AMP", "name": "Amp", "address": "0xfF20817765cB7f73d4bde2e66e067E58D11095C2", "decimals": 18 },
    { "symbol": "ANT", "name": "Aragon Network Token", "address": "0xa117000000f279D81A1D3cc75430fAA017FA5A2e", "decimals": 18 },
    { "symbol": "BADGER", "name": "Badger", "address": "0x3472A5A71965499acd81997a54BBA8D852C6E53d", "decimals": 18 },
    { "symbol": "BAL", "name": "Balancer", "address": "0xba100000625a3754423978a60c9317c58a424e3D", "decimals": 18 },
    { "symbol": "BAND", "name": "BandToken", "address": "0xBA11D00c5f74255f56a5E366F4F77f5A186d7f55", "decimals": 18 },
    { "symbol": "BAT", "name": "Basic Attention Token", "address": "0x0D8775F648430679A709E98d2b0Cb6250d2887EF", "decimals": 18 },
    { "symbol": "BUSD", "name": "Binance USD", "address": "0x4Fabb145d64652a948d72533023f6E7A623C7C53", "decimals": 18 },
    { "symbol": "BZRX", "name": "bZx Protocol Token", "address": "0x56d811088235F11C8920698a204A5010a788f4b3", "decimals": 18 },
    { "symbol": "CEL", "name": "Celsius", "address": "0xaaAEBE6Fe48E54f431b0C390CfaF0b017d09D42d", "decimals": 4 },
    { "symbol": "COMP", "name": "Compound", "address": "0xc00e94Cb662C3520282E6f5717214004A7f26888", "decimals": 18 },
    { "symbol": "COVER", "name": "Cover Protocol Governance Token", "address": "0x4688a8b1F292FDaB17E9a90c8Bc379dC1DBd8713", "decimals": 18 },
    { "symbol": "CREAM", "name": "Cream", "address": "0x2ba592F78dB6436527729929AAf6c908497cB200", "decimals": 18 },
    { "symbol": "CRO", "name": "CRO", "address": "0xA0b73E1Ff0B80914AB6fe0444E65848C4C34450b", "decimals": 8 },
    { "symbol": "CRV", "name": "Curve DAO Token", "address": "0xD533a949740bb3306d119CC777fa900bA034cd52", "decimals": 18 },
    { "symbol": "DAI", "name": "Dai Stablecoin", "address": "0x6B175474E89094C44Da98b954EedeAC495271d0F", "decimals": 18 },
    { "symbol": "DPI", "name": "DefiPulse Index", "address": "0x1494CA1F11D487c2bBe4543E90080AeBa4BA3C2b", "decimals": 18 },
    { "symbol": "ENJ", "name": "Enjin Coin", "address": "0xF629cBd94d3791C9250152BD8dfBDF380E2a3B9c", "decimals": 18 },
    { "symbol": "ETH", "name": "Ethereum", "address": "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", "decimals": 18 },
    { "symbol": "FTM", "name": "Fantom Token", "address": "0x4E15361FD6b4BB609Fa63C81A2be19d873717870", "decimals": 18 },
    { "symbol": "FTX Token", "name": "FTT", "address": "0x50D1c9771902476076eCFc8B2A83Ad6b9355a4c9", "decimals": 18 },
    { "symbol": "GRT", "name": "Graph Token", "address": "0xc944E90C64B2c07662A292be6244BDf05Cda44a7", "decimals": 18 },
    { "symbol": "HEGIC", "name": "Hegic", "address": "0x584bC13c7D411c00c01A62e8019472dE68768430", "decimals": 18 },
    { "symbol": "INJ", "name": "Injective Token", "address": "0xe28b3B32B6c345A34Ff64674606124Dd5Aceca30", "decimals": 18 },
    { "symbol": "KNC", "name": "Kyber Network Crystal", "address": "0xdd974D5C2e2928deA5F71b9825b8b646686BD200", "decimals": 18 },
    { "symbol": "KP3R", "name": "Keep3rV1", "address": "0x1cEB5cB57C4D4E2b2433641b95Dd330A33185A44", "decimals": 18 },
    { "symbol": "LINK", "name": "ChainLink Token", "address": "0x514910771AF9Ca656af840dff83E8264EcF986CA", "decimals": 18 },
    { "symbol": "LRC", "name": "LoopringCoin V2", "address": "0xBBbbCA6A901c926F240b89EacB641d8Aec7AEafD", "decimals": 18 },
    { "symbol": "MANA", "name": "Decentraland MANA", "address": "0x0F5D2fB29fb7d3CFeE444a200298f468908cC942", "decimals": 18 },
    { "symbol": "MATIC", "name": "Matic Token", "address": "0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0", "decimals": 18 },
    { "symbol": "MKR", "name": "Maker", "address": "0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2", "decimals": 18 },
    { "symbol": "MLN", "name": "Melon Token", "address": "0xec67005c4E498Ec7f55E092bd1d35cbC47C91892", "decimals": 18 },
    { "symbol": "MTA", "name": "Meta", "address": "0xa3BeD4E1c75D00fa6f4E5E6922DB7261B5E9AcD2", "decimals": 18 },
    { "symbol": "NMR", "name": "Numeraire", "address": "0x1776e1F26f98b1A5dF9cD347953a26dd3Cb46671", "decimals": 18 },
    { "symbol": "OGN", "name": "OriginToken", "address": "0x8207c1FfC5B6804F6024322CcF34F29c3541Ae26", "decimals": 18 },
    { "symbol": "OMG", "name": "OMGToken", "address": "0xd26114cd6EE289AccF82350c8d8487fedB8A0C07", "decimals": 18 },
    { "symbol": "OXT", "name": "Orchid", "address": "0x4575f41308EC1483f3d399aa9a2826d74Da13Deb", "decimals": 18 },
    { "symbol": "PAX", "name": "Paxos Standard", "address": "0x8E870D67F660D95d5be530380D0eC0bd388289E1", "decimals": 18 },
    { "symbol": "PAXG", "name": "Paxos Gold", "address": "0x45804880De22913dAFE09f4980848ECE6EcbAf78", "decimals": 18 },
    { "symbol": "PERP", "name": "Perpetual", "address": "0xbC396689893D065F41bc2C6EcbeE5e0085233447", "decimals": 18 },
    { "symbol": "RCN", "name": "Ripio Credit Network Token", "address": "0xF970b8E36e23F7fC3FD752EeA86f8Be8D83375A6", "decimals": 18 },
    { "symbol": "REN", "name": "Republic Token", "address": "0x408e41876cCCDC0F92210600ef50372656052a38", "decimals": 18 },
    { "symbol": "REPv2", "name": "Reputation", "address": "0x221657776846890989a759BA2973e427DfF5C9bB", "decimals": 18 },
    { "symbol": "RLC", "name": "iEx.ec Network Token", "address": "0x607F4C5BB672230e8672085532f7e901544a7375", "decimals": 9 },
    { "symbol": "RUNE", "name": "THORChain ETH.RUNE", "address": "0x3155BA85D5F96b2d030a4966AF206230e46849cb", "decimals": 18 },
    { "symbol": "SNX", "name": "Synthetix Network Token", "address": "0xC011a73ee8576Fb46F5E1c5751cA3B9Fe0af2a6F", "decimals": 18 },
    { "symbol": "SRM", "name": "Serum", "address": "0x476c5E26a75bd202a9683ffD34359C0CC15be0fF", "decimals": 6 },
    { "symbol": "sUSD", "name": "Synth sUSD", "address": "0x57Ab1ec28D129707052df4dF418D58a2D46d5f51", "decimals": 18 },
    { "symbol": "SUSHI", "name": "SushiToken", "address": "0x6B3595068778DD592e39A122f4f5a5cF09C90fE2", "decimals": 18 },
    { "symbol": "SXP", "name": "Swipe", "address": "0x8CE9137d39326AD0cD6491fb5CC0CbA0e089b6A9", "decimals": 18 },
    { "symbol": "TOMOE", "name": "TomoChain", "address": "0x05D3606d5c81EB9b7B18530995eC9B29da05FaBa", "decimals": 18 },
    { "symbol": "TRU", "name": "TrueFi", "address": "0x4C19596f5aAfF459fA38B0f7eD92F11AE6543784", "decimals": 8 },
    { "symbol": "TUSD", "name": "TrueUSD", "address": "0x0000000000085d4780B73119b644AE5ecd22b376", "decimals": 18 },
    { "symbol": "UMA", "name": "UMA Voting Token v1", "address": "0x04Fa0d235C4abf4BcF4787aF4CF447DE572eF828", "decimals": 18 },
    { "symbol": "UNI", "name": "Uniswap", "address": "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984", "decimals": 18 },
    { "symbol": "USDC", "name": "USD Coin", "address": "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", "decimals": 6 },
    { "symbol": "USDT", "name": "Tether USD", "address": "0xdAC17F958D2ee523a2206206994597C13D831ec7", "decimals": 6 },
    { "symbol": "UST", "name": "Wrapped UST Token", "address": "0xa47c8bf37f92aBed4A126BDA807A7b7498661acD", "decimals": 18 },
    { "symbol": "WAVES", "name": "WAVES", "address": "0x1cF4592ebfFd730c7dc92c1bdFFDfc3B9EfCf29a", "decimals": 18 },
    { "symbol": "WBTC", "name": "Wrapped BTC", "address": "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599", "decimals": 8 },
    { "symbol": "wNXM", "name": "Wrapped NXM", "address": "0x0d438F3b5175Bebc262bF23753C1E53d03432bDE", "decimals": 18 },
    { "symbol": "YFI", "name": "yearn.finance", "address": "0x0bc529c00C6401aEF6D220BE8C6Ea1667F6Ad93e", "decimals": 18 },
    { "symbol": "YFII", "name": "YFII.finance", "address": "0xa1d0E215a23d7030842FC67cE582a6aFa3CCaB83", "decimals": 18 },
    { "symbol": "ZRX", "name": "0x Protocol Token", "address": "0xE41d2489571d322189246DaFA5ebDe1F4699F498", "decimals": 18 }
  ],
  [ChainId.KOVAN]: [
    { "symbol": "ZRX", "name": "0x Protocol Token", "address": "0x162c44e53097e7B5aaE939b297ffFD6Bf90D1EE3", "decimals": 18 },
    { "symbol": "WETH", "name": "Wrapped Ether", "address": "0xd0A1E359811322d97991E03f863a0C30C2cF029C", "decimals": 18 },
    { "symbol": "ZRX", "name": "0x Protocol Token", "address": "0x162c44e53097e7B5aaE939b297ffFD6Bf90D1EE3", "decimals": 18 },
    { "symbol": "USDC", "name": "USD Coin USDC", "address": "0xb7a4F3E9097C08dA09517b5aB877F7a917224ede", "decimals": 6 },
    { "symbol": "DAI", "name": "Dai Stablecoin", "address": "0x4F96Fe3b7A6Cf9725f59d353F723c1bDb64CA6Aa", "decimals": 18 },
    { "symbol": "USDT", "name": "Tether USD", "address": "0x07de306FF27a2B630B1141956844eB1552B956B5", "decimals": 6 },
    { "symbol": "COMP", "name": "Compound", "address": "0x61460874a7196d6a22D1eE4922473664b3E95270", "decimals": 18 },
    { "symbol": "BAT", "name": "Basic Attention Token", "address": "0x482dC9bB08111CB875109B075A40881E48aE02Cd", "decimals": 18 },
    { "symbol": "WBTC", "name": "Wrapped BTC", "address": "0xd3A691C852CDB01E281545A27064741F0B7f6825", "decimals": 8 },
    { "symbol": "REP", "name": "Reputation", "address": "0x50DD65531676F718B018De3dc48F92B53D756996", "decimals": 18 },
  ]
}

export type ChainlinkMappingList = {
  readonly [address: string]: {
    from: string
    to: string
    decimals: number
    fromDecimals: number
    toDecimals: number
    warning?: string
  }
}

export const CHAINLINK_MAPPING: { [chainId in ChainId]?: ChainlinkMappingList } = {
  [ChainId.MAINNET]: {
    "0x72AFAECF99C9d9C8215fF44C77B94B99C28741e8": { "from": "0x111111111117dC0aa78b770fA6A738034120C302", "to": "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", "decimals": 18, "fromDecimals": 18, "toDecimals": 18 },
    "0x6Df09E975c830ECae5bd4eD9d90f3A95a4f88012": { "from": "0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9", "to": "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", "decimals": 18, "fromDecimals": 18, "toDecimals": 18 },
    "0x547a514d5e3769680Ce22B2361c10Ea13619e8a9": { "from": "0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9", "to": "0x0000000000000000000000000000000000000001", "decimals": 8, "fromDecimals": 18, "toDecimals": 8 },
    "0x231e764B44b2C1b7Ca171fa8021A24ed520Cde10": { "from": "0xADE00C28244d5CE17D72E40330B1c318cD12B7c3", "to": "0x0000000000000000000000000000000000000001", "decimals": 8, "fromDecimals": 18, "toDecimals": 8 },
    "0x89c7926c7c15fD5BFDB1edcFf7E7fC8283B578F6": { "from": "0xa1faa113cbE53436Df28FF0aEe54275c13B40975", "to": "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", "decimals": 18, "fromDecimals": 18, "toDecimals": 18 },
    "0x8797ABc4641dE76342b8acE9C63e3301DC35e3d8": { "from": "0xfF20817765cB7f73d4bde2e66e067E58D11095C2", "to": "0x0000000000000000000000000000000000000001", "decimals": 8, "fromDecimals": 18, "toDecimals": 8 },
    "0x8f83670260F8f7708143b836a2a6F11eF0aBac01": { "from": "0xa117000000f279D81A1D3cc75430fAA017FA5A2e", "to": "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", "decimals": 18, "fromDecimals": 18, "toDecimals": 18 },
    "0x58921Ac140522867bf50b9E009599Da0CA4A2379": { "from": "0x3472A5A71965499acd81997a54BBA8D852C6E53d", "to": "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", "decimals": 18, "fromDecimals": 18, "toDecimals": 18 },
    "0xC1438AA3823A6Ba0C159CfA8D98dF5A994bA120b": { "from": "0xba100000625a3754423978a60c9317c58a424e3D", "to": "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", "decimals": 18, "fromDecimals": 18, "toDecimals": 18 },
    "0x0BDb051e10c9718d1C29efbad442E88D38958274": { "from": "0xBA11D00c5f74255f56a5E366F4F77f5A186d7f55", "to": "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", "decimals": 18, "fromDecimals": 18, "toDecimals": 18 },
    "0x919C77ACc7373D000b329c1276C76586ed2Dd19F": { "from": "0xBA11D00c5f74255f56a5E366F4F77f5A186d7f55", "to": "0x0000000000000000000000000000000000000001", "decimals": 8, "fromDecimals": 18, "toDecimals": 8 },
    "0x0d16d4528239e9ee52fa531af613AcdB23D88c94": { "from": "0x0D8775F648430679A709E98d2b0Cb6250d2887EF", "to": "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", "decimals": 18, "fromDecimals": 18, "toDecimals": 18 },
    "0xdeb288F737066589598e9214E782fa5A8eD689e8": { "from": "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599", "to": "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", "decimals": 18, "fromDecimals": 8, "toDecimals": 18 },
    "0xF4030086522a5bEEa4988F8cA5B36dbC97BeE88c": { "from": "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599", "to": "0x0000000000000000000000000000000000000001", "decimals": 8, "fromDecimals": 8, "toDecimals": 8 },
    "0x614715d2Af89E6EC99A233818275142cE88d1Cfd": { "from": "0x4Fabb145d64652a948d72533023f6E7A623C7C53", "to": "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", "decimals": 18, "fromDecimals": 18, "toDecimals": 18 },
    "0x8f7C7181Ed1a2BA41cfC3f5d064eF91b67daef66": { "from": "0x56d811088235F11C8920698a204A5010a788f4b3", "to": "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", "decimals": 18, "fromDecimals": 18, "toDecimals": 18 },
    "0x75FbD83b4bd51dEe765b2a01e8D3aa1B020F9d33": { "from": "0xaaAEBE6Fe48E54f431b0C390CfaF0b017d09D42d", "to": "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", "decimals": 18, "fromDecimals": 4, "toDecimals": 18 },
    "0x1B39Ee86Ec5979ba5C322b826B3ECb8C79991699": { "from": "0xc00e94Cb662C3520282E6f5717214004A7f26888", "to": "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", "decimals": 18, "fromDecimals": 18, "toDecimals": 18 },
    "0xdbd020CAeF83eFd542f4De03e3cF0C28A4428bd5": { "from": "0xc00e94Cb662C3520282E6f5717214004A7f26888", "to": "0x0000000000000000000000000000000000000001", "decimals": 8, "fromDecimals": 18, "toDecimals": 8 },
    "0x7B6230EF79D5E97C11049ab362c0b685faCBA0C2": { "from": "0x4688a8b1F292FDaB17E9a90c8Bc379dC1DBd8713", "to": "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", "decimals": 18, "fromDecimals": 18, "toDecimals": 18 },
    "0x0ad50393F11FfAc4dd0fe5F1056448ecb75226Cf": { "from": "0x4688a8b1F292FDaB17E9a90c8Bc379dC1DBd8713", "to": "0x0000000000000000000000000000000000000001", "decimals": 8, "fromDecimals": 18, "toDecimals": 8 },
    "0x82597CFE6af8baad7c0d441AA82cbC3b51759607": { "from": "0x2ba592F78dB6436527729929AAf6c908497cB200", "to": "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", "decimals": 18, "fromDecimals": 18, "toDecimals": 18 },
    "0xcA696a9Eb93b81ADFE6435759A29aB4cf2991A96": { "from": "0xA0b73E1Ff0B80914AB6fe0444E65848C4C34450b", "to": "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", "decimals": 18, "fromDecimals": 8, "toDecimals": 18 },
    "0x8a12Be339B0cD1829b91Adc01977caa5E9ac121e": { "from": "0xD533a949740bb3306d119CC777fa900bA034cd52", "to": "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", "decimals": 18, "fromDecimals": 18, "toDecimals": 18 },
    "0x773616E4d11A78F511299002da57A0a94577F1f4": { "from": "0x6B175474E89094C44Da98b954EedeAC495271d0F", "to": "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", "decimals": 18, "fromDecimals": 18, "toDecimals": 18 },
    "0xAed0c38402a5d19df6E4c03F4E2DceD6e29c1ee9": { "from": "0x6B175474E89094C44Da98b954EedeAC495271d0F", "to": "0x0000000000000000000000000000000000000001", "decimals": 8, "fromDecimals": 18, "toDecimals": 8 },
    "0x029849bbc0b1d93b85a8b6190e979fd38F5760E2": { "from": "0x1494CA1F11D487c2bBe4543E90080AeBa4BA3C2b", "to": "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", "decimals": 18, "fromDecimals": 18, "toDecimals": 18 },
    "0xD2A593BF7594aCE1faD597adb697b5645d5edDB2": { "from": "0x1494CA1F11D487c2bBe4543E90080AeBa4BA3C2b", "to": "0x0000000000000000000000000000000000000001", "decimals": 18, "fromDecimals": 18, "toDecimals": 8 },
    "0x24D9aB51950F3d62E9144fdC2f3135DAA6Ce8D1B": { "from": "0xF629cBd94d3791C9250152BD8dfBDF380E2a3B9c", "to": "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", "decimals": 18, "fromDecimals": 18, "toDecimals": 18 },
    "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419": { "from": "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", "to": "0x0000000000000000000000000000000000000001", "decimals": 8, "fromDecimals": 18, "toDecimals": 8 },
    "0x2DE7E4a9488488e0058B95854CC2f7955B35dC9b": { "from": "0x4E15361FD6b4BB609Fa63C81A2be19d873717870", "to": "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", "decimals": 18, "fromDecimals": 18, "toDecimals": 18 },
    "0xF0985f7E2CaBFf22CecC5a71282a89582c382EFE": { "from": "0x50D1c9771902476076eCFc8B2A83Ad6b9355a4c9", "to": "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", "decimals": 18, "fromDecimals": 18, "toDecimals": 18 },
    "0x17D054eCac33D91F7340645341eFB5DE9009F1C1": { "from": "0xc944E90C64B2c07662A292be6244BDf05Cda44a7", "to": "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", "decimals": 18, "fromDecimals": 18, "toDecimals": 18 },
    "0xAf5E8D9Cd9fC85725A83BF23C52f1C39A71588a6": { "from": "0x584bC13c7D411c00c01A62e8019472dE68768430", "to": "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", "decimals": 18, "fromDecimals": 18, "toDecimals": 18 },
    "0xBFC189aC214E6A4a35EBC281ad15669619b75534": { "from": "0x584bC13c7D411c00c01A62e8019472dE68768430", "to": "0x0000000000000000000000000000000000000001", "decimals": 8, "fromDecimals": 18, "toDecimals": 8 },
    "0xaE2EbE3c4D20cE13cE47cbb49b6d7ee631Cd816e": { "from": "0xe28b3B32B6c345A34Ff64674606124Dd5Aceca30", "to": "0x0000000000000000000000000000000000000001", "decimals": 8, "fromDecimals": 18, "toDecimals": 8 },
    "0x656c0544eF4C98A6a98491833A89204Abb045d6b": { "from": "0xdd974D5C2e2928deA5F71b9825b8b646686BD200", "to": "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", "decimals": 18, "fromDecimals": 18, "toDecimals": 18 },
    "0xf8fF43E991A81e6eC886a3D281A2C6cC19aE70Fc": { "from": "0xdd974D5C2e2928deA5F71b9825b8b646686BD200", "to": "0x0000000000000000000000000000000000000001", "decimals": 8, "fromDecimals": 18, "toDecimals": 8 },
    "0xe7015CCb7E5F788B8c1010FC22343473EaaC3741": { "from": "0x1cEB5cB57C4D4E2b2433641b95Dd330A33185A44", "to": "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", "decimals": 18, "fromDecimals": 18, "toDecimals": 18 },
    "0xDC530D9457755926550b59e8ECcdaE7624181557": { "from": "0x514910771AF9Ca656af840dff83E8264EcF986CA", "to": "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", "decimals": 18, "fromDecimals": 18, "toDecimals": 18 },
    "0x2c1d072e956AFFC0D435Cb7AC38EF18d24d9127c": { "from": "0x514910771AF9Ca656af840dff83E8264EcF986CA", "to": "0x0000000000000000000000000000000000000001", "decimals": 8, "fromDecimals": 18, "toDecimals": 8 },
    "0x160AC928A16C93eD4895C2De6f81ECcE9a7eB7b4": { "from": "0xBBbbCA6A901c926F240b89EacB641d8Aec7AEafD", "to": "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", "decimals": 18, "fromDecimals": 18, "toDecimals": 18 },
    "0xFd33ec6ABAa1Bdc3D9C6C85f1D6299e5a1a5511F": { "from": "0xBBbbCA6A901c926F240b89EacB641d8Aec7AEafD", "to": "0x0000000000000000000000000000000000000001", "decimals": 8, "fromDecimals": 18, "toDecimals": 8 },
    "0x82A44D92D6c329826dc557c5E1Be6ebeC5D5FeB9": { "from": "0x0F5D2fB29fb7d3CFeE444a200298f468908cC942", "to": "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", "decimals": 18, "fromDecimals": 18, "toDecimals": 18 },
    "0x7bAC85A8a13A4BcD8abb3eB7d6b4d632c5a57676": { "from": "0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0", "to": "0x0000000000000000000000000000000000000001", "decimals": 8, "fromDecimals": 18, "toDecimals": 8 },
    "0x24551a8Fb2A7211A25a17B1481f043A8a8adC7f2": { "from": "0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2", "to": "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", "decimals": 18, "fromDecimals": 18, "toDecimals": 18 },
    "0xDaeA8386611A157B08829ED4997A8A62B557014C": { "from": "0xec67005c4E498Ec7f55E092bd1d35cbC47C91892", "to": "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", "decimals": 18, "fromDecimals": 18, "toDecimals": 18 },
    "0x98334b85De2A8b998Ba844c5521e73D68AD69C00": { "from": "0xa3BeD4E1c75D00fa6f4E5E6922DB7261B5E9AcD2", "to": "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", "decimals": 18, "fromDecimals": 18, "toDecimals": 18 },
    "0xc751E86208F0F8aF2d5CD0e29716cA7AD98B5eF5": { "from": "0xa3BeD4E1c75D00fa6f4E5E6922DB7261B5E9AcD2", "to": "0x0000000000000000000000000000000000000001", "decimals": 8, "fromDecimals": 18, "toDecimals": 8 },
    "0x9cB2A01A7E64992d32A34db7cEea4c919C391f6A": { "from": "0x1776e1F26f98b1A5dF9cD347953a26dd3Cb46671", "to": "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", "decimals": 18, "fromDecimals": 18, "toDecimals": 18 },
    "0x2c881B6f3f6B5ff6C975813F87A4dad0b241C15b": { "from": "0x8207c1FfC5B6804F6024322CcF34F29c3541Ae26", "to": "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", "decimals": 18, "fromDecimals": 18, "toDecimals": 18 },
    "0x57C9aB3e56EE4a83752c181f241120a3DBba06a1": { "from": "0xd26114cd6EE289AccF82350c8d8487fedB8A0C07", "to": "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", "decimals": 18, "fromDecimals": 18, "toDecimals": 18 },
    "0xd75AAaE4AF0c398ca13e2667Be57AF2ccA8B5de6": { "from": "0x4575f41308EC1483f3d399aa9a2826d74Da13Deb", "to": "0x0000000000000000000000000000000000000001", "decimals": 8, "fromDecimals": 18, "toDecimals": 8 },
    "0x3a08ebBaB125224b7b6474384Ee39fBb247D2200": { "from": "0x8E870D67F660D95d5be530380D0eC0bd388289E1", "to": "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", "decimals": 18, "fromDecimals": 18, "toDecimals": 18 },
    "0x9B97304EA12EFed0FAd976FBeCAad46016bf269e": { "from": "0x45804880De22913dAFE09f4980848ECE6EcbAf78", "to": "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", "decimals": 18, "fromDecimals": 18, "toDecimals": 18 },
    "0x3b41D5571468904D4e53b6a8d93A6BaC43f02dC9": { "from": "0xbC396689893D065F41bc2C6EcbeE5e0085233447", "to": "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", "decimals": 18, "fromDecimals": 18, "toDecimals": 18 },
    "0xEa0b3DCa635f4a4E77D9654C5c18836EE771566e": { "from": "0xF970b8E36e23F7fC3FD752EeA86f8Be8D83375A6", "to": "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599", "decimals": 8, "fromDecimals": 18, "toDecimals": 8 },
    "0x3147D7203354Dc06D9fd350c7a2437bcA92387a4": { "from": "0x408e41876cCCDC0F92210600ef50372656052a38", "to": "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", "decimals": 18, "fromDecimals": 18, "toDecimals": 18 },
    "0x0f59666EDE214281e956cb3b2D0d69415AfF4A01": { "from": "0x408e41876cCCDC0F92210600ef50372656052a38", "to": "0x0000000000000000000000000000000000000001", "decimals": 8, "fromDecimals": 18, "toDecimals": 8 },
    "0xD4CE430C3b67b3E2F7026D86E7128588629e2455": { "from": "0x221657776846890989a759BA2973e427DfF5C9bB", "to": "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", "decimals": 18, "fromDecimals": 18, "toDecimals": 18 },
    "0x4cba1e1fdc738D0fe8DB3ee07728E2Bc4DA676c6": { "from": "0x607F4C5BB672230e8672085532f7e901544a7375", "to": "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", "decimals": 18, "fromDecimals": 9, "toDecimals": 18 },
    "0x875D60C44cfbC38BaA4Eb2dDB76A767dEB91b97e": { "from": "0x3155BA85D5F96b2d030a4966AF206230e46849cb", "to": "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", "decimals": 18, "fromDecimals": 18, "toDecimals": 18 },
    "0x79291A9d692Df95334B1a0B3B4AE6bC606782f8c": { "from": "0xC011a73ee8576Fb46F5E1c5751cA3B9Fe0af2a6F", "to": "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", "decimals": 18, "fromDecimals": 18, "toDecimals": 18 },
    "0xDC3EA94CD0AC27d9A86C180091e7f78C683d3699": { "from": "0xC011a73ee8576Fb46F5E1c5751cA3B9Fe0af2a6F", "to": "0x0000000000000000000000000000000000000001", "decimals": 8, "fromDecimals": 18, "toDecimals": 8 },
    "0x050c048c9a0CD0e76f166E2539F87ef2acCEC58f": { "from": "0x476c5E26a75bd202a9683ffD34359C0CC15be0fF", "to": "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", "decimals": 18, "fromDecimals": 6, "toDecimals": 18 },
    "0x8e0b7e6062272B5eF4524250bFFF8e5Bd3497757": { "from": "0x57Ab1ec28D129707052df4dF418D58a2D46d5f51", "to": "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", "decimals": 18, "fromDecimals": 18, "toDecimals": 18 },
    "0xe572CeF69f43c2E488b33924AF04BDacE19079cf": { "from": "0x6B3595068778DD592e39A122f4f5a5cF09C90fE2", "to": "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", "decimals": 18, "fromDecimals": 18, "toDecimals": 18 },
    "0xFb0CfD6c19e25DB4a08D8a204a387cEa48Cc138f": { "from": "0x8CE9137d39326AD0cD6491fb5CC0CbA0e089b6A9", "to": "0x0000000000000000000000000000000000000001", "decimals": 8, "fromDecimals": 18, "toDecimals": 8 },
    "0x3d44925a8E9F9DFd90390E58e92Ec16c996A331b": { "from": "0x05D3606d5c81EB9b7B18530995eC9B29da05FaBa", "to": "0x0000000000000000000000000000000000000001", "decimals": 8, "fromDecimals": 18, "toDecimals": 8 },
    "0x26929b85fE284EeAB939831002e1928183a10fb1": { "from": "0x4C19596f5aAfF459fA38B0f7eD92F11AE6543784", "to": "0x0000000000000000000000000000000000000001", "decimals": 8, "fromDecimals": 8, "toDecimals": 8 },
    "0x3886BA987236181D98F2401c507Fb8BeA7871dF2": { "from": "0x0000000000085d4780B73119b644AE5ecd22b376", "to": "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", "decimals": 18, "fromDecimals": 18, "toDecimals": 18 },
    "0xf817B69EA583CAFF291E287CaE00Ea329d22765C": { "from": "0x04Fa0d235C4abf4BcF4787aF4CF447DE572eF828", "to": "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", "decimals": 18, "fromDecimals": 18, "toDecimals": 18 },
    "0xD6aA3D25116d8dA79Ea0246c4826EB951872e02e": { "from": "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984", "to": "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", "decimals": 18, "fromDecimals": 18, "toDecimals": 18 },
    "0x553303d460EE0afB37EdFf9bE42922D8FF63220e": { "from": "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984", "to": "0x0000000000000000000000000000000000000001", "decimals": 8, "fromDecimals": 18, "toDecimals": 8 },
    "0x986b5E1e1755e3C2440e960477f25201B0a8bbD4": { "from": "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", "to": "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", "decimals": 18, "fromDecimals": 6, "toDecimals": 18 },
    "0x8fFfFfd4AfB6115b954Bd326cbe7B4BA576818f6": { "from": "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", "to": "0x0000000000000000000000000000000000000001", "decimals": 8, "fromDecimals": 6, "toDecimals": 8 },
    "0xEe9F2375b4bdF6387aa8265dD4FB8F16512A1d46": { "from": "0xdAC17F958D2ee523a2206206994597C13D831ec7", "to": "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", "decimals": 18, "fromDecimals": 6, "toDecimals": 18 },
    "0x3E7d1eAB13ad0104d2750B8863b489D65364e32D": { "from": "0xdAC17F958D2ee523a2206206994597C13D831ec7", "to": "0x0000000000000000000000000000000000000001", "decimals": 8, "fromDecimals": 6, "toDecimals": 8 },
    "0xa20623070413d42a5C01Db2c8111640DD7A5A03a": { "from": "0xa47c8bf37f92aBed4A126BDA807A7b7498661acD", "to": "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", "decimals": 18, "fromDecimals": 18, "toDecimals": 18 },
    "0x9a79fdCd0E326dF6Fa34EA13c05d3106610798E9": { "from": "0x1cF4592ebfFd730c7dc92c1bdFFDfc3B9EfCf29a", "to": "0x0000000000000000000000000000000000000001", "decimals": 8, "fromDecimals": 18, "toDecimals": 8 },
    "0xe5Dc0A609Ab8bCF15d3f35cFaa1Ff40f521173Ea": { "from": "0x0d438F3b5175Bebc262bF23753C1E53d03432bDE", "to": "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", "decimals": 18, "fromDecimals": 18, "toDecimals": 18 },
    "0x7c5d4F8345e66f68099581Db340cd65B078C41f4": { "from": "0x0bc529c00C6401aEF6D220BE8C6Ea1667F6Ad93e", "to": "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", "decimals": 18, "fromDecimals": 18, "toDecimals": 18 },
    "0xA027702dbb89fbd58938e4324ac03B58d812b0E1": { "from": "0x0bc529c00C6401aEF6D220BE8C6Ea1667F6Ad93e", "to": "0x0000000000000000000000000000000000000001", "decimals": 8, "fromDecimals": 18, "toDecimals": 8 },
    "0xaaB2f6b45B28E962B3aCd1ee4fC88aEdDf557756": { "from": "0xa1d0E215a23d7030842FC67cE582a6aFa3CCaB83", "to": "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", "decimals": 18, "fromDecimals": 18, "toDecimals": 18 },
    "0x2Da4983a622a8498bb1a21FaE9D8F6C664939962": { "from": "0xE41d2489571d322189246DaFA5ebDe1F4699F498", "to": "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", "decimals": 18, "fromDecimals": 18, "toDecimals": 18 },
    "0x2885d15b8Af22648b98B122b22FDF4D2a56c6023": { "from": "0xE41d2489571d322189246DaFA5ebDe1F4699F498", "to": "0x0000000000000000000000000000000000000001", "decimals": 8, "fromDecimals": 18, "toDecimals": 8 },
  },
  [ChainId.KOVAN]: {
    "0xBc3f28Ccc21E9b5856E81E6372aFf57307E2E883": { "from": "0x162c44e53097e7B5aaE939b297ffFD6Bf90D1EE3", "to": "0xd0A1E359811322d97991E03f863a0C30C2cF029C", "decimals": 18, "fromDecimals": 18, "toDecimals": 18 },
    "0x24D6B177CF20166cd8F55CaaFe1c745B44F6c203": { "from": "0x162c44e53097e7B5aaE939b297ffFD6Bf90D1EE3", "to": "0x0000000000000000000000000000000000000001", "decimals": 8, "fromDecimals": 18, "toDecimals": 8 },
    "0x64EaC61A2DFda2c3Fa04eED49AA33D021AeC8838": { "from": "0xb7a4F3E9097C08dA09517b5aB877F7a917224ede", "to": "0xd0A1E359811322d97991E03f863a0C30C2cF029C", "decimals": 18, "fromDecimals": 6, "toDecimals": 18 },
    "0x9211c6b3BF41A10F78539810Cf5c64e1BB78Ec60": { "from": "0xb7a4F3E9097C08dA09517b5aB877F7a917224ede", "to": "0x0000000000000000000000000000000000000001", "decimals": 8, "fromDecimals": 6, "toDecimals": 8 },
    "0x22B58f1EbEDfCA50feF632bD73368b2FdA96D541": { "from": "0x4F96Fe3b7A6Cf9725f59d353F723c1bDb64CA6Aa", "to": "0xd0A1E359811322d97991E03f863a0C30C2cF029C", "decimals": 18, "fromDecimals": 18, "toDecimals": 18 },
    "0x777A68032a88E5A84678A77Af2CD65A7b3c0775a": { "from": "0x4F96Fe3b7A6Cf9725f59d353F723c1bDb64CA6Aa", "to": "0x0000000000000000000000000000000000000001", "decimals": 8, "fromDecimals": 18, "toDecimals": 8 },
    "0x0bF499444525a23E7Bb61997539725cA2e928138": { "from": "0x07de306FF27a2B630B1141956844eB1552B956B5", "to": "0xd0A1E359811322d97991E03f863a0C30C2cF029C", "decimals": 18, "fromDecimals": 6, "toDecimals": 18 },
    "0x2ca5A90D34cA333661083F89D831f757A9A50148": { "from": "0x07de306FF27a2B630B1141956844eB1552B956B5", "to": "0x0000000000000000000000000000000000000001", "decimals": 8, "fromDecimals": 6, "toDecimals": 8 },
    "0xECF93D14d25E02bA2C13698eeDca9aA98348EFb6": { "from": "0x61460874a7196d6a22D1eE4922473664b3E95270", "to": "0x0000000000000000000000000000000000000001", "decimals": 8, "fromDecimals": 18, "toDecimals": 8 },
    "0x0e4fcEC26c9f85c3D714370c98f43C4E02Fc35Ae": { "from": "0x482dC9bB08111CB875109B075A40881E48aE02Cd", "to": "0xd0A1E359811322d97991E03f863a0C30C2cF029C", "decimals": 18, "fromDecimals": 18, "toDecimals": 18 },
    "0xF7904a295A029a3aBDFFB6F12755974a958C7C25": { "from": "0xd3A691C852CDB01E281545A27064741F0B7f6825", "to": "0xd0A1E359811322d97991E03f863a0C30C2cF029C", "decimals": 18, "fromDecimals": 8, "toDecimals": 18 },
    "0x6135b13325bfC4B00278B4abC5e20bbce2D6580e": { "from": "0xd3A691C852CDB01E281545A27064741F0B7f6825", "to": "0x0000000000000000000000000000000000000001", "decimals": 8, "fromDecimals": 8, "toDecimals": 8 },
    "0x3A7e6117F2979EFf81855de32819FBba48a63e9e": { "from": "0x50DD65531676F718B018De3dc48F92B53D756996", "to": "0xd0A1E359811322d97991E03f863a0C30C2cF029C", "decimals": 18, "fromDecimals": 18, "toDecimals": 18 },
    "0x8f4e77806EFEC092A279AC6A49e129e560B4210E": { "from": "0x50DD65531676F718B018De3dc48F92B53D756996", "to": "0x0000000000000000000000000000000000000001", "decimals": 8, "fromDecimals": 18, "toDecimals": 8 },
  },
}
