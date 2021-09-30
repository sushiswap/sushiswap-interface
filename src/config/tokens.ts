import { ChainId, Ether, SUSHI_ADDRESS, Token, WETH9, WNATIVE } from '@sushiswap/sdk'

import { SupportedChainId } from '../chains'

export const FUSE: { [key: string]: Token } = {
  WETH: new Token(ChainId.FUSE, '0xa722c13135930332Eb3d749B2F0906559D2C5b99', 18, 'WETH', 'Wrapped Ether'),
  WBTC: new Token(ChainId.FUSE, '0x33284f95ccb7B948d9D352e1439561CF83d8d00d', 8, 'WBTC', 'Wrapped Bitcoin'),
  USDC: new Token(ChainId.FUSE, '0x620fd5fa44BE6af63715Ef4E65DDFA0387aD13F5', 6, 'USDC', 'USD Coin'),
  USDT: new Token(ChainId.FUSE, '0x33284f95ccb7B948d9D352e1439561CF83d8d00d', 8, 'USDT', 'Tether USD'),
  DAI: new Token(ChainId.FUSE, '0x94Ba7A27c7A95863d1bdC7645AC2951E0cca06bA', 18, 'DAI', 'Dai Stablecoin'),
}

export const ARBITRUM: { [key: string]: Token } = {
  USDC: new Token(ChainId.ARBITRUM, '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8', 6, 'USDC', 'USD Coin'),
  WBTC: new Token(ChainId.ARBITRUM, '0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f', 8, 'WBTC', 'Wrapped Bitcoin'),
  USDT: new Token(ChainId.ARBITRUM, '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9', 8, 'USDT', 'Tether USD'),
}

export const PALM: { [key: string]: Token } = {
  DAI: new Token(ChainId.PALM, '0x4C1f6fCBd233241bF2f4D02811E3bF8429BC27B8', 18, 'DAI', 'Dai Stablecoin'),
  WETH: new Token(ChainId.PALM, '0x726138359C17F1E56bA8c4F737a7CAf724F6010b', 18, 'WETH', 'Wrapped Ether'),
}

export const CELO: { [key: string]: Token } = {
  mCUSD: new Token(ChainId.CELO, '0x64dEFa3544c695db8c535D289d843a189aa26b98', 18, 'mCUSD', 'Moola cUSD'),
  mCELO: new Token(ChainId.CELO, '0x7037F7296B2fc7908de7b57a89efaa8319f0C500', 18, 'mCELO', 'Moola CELO'),
  mcEURO: new Token(ChainId.CELO, '0xa8d0E6799FF3Fd19c6459bf02689aE09c4d78Ba7', 18, 'mCEUR', 'Moola Celo Euro'),
  cUSD: new Token(ChainId.CELO, '0x765DE816845861e75A25fCA122bb6898B8B1282a', 18, 'cUSD', 'Celo Dollar'),
  cEURO: new Token(ChainId.CELO, '0xD8763CBa276a3738E6DE85b4b3bF5FDed6D6cA73', 18, 'cEUR', 'Celo Euro'),
  cBTC: new Token(ChainId.CELO, '0xD629eb00dEced2a080B7EC630eF6aC117e614f1b', 18, 'cBTC', 'Wrapped Bitcoin'),
  cETH: new Token(ChainId.CELO, '0x2DEf4285787d58a2f811AF24755A8150622f4361', 18, 'cETH', 'Wrapped Ether'),
}

export const BSC: { [key: string]: Token } = {
  DAI: new Token(ChainId.BSC, '0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3', 18, 'DAI', 'Dai Stablecoin'),
  USD: new Token(ChainId.BSC, '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56', 18, 'BUSD', 'Binance USD'),
  USDC: new Token(ChainId.BSC, '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d', 18, 'USDC', 'USD Coin'),
  USDT: new Token(ChainId.BSC, '0x55d398326f99059fF775485246999027B3197955', 18, 'USDT', 'Tether USD'),
  BTCB: new Token(ChainId.BSC, '0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c', 18, 'BTCB', 'Bitcoin'),
  WETH: new Token(ChainId.BSC, '0x2170Ed0880ac9A755fd29B2688956BD959F933F8', 18, 'WETH', 'Wrapped Ether'),
}

