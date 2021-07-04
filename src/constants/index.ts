import { ChainId, JSBI, Percent, Token, WETH } from '@sushiswap/sdk'
import { fortmatic, injected, lattice, portis, torus, walletconnect, walletlink } from '../connectors'

import { AbstractConnector } from '@web3-react/abstract-connector'

export const POOL_DENY = ['14', '29', '45', '30']

// a list of tokens by chain
type ChainTokenList = {
    readonly [chainId in ChainId]: Token[]
}

type ChainTokenMap = {
    readonly [chainId in ChainId]?: Token
}

// Block time here is slightly higher (~1s) than average in order to avoid ongoing proposals past the displayed time
export const AVERAGE_BLOCK_TIME_IN_SECS = 13
export const PROPOSAL_LENGTH_IN_BLOCKS = 40_320
export const PROPOSAL_LENGTH_IN_SECS = AVERAGE_BLOCK_TIME_IN_SECS * PROPOSAL_LENGTH_IN_BLOCKS

export const TIMELOCK_ADDRESS = '0x1a9C8182C09F50C8318d769245beA52c32BE35BC'

// SUSHI
export const SUSHI: ChainTokenMap = {
    [ChainId.MAINNET]: new Token(
        ChainId.MAINNET,
        '0x6B3595068778DD592e39A122f4f5a5cF09C90fE2',
        18,
        'SUSHI',
        'SushiToken'
    ),
    [ChainId.ROPSTEN]: new Token(
        ChainId.ROPSTEN,
        '0x0769fd68dFb93167989C6f7254cd0D766Fb2841F',
        18,
        'SUSHI',
        'SushiToken'
    ),
    [ChainId.RINKEBY]: new Token(
        ChainId.RINKEBY,
        '0x0769fd68dFb93167989C6f7254cd0D766Fb2841F',
        18,
        'SUSHI',
        'SushiToken'
    ),
    [ChainId.GÖRLI]: new Token(ChainId.GÖRLI, '0x0769fd68dFb93167989C6f7254cd0D766Fb2841F', 18, 'SUSHI', 'SushiToken'),
    [ChainId.KOVAN]: new Token(ChainId.KOVAN, '0x0769fd68dFb93167989C6f7254cd0D766Fb2841F', 18, 'SUSHI', 'SushiToken'),
    [ChainId.FANTOM]: new Token(ChainId.FANTOM, '0xae75A438b2E0cB8Bb01Ec1E1e376De11D44477CC', 18, 'SUSHI', 'SushiToken')
}

export const COMMON_CONTRACT_NAMES: { [address: string]: string } = {
    // [UNI_ADDRESS]: 'UNI',
    [TIMELOCK_ADDRESS]: 'Timelock'
}

// TODO: specify merkle distributor for mainnet
export const MERKLE_DISTRIBUTOR_ADDRESS: { [chainId in ChainId]?: string } = {
    [ChainId.MAINNET]: '0xcBE6B83e77cdc011Cc18F6f0Df8444E5783ed982',
    [ChainId.ROPSTEN]: '0x84d1f7202e0e7dac211617017ca72a2cb5e2b955'
}

