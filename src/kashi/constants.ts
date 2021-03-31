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

// Pricing currency
export const USD_ADDRESS: { [chainId in ChainId]?: string } = {
  [ChainId.MAINNET]: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
  [ChainId.ROPSTEN]: '0x516de3a7A567d81737e3a46ec4FF9cFD1fcb0136',
  [ChainId.KOVAN]: '0x07de306FF27a2B630B1141956844eB1552B956B5',
  [ChainId.RINKEBY]: '0xD9BA894E0097f8cC2BBc9D24D308b98e36dc6D02',
  [ChainId.GÖRLI]: '0xD87Ba7A50B2E7E660f678A895E4B72E7CB4CCd9C',
  [ChainId.BSC]: '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56',
  [ChainId.BSC_TESTNET]: '0x337610d27c682E347C9cD60BD4b3b107C9d34dDd',
  [ChainId.HECO]: '0x0298c2b32eaE4da002a15f36fdf7615BEa3DA047',
  [ChainId.HECO_TESTNET]: '',
  [ChainId.MATIC]: '',
  [ChainId.MATIC_TESTNET]: '',
  [ChainId.XDAI]: '',
}

// TODO: Remove, this is redundant, use WETH map from SDK which supports all networks
export const WETH: {
  [chainId in ChainId]?: string
} = {
  [ChainId.MAINNET]: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'
}

export const CHAINLINK_TOKENS = [
  '0x111111111117dc0aa78b770fa6a738034120c302',
  '0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9',
  '0xade00c28244d5ce17d72e40330b1c318cd12b7c3',
  '0xa1faa113cbe53436df28ff0aee54275c13b40975',
  '0xff20817765cb7f73d4bde2e66e067e58d11095c2',
  '0xa117000000f279d81a1d3cc75430faa017fa5a2e',
  '0x3472a5a71965499acd81997a54bba8d852c6e53d',
  '0xba100000625a3754423978a60c9317c58a424e3d',
  '0xba11d00c5f74255f56a5e366f4f77f5a186d7f55',
  '0x0d8775f648430679a709e98d2b0cb6250d2887ef',
  '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
  '0x4fabb145d64652a948d72533023f6e7a623c7c53',
  '0x56d811088235f11c8920698a204a5010a788f4b3',
  '0xaaaebe6fe48e54f431b0c390cfaf0b017d09d42d',
  '0xc00e94cb662c3520282e6f5717214004a7f26888',
  '0x4688a8b1f292fdab17e9a90c8bc379dc1dbd8713',
  '0x2ba592f78db6436527729929aaf6c908497cb200',
  '0xa0b73e1ff0b80914ab6fe0444e65848c4c34450b',
  '0xd533a949740bb3306d119cc777fa900ba034cd52',
  '0x6b175474e89094c44da98b954eedeac495271d0f',
  '0x1494ca1f11d487c2bbe4543e90080aeba4ba3c2b',
  '0xf629cbd94d3791c9250152bd8dfbdf380e2a3b9c',
  '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
  '0x4e15361fd6b4bb609fa63c81a2be19d873717870',
  '0x50d1c9771902476076ecfc8b2a83ad6b9355a4c9',
  '0xc944e90c64b2c07662a292be6244bdf05cda44a7',
  '0x584bc13c7d411c00c01a62e8019472de68768430',
  '0xe28b3b32b6c345a34ff64674606124dd5aceca30',
  '0xdd974d5c2e2928dea5f71b9825b8b646686bd200',
  '0x1ceb5cb57c4d4e2b2433641b95dd330a33185a44',
  '0x514910771af9ca656af840dff83e8264ecf986ca',
  '0xbbbbca6a901c926f240b89eacb641d8aec7aeafd',
  '0x0f5d2fb29fb7d3cfee444a200298f468908cc942',
  '0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0',
  '0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2',
  '0xec67005c4e498ec7f55e092bd1d35cbc47c91892',
  '0xa3bed4e1c75d00fa6f4e5e6922db7261b5e9acd2',
  '0x1776e1f26f98b1a5df9cd347953a26dd3cb46671',
  '0x8207c1ffc5b6804f6024322ccf34f29c3541ae26',
  '0xd26114cd6ee289accf82350c8d8487fedb8a0c07',
  '0x4575f41308ec1483f3d399aa9a2826d74da13deb',
  '0x8e870d67f660d95d5be530380d0ec0bd388289e1',
  '0x45804880de22913dafe09f4980848ece6ecbaf78',
  '0xbc396689893d065f41bc2c6ecbee5e0085233447',
  '0xf970b8e36e23f7fc3fd752eea86f8be8d83375a6',
  '0x408e41876cccdc0f92210600ef50372656052a38',
  '0x221657776846890989a759ba2973e427dff5c9bb',
  '0x607f4c5bb672230e8672085532f7e901544a7375',
  '0x3155ba85d5f96b2d030a4966af206230e46849cb',
  '0xc011a73ee8576fb46f5e1c5751ca3b9fe0af2a6f',
  '0x476c5e26a75bd202a9683ffd34359c0cc15be0ff',
  '0x57ab1ec28d129707052df4df418d58a2d46d5f51',
  '0x6b3595068778dd592e39a122f4f5a5cf09c90fe2',
  '0x8ce9137d39326ad0cd6491fb5cc0cba0e089b6a9',
  '0x05d3606d5c81eb9b7b18530995ec9b29da05faba',
  '0x4c19596f5aaff459fa38b0f7ed92f11ae6543784',
  '0x0000000000085d4780b73119b644ae5ecd22b376',
  '0x04fa0d235c4abf4bcf4787af4cf447de572ef828',
  '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984',
  '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
  '0xdac17f958d2ee523a2206206994597c13d831ec7',
  '0xa47c8bf37f92abed4a126bda807a7b7498661acd',
  '0x1cf4592ebffd730c7dc92c1bdffdfc3b9efcf29a',
  '0x0d438f3b5175bebc262bf23753c1e53d03432bde',
  '0x0bc529c00c6401aef6d220be8c6ea1667f6ad93e',
  '0xa1d0e215a23d7030842fc67ce582a6afa3ccab83',
  '0xe41d2489571d322189246dafa5ebde1f4699f498'
]