export const FANTOM: { [key: string]: Token } = {
  USDC: new Token(ChainId.FANTOM, '0x04068DA6C83AFCFA0e13ba15A6696662335D5B75', 6, 'USDC', 'USD Coin'),
  WBTC: new Token(ChainId.FANTOM, '0x321162Cd933E2Be498Cd2267a90534A804051b11', 8, 'WBTC', 'Wrapped Bitcoin'),
  DAI: new Token(ChainId.FANTOM, '0x8D11eC38a3EB5E956B052f67Da8Bdc9bef8Abf3E', 18, 'DAI', 'Dai Stablecoin'),
  WETH: new Token(ChainId.FANTOM, '0x74b23882a30290451A17c44f4F05243b6b58C76d', 18, 'WETH', 'Wrapped Ether'),
}

export const MATIC: { [key: string]: Token } = {
  USDC: new Token(ChainId.MATIC, '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174', 6, 'USDC', 'USD Coin'),
  WBTC: new Token(ChainId.MATIC, '0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6', 8, 'WBTC', 'Wrapped Bitcoin'),
  DAI: new Token(ChainId.MATIC, '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063', 18, 'DAI', 'Dai Stablecoin'),
  WETH: new Token(ChainId.MATIC, '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619', 18, 'WETH', 'Wrapped Ether'),
  USDT: new Token(ChainId.MATIC, '0xc2132D05D31c914a87C6611C10748AEb04B58e8F', 6, 'USDT', 'Tether USD'),
  TEL: new Token(ChainId.MATIC, '0xdF7837DE1F2Fa4631D716CF2502f8b230F1dcc32', 2, 'TEL', 'Telcoin'),
  SUSHI: new Token(ChainId.MATIC, '0x0b3F868E0BE5597D5DB7fEB59E1CADBb0fdDa50a', 18, 'SUSHI', 'SushiToken'),
  AAVE: new Token(ChainId.MATIC, '0xD6DF932A45C0f255f85145f286eA0b292B21C90B', 18, 'AAVE', 'Aave'),
  FRAX: new Token(ChainId.MATIC, '0x104592a158490a9228070E0A8e5343B499e125D0', 18, 'FRAX', 'Frax'),
  FXS: new Token(ChainId.MATIC, '0x3e121107F6F22DA4911079845a470757aF4e1A1b', 18, 'FXS', 'Frax Share'),
  DMAGIC: new Token(ChainId.MATIC, '0x61dAECaB65EE2A1D5b6032df030f3fAA3d116Aa7', 18, 'DMAGIC', 'Dark Magic'),
  DRAX: new Token(ChainId.MATIC, '0x1Ba3510A9ceEb72E5CdBa8bcdDe9647E1f20fB4b', 18, 'DRAX', 'Drax'),
  AXMATIC: new Token(ChainId.MATIC, '0x1221591c1d77A9c334aBb0fe530ae6EE3aF51Af9', 18, 'AXMATIC', 'axMATIC'),
}

export const OKEX: { [key: string]: Token } = {
  DAI: new Token(ChainId.OKEX, '0x21cDE7E32a6CAF4742d00d44B07279e7596d26B9', 18, 'DAI', 'Dai Stablecoin'),
  USDC: new Token(ChainId.OKEX, '0xc946DAf81b08146B1C7A8Da2A851Ddf2B3EAaf85', 18, 'USDC', 'USD Coin'),
  USDT: new Token(ChainId.OKEX, '0x382bB369d343125BfB2117af9c149795C6C65C50', 18, 'USDT', 'Tether USD'),
  WBTC: new Token(ChainId.OKEX, '0x506f731F7656e2FB34b587B912808f2a7aB640BD', 18, 'WBTC', 'Wrapped Bitcoin'),
  WETH: new Token(ChainId.OKEX, '0xEF71CA2EE68F45B9Ad6F72fbdb33d707b872315C', 18, 'WETH', 'Wrapped Ether'),
}

export const HECO: { [key: string]: Token } = {
  DAI: new Token(ChainId.HECO, '0x3D760a45D0887DFD89A2F5385a236B29Cb46ED2a', 18, 'DAI', 'Dai Stablecoin'),
  USDC: new Token(ChainId.HECO, '0x9362Bbef4B8313A8Aa9f0c9808B80577Aa26B73B', 18, 'USDC', 'USD Coin'),
  USDT: new Token(ChainId.HECO, '0xa71EdC38d189767582C38A3145b5873052c3e47a', 18, 'USDT', 'Tether USD'),
  WBTC: new Token(ChainId.HECO, '0x66a79D23E58475D2738179Ca52cd0b41d73f0BEa', 18, 'WBTC', 'Wrapped Bitcoin'),
  WETH: new Token(ChainId.HECO, '0x64FF637fB478863B7468bc97D30a5bF3A428a1fD', 18, 'WETH', 'Wrapped Ether'),
}