// TODO: update weekly with new constant
export const MERKLE_ROOT =
    //'https://raw.githubusercontent.com/sushiswap/sushi-vesting/master/merkle/week-01/merkle-10959148-11003985.json'
    //'https://raw.githubusercontent.com/sushiswap/sushi-vesting/master/merkle/week-02/merkle-10959148-11049116.json'
    //'https://raw.githubusercontent.com/sushiswap/sushi-vesting/master/merkle/week-03/merkle-10959148-11094829.json'
    //'https://raw.githubusercontent.com/sushiswap/sushi-vesting/master/merkle/week-04/merkle-10959148-11140426.json'
    //'https://raw.githubusercontent.com/sushiswap/sushi-vesting/master/merkle/week-05/merkle-10959148-11185970.json'
    //'https://raw.githubusercontent.com/sushiswap/sushi-vesting/master/merkle/week-06/merkle-10959148-11231587.json'
    //'https://raw.githubusercontent.com/sushiswap/sushi-vesting/master/merkle/week-07/merkle-10959148-11277295.json'
    //'https://raw.githubusercontent.com/sushiswap/sushi-vesting/master/merkle/week-08/merkle-10959148-11322822.json'
    //'https://raw.githubusercontent.com/sushiswap/sushi-vesting/master/merkle/week-09/merkle-10959148-11368459.json'
    //'https://raw.githubusercontent.com/sushiswap/sushi-vesting/master/merkle/week-10/merkle-10959148-11413917.json'
    //'https://raw.githubusercontent.com/sushiswap/sushi-vesting/master/merkle/week-11/merkle-10959148-11459483.json'
    //'https://raw.githubusercontent.com/sushiswap/sushi-vesting/master/merkle/week-12/merkle-10959148-11505104.json'
    'https://raw.githubusercontent.com/sushiswap/sushi-vesting/master/merkle/week-13/merkle-10959148-11550728.json'

// TODO: SDK should have two maps, WETH map and WNATIVE map.
const WRAPPED_NATIVE_ONLY: ChainTokenList = {
    [ChainId.MAINNET]: [WETH[ChainId.MAINNET]],
    [ChainId.ROPSTEN]: [WETH[ChainId.ROPSTEN]],
    [ChainId.RINKEBY]: [WETH[ChainId.RINKEBY]],
    [ChainId.GÖRLI]: [WETH[ChainId.GÖRLI]],
    [ChainId.KOVAN]: [WETH[ChainId.KOVAN]],
    [ChainId.FANTOM]: [WETH[ChainId.FANTOM]],
    [ChainId.FANTOM_TESTNET]: [WETH[ChainId.FANTOM_TESTNET]],
    [ChainId.MATIC]: [WETH[ChainId.MATIC]],
    [ChainId.MATIC_TESTNET]: [WETH[ChainId.MATIC_TESTNET]],
    [ChainId.XDAI]: [WETH[ChainId.XDAI]],
    [ChainId.BSC]: [WETH[ChainId.BSC]],
    [ChainId.BSC_TESTNET]: [WETH[ChainId.BSC_TESTNET]],
    [ChainId.ARBITRUM]: [WETH[ChainId.ARBITRUM]],
    [ChainId.MOONBASE]: [WETH[ChainId.MOONBASE]],
    [ChainId.AVALANCHE]: [WETH[ChainId.AVALANCHE]],
    [ChainId.FUJI]: [WETH[ChainId.FUJI]],
    [ChainId.HECO]: [WETH[ChainId.HECO]],
    [ChainId.HECO_TESTNET]: [WETH[ChainId.HECO_TESTNET]],
    [ChainId.HARMONY]: [WETH[ChainId.HARMONY]],
    [ChainId.HARMONY_TESTNET]: [WETH[ChainId.HARMONY_TESTNET]],
    [ChainId.OKEX]: [WETH[ChainId.OKEX]],
    [ChainId.OKEX_TESTNET]: [WETH[ChainId.OKEX_TESTNET]]
}

// Default Ethereum chain tokens
export const DAI = new Token(ChainId.MAINNET, '0x6B175474E89094C44Da98b954EedeAC495271d0F', 18, 'DAI', 'Dai Stablecoin')
export const USDC = new Token(ChainId.MAINNET, '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', 6, 'USDC', 'USD Coin')
export const USDT = new Token(ChainId.MAINNET, '0xdAC17F958D2ee523a2206206994597C13D831ec7', 6, 'USDT', 'Tether USD')
export const AMPL = new Token(ChainId.MAINNET, '0xD46bA6D942050d489DBd938a2C909A5d5039A161', 9, 'AMPL', 'Ampleforth')
export const WBTC = new Token(ChainId.MAINNET, '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599', 8, 'WBTC', 'Wrapped BTC')
export const RUNE = new Token(ChainId.MAINNET, '0x3155BA85D5F96b2d030a4966AF206230e46849cb', 18, 'RUNE', 'RUNE.ETH')
export const NFTX = new Token(ChainId.MAINNET, '0x87d73E916D7057945c9BcD8cdd94e42A6F47f776', 18, 'NFTX', 'NFTX')
export const STETH = new Token(ChainId.MAINNET, '0xDFe66B14D37C77F4E9b180cEb433d1b164f0281D', 18, 'stETH', 'stakedETH')