type ChainlinkMappingList = {
  readonly [address: string]: {
    from: string
    to: string
    decimals: bigint
    warning?: string
  }
}

export const CHAINLINK_MAPPING: ChainlinkMappingList = {
  '0x72AFAECF99C9d9C8215fF44C77B94B99C28741e8': {
    from: '0x111111111117dc0aa78b770fa6a738034120c302',
    to: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    decimals: BigInt('18')
  },
  '0x6Df09E975c830ECae5bd4eD9d90f3A95a4f88012': {
    from: '0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9',
    to: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    decimals: BigInt('18')
  },
  '0x547a514d5e3769680Ce22B2361c10Ea13619e8a9': {
    from: '0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9',
    to: '0x0000000000000000000000000000000000000001',
    decimals: BigInt('8')
  },
  '0x231e764B44b2C1b7Ca171fa8021A24ed520Cde10': {
    from: '0xade00c28244d5ce17d72e40330b1c318cd12b7c3',
    to: '0x0000000000000000000000000000000000000001',
    decimals: BigInt('8')
  },
  '0x89c7926c7c15fD5BFDB1edcFf7E7fC8283B578F6': {
    from: '0xa1faa113cbe53436df28ff0aee54275c13b40975',
    to: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    decimals: BigInt('18')
  },
  '0x8797ABc4641dE76342b8acE9C63e3301DC35e3d8': {
    from: '0xff20817765cb7f73d4bde2e66e067e58d11095c2',
    to: '0x0000000000000000000000000000000000000001',
    decimals: BigInt('8')
  },
  '0x8f83670260F8f7708143b836a2a6F11eF0aBac01': {
    from: '0xa117000000f279d81a1d3cc75430faa017fa5a2e',
    to: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    decimals: BigInt('18')
  },
  '0x58921Ac140522867bf50b9E009599Da0CA4A2379': {
    from: '0x3472a5a71965499acd81997a54bba8d852c6e53d',
    to: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    decimals: BigInt('18')
  },
  '0xC1438AA3823A6Ba0C159CfA8D98dF5A994bA120b': {
    from: '0xba100000625a3754423978a60c9317c58a424e3d',
    to: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    decimals: BigInt('18')
  },
  '0x0BDb051e10c9718d1C29efbad442E88D38958274': {
    from: '0xba11d00c5f74255f56a5e366f4f77f5a186d7f55',
    to: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    decimals: BigInt('18')
  },
  '0x919C77ACc7373D000b329c1276C76586ed2Dd19F': {
    from: '0xba11d00c5f74255f56a5e366f4f77f5a186d7f55',
    to: '0x0000000000000000000000000000000000000001',
    decimals: BigInt('8')
  },
  '0x0d16d4528239e9ee52fa531af613AcdB23D88c94': {
    from: '0x0d8775f648430679a709e98d2b0cb6250d2887ef',
    to: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    decimals: BigInt('18')
  },
  '0xdeb288F737066589598e9214E782fa5A8eD689e8': {
    from: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
    to: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    decimals: BigInt('18'),
    warning: 'For the price of WBTC, the Chainlink oracle for BTC is used.  '
  },
  '0xF4030086522a5bEEa4988F8cA5B36dbC97BeE88c': {
    from: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
    to: '0x0000000000000000000000000000000000000001',
    decimals: BigInt('8'),
    warning: 'For the price of WBTC, the Chainlink oracle for BTC is used.  '
  },
  '0x614715d2Af89E6EC99A233818275142cE88d1Cfd': {
    from: '0x4fabb145d64652a948d72533023f6e7a623c7c53',
    to: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    decimals: BigInt('18')
  },
  '0x8f7C7181Ed1a2BA41cfC3f5d064eF91b67daef66': {
    from: '0x56d811088235f11c8920698a204a5010a788f4b3',
    to: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    decimals: BigInt('18')
  },
  '0x75FbD83b4bd51dEe765b2a01e8D3aa1B020F9d33': {
    from: '0xaaaebe6fe48e54f431b0c390cfaf0b017d09d42d',
    to: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    decimals: BigInt('18')
  },
  '0x1B39Ee86Ec5979ba5C322b826B3ECb8C79991699': {
    from: '0xc00e94cb662c3520282e6f5717214004a7f26888',
    to: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    decimals: BigInt('18')
  },
  '0xdbd020CAeF83eFd542f4De03e3cF0C28A4428bd5': {
    from: '0xc00e94cb662c3520282e6f5717214004a7f26888',
    to: '0x0000000000000000000000000000000000000001',
    decimals: BigInt('8')
  },
  '0x7B6230EF79D5E97C11049ab362c0b685faCBA0C2': {
    from: '0x4688a8b1f292fdab17e9a90c8bc379dc1dbd8713',
    to: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    decimals: BigInt('18')
  },
  '0x0ad50393F11FfAc4dd0fe5F1056448ecb75226Cf': {
    from: '0x4688a8b1f292fdab17e9a90c8bc379dc1dbd8713',
    to: '0x0000000000000000000000000000000000000001',
    decimals: BigInt('8')
  },
  '0x82597CFE6af8baad7c0d441AA82cbC3b51759607': {
    from: '0x2ba592f78db6436527729929aaf6c908497cb200',
    to: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    decimals: BigInt('18')
  },
  '0xcA696a9Eb93b81ADFE6435759A29aB4cf2991A96': {
    from: '0xa0b73e1ff0b80914ab6fe0444e65848c4c34450b',
    to: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    decimals: BigInt('18')
  },
  '0x8a12Be339B0cD1829b91Adc01977caa5E9ac121e': {
    from: '0xd533a949740bb3306d119cc777fa900ba034cd52',
    to: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    decimals: BigInt('18')
  },
  '0x773616E4d11A78F511299002da57A0a94577F1f4': {
    from: '0x6b175474e89094c44da98b954eedeac495271d0f',
    to: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    decimals: BigInt('18')
  },
  '0xAed0c38402a5d19df6E4c03F4E2DceD6e29c1ee9': {
    from: '0x6b175474e89094c44da98b954eedeac495271d0f',
    to: '0x0000000000000000000000000000000000000001',
    decimals: BigInt('8')
  },
  '0x029849bbc0b1d93b85a8b6190e979fd38F5760E2': {
    from: '0x1494ca1f11d487c2bbe4543e90080aeba4ba3c2b',
    to: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    decimals: BigInt('18')
  },
  '0xD2A593BF7594aCE1faD597adb697b5645d5edDB2': {
    from: '0x1494ca1f11d487c2bbe4543e90080aeba4ba3c2b',
    to: '0x0000000000000000000000000000000000000001',
    decimals: BigInt('18')
  },
  '0x24D9aB51950F3d62E9144fdC2f3135DAA6Ce8D1B': {
    from: '0xf629cbd94d3791c9250152bd8dfbdf380e2a3b9c',
    to: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    decimals: BigInt('18')
  },
  '0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419': {
    from: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    to: '0x0000000000000000000000000000000000000001',
    decimals: BigInt('8')
  },
  '0x2DE7E4a9488488e0058B95854CC2f7955B35dC9b': {
    from: '0x4e15361fd6b4bb609fa63c81a2be19d873717870',
    to: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    decimals: BigInt('18')
  },
  '0xF0985f7E2CaBFf22CecC5a71282a89582c382EFE': {
    from: '0x50d1c9771902476076ecfc8b2a83ad6b9355a4c9',
    to: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    decimals: BigInt('18')
  },
  '0x17D054eCac33D91F7340645341eFB5DE9009F1C1': {
    from: '0xc944e90c64b2c07662a292be6244bdf05cda44a7',
    to: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    decimals: BigInt('18')
  },
  '0xAf5E8D9Cd9fC85725A83BF23C52f1C39A71588a6': {
    from: '0x584bc13c7d411c00c01a62e8019472de68768430',
    to: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    decimals: BigInt('18')
  },
  '0xBFC189aC214E6A4a35EBC281ad15669619b75534': {
    from: '0x584bc13c7d411c00c01a62e8019472de68768430',
    to: '0x0000000000000000000000000000000000000001',
    decimals: BigInt('8')
  },
  '0xaE2EbE3c4D20cE13cE47cbb49b6d7ee631Cd816e': {
    from: '0xe28b3b32b6c345a34ff64674606124dd5aceca30',
    to: '0x0000000000000000000000000000000000000001',
    decimals: BigInt('8')
  },
  '0x656c0544eF4C98A6a98491833A89204Abb045d6b': {
    from: '0xdd974d5c2e2928dea5f71b9825b8b646686bd200',
    to: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    decimals: BigInt('18')
  },
  '0xf8fF43E991A81e6eC886a3D281A2C6cC19aE70Fc': {
    from: '0xdd974d5c2e2928dea5f71b9825b8b646686bd200',
    to: '0x0000000000000000000000000000000000000001',
    decimals: BigInt('8')
  },
  '0xe7015CCb7E5F788B8c1010FC22343473EaaC3741': {
    from: '0x1ceb5cb57c4d4e2b2433641b95dd330a33185a44',
    to: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    decimals: BigInt('18')
  },
  '0xDC530D9457755926550b59e8ECcdaE7624181557': {
    from: '0x514910771af9ca656af840dff83e8264ecf986ca',
    to: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    decimals: BigInt('18')
  },
  '0x2c1d072e956AFFC0D435Cb7AC38EF18d24d9127c': {
    from: '0x514910771af9ca656af840dff83e8264ecf986ca',
    to: '0x0000000000000000000000000000000000000001',
    decimals: BigInt('8')
  },
  '0x160AC928A16C93eD4895C2De6f81ECcE9a7eB7b4': {
    from: '0xbbbbca6a901c926f240b89eacb641d8aec7aeafd',
    to: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    decimals: BigInt('18')
  },
  '0xFd33ec6ABAa1Bdc3D9C6C85f1D6299e5a1a5511F': {
    from: '0xbbbbca6a901c926f240b89eacb641d8aec7aeafd',
    to: '0x0000000000000000000000000000000000000001',
    decimals: BigInt('8')
  },
  '0x82A44D92D6c329826dc557c5E1Be6ebeC5D5FeB9': {
    from: '0x0f5d2fb29fb7d3cfee444a200298f468908cc942',
    to: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    decimals: BigInt('18')
  },
  '0x7bAC85A8a13A4BcD8abb3eB7d6b4d632c5a57676': {
    from: '0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0',
    to: '0x0000000000000000000000000000000000000001',
    decimals: BigInt('8')
  },
  '0x24551a8Fb2A7211A25a17B1481f043A8a8adC7f2': {
    from: '0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2',
    to: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    decimals: BigInt('18')
  },
  '0xDaeA8386611A157B08829ED4997A8A62B557014C': {
    from: '0xec67005c4e498ec7f55e092bd1d35cbc47c91892',
    to: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    decimals: BigInt('18')
  },
  '0x98334b85De2A8b998Ba844c5521e73D68AD69C00': {
    from: '0xa3bed4e1c75d00fa6f4e5e6922db7261b5e9acd2',
    to: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    decimals: BigInt('18')
  },
  '0xc751E86208F0F8aF2d5CD0e29716cA7AD98B5eF5': {
    from: '0xa3bed4e1c75d00fa6f4e5e6922db7261b5e9acd2',
    to: '0x0000000000000000000000000000000000000001',
    decimals: BigInt('8')
  },
  '0x9cB2A01A7E64992d32A34db7cEea4c919C391f6A': {
    from: '0x1776e1f26f98b1a5df9cd347953a26dd3cb46671',
    to: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    decimals: BigInt('18')
  },
  '0x2c881B6f3f6B5ff6C975813F87A4dad0b241C15b': {
    from: '0x8207c1ffc5b6804f6024322ccf34f29c3541ae26',
    to: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    decimals: BigInt('18')
  },
  '0x57C9aB3e56EE4a83752c181f241120a3DBba06a1': {
    from: '0xd26114cd6ee289accf82350c8d8487fedb8a0c07',
    to: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    decimals: BigInt('18')
  },
  '0xd75AAaE4AF0c398ca13e2667Be57AF2ccA8B5de6': {
    from: '0x4575f41308ec1483f3d399aa9a2826d74da13deb',
    to: '0x0000000000000000000000000000000000000001',
    decimals: BigInt('8')
  },
  '0x3a08ebBaB125224b7b6474384Ee39fBb247D2200': {
    from: '0x8e870d67f660d95d5be530380d0ec0bd388289e1',
    to: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    decimals: BigInt('18')
  },
  '0x9B97304EA12EFed0FAd976FBeCAad46016bf269e': {
    from: '0x45804880de22913dafe09f4980848ece6ecbaf78',
    to: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    decimals: BigInt('18')
  },
  '0x3b41D5571468904D4e53b6a8d93A6BaC43f02dC9': {
    from: '0xbc396689893d065f41bc2c6ecbee5e0085233447',
    to: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    decimals: BigInt('18')
  },
  '0xEa0b3DCa635f4a4E77D9654C5c18836EE771566e': {
    from: '0xf970b8e36e23f7fc3fd752eea86f8be8d83375a6',
    to: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
    decimals: BigInt('8')
  },
  '0x3147D7203354Dc06D9fd350c7a2437bcA92387a4': {
    from: '0x408e41876cccdc0f92210600ef50372656052a38',
    to: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    decimals: BigInt('18')
  },
  '0x0f59666EDE214281e956cb3b2D0d69415AfF4A01': {
    from: '0x408e41876cccdc0f92210600ef50372656052a38',
    to: '0x0000000000000000000000000000000000000001',
    decimals: BigInt('8')
  },
  '0xD4CE430C3b67b3E2F7026D86E7128588629e2455': {
    from: '0x221657776846890989a759ba2973e427dff5c9bb',
    to: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    decimals: BigInt('18')
  },
  '0x4cba1e1fdc738D0fe8DB3ee07728E2Bc4DA676c6': {
    from: '0x607f4c5bb672230e8672085532f7e901544a7375',
    to: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    decimals: BigInt('18')
  },
  '0x875D60C44cfbC38BaA4Eb2dDB76A767dEB91b97e': {
    from: '0x3155ba85d5f96b2d030a4966af206230e46849cb',
    to: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    decimals: BigInt('18')
  },
  '0x79291A9d692Df95334B1a0B3B4AE6bC606782f8c': {
    from: '0xc011a73ee8576fb46f5e1c5751ca3b9fe0af2a6f',
    to: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    decimals: BigInt('18')
  },
  '0xDC3EA94CD0AC27d9A86C180091e7f78C683d3699': {
    from: '0xc011a73ee8576fb46f5e1c5751ca3b9fe0af2a6f',
    to: '0x0000000000000000000000000000000000000001',
    decimals: BigInt('8')
  },
  '0x050c048c9a0CD0e76f166E2539F87ef2acCEC58f': {
    from: '0x476c5e26a75bd202a9683ffd34359c0cc15be0ff',
    to: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    decimals: BigInt('18')
  },
  '0x8e0b7e6062272B5eF4524250bFFF8e5Bd3497757': {
    from: '0x57ab1ec28d129707052df4df418d58a2d46d5f51',
    to: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    decimals: BigInt('18')
  },
  '0xe572CeF69f43c2E488b33924AF04BDacE19079cf': {
    from: '0x6b3595068778dd592e39a122f4f5a5cf09c90fe2',
    to: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    decimals: BigInt('18')
  },
  '0xFb0CfD6c19e25DB4a08D8a204a387cEa48Cc138f': {
    from: '0x8ce9137d39326ad0cd6491fb5cc0cba0e089b6a9',
    to: '0x0000000000000000000000000000000000000001',
    decimals: BigInt('8')
  },
  '0x3d44925a8E9F9DFd90390E58e92Ec16c996A331b': {
    from: '0x05d3606d5c81eb9b7b18530995ec9b29da05faba',
    to: '0x0000000000000000000000000000000000000001',
    decimals: BigInt('8'),
    warning: 'For the price of TOMOE, the Chainlink oracle for TOMO is used. '
  },
  '0x26929b85fE284EeAB939831002e1928183a10fb1': {
    from: '0x4c19596f5aaff459fa38b0f7ed92f11ae6543784',
    to: '0x0000000000000000000000000000000000000001',
    decimals: BigInt('8')
  },
  '0x3886BA987236181D98F2401c507Fb8BeA7871dF2': {
    from: '0x0000000000085d4780b73119b644ae5ecd22b376',
    to: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    decimals: BigInt('18')
  },
  '0xf817B69EA583CAFF291E287CaE00Ea329d22765C': {
    from: '0x04fa0d235c4abf4bcf4787af4cf447de572ef828',
    to: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    decimals: BigInt('18')
  },
  '0xD6aA3D25116d8dA79Ea0246c4826EB951872e02e': {
    from: '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984',
    to: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    decimals: BigInt('18')
  },
  '0x553303d460EE0afB37EdFf9bE42922D8FF63220e': {
    from: '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984',
    to: '0x0000000000000000000000000000000000000001',
    decimals: BigInt('8')
  },
  '0x986b5E1e1755e3C2440e960477f25201B0a8bbD4': {
    from: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    to: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    decimals: BigInt('18')
  },
  '0x8fFfFfd4AfB6115b954Bd326cbe7B4BA576818f6': {
    from: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    to: '0x0000000000000000000000000000000000000001',
    decimals: BigInt('8')
  },
  '0xEe9F2375b4bdF6387aa8265dD4FB8F16512A1d46': {
    from: '0xdac17f958d2ee523a2206206994597c13d831ec7',
    to: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    decimals: BigInt('18')
  },
  '0x3E7d1eAB13ad0104d2750B8863b489D65364e32D': {
    from: '0xdac17f958d2ee523a2206206994597c13d831ec7',
    to: '0x0000000000000000000000000000000000000001',
    decimals: BigInt('8')
  },
  '0xa20623070413d42a5C01Db2c8111640DD7A5A03a': {
    from: '0xa47c8bf37f92abed4a126bda807a7b7498661acd',
    to: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    decimals: BigInt('18')
  },
  '0x9a79fdCd0E326dF6Fa34EA13c05d3106610798E9': {
    from: '0x1cf4592ebffd730c7dc92c1bdffdfc3b9efcf29a',
    to: '0x0000000000000000000000000000000000000001',
    decimals: BigInt('8')
  },
  '0xe5Dc0A609Ab8bCF15d3f35cFaa1Ff40f521173Ea': {
    from: '0x0d438f3b5175bebc262bf23753c1e53d03432bde',
    to: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    decimals: BigInt('18')
  },
  '0x7c5d4F8345e66f68099581Db340cd65B078C41f4': {
    from: '0x0bc529c00c6401aef6d220be8c6ea1667f6ad93e',
    to: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    decimals: BigInt('18')
  },
  '0xA027702dbb89fbd58938e4324ac03B58d812b0E1': {
    from: '0x0bc529c00c6401aef6d220be8c6ea1667f6ad93e',
    to: '0x0000000000000000000000000000000000000001',
    decimals: BigInt('8')
  },
  '0xaaB2f6b45B28E962B3aCd1ee4fC88aEdDf557756': {
    from: '0xa1d0E215a23d7030842FC67cE582a6aFa3CCaB83',
    to: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    decimals: BigInt('18')
  },
  '0x2Da4983a622a8498bb1a21FaE9D8F6C664939962': {
    from: '0xe41d2489571d322189246dafa5ebde1f4699f498',
    to: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    decimals: BigInt('18')
  },
  '0x2885d15b8Af22648b98B122b22FDF4D2a56c6023': {
    from: '0xe41d2489571d322189246dafa5ebde1f4699f498',
    to: '0x0000000000000000000000000000000000000001',
    decimals: BigInt('8')
  }
}