export const HARMONY: { [key: string]: Token } = {
  DAI: new Token(ChainId.HARMONY, '0xEf977d2f931C1978Db5F6747666fa1eACB0d0339', 18, 'DAI', 'Dai Stablecoin'),
  USDC: new Token(ChainId.HARMONY, '0x985458E523dB3d53125813eD68c274899e9DfAb4', 6, 'USDC', 'USD Coin'),
  USDT: new Token(ChainId.HARMONY, '0x3C2B8Be99c50593081EAA2A724F0B8285F5aba8f', 6, 'USDT', 'Tether USD'),
  WBTC: new Token(ChainId.HARMONY, '0x3095c7557bCb296ccc6e363DE01b760bA031F2d9', 8, 'WBTC', 'Wrapped Bitcoin'),
  WETH: new Token(ChainId.HARMONY, '0x6983D1E6DEf3690C4d616b13597A09e6193EA013', 18, 'WETH', 'Wrapped Ether'),
}

export const XDAI: { [key: string]: Token } = {
  USDC: new Token(ChainId.XDAI, '0xDDAfbb505ad214D7b80b1f830fcCc89B60fb7A83', 6, 'USDC', 'USD Coin'),
  USDT: new Token(ChainId.XDAI, '0x4ECaBa5870353805a9F068101A40E0f32ed605C6', 6, 'USDT', 'Tether USD'),
  WBTC: new Token(ChainId.XDAI, '0x8e5bBbb09Ed1ebdE8674Cda39A0c169401db4252', 8, 'WBTC', 'Wrapped Bitcoin'),
  WETH: new Token(ChainId.XDAI, '0x6A023CCd1ff6F2045C3309768eAd9E68F978f6e1', 18, 'WETH', 'Wrapped Ether'),
}

export const AVALANCHE: { [key: string]: Token } = {
  DAI_OLD: new Token(
    ChainId.AVALANCHE,
    '0xbA7dEebBFC5fA1100Fb055a87773e1E99Cd3507a',
    18,
    'oldDAI',
    'Old Dai Stablecoin'
  ),
  USDT_OLD: new Token(ChainId.AVALANCHE, '0xde3A24028580884448a5397872046a019649b084', 6, 'oldUSDT', 'Old Tether USD'),
  WBTC_OLD: new Token(
    ChainId.AVALANCHE,
    '0x408D4cD0ADb7ceBd1F1A1C33A0Ba2098E1295bAB',
    8,
    'oldWBTC',
    'Old Wrapped Bitcoin'
  ),
  WETH_OLD: new Token(
    ChainId.AVALANCHE,
    '0xf20d962a6c8f70c731bd838a3a388D7d48fA6e15',
    18,
    'oldWETH',
    'Old Wrapped Ether'
  ),
  USDC: new Token(ChainId.AVALANCHE, '0xA7D7079b0FEaD91F3e65f86E8915Cb59c1a4C664', 6, 'USDC', 'USD Coin'),
  DAI: new Token(ChainId.AVALANCHE, '0xd586E7F844cEa2F87f50152665BCbc2C279D8d70', 18, 'DAI', 'Dai Stablecoin'),
  USDT: new Token(ChainId.AVALANCHE, '0xc7198437980c041c805A1EDcbA50c1Ce5db95118', 6, 'USDT', 'Tether USD'),
  WBTC: new Token(ChainId.AVALANCHE, '0x50b7545627a5162F82A992c33b87aDc75187B218', 8, 'WBTC', 'Wrapped Bitcoin'),
  WETH: new Token(ChainId.AVALANCHE, '0x49D5c2BdFfac6CE2BFdB6640F4F80f226bc10bAB', 18, 'WETH', 'Wrapped Ether'),
}