export const BSC: { [key: string]: Token } = {
    DAI: new Token(ChainId.BSC, '0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3', 18, 'DAI', 'Dai Stablecoin'),
    USD: new Token(ChainId.BSC, '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56', 18, 'BUSD', 'Binance USD'),
    USDC: new Token(ChainId.BSC, '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d', 18, 'USDC', 'USD Coin'),
    USDT: new Token(ChainId.BSC, '0x55d398326f99059fF775485246999027B3197955', 18, 'USDT', 'Tether USD'),
    BTCB: new Token(ChainId.BSC, '0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c', 18, 'BTCB', 'Bitcoin')
}

export const FANTOM: { [key: string]: Token } = {
    USDC: new Token(ChainId.FANTOM, '0x04068DA6C83AFCFA0e13ba15A6696662335D5B75', 6, 'USDC', 'USD Coin'),
    WBTC: new Token(ChainId.FANTOM, '0x321162Cd933E2Be498Cd2267a90534A804051b11', 8, 'WBTC', 'Wrapped Bitcoin'),
    DAI: new Token(ChainId.FANTOM, '0x8D11eC38a3EB5E956B052f67Da8Bdc9bef8Abf3E', 18, 'DAI', 'Dai Stablecoin'),
    WETH: new Token(ChainId.FANTOM, '0x74b23882a30290451A17c44f4F05243b6b58C76d', 18, 'WETH', 'Wrapped Ether')
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
    DRAX: new Token(ChainId.MATIC, '0x1Ba3510A9ceEb72E5CdBa8bcdDe9647E1f20fB4b', 18, 'DRAX', 'Drax')
}

// used to construct intermediary pairs for trading
export const BASES_TO_CHECK_TRADES_AGAINST: ChainTokenList = {
    ...WRAPPED_NATIVE_ONLY,
    [ChainId.MAINNET]: [...WRAPPED_NATIVE_ONLY[ChainId.MAINNET], DAI, USDC, USDT, WBTC, RUNE, NFTX, STETH],
    [ChainId.MATIC]: [...WRAPPED_NATIVE_ONLY[ChainId.MATIC], MATIC.USDC, MATIC.WBTC, MATIC.DAI, MATIC.WETH, MATIC.USDT],
    [ChainId.FANTOM]: [...WRAPPED_NATIVE_ONLY[ChainId.FANTOM], FANTOM.DAI, FANTOM.USDC, FANTOM.WBTC, FANTOM.WETH],
    [ChainId.BSC]: [...WRAPPED_NATIVE_ONLY[ChainId.BSC], BSC.DAI, BSC.USD, BSC.USDC, BSC.USDT, BSC.BTCB]
}

export const CREAM = new Token(ChainId.MAINNET, '0x2ba592F78dB6436527729929AAf6c908497cB200', 18, 'CREAM', 'Cream')
export const BAC = new Token(ChainId.MAINNET, '0x3449FC1Cd036255BA1EB19d65fF4BA2b8903A69a', 18, 'BAC', 'Basis Cash')
export const FXS = new Token(ChainId.MAINNET, '0x3432B6A60D23Ca0dFCa7761B7ab56459D9C964D0', 18, 'FXS', 'Frax Share')
export const ALPHA = new Token(ChainId.MAINNET, '0xa1faa113cbE53436Df28FF0aEe54275c13B40975', 18, 'ALPHA', 'AlphaToken')
export const USDP = new Token(
    ChainId.MAINNET,
    '0x1456688345527bE1f37E9e627DA0837D6f08C925',
    18,
    'USDP',
    'USDP Stablecoin'
)
export const DUCK = new Token(ChainId.MAINNET, '0x92E187a03B6CD19CB6AF293ba17F2745Fd2357D5', 18, 'DUCK', 'DUCK')
export const BAB = new Token(ChainId.MAINNET, '0xC36824905dfF2eAAEE7EcC09fCC63abc0af5Abc5', 18, 'BAB', 'BAB')
export const HBTC = new Token(ChainId.MAINNET, '0x0316EB71485b0Ab14103307bf65a021042c6d380', 18, 'HBTC', 'Huobi BTC')
export const FRAX = new Token(ChainId.MAINNET, '0x853d955aCEf822Db058eb8505911ED77F175b99e', 18, 'FRAX', 'FRAX')
export const IBETH = new Token(
    ChainId.MAINNET,
    '0xeEa3311250FE4c3268F8E684f7C87A82fF183Ec1',
    8,
    'ibETHv2',
    'Interest Bearing Ether v2'
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

export const UMA = new Token(ChainId.MAINNET, '0x04Fa0d235C4abf4BcF4787aF4CF447DE572eF828', 18, 'UMA', 'UMA')

export const UMA_CALL = new Token(
    ChainId.MAINNET,
    '0x1062aD0E59fa67fa0b27369113098cC941Dd0D5F',
    18,
    'UMA',
    'UMA 35 Call [30 Apr 2021]'
)

export const DOUGH = new Token(
    ChainId.MAINNET,
    '0xad32A8e6220741182940c5aBF610bDE99E737b2D',
    18,
    'DOUGH',
    'PieDAO Dough v2'
)

export const PLAY = new Token(
    ChainId.MAINNET,
    '0x33e18a092a93ff21aD04746c7Da12e35D34DC7C4',
    18,
    'PLAY',
    'Metaverse NFT Index'
)

export const XSUSHI_CALL = new Token(
    ChainId.MAINNET,
    '0xada279f9301C01A4eF914127a6C2a493Ad733924',
    18,
    'XSUc25-0531',
    'XSUSHI 25 Call [31 May 2021]'
)

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

/**
 * Some tokens can only be swapped via certain pairs, so we override the list of bases that are considered for these
 * tokens.
 */
export const CUSTOM_BASES: { [chainId in ChainId]?: { [tokenAddress: string]: Token[] } } = {
    [ChainId.MAINNET]: {
        [AMPL.address]: [DAI, WETH[ChainId.MAINNET]],
        [DUCK.address]: [USDP, WETH[ChainId.MAINNET]],
        [BAB.address]: [BAC, WETH[ChainId.MAINNET]],
        [HBTC.address]: [CREAM, WETH[ChainId.MAINNET]],
        [FRAX.address]: [FXS, WETH[ChainId.MAINNET]],
        [IBETH.address]: [ALPHA, WETH[ChainId.MAINNET]],
        [PONT.address]: [PWING, WETH[ChainId.MAINNET]],
        [UMA_CALL.address]: [UMA, WETH[ChainId.MAINNET]],
        [PLAY.address]: [DOUGH, WETH[ChainId.MAINNET]],
        [XSUSHI_CALL.address]: [XSUSHI, WETH[ChainId.MAINNET]],
        [LIFT.address]: [LFBTC, WETH[ChainId.MAINNET]],
        [CVXCRV.address]: [CRV, WETH[ChainId.MAINNET]]
    },
    [ChainId.MATIC]: {
        [MATIC.TEL.address]: [MATIC.SUSHI, MATIC.AAVE],
        [MATIC.FXS.address]: [MATIC.FRAX],
        [MATIC.DRAX.address]: [MATIC.DMAGIC]
    }
}

// used for display in the default list when adding liquidity
export const SUGGESTED_BASES: ChainTokenList = {
    ...WRAPPED_NATIVE_ONLY,
    [ChainId.MAINNET]: [...WRAPPED_NATIVE_ONLY[ChainId.MAINNET], DAI, USDC, USDT, WBTC],
    [ChainId.MATIC]: [...WRAPPED_NATIVE_ONLY[ChainId.MATIC], MATIC.USDC, MATIC.WBTC, MATIC.DAI, MATIC.WETH, MATIC.USDT],
    [ChainId.FANTOM]: [...WRAPPED_NATIVE_ONLY[ChainId.FANTOM], FANTOM.DAI, FANTOM.USDC, FANTOM.WBTC, FANTOM.WETH],
    [ChainId.BSC]: [...WRAPPED_NATIVE_ONLY[ChainId.BSC], BSC.DAI, BSC.USD, BSC.USDC, BSC.USDT, BSC.BTCB]
}

// used to construct the list of all pairs we consider by default in the frontend
export const BASES_TO_TRACK_LIQUIDITY_FOR: ChainTokenList = {
    ...WRAPPED_NATIVE_ONLY,
    [ChainId.MAINNET]: [...WRAPPED_NATIVE_ONLY[ChainId.MAINNET], DAI, USDC, USDT, WBTC],
    [ChainId.MATIC]: [...WRAPPED_NATIVE_ONLY[ChainId.MATIC], MATIC.USDC, MATIC.WBTC, MATIC.DAI, MATIC.WETH, MATIC.USDT],
    [ChainId.FANTOM]: [...WRAPPED_NATIVE_ONLY[ChainId.FANTOM], FANTOM.DAI, FANTOM.USDC, FANTOM.WBTC, FANTOM.WETH],
    [ChainId.BSC]: [...WRAPPED_NATIVE_ONLY[ChainId.BSC], BSC.DAI, BSC.USD, BSC.USDC, BSC.USDT, BSC.BTCB]
}

export const PINNED_PAIRS: { readonly [chainId in ChainId]?: [Token, Token][] } = {
    [ChainId.MAINNET]: [
        [SUSHI[ChainId.MAINNET] as Token, WETH[ChainId.MAINNET]],
        [
            new Token(ChainId.MAINNET, '0x5d3a536E4D6DbD6114cc1Ead35777bAB948E3643', 8, 'cDAI', 'Compound Dai'),
            new Token(ChainId.MAINNET, '0x39AA39c021dfbaE8faC545936693aC917d5E7563', 8, 'cUSDC', 'Compound USD Coin')
        ],
        [USDC, USDT],
        [DAI, USDT]
    ]
}

export interface WalletInfo {
    connector?: AbstractConnector
    name: string
    iconName: string
    description: string
    href: string | null
    color: string
    primary?: true
    mobile?: true
    mobileOnly?: true
}

export const SUPPORTED_WALLETS: { [key: string]: WalletInfo } = {
    INJECTED: {
        connector: injected,
        name: 'Injected',
        iconName: 'arrow-right.svg',
        description: 'Injected web3 provider.',
        href: null,
        color: '#010101',
        primary: true
    },
    METAMASK: {
        connector: injected,
        name: 'MetaMask',
        iconName: 'metamask.png',
        description: 'Easy-to-use browser extension.',
        href: null,
        color: '#E8831D'
    },
    WALLET_CONNECT: {
        connector: walletconnect,
        name: 'WalletConnect',
        iconName: 'walletConnectIcon.svg',
        description: 'Connect to Trust Wallet, Rainbow Wallet and more...',
        href: null,
        color: '#4196FC',
        mobile: true
    },
    LATTICE: {
        connector: lattice,
        name: 'Lattice',
        iconName: 'gridPlusWallet.png',
        description: 'Connect to GridPlus Wallet.',
        href: null,
        color: '#40a9ff',
        mobile: true
    },
    WALLET_LINK: {
        connector: walletlink,
        name: 'Coinbase Wallet',
        iconName: 'coinbaseWalletIcon.svg',
        description: 'Use Coinbase Wallet app on mobile device',
        href: null,
        color: '#315CF5'
    },
    COINBASE_LINK: {
        name: 'Open in Coinbase Wallet',
        iconName: 'coinbaseWalletIcon.svg',
        description: 'Open in Coinbase Wallet app.',
        href: 'https://go.cb-w.com',
        color: '#315CF5',
        mobile: true,
        mobileOnly: true
    },
    FORTMATIC: {
        connector: fortmatic,
        name: 'Fortmatic',
        iconName: 'fortmaticIcon.png',
        description: 'Login using Fortmatic hosted wallet',
        href: null,
        color: '#6748FF',
        mobile: true
    },
    Portis: {
        connector: portis,
        name: 'Portis',
        iconName: 'portisIcon.png',
        description: 'Login using Portis hosted wallet',
        href: null,
        color: '#4A6C9B',
        mobile: true
    },
    Torus: {
        connector: torus,
        name: 'Torus',
        iconName: 'torusIcon.png',
        description: 'Login using Torus hosted wallet',
        href: null,
        color: '#315CF5',
        mobile: true
    }
}

export const NetworkContextName = 'NETWORK'

// default allowed slippage, in bips
export const INITIAL_ALLOWED_SLIPPAGE = 50
// 20 minutes, denominated in seconds
export const DEFAULT_DEADLINE_FROM_NOW = 60 * 20

// used for rewards deadlines
export const BIG_INT_SECONDS_IN_WEEK = JSBI.BigInt(60 * 60 * 24 * 7)

export const BIG_INT_ZERO = JSBI.BigInt(0)

// one basis point
export const ONE_BIPS = new Percent(JSBI.BigInt(1), JSBI.BigInt(10000))
export const BIPS_BASE = JSBI.BigInt(10000)
// used for warning states
export const ALLOWED_PRICE_IMPACT_LOW: Percent = new Percent(JSBI.BigInt(100), BIPS_BASE) // 1%
export const ALLOWED_PRICE_IMPACT_MEDIUM: Percent = new Percent(JSBI.BigInt(300), BIPS_BASE) // 3%
export const ALLOWED_PRICE_IMPACT_HIGH: Percent = new Percent(JSBI.BigInt(500), BIPS_BASE) // 5%
// if the price slippage exceeds this number, force the user to type 'confirm' to execute
export const PRICE_IMPACT_WITHOUT_FEE_CONFIRM_MIN: Percent = new Percent(JSBI.BigInt(1000), BIPS_BASE) // 10%
// for non expert mode disable swaps above this
export const BLOCKED_PRICE_IMPACT_NON_EXPERT: Percent = new Percent(JSBI.BigInt(1500), BIPS_BASE) // 15%

// used to ensure the user doesn't send so much ETH so they end up with <.01
export const MIN_ETH: JSBI = JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(16)) // .01 ETH
export const BETTER_TRADE_LESS_HOPS_THRESHOLD = new Percent(JSBI.BigInt(50), JSBI.BigInt(10000))