// Default Ethereum chain tokens
export const ALPHA = new Token(ChainId.MAINNET, '0xa1faa113cbE53436Df28FF0aEe54275c13B40975', 18, 'ALPHA', 'AlphaToken')
export const AMPL = new Token(ChainId.MAINNET, '0xD46bA6D942050d489DBd938a2C909A5d5039A161', 9, 'AMPL', 'Ampleforth')
export const BAB = new Token(ChainId.MAINNET, '0xC36824905dfF2eAAEE7EcC09fCC63abc0af5Abc5', 18, 'BAB', 'BAB')
export const BAC = new Token(ChainId.MAINNET, '0x3449FC1Cd036255BA1EB19d65fF4BA2b8903A69a', 18, 'BAC', 'Basis Cash')
export const CREAM = new Token(ChainId.MAINNET, '0x2ba592F78dB6436527729929AAf6c908497cB200', 18, 'CREAM', 'Cream')
export const DAI = new Token(ChainId.MAINNET, '0x6B175474E89094C44Da98b954EedeAC495271d0F', 18, 'DAI', 'Dai Stablecoin')
export const DOUGH = new Token(
  ChainId.MAINNET,
  '0xad32A8e6220741182940c5aBF610bDE99E737b2D',
  18,
  'DOUGH',
  'PieDAO Dough v2'
)
export const DUCK = new Token(ChainId.MAINNET, '0x92E187a03B6CD19CB6AF293ba17F2745Fd2357D5', 18, 'DUCK', 'DUCK')
export const ETH2X_FLI = new Token(
  ChainId.MAINNET,
  '0xAa6E8127831c9DE45ae56bB1b0d4D4Da6e5665BD',
  18,
  'ETH2x-FLI',
  'ETH 2x Flexible Leverage Index'
)
export const FEI = new Token(ChainId.MAINNET, '0x956F47F50A910163D8BF957Cf5846D573E7f87CA', 18, 'FEI', 'Fei USD')
export const FRAX = new Token(ChainId.MAINNET, '0x853d955aCEf822Db058eb8505911ED77F175b99e', 18, 'FRAX', 'FRAX')
export const FXS = new Token(ChainId.MAINNET, '0x3432B6A60D23Ca0dFCa7761B7ab56459D9C964D0', 18, 'FXS', 'Frax Share')
export const HBTC = new Token(ChainId.MAINNET, '0x0316EB71485b0Ab14103307bf65a021042c6d380', 18, 'HBTC', 'Huobi BTC')
export const IBETH = new Token(
  ChainId.MAINNET,
  '0xeEa3311250FE4c3268F8E684f7C87A82fF183Ec1',
  8,
  'ibETHv2',
  'Interest Bearing Ether v2'
)
export const MEOW = new Token(ChainId.MAINNET, '0x650F44eD6F1FE0E1417cb4b3115d52494B4D9b6D', 18, 'MEOW', 'Meowshi')
export const MIR = new Token(ChainId.MAINNET, '0x09a3EcAFa817268f77BE1283176B946C4ff2E608', 18, 'MIR', 'Wrapped MIR')
export const NFTX = new Token(ChainId.MAINNET, '0x87d73E916D7057945c9BcD8cdd94e42A6F47f776', 18, 'NFTX', 'NFTX')
export const PLAY = new Token(
  ChainId.MAINNET,
  '0x33e18a092a93ff21aD04746c7Da12e35D34DC7C4',
  18,
  'PLAY',
  'Metaverse NFT Index'
)
export const PONT = new Token(
  ChainId.MAINNET,
  '0xcb46C550539ac3DB72dc7aF7c89B11c306C727c2',
  9,
  'pONT',
  'Poly Ontology Token'
)
export const PWING = new Token(
  ChainId.MAINNET,
  '0xDb0f18081b505A7DE20B18ac41856BCB4Ba86A1a',
  9,
  'pWING',
  'Poly Ontology Wing Token'
)
export const RENBTC = new Token(1, '0xEB4C2781e4ebA804CE9a9803C67d0893436bB27D', 8, 'renBTC', 'renBTC')
export const RUNE = new Token(ChainId.MAINNET, '0x3155BA85D5F96b2d030a4966AF206230e46849cb', 18, 'RUNE', 'RUNE.ETH')
export const STETH = new Token(ChainId.MAINNET, '0xDFe66B14D37C77F4E9b180cEb433d1b164f0281D', 18, 'stETH', 'stakedETH')
export const TRIBE = new Token(ChainId.MAINNET, '0xc7283b66Eb1EB5FB86327f08e1B5816b0720212B', 18, 'TRIBE', 'Tribe')
export const UMA = new Token(ChainId.MAINNET, '0x04Fa0d235C4abf4BcF4787aF4CF447DE572eF828', 18, 'UMA', 'UMA')
export const UMA_CALL = new Token(
  ChainId.MAINNET,
  '0x1062aD0E59fa67fa0b27369113098cC941Dd0D5F',
  18,
  'UMA',
  'UMA 35 Call [30 Apr 2021]'
)
export const USDC = new Token(ChainId.MAINNET, '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', 6, 'USDC', 'USD Coin')
export const USDP = new Token(
  ChainId.MAINNET,
  '0x1456688345527bE1f37E9e627DA0837D6f08C925',
  18,
  'USDP',
  'USDP Stablecoin'
)
export const USDT = new Token(ChainId.MAINNET, '0xdAC17F958D2ee523a2206206994597C13D831ec7', 6, 'USDT', 'Tether USD')
export const UST = new Token(ChainId.MAINNET, '0xa47c8bf37f92aBed4A126BDA807A7b7498661acD', 18, 'UST', 'Wrapped UST')
export const XSUSHI_CALL = new Token(
  ChainId.MAINNET,
  '0xada279f9301C01A4eF914127a6C2a493Ad733924',
  18,
  'XSUc25-0531',
  'XSUSHI 25 Call [31 May 2021]'
)
export const WBTC = new Token(ChainId.MAINNET, '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599', 8, 'WBTC', 'Wrapped BTC')