export const ZERO_PERCENT = new Percent('0')
export const ONE_HUNDRED_PERCENT = new Percent('1')

// SDN OFAC addresses
export const BLOCKED_ADDRESSES: string[] = [
    '0x7F367cC41522cE07553e823bf3be79A889DEbe1B',
    '0xd882cFc20F52f2599D84b8e8D58C7FB62cfE344b',
    '0x901bb9583b24D97e995513C6778dc6888AB6870e',
    '0xA7e5d5A720f06526557c513402f2e6B5fA20b008'
]

// BentoBox Swappers
export const BASE_SWAPPER: { [chainId in ChainId]?: string } = {
    [ChainId.MAINNET]: '0x0',
    [ChainId.ROPSTEN]: '0xe4E2540D421e56b0B786d40c5F5268891288c6fb'
}

// Boring Helper
// export const BORING_HELPER_ADDRESS = '0x11Ca5375AdAfd6205E41131A4409f182677996E6'

export const ANALYTICS_URL: { [chainId in ChainId]?: string } = {
    [ChainId.MAINNET]: 'https://analytics.sushi.com',
    [ChainId.MATIC]: 'https://analytics-polygon.sushi.com',
    [ChainId.FANTOM]: 'https://analytics-ftm.sushi.com',
    [ChainId.BSC]: 'https://analytics-bsc.sushi.com',
    [ChainId.XDAI]: 'https://analytics-xdai.sushi.com'
}