export const XSUSHI = new Token(ChainId.MAINNET, '0x8798249c2E607446EfB7Ad49eC89dD1865Ff4272', 18, 'xSUSHI', 'SushiBar')

export const LIFT = new Token(ChainId.MAINNET, '0xf9209d900f7ad1DC45376a2caA61c78f6dEA53B6', 18, 'LIFT', 'LiftKitchen')
export const LFBTC = new Token(
  ChainId.MAINNET,
  '0xafcE9B78D409bF74980CACF610AFB851BF02F257',
  18,
  'LFBTC',
  'LiftKitchen BTC'
)
export const CVXCRV = new Token(ChainId.MAINNET, '0x62B9c7356A2Dc64a1969e19C23e4f579F9810Aa7', 18, 'cvxCRV', 'cvxCRV')
export const CRV = new Token(ChainId.MAINNET, '0xD533a949740bb3306d119CC777fa900bA034cd52', 18, 'CRV', 'Curve')

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

export const DPI = new Token(ChainId.MAINNET, '0x1494CA1F11D487c2bBe4543E90080AeBa4BA3C2b', 18, 'DefiPulse', 'DPI')
export const RAI = new Token(
  ChainId.MAINNET,
  '0x03ab458634910AaD20eF5f1C8ee96F1D6ac54919',
  18,
  'Rai Reflex Index',
  'RAI'
)
export const YFI = new Token(ChainId.MAINNET, '0x0bc529c00C6401aEF6D220BE8C6Ea1667F6Ad93e', 18, 'YFI', 'YFI')
export const WOOFY = new Token(ChainId.MAINNET, '0xD0660cD418a64a1d44E9214ad8e459324D8157f1', 12, 'Woofy', 'WOOFY')
export const SPANK = new Token(ChainId.MAINNET, '0x42d6622deCe394b54999Fbd73D108123806f6a18', 18, 'Spank', 'SPANK')

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
}

export const WETH9_EXTENDED: { [chainId: number]: Token } = {
  ...WETH9,
  [SupportedChainId.ARBITRUM_TESTNET]: new Token(
    ChainId.ARBITRUM_TESTNET,
    '0x4A5e4A42dC430f669086b417AADf2B128beFEfac',
    18,
    'WETH9',
    'Wrapped Ether'
  ),
  [SupportedChainId.ARBITRUM]: new Token(
    ChainId.ARBITRUM,
    '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
    18,
    'WETH',
    'Wrapped Ether'
  ),
}

export class ExtendedEther extends Ether {
  public get wrapped(): Token {
    // if (this.chainId in WNATIVE) return WNATIVE[this.chainId]
    if (this.chainId in WETH9_EXTENDED) return WETH9_EXTENDED[this.chainId]

    throw new Error('Unsupported chain ID')
  }

  public static onChain(chainId: number): ExtendedEther {
    return new ExtendedEther(chainId)
  }
}
